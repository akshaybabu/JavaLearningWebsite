package com.javaforge.auth.progress;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
public class UserProgressEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "lessons_completed", nullable = false)
    private int lessonsCompleted;

    @Column(name = "exercises_attempted", nullable = false)
    private int exercisesAttempted;

    @Column(name = "exercises_passed", nullable = false)
    private int exercisesPassed;

    @Column(name = "quiz_accuracy", nullable = false)
    private int quizAccuracy;

    @Column(name = "projects_completed", nullable = false)
    private int projectsCompleted;

    @Column(name = "time_spent_min", nullable = false)
    private int timeSpentMin;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak;

    @Column(name = "longest_streak", nullable = false)
    private int longestStreak;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    @Column(name = "weekly_goal_min", nullable = false)
    private int weeklyGoalMin;

    @Column(name = "xp", nullable = false)
    private int xp;

    @Column(name = "level_no", nullable = false)
    private int level;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getLessonsCompleted() {
        return lessonsCompleted;
    }

    public void setLessonsCompleted(int lessonsCompleted) {
        this.lessonsCompleted = lessonsCompleted;
    }

    public int getExercisesAttempted() {
        return exercisesAttempted;
    }

    public void setExercisesAttempted(int exercisesAttempted) {
        this.exercisesAttempted = exercisesAttempted;
    }

    public int getExercisesPassed() {
        return exercisesPassed;
    }

    public void setExercisesPassed(int exercisesPassed) {
        this.exercisesPassed = exercisesPassed;
    }

    public int getQuizAccuracy() {
        return quizAccuracy;
    }

    public void setQuizAccuracy(int quizAccuracy) {
        this.quizAccuracy = quizAccuracy;
    }

    public int getProjectsCompleted() {
        return projectsCompleted;
    }

    public void setProjectsCompleted(int projectsCompleted) {
        this.projectsCompleted = projectsCompleted;
    }

    public int getTimeSpentMin() {
        return timeSpentMin;
    }

    public void setTimeSpentMin(int timeSpentMin) {
        this.timeSpentMin = timeSpentMin;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public LocalDate getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDate lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public int getWeeklyGoalMin() {
        return weeklyGoalMin;
    }

    public void setWeeklyGoalMin(int weeklyGoalMin) {
        this.weeklyGoalMin = weeklyGoalMin;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
