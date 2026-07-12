package com.javaforge.auth.progress.dto;

public record TopicMasterySummary(
    String userId,
    String topicId,
    String topicTitle,
    String mastery,
    String lastPracticed
) {
}
