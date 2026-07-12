package com.javaforge.auth.progress.dto;

public record RecentLessonSummary(
    String id,
    String title,
    String module,
    String courseId,
    String lastOpened,
    int completion
) {
}
