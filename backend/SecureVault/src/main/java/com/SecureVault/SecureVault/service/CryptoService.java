package com.SecureVault.SecureVault.service;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Moteur cryptographique du microservice (architecture JCA, standards natifs du JDK).
 *
 * <ul>
 *   <li>RSA 2048 : paires de cles par utilisateur, chiffrement de la cle AES (RSA-OAEP) et
 *       signature des messages (SHA256withRSA).
 *   <li>AES-256-GCM : chiffrement authentifie du contenu des messages.
 *   <li>La cle privee RSA de chaque utilisateur est chiffree au repos (AES-GCM) avec une cle
 *       maitresse cote serveur.
 * </ul>
 */
@Service
public class CryptoService {

    private static final String RSA = "RSA";
    private static final String RSA_TRANSFORM = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding";
    private static final String AES_TRANSFORM = "AES/GCM/NoPadding";
    private static final String SIGN_ALGO = "SHA256withRSA";
    private static final int GCM_TAG_BITS = 128;
    private static final int IV_BYTES = 12;

    private final SecretKey masterKey;
    private final SecureRandom random = new SecureRandom();

    public CryptoService(@Value("${securevault.master-key}") String masterKeySecret) {
        // On derive une cle AES de 256 bits (32 octets) via SHA-256 : la valeur configuree peut
        // avoir n'importe quelle longueur, on obtient toujours une cle AES de taille valide.
        try {
            byte[] keyBytes =
                MessageDigest.getInstance("SHA-256").digest(masterKeySecret.getBytes(StandardCharsets.UTF_8));
            this.masterKey = new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            throw new IllegalStateException("Initialisation de la cle maitresse impossible", e);
        }
    }

    // ----- Generation et encodage des cles -----

    public KeyPair generateRsaKeyPair() {
        try {
            KeyPairGenerator gen = KeyPairGenerator.getInstance(RSA);
            gen.initialize(2048);
            return gen.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException("Generation des cles RSA impossible", e);
        }
    }

    public String encodePublicKey(PublicKey key) {
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    public PublicKey decodePublicKey(String base64) {
        try {
            byte[] bytes = Base64.getDecoder().decode(base64);
            return KeyFactory.getInstance(RSA).generatePublic(new X509EncodedKeySpec(bytes));
        } catch (Exception e) {
            throw new IllegalStateException("Cle publique invalide", e);
        }
    }

    // ----- Protection de la cle privee au repos -----

    public String protectPrivateKey(PrivateKey key) {
        return aesEncrypt(masterKey, key.getEncoded());
    }

    public PrivateKey unprotectPrivateKey(String stored) {
        try {
            byte[] pkcs8 = aesDecrypt(masterKey, stored);
            return KeyFactory.getInstance(RSA).generatePrivate(new PKCS8EncodedKeySpec(pkcs8));
        } catch (Exception e) {
            throw new IllegalStateException("Dechiffrement de la cle privee impossible", e);
        }
    }

    // ----- AES-256-GCM -----

    public SecretKey newAesKey() {
        try {
            KeyGenerator gen = KeyGenerator.getInstance("AES");
            gen.init(256);
            return gen.generateKey();
        } catch (Exception e) {
            throw new IllegalStateException("Generation de la cle AES impossible", e);
        }
    }

    public SecretKey aesKeyFromBytes(byte[] raw) {
        return new SecretKeySpec(raw, "AES");
    }

    /** Chiffre des octets et renvoie "ivBase64:cipherBase64". */
    public String aesEncrypt(SecretKey key, byte[] plain) {
        try {
            byte[] iv = new byte[IV_BYTES];
            random.nextBytes(iv);
            Cipher cipher = Cipher.getInstance(AES_TRANSFORM);
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] ct = cipher.doFinal(plain);
            return Base64.getEncoder().encodeToString(iv) + ":" + Base64.getEncoder().encodeToString(ct);
        } catch (Exception e) {
            throw new IllegalStateException("Chiffrement AES impossible", e);
        }
    }

    public byte[] aesDecrypt(SecretKey key, String stored) {
        try {
            String[] parts = stored.split(":", 2);
            byte[] iv = Base64.getDecoder().decode(parts[0]);
            byte[] ct = Base64.getDecoder().decode(parts[1]);
            Cipher cipher = Cipher.getInstance(AES_TRANSFORM);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            return cipher.doFinal(ct);
        } catch (Exception e) {
            throw new IllegalStateException("Dechiffrement AES impossible", e);
        }
    }

    /** Chiffre un texte avec une cle AES, renvoie [cipherBase64, ivBase64]. */
    public String[] aesEncryptText(SecretKey key, String plaintext) {
        String combined = aesEncrypt(key, plaintext.getBytes(StandardCharsets.UTF_8));
        String[] parts = combined.split(":", 2);
        return new String[] {parts[1], parts[0]};
    }

    public String aesDecryptText(SecretKey key, String cipherB64, String ivB64) {
        byte[] plain = aesDecrypt(key, ivB64 + ":" + cipherB64);
        return new String(plain, StandardCharsets.UTF_8);
    }

    // ----- RSA-OAEP (protege la cle AES) -----

    public String rsaEncrypt(PublicKey publicKey, byte[] data) {
        try {
            Cipher cipher = Cipher.getInstance(RSA_TRANSFORM);
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            return Base64.getEncoder().encodeToString(cipher.doFinal(data));
        } catch (Exception e) {
            throw new IllegalStateException("Chiffrement RSA impossible", e);
        }
    }

    public byte[] rsaDecrypt(PrivateKey privateKey, String base64) {
        try {
            Cipher cipher = Cipher.getInstance(RSA_TRANSFORM);
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            return cipher.doFinal(Base64.getDecoder().decode(base64));
        } catch (Exception e) {
            throw new IllegalStateException("Dechiffrement RSA impossible", e);
        }
    }

    // ----- Signature SHA256withRSA -----

    public String sign(PrivateKey privateKey, String plaintext) {
        try {
            Signature signature = Signature.getInstance(SIGN_ALGO);
            signature.initSign(privateKey);
            signature.update(plaintext.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(signature.sign());
        } catch (Exception e) {
            throw new IllegalStateException("Signature impossible", e);
        }
    }

    public boolean verify(PublicKey publicKey, String plaintext, String signatureB64) {
        try {
            Signature signature = Signature.getInstance(SIGN_ALGO);
            signature.initVerify(publicKey);
            signature.update(plaintext.getBytes(StandardCharsets.UTF_8));
            return signature.verify(Base64.getDecoder().decode(signatureB64));
        } catch (Exception e) {
            return false;
        }
    }
}
