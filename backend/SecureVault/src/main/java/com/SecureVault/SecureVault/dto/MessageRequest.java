package com.SecureVault.SecureVault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessageRequest(@NotNull Long recipientId, @NotBlank String content) {}
