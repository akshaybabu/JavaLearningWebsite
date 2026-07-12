package com.javaforge.auth.progress.dto;

public record AchievementSummary(
    String achievementId,
    String earnedAt,
    AchievementDetail achievement
) {
    public record AchievementDetail(
        String id,
        String slug,
        String title,
        String description,
        String icon,
        String color,
        int xpReward,
        String criteria
    ) {
    }
}
