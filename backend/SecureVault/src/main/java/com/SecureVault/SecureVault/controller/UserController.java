package com.SecureVault.SecureVault.controller;

import com.SecureVault.SecureVault.dto.PublicKeyResponse;
import com.SecureVault.SecureVault.dto.UserResponse;
import com.SecureVault.SecureVault.security.AuthPrincipal;
import com.SecureVault.SecureVault.service.UserService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AuthPrincipal principal) {
        return userService.me(principal.userId());
    }

    @GetMapping
    public List<UserResponse> contacts(@AuthenticationPrincipal AuthPrincipal principal) {
        return userService.contacts(principal.userId());
    }

    @GetMapping("/{id}/public-key")
    public PublicKeyResponse publicKey(@PathVariable Long id) {
        return userService.publicKey(id);
    }
}
