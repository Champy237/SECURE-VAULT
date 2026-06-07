package com.SecureVault.SecureVault.security;

/** Identite de l'utilisateur authentifie, portee par le SecurityContext. */
public record AuthPrincipal(Long userId, String username) {}
