package com.javaforge.auth.progress;

import com.javaforge.auth.progress.dto.AchievementSummary;
import com.javaforge.auth.progress.dto.ActivitySummary;
import com.javaforge.auth.progress.dto.CurrentPathSummary;
import com.javaforge.auth.progress.dto.DashboardResponse;
import com.javaforge.auth.progress.dto.ProgressSummary;
import com.javaforge.auth.progress.dto.RecentLessonSummary;
import com.javaforge.auth.progress.dto.RecordLearningActivityRequest;
import com.javaforge.auth.progress.dto.TopicMasterySummary;
import com.javaforge.auth.progress.dto.UserSummary;
import com.javaforge.auth.security.AuthenticatedUser;
import com.javaforge.auth.user.UserEntity;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LearningProgressService {

    private static final int DEFAULT_WEEKLY_GOAL_MIN = 300;
    private static final int CORE_JAVA_TOTAL_LESSONS = 180;
    private static final String CORE_JAVA_PATH_TITLE = "Core Java Developer";

    private final UserProgressRepository userProgressRepository;
    private final LearningActivityDailyRepository learningActivityDailyRepository;
    private final RecentLessonRepository recentLessonRepository;
    private final TopicMasteryRepository topicMasteryRepository;

    public LearningProgressService(
        UserProgressRepository userProgressRepository,
        LearningActivityDailyRepository learningActivityDailyRepository,
        RecentLessonRepository recentLessonRepository,
        TopicMasteryRepository topicMasteryRepository
    ) {
        this.userProgressRepository = userProgressRepository;
        this.learningActivityDailyRepository = learningActivityDailyRepository;
        this.recentLessonRepository = recentLessonRepository;
        this.topicMasteryRepository = topicMasteryRepository;
    }

    @Transactional
    public void initializeProgressForUser(Long userId) {
        userProgressRepository.findById(userId).orElseGet(() -> {
            UserProgressEntity progress = new UserProgressEntity();
            progress.setUserId(userId);
            progress.setWeeklyGoalMin(DEFAULT_WEEKLY_GOAL_MIN);
            progress.setLevel(1);
            return userProgressRepository.save(progress);
        });
    }

    @Transactional
    public DashboardResponse getDashboard(AuthenticatedUser principal) {
        UserEntity user = principal.getUser();
        UserProgressEntity progress = ensureProgress(user.getId());
        int weeklyCompleted = resolveWeeklyCompletedMinutes(user.getId());

        return new DashboardResponse(
            new UserSummary(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name().toLowerCase(),
                user.getCreatedAt().toString()
            ),
            new ProgressSummary(
                String.valueOf(progress.getUserId()),
                progress.getLessonsCompleted(),
                progress.getExercisesAttempted(),
                progress.getExercisesPassed(),
                progress.getQuizAccuracy(),
                progress.getProjectsCompleted(),
                progress.getTimeSpentMin(),
                progress.getCurrentStreak(),
                progress.getLongestStreak(),
                progress.getLastActivityDate() != null ? progress.getLastActivityDate().toString() : "",
                progress.getWeeklyGoalMin(),
                weeklyCompleted,
                progress.getXp(),
                progress.getLevel()
            ),
            buildActivitySeries(user.getId()),
            topicMasteryRepository.findByUserIdOrderByLastPracticedDesc(user.getId()).stream()
                .map(topic -> new TopicMasterySummary(
                    String.valueOf(topic.getUserId()),
                    topic.getTopicId(),
                    topic.getTopicTitle(),
                    topic.getMastery().toApiValue(),
                    topic.getLastPracticed().toString()
                ))
                .toList(),
            recentLessonRepository.findTop4ByUserIdOrderByLastOpenedAtDesc(user.getId()).stream()
                .map(lesson -> new RecentLessonSummary(
                    lesson.getLessonId(),
                    lesson.getLessonTitle(),
                    lesson.getModuleTitle(),
                    lesson.getCourseId(),
                    lesson.getLastOpenedAt().toLocalDate().toString(),
                    lesson.getCompletionPercent()
                ))
                .toList(),
            new CurrentPathSummary(
                CORE_JAVA_PATH_TITLE,
                progress.getLessonsCompleted(),
                CORE_JAVA_TOTAL_LESSONS,
                Math.round((progress.getLessonsCompleted() * 100.0f) / CORE_JAVA_TOTAL_LESSONS)
            ),
            buildAchievements(progress)
        );
    }

    @Transactional
    public DashboardResponse recordActivity(AuthenticatedUser principal, RecordLearningActivityRequest request) {
        UserEntity user = principal.getUser();
        UserProgressEntity progress = ensureProgress(user.getId());

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        LearningActivityDailyEntity dailyActivity = learningActivityDailyRepository
            .findByUserIdAndActivityDate(user.getId(), today)
            .orElseGet(() -> {
                LearningActivityDailyEntity entity = new LearningActivityDailyEntity();
                entity.setUserId(user.getId());
                entity.setActivityDate(today);
                return entity;
            });

        RecentLessonEntity recentLesson = recentLessonRepository
            .findByUserIdAndLessonId(user.getId(), request.lessonId())
            .orElseGet(() -> {
                RecentLessonEntity entity = new RecentLessonEntity();
                entity.setUserId(user.getId());
                entity.setLessonId(request.lessonId());
                return entity;
            });

        boolean newlyCompletedLesson = request.lessonCompleted() && recentLesson.getCompletionPercent() < 100;
        int safeCompletionPercent = Math.max(
            Math.max(0, recentLesson.getCompletionPercent()),
            Math.max(0, Math.min(100, request.completionPercent()))
        );
        if (request.lessonCompleted()) {
            safeCompletionPercent = 100;
            recentLesson.setCompletedAt(now);
        }

        recentLesson.setCourseId(request.courseId());
        recentLesson.setLessonTitle(request.lessonTitle());
        recentLesson.setModuleTitle(request.moduleTitle());
        recentLesson.setLastOpenedAt(now);
        recentLesson.setCompletionPercent(safeCompletionPercent);
        recentLessonRepository.save(recentLesson);

        int safeExercisesPassed = Math.max(0, Math.min(request.exercisesPassed(), request.exercisesAttempted()));
        int xpEarned = request.xpEarned() != null
            ? request.xpEarned()
            : Math.max(5, request.minutesSpent()) + (newlyCompletedLesson ? 100 : 0) + (safeExercisesPassed * 15);

        dailyActivity.setMinutesSpent(dailyActivity.getMinutesSpent() + request.minutesSpent());
        dailyActivity.setExercisesCompleted(dailyActivity.getExercisesCompleted() + safeExercisesPassed);
        dailyActivity.setXpEarned(dailyActivity.getXpEarned() + xpEarned);
        if (newlyCompletedLesson) {
            dailyActivity.setLessonsCompleted(dailyActivity.getLessonsCompleted() + 1);
        }
        learningActivityDailyRepository.save(dailyActivity);

        int updatedExercisesAttempted = progress.getExercisesAttempted() + request.exercisesAttempted();
        int updatedExercisesPassed = progress.getExercisesPassed() + safeExercisesPassed;

        progress.setTimeSpentMin(progress.getTimeSpentMin() + request.minutesSpent());
        progress.setExercisesAttempted(updatedExercisesAttempted);
        progress.setExercisesPassed(updatedExercisesPassed);
        progress.setQuizAccuracy(resolveQuizAccuracy(updatedExercisesAttempted, updatedExercisesPassed));
        progress.setXp(progress.getXp() + xpEarned);
        progress.setLevel(Math.max(1, (progress.getXp() / 600) + 1));

        if (newlyCompletedLesson) {
            progress.setLessonsCompleted(progress.getLessonsCompleted() + 1);
        }

        updateStreak(progress, today);
        userProgressRepository.save(progress);

        if (request.topicId() != null && !request.topicId().isBlank()
            && request.topicTitle() != null && !request.topicTitle().isBlank()) {
            TopicMasteryEntity topicMastery = topicMasteryRepository
                .findByUserIdAndTopicId(user.getId(), request.topicId())
                .orElseGet(() -> {
                    TopicMasteryEntity entity = new TopicMasteryEntity();
                    entity.setUserId(user.getId());
                    entity.setTopicId(request.topicId());
                    return entity;
                });

            topicMastery.setTopicTitle(request.topicTitle());
            topicMastery.setMastery(resolveMasteryLevel(request, safeCompletionPercent));
            topicMastery.setLastPracticed(today);
            topicMasteryRepository.save(topicMastery);
        }

        return getDashboard(principal);
    }

    private UserProgressEntity ensureProgress(Long userId) {
        return userProgressRepository.findById(userId).orElseGet(() -> {
            UserProgressEntity progress = new UserProgressEntity();
            progress.setUserId(userId);
            progress.setWeeklyGoalMin(DEFAULT_WEEKLY_GOAL_MIN);
            progress.setLevel(1);
            return userProgressRepository.save(progress);
        });
    }

    private void updateStreak(UserProgressEntity progress, LocalDate today) {
        LocalDate lastActivityDate = progress.getLastActivityDate();
        if (lastActivityDate == null) {
            progress.setCurrentStreak(1);
        } else if (today.equals(lastActivityDate)) {
            if (progress.getCurrentStreak() == 0) {
                progress.setCurrentStreak(1);
            }
        } else if (today.minusDays(1).equals(lastActivityDate)) {
            progress.setCurrentStreak(progress.getCurrentStreak() + 1);
        } else {
            progress.setCurrentStreak(1);
        }

        progress.setLongestStreak(Math.max(progress.getLongestStreak(), progress.getCurrentStreak()));
        progress.setLastActivityDate(today);
    }

    private MasteryLevel resolveMasteryLevel(RecordLearningActivityRequest request, int completionPercent) {
        if (request.masteryLevel() != null) {
            return request.masteryLevel();
        }
        if (completionPercent >= 100) {
            return MasteryLevel.PROFICIENT;
        }
        if (completionPercent >= 60) {
            return MasteryLevel.LEARNING;
        }
        return MasteryLevel.NOT_STARTED;
    }

    private int resolveWeeklyCompletedMinutes(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        Integer result = learningActivityDailyRepository.sumMinutesSpentBetween(userId, weekStart, today);
        return result != null ? result : 0;
    }

    private int resolveQuizAccuracy(int totalAttempted, int totalPassed) {
        if (totalAttempted <= 0) {
            return 0;
        }
        return Math.round((totalPassed * 100.0f) / totalAttempted);
    }

    private List<ActivitySummary> buildActivitySeries(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate fromDate = today.minusDays(83);
        List<LearningActivityDailyEntity> persisted = learningActivityDailyRepository
            .findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(userId, fromDate, today);

        Map<LocalDate, LearningActivityDailyEntity> byDate = new HashMap<>();
        for (LearningActivityDailyEntity entity : persisted) {
            byDate.put(entity.getActivityDate(), entity);
        }

        List<ActivitySummary> activity = new ArrayList<>();
        for (int i = 0; i < 84; i++) {
            LocalDate date = fromDate.plusDays(i);
            LearningActivityDailyEntity entity = byDate.get(date);
            activity.add(new ActivitySummary(
                date.toString(),
                entity != null ? entity.getMinutesSpent() : 0,
                entity != null ? entity.getLessonsCompleted() : 0,
                entity != null ? entity.getExercisesCompleted() : 0
            ));
        }
        return activity;
    }

    private List<AchievementSummary> buildAchievements(UserProgressEntity progress) {
        List<AchievementSummary> achievements = new ArrayList<>();

        if (progress.getLessonsCompleted() > 0) {
            achievements.add(new AchievementSummary(
                "first-lesson",
                progress.getLastActivityDate() != null ? progress.getLastActivityDate().toString() : LocalDate.now().toString(),
                new AchievementSummary.AchievementDetail(
                    "first-lesson",
                    "first-lesson",
                    "Lesson Starter",
                    "Completed your first lesson",
                    "🎉",
                    "#f97316",
                    50,
                    "Complete your first lesson"
                )
            ));
        }

        if (progress.getCurrentStreak() >= 7) {
            achievements.add(new AchievementSummary(
                "streak-7",
                progress.getLastActivityDate() != null ? progress.getLastActivityDate().toString() : LocalDate.now().toString(),
                new AchievementSummary.AchievementDetail(
                    "streak-7",
                    "streak-7",
                    "Week Warrior",
                    "Maintained a 7-day streak",
                    "🔥",
                    "#f43f5e",
                    200,
                    "7 consecutive learning days"
                )
            ));
        }

        if (progress.getXp() >= 1000) {
            achievements.add(new AchievementSummary(
                "xp-1000",
                progress.getLastActivityDate() != null ? progress.getLastActivityDate().toString() : LocalDate.now().toString(),
                new AchievementSummary.AchievementDetail(
                    "xp-1000",
                    "xp-1000",
                    "XP Builder",
                    "Earned 1000 experience points",
                    "⚡",
                    "#f59e0b",
                    100,
                    "Reach 1000 XP"
                )
            ));
        }

        return achievements;
    }
}
