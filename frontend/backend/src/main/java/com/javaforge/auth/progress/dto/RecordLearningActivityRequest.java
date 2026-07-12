package com.javaforge.auth.progress.dto;

import com.javaforge.auth.progress.MasteryLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RecordLearningActivityRequest(
    @NotBlank(message = "Course id is required")
    @Size(max = 80, message = "Course id must be at most 80 characters")
    String courseId,

    @NotBlank(message = "Lesson id is required")
    @Size(max = 80, message = "Lesson id must be at most 80 characters")
    String lessonId,

    @NotBlank(message = "Lesson title is required")
    @Size(max = 180, message = "Lesson title must be at most 180 characters")
    String lessonTitle,

    @NotBlank(message = "Module title is required")
    @Size(max = 180, message = "Module title must be at most 180 characters")
    String moduleTitle,

    @Min(value = 0, message = "Completion percent must be at least 0")
    @Max(value = 100, message = "Completion percent must be at most 100")
    int completionPercent,

    @Min(value = 0, message = "Minutes spent must be at least 0")
    int minutesSpent,

    @Min(value = 0, message = "Exercises attempted must be at least 0")
    int exercisesAttempted,

    @Min(value = 0, message = "Exercises passed must be at least 0")
    int exercisesPassed,

    boolean lessonCompleted,

    @Size(max = 80, message = "Topic id must be at most 80 characters")
    String topicId,

    @Size(max = 180, message = "Topic title must be at most 180 characters")
    String topicTitle,

    MasteryLevel masteryLevel,

    @Min(value = 0, message = "XP earned must be at least 0")
    Integer xpEarned
) {
}
