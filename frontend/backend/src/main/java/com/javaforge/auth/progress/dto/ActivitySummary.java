package com.javaforge.auth.progress.dto;

public record ActivitySummary(
    String date,
    int minutes,
    int lessons,
    int exercises
) {
}
