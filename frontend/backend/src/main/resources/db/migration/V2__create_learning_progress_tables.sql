CREATE TABLE user_progress (
    user_id BIGINT NOT NULL,
    lessons_completed INT NOT NULL DEFAULT 0,
    exercises_attempted INT NOT NULL DEFAULT 0,
    exercises_passed INT NOT NULL DEFAULT 0,
    quiz_accuracy INT NOT NULL DEFAULT 0,
    projects_completed INT NOT NULL DEFAULT 0,
    time_spent_min INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE NULL,
    weekly_goal_min INT NOT NULL DEFAULT 300,
    xp INT NOT NULL DEFAULT 0,
    level_no INT NOT NULL DEFAULT 1,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_progress_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE learning_activity_daily (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    activity_date DATE NOT NULL,
    minutes_spent INT NOT NULL DEFAULT 0,
    lessons_completed INT NOT NULL DEFAULT 0,
    exercises_completed INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_learning_activity_daily UNIQUE (user_id, activity_date),
    CONSTRAINT fk_learning_activity_daily_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE recent_lessons (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    lesson_id VARCHAR(80) NOT NULL,
    course_id VARCHAR(80) NOT NULL,
    lesson_title VARCHAR(180) NOT NULL,
    module_title VARCHAR(180) NOT NULL,
    last_opened_at DATETIME(6) NOT NULL,
    completion_percent INT NOT NULL DEFAULT 0,
    completed_at DATETIME(6) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_recent_lessons_user_lesson UNIQUE (user_id, lesson_id),
    CONSTRAINT fk_recent_lessons_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE topic_mastery (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    topic_id VARCHAR(80) NOT NULL,
    topic_title VARCHAR(180) NOT NULL,
    mastery VARCHAR(30) NOT NULL,
    last_practiced DATE NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_topic_mastery_user_topic UNIQUE (user_id, topic_id),
    CONSTRAINT fk_topic_mastery_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_learning_activity_daily_user_date ON learning_activity_daily (user_id, activity_date);
CREATE INDEX idx_recent_lessons_user_opened ON recent_lessons (user_id, last_opened_at);
CREATE INDEX idx_topic_mastery_user_practiced ON topic_mastery (user_id, last_practiced);
