package com.SecureVault.SecureVault.dto;

import java.time.Instant;

/**
 * Message dechiffre, pret a etre affiche.
 *
 * @param content texte en clair (dechiffre cote serveur pour le lecteur autorise)
 * @param signatureValid resultat de la verification de signature RSA
 * @param outgoing true si le lecteur courant est l'expediteur
 */
public record MessageResponse(
    Long id,
    Long senderId,
    String fromUsername,
    Long recipientId,
    String content,
    boolean signatureValid,
    boolean outgoing,
    Instant sentAt) {}
