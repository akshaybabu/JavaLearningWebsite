package com.javaforge.auth.progress;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "topic_mastery")
public class TopicMasteryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "topic_id", nullable = false, length = 80)
    private String topicId;

    @Column(name = "topic_title", nullable = false, length = 180)
    private String topicTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "mastery", nullable = false, length = 30)
    private MasteryLevel mastery;

    @Column(name = "last_practiced", nullable = false)
    private LocalDate lastPracticed;

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }

    public MasteryLevel getMastery() {
        return mastery;
    }

    public void setMastery(MasteryLevel mastery) {
        this.mastery = mastery;
    }

    public LocalDate getLastPracticed() {
        return lastPracticed;
    }

    public void setLastPracticed(LocalDate lastPracticed) {
        this.lastPracticed = lastPracticed;
    }
}
