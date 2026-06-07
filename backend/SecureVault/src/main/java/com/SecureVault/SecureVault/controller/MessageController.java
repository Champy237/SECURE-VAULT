package com.SecureVault.SecureVault.controller;

import com.SecureVault.SecureVault.dto.MessageRequest;
import com.SecureVault.SecureVault.dto.MessageResponse;
import com.SecureVault.SecureVault.security.AuthPrincipal;
import com.SecureVault.SecureVault.service.MessageService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageResponse> send(
        @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.send(principal.userId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/conversation/{peerId}")
    public List<MessageResponse> conversation(
        @AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long peerId) {
        return messageService.conversation(principal.userId(), peerId);
    }
}
