package com.SecureVault.SecureVault.service;

import com.SecureVault.SecureVault.dto.PublicKeyResponse;
import com.SecureVault.SecureVault.dto.UserResponse;
import com.SecureVault.SecureVault.entity.User;
import com.SecureVault.SecureVault.exception.ApiException;
import com.SecureVault.SecureVault.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository users;

    public UserService(UserRepository users) {
        this.users = users;
    }

    public User getById(Long id) {
        return users.findById(id).orElseThrow(() -> ApiException.notFound("Utilisateur introuvable"));
    }

    public UserResponse me(Long id) {
        User u = getById(id);
        return new UserResponse(u.getId(), u.getUsername(), u.getEmail());
    }

    /** Liste des autres utilisateurs (contacts possibles). */
    public List<UserResponse> contacts(Long currentUserId) {
        return users.findByIdNot(currentUserId).stream()
            .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getEmail()))
            .toList();
    }

    public PublicKeyResponse publicKey(Long id) {
        User u = getById(id);
        return new PublicKeyResponse(u.getId(), u.getPublicKey());
    }
}
