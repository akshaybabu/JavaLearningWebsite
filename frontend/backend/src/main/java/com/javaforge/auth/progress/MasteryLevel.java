package com.javaforge.auth.progress;

public enum MasteryLevel {
    NOT_STARTED,
    LEARNING,
    PRACTISING,
    PROFICIENT,
    MASTERED;

    public String toApiValue() {
        return name().toLowerCase();
    }
}
