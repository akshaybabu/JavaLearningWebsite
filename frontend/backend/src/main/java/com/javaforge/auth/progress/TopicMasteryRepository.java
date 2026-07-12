package com.javaforge.auth.progress;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicMasteryRepository extends JpaRepository<TopicMasteryEntity, Long> {

    Optional<TopicMasteryEntity> findByUserIdAndTopicId(Long userId, String topicId);

    List<TopicMasteryEntity> findByUserIdOrderByLastPracticedDesc(Long userId);
}
