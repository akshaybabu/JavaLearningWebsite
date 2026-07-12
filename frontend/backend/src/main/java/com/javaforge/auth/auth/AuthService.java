package com.javaforge.auth.auth;

import com.javaforge.auth.auth.dto.AuthResponse;
import com.javaforge.auth.auth.dto.LoginRequest;
import com.javaforge.auth.auth.dto.RegisterRequest;
import com.javaforge.auth.auth.dto.UserProfileResponse;
import com.javaforge.auth.exception.AuthenticationFailedException;
import com.javaforge.auth.exception.DuplicateResourceException;
import com.javaforge.auth.progress.LearningProgressService;
import com.javaforge.auth.security.AuthenticatedUser;
import com.javaforge.auth.security.JwtService;
import com.javaforge.auth.user.UserEntity;
import com.javaforge.auth.user.UserRepository;
import com.javaforge.auth.user.UserRole;
import com.javaforge.auth.user.UserStatus;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LearningProgressService learningProgressService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        LearningProgressService learningProgressService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.learningProgressService = learningProgressService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedUsername = request.getUsername().trim().toLowerCase(Locale.ROOT);
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.countConflicts(normalizedUsername, normalizedEmail) > 0) {
            throw new DuplicateResourceException("A user with that username or email already exists.");
        }

        UserEntity user = new UserEntity();
        user.setFullName(request.getFullName().trim());
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.LEARNER);
        user.setStatus(UserStatus.ACTIVE);

        UserEntity savedUser = userRepository.save(user);
        learningProgressService.initializeProgressForUser(savedUser.getId());
        AuthenticatedUser principal = new AuthenticatedUser(savedUser);

        return new AuthResponse(
            jwtService.generateToken(principal),
            "Bearer",
            jwtService.getAccessTokenExpirationMs(),
            UserProfileResponse.from(savedUser)
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim().toLowerCase(Locale.ROOT);
        UserEntity user = userRepository.findByIdentifierAndStatus(identifier, UserStatus.ACTIVE)
            .orElseThrow(() -> new AuthenticationFailedException("Invalid username/email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationFailedException("Invalid username/email or password.");
        }

        userRepository.updateLastLoginAt(user.getId(), LocalDateTime.now());

        AuthenticatedUser principal = new AuthenticatedUser(user);
        return new AuthResponse(
            jwtService.generateToken(principal),
            "Bearer",
            jwtService.getAccessTokenExpirationMs(),
            UserProfileResponse.from(user)
        );
    }

    public UserProfileResponse me(AuthenticatedUser user) {
        return UserProfileResponse.from(user.getUser());
    }
}
