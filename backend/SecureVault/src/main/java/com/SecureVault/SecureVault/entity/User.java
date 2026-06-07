package com.SecureVault.SecureVault.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    /** Mot de passe hache avec BCrypt. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /** Cle publique RSA au format X.509 (Base64). Diffusee librement. */
    @Lob
    @Column(name = "public_key", nullable = false, columnDefinition = "TEXT")
    private String publicKey;

    /** Cle privee RSA chiffree au repos (AES-GCM via la cle maitresse, Base64). */
    @Lob
    @Column(name = "private_key_enc", nullable = false, columnDefinition = "TEXT")
    private String privateKeyEnc;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @jakarta.persistence.PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
