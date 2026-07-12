package com.javaforge.auth.progress.dto;

public record CurrentPathSummary(
    String title,
    int completed,
    int total,
    int pct
) {
}
