package com.javaforge.auth.auth;

import com.javaforge.auth.auth.dto.AuthResponse;
import com.javaforge.auth.auth.dto.LoginRequest;
import com.javaforge.auth.auth.dto.RegisterRequest;
import com.javaforge.auth.auth.dto.UserProfileResponse;
import com.javaforge.auth.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserProfileResponse me(@org.springframework.security.core.annotation.AuthenticationPrincipal AuthenticatedUser user) {
        return authService.me(user);
    }
}
