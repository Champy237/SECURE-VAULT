package com.SecureVault.SecureVault.service;

import com.SecureVault.SecureVault.dto.MessageRequest;
import com.SecureVault.SecureVault.dto.MessageResponse;
import com.SecureVault.SecureVault.entity.Message;
import com.SecureVault.SecureVault.entity.User;
import com.SecureVault.SecureVault.exception.ApiException;
import com.SecureVault.SecureVault.repository.MessageRepository;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {

    private final MessageRepository messages;
    private final UserService userService;
    private final CryptoService crypto;

    public MessageService(MessageRepository messages, UserService userService, CryptoService crypto) {
        this.messages = messages;
        this.userService = userService;
        this.crypto = crypto;
    }

    /** Chiffre (hybride RSA + AES) et signe un message, puis le stocke. */
    @Transactional
    public MessageResponse send(Long senderId, MessageRequest request) {
        if (senderId.equals(request.recipientId())) {
            throw ApiException.badRequest("Impossible de s'envoyer un message a soi-meme");
        }
        User sender = userService.getById(senderId);
        User recipient = userService.getById(request.recipientId());

        PublicKey senderPub = crypto.decodePublicKey(sender.getPublicKey());
        PublicKey recipientPub = crypto.decodePublicKey(recipient.getPublicKey());
        PrivateKey senderPriv = crypto.unprotectPrivateKey(sender.getPrivateKeyEnc());

        // 1. Chiffrement AES-GCM du contenu avec une cle de session ephemere.
        SecretKey aesKey = crypto.newAesKey();
        String[] cipherAndIv = crypto.aesEncryptText(aesKey, request.content());

        // 2. La cle AES est protegee par RSA pour le destinataire ET l'expediteur.
        String aesForRecipient = crypto.rsaEncrypt(recipientPub, aesKey.getEncoded());
        String aesForSender = crypto.rsaEncrypt(senderPub, aesKey.getEncoded());

        // 3. Signature du message clair avec la cle privee de l'expediteur.
        String signature = crypto.sign(senderPriv, request.content());

        Message message =
            Message.builder()
                .senderId(senderId)
                .recipientId(request.recipientId())
                .ciphertext(cipherAndIv[0])
                .iv(cipherAndIv[1])
                .aesKeyForRecipient(aesForRecipient)
                .aesKeyForSender(aesForSender)
                .signature(signature)
                .build();

        message = messages.save(message);
        return new MessageResponse(
            message.getId(),
            senderId,
            sender.getUsername(),
            request.recipientId(),
            request.content(),
            true,
            true,
            message.getCreatedAt());
    }

    /** Recupere, dechiffre et verifie la conversation entre l'utilisateur courant et un contact. */
    @Transactional(readOnly = true)
    public List<MessageResponse> conversation(Long currentUserId, Long peerId) {
        User current = userService.getById(currentUserId);
        User peer = userService.getById(peerId);
        PrivateKey currentPriv = crypto.unprotectPrivateKey(current.getPrivateKeyEnc());

        List<Message> records = messages.findConversation(currentUserId, peerId);
        List<MessageResponse> result = new ArrayList<>();

        for (Message m : records) {
            boolean outgoing = m.getSenderId().equals(currentUserId);
            // Selon le role, on utilise la copie de cle AES chiffree pour l'expediteur ou le destinataire.
            String aesKeyEnc = outgoing ? m.getAesKeyForSender() : m.getAesKeyForRecipient();

            String content;
            boolean signatureValid;
            try {
                byte[] aesBytes = crypto.rsaDecrypt(currentPriv, aesKeyEnc);
                SecretKey aesKey = crypto.aesKeyFromBytes(aesBytes);
                content = crypto.aesDecryptText(aesKey, m.getCiphertext(), m.getIv());

                User sender = outgoing ? current : peer;
                PublicKey senderPub = crypto.decodePublicKey(sender.getPublicKey());
                signatureValid = crypto.verify(senderPub, content, m.getSignature());
            } catch (Exception e) {
                content = "[message illisible]";
                signatureValid = false;
            }

            String fromUsername = outgoing ? current.getUsername() : peer.getUsername();
            result.add(
                new MessageResponse(
                    m.getId(),
                    m.getSenderId(),
                    fromUsername,
                    m.getRecipientId(),
                    content,
                    signatureValid,
                    outgoing,
                    m.getCreatedAt()));
        }
        return result;
    }
}
