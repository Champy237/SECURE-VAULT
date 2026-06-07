package com.SecureVault.SecureVault.dto;

public record AuthResponse(String token, Long userId, String username) {}
