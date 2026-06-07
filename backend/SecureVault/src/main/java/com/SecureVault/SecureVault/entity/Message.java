package com.SecureVault.SecureVault.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "messages",
    indexes = @Index(name = "idx_conversation", columnList = "sender_id,recipient_id,created_at"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    /** Contenu chiffre en AES-256-GCM (Base64). */
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String ciphertext;

    /** Vecteur d'initialisation du chiffrement AES-GCM (Base64). */
    @Column(name = "iv", nullable = false, length = 48)
    private String iv;

    /** Cle AES chiffree avec la cle publique RSA du destinataire (RSA-OAEP, Base64). */
    @Lob
    @Column(name = "aes_key_recipient", nullable = false, columnDefinition = "TEXT")
    private String aesKeyForRecipient;

    /** Cle AES chiffree avec la cle publique RSA de l'expediteur (pour qu'il relise ses envois). */
    @Lob
    @Column(name = "aes_key_sender", nullable = false, columnDefinition = "TEXT")
    private String aesKeyForSender;

    /** Signature RSA (SHA256withRSA) du message clair (Base64). */
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String signature;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @jakarta.persistence.PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
