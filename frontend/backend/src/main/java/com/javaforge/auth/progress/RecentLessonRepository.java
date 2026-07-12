package com.javaforge.auth.progress;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecentLessonRepository extends JpaRepository<RecentLessonEntity, Long> {

    Optional<RecentLessonEntity> findByUserIdAndLessonId(Long userId, String lessonId);

    List<RecentLessonEntity> findTop4ByUserIdOrderByLastOpenedAtDesc(Long userId);
}
