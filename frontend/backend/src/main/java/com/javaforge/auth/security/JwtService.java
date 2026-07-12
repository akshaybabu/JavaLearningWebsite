package com.javaforge.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final Key signingKey;
    private final long accessTokenExpirationMs;

    public JwtService(
        @Value("${app.security.jwt-secret}") String jwtSecret,
        @Value("${app.security.access-token-expiration-ms}") long accessTokenExpirationMs
    ) {
        try {
            this.signingKey = Keys.hmacShaKeyFor(resolveSecret(jwtSecret));
        } catch (WeakKeyException exception) {
            throw new IllegalStateException(
                "JWT_SECRET must be at least 32 bytes for HS256. Update your environment variable or application.yml secret.",
                exception
            );
        }
        this.accessTokenExpirationMs = accessTokenExpirationMs;
    }

    public String generateToken(AuthenticatedUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
            .claims(Map.of(
                "role", user.getUser().getRole().name(),
                "email", user.getUser().getEmail(),
                "fullName", user.getUser().getFullName()
            ))
            .subject(user.getUsername())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusMillis(accessTokenExpirationMs)))
            .signWith(signingKey)
            .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, AuthenticatedUser user) {
        String username = extractUsername(token);
        return username.equalsIgnoreCase(user.getUsername()) && !isTokenExpired(token);
    }

    public long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith((javax.crypto.SecretKey) signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private byte[] resolveSecret(String jwtSecret) {
        try {
            return Decoders.BASE64.decode(jwtSecret);
        } catch (IllegalArgumentException ignored) {
            return jwtSecret.getBytes();
        }
    }
}
