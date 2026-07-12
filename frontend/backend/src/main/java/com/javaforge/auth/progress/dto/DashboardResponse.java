package com.javaforge.auth.progress.dto;

import java.util.List;

public record DashboardResponse(
    UserSummary user,
    ProgressSummary progress,
    List<ActivitySummary> activity,
    List<TopicMasterySummary> topicMasteries,
    List<RecentLessonSummary> recentLessons,
    CurrentPathSummary currentPath,
    List<AchievementSummary> achievements
) {
}
