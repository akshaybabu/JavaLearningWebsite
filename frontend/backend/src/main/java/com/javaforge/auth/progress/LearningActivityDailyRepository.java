package com.javaforge.auth.progress;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LearningActivityDailyRepository extends JpaRepository<LearningActivityDailyEntity, Long> {

    Optional<LearningActivityDailyEntity> findByUserIdAndActivityDate(Long userId, LocalDate activityDate);

    List<LearningActivityDailyEntity> findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(
        Long userId,
        LocalDate fromDate,
        LocalDate toDate
    );

    @Query("""
        select coalesce(sum(a.minutesSpent), 0)
        from LearningActivityDailyEntity a
        where a.userId = :userId
          and a.activityDate between :fromDate and :toDate
        """)
    Integer sumMinutesSpentBetween(
        @Param("userId") Long userId,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate
    );
}
