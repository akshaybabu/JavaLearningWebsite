package com.javaforge.auth.progress.dto;

public record UserSummary(
    long id,
    String name,
    String email,
    String role,
    String createdAt
) {
}
