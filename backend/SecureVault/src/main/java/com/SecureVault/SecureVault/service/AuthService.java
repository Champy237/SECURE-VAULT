package com.SecureVault.SecureVault.service;

import com.SecureVault.SecureVault.dto.AuthResponse;
import com.SecureVault.SecureVault.dto.LoginRequest;
import com.SecureVault.SecureVault.dto.RegisterRequest;
import com.SecureVault.SecureVault.entity.User;
import com.SecureVault.SecureVault.exception.ApiException;
import com.SecureVault.SecureVault.repository.UserRepository;
import com.SecureVault.SecureVault.security.JwtUtil;
import java.security.KeyPair;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final CryptoService crypto;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
        UserRepository users,
        CryptoService crypto,
        PasswordEncoder passwordEncoder,
        JwtUtil jwtUtil) {
        this.users = users;
        this.crypto = crypto;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (users.existsByUsername(request.username())) {
            throw ApiException.conflict("Ce nom d'utilisateur est deja pris");
        }
        if (users.existsByEmail(request.email())) {
            throw ApiException.conflict("Cet email est deja utilise");
        }

        // Generation de la paire de cles RSA propre a l'utilisateur.
        KeyPair keyPair = crypto.generateRsaKeyPair();

        User user =
            User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .publicKey(crypto.encodePublicKey(keyPair.getPublic()))
                .privateKeyEnc(crypto.protectPrivateKey(keyPair.getPrivate()))
                .build();

        user = users.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername());
    }

    public AuthResponse login(LoginRequest request) {
        User user =
            users
                .findByUsernameOrEmail(request.identifier(), request.identifier())
                .orElseThrow(() -> ApiException.unauthorized("Identifiants invalides"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Identifiants invalides");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername());
    }
}
