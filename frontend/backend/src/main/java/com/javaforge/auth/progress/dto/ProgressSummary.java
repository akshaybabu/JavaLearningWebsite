package com.javaforge.auth.progress.dto;

public record ProgressSummary(
    String userId,
    int lessonsCompleted,
    int exercisesAttempted,
    int exercisesPassed,
    int quizAccuracy,
    int projectsCompleted,
    int timeSpentMin,
    int currentStreak,
    int longestStreak,
    String lastActivityDate,
    int weeklyGoalMin,
    int weeklyCompletedMin,
    int xp,
    int level
) {
}
