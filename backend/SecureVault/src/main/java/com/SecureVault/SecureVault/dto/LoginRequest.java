package com.SecureVault.SecureVault.dto;

import jakarta.validation.constraints.NotBlank;

/** identifier = nom d'utilisateur ou email. */
public record LoginRequest(@NotBlank String identifier, @NotBlank String password) {}
