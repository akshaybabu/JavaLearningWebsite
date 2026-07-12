"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Play,
  Trophy,
  Zap,
} from "lucide-react";
import type { LearningActivity } from "@/types";
import { Badge, Button, Card, ProgressBar, ProgressRing, Tooltip } from "@/components/ui";
import { DashboardApiError, type DashboardData, fetchDashboard } from "@/lib/dashboard/client";
import { formatDuration, formatRelativeTime, cn } from "@/lib/utils";

const masteryConfig = {
  not_started: { label: "Not Started", color: "var(--text-muted)", bg: "var(--bg-elevated)" },
  learning: { label: "Learning", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  practising: { label: "Practising", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  proficient: { label: "Proficient", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  mastered: { label: "Mastered", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
} as const;

function ActivityHeatmap({ activity }: { activity: LearningActivity[] }) {
  if (!activity.length) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Your learning activity will appear here as soon as you start lessons.
      </p>
    );
  }

  const weeks: Array<Array<LearningActivity | null>> = [];
  const data: Array<LearningActivity | null> = [...activity];
  const firstDate = new Date(data[0]!.date);
  const startPad = firstDate.getDay();

  for (let index = 0; index < startPad; index += 1) {
    data.unshift(null);
  }

  for (let index = 0; index < data.length; index += 7) {
    weeks.push(data.slice(index, index + 7));
  }

  const maxMinutes = Math.max(...activity.map((day) => day.minutes), 1);

  const getColor = (minutes: number) => {
    if (!minutes) {
      return "bg-[var(--bg-elevated)]";
    }

    const intensity = minutes / maxMinutes;
    if (intensity < 0.25) {
      return "bg-brand-900";
    }
    if (intensity < 0.5) {
      return "bg-brand-700";
    }
    if (intensity < 0.75) {
      return "bg-brand-500";
    }
    return "bg-brand-400";
  };

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div>
      <div className="flex items-end gap-1.5">
        <div className="mr-1 flex flex-col gap-1">
          {days.map((day, index) => (
            <span key={day + index} className="flex h-3 items-center text-2xs text-[var(--text-muted)]">
              {index % 2 === 1 ? day : ""}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <Tooltip
                key={`day-${weekIndex}-${dayIndex}`}
                label={day ? `${day.date}: ${day.minutes}m, ${day.lessons} lessons` : "No activity"}
              >
                <div
                  className={cn(
                    "heatmap-cell rounded-sm",
                    day ? getColor(day.minutes) : "bg-[var(--bg-elevated)]",
                  )}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span className="text-2xs text-[var(--text-muted)]">Less</span>
        {["bg-[var(--bg-elevated)]", "bg-brand-900", "bg-brand-700", "bg-brand-500", "bg-brand-400"].map((color) => (
          <div key={color} className={cn("h-3 w-3 rounded-sm", color)} />
        ))}
        <span className="text-2xs text-[var(--text-muted)]">More</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchDashboard();
      setDashboard(data);
    } catch (loadError) {
      const message = loadError instanceof DashboardApiError
        ? loadError.message
        : "Unable to load your dashboard right now.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    const refreshInterval = window.setInterval(() => {
      void loadDashboard();
    }, 60000);

    const handleFocus = () => {
      void loadDashboard();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearTimeout(initialLoadTimer);
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadDashboard]);

  if (isLoading && !dashboard) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-8">
        <Card className="w-full max-w-xl p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-400" />
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Loading your learning dashboard</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Pulling your streak, progress, recent lessons, and topic mastery from the database.
          </p>
        </Card>
      </div>
    );
  }

  if (error && !dashboard) {
    const needsLogin = error.toLowerCase().includes("log in");

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-8">
        <Card className="w-full max-w-xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Dashboard unavailable</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{error}</p>
          <div className="mt-5 flex justify-center gap-3">
            {needsLogin ? (
              <Link href="/login">
                <Button variant="brand">Go to Login</Button>
              </Link>
            ) : (
              <Button variant="brand" onClick={() => void loadDashboard()}>
                Try Again
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { user, progress, topicMasteries, activity, achievements, currentPath, recentLessons } = dashboard;
  const currentLesson = recentLessons[0] ?? null;
  const weeklyPct = progress.weeklyGoalMin > 0
    ? Math.min(100, Math.round((progress.weeklyCompletedMin / progress.weeklyGoalMin) * 100))
    : 0;
  const exercisePct = progress.exercisesAttempted > 0
    ? Math.round((progress.exercisesPassed / progress.exercisesAttempted) * 100)
    : 0;
  const weeklyRemaining = Math.max(0, progress.weeklyGoalMin - progress.weeklyCompletedMin);
  const xpToNextLevel = Math.max(0, progress.level * 600 - progress.xp);

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="mb-1 text-sm text-[var(--text-muted)]">Welcome back</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user.fullName}</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            <span className="font-semibold text-brand-400">{currentPath.title}</span>
            {" · "}
            {currentPath.completed}/{currentPath.total} lessons
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={currentLesson ? `/learn/${currentLesson.courseId}/${currentLesson.id}` : "/courses"}>
            <Button variant="brand" size="md" className="gap-2">
              <Play className="h-4 w-4" />
              {currentLesson ? "Resume Learning" : "Start Learning"}
            </Button>
          </Link>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Card className="border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <p className="font-medium text-amber-300">Showing your last loaded dashboard snapshot</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{error}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => void loadDashboard()}>
                Refresh
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {[
          {
            icon: Flame,
            label: "Current Streak",
            value: `${progress.currentStreak} days`,
            sub: `Best: ${progress.longestStreak} days`,
            color: "#f97316",
            bg: "rgba(249,115,22,0.1)",
          },
          {
            icon: Clock,
            label: "Total Learning Time",
            value: formatDuration(progress.timeSpentMin),
            sub: `This week: ${formatDuration(progress.weeklyCompletedMin)}`,
            color: "#3b82f6",
            bg: "rgba(59,130,246,0.1)",
          },
          {
            icon: CheckCircle2,
            label: "Lessons Completed",
            value: `${progress.lessonsCompleted}`,
            sub: `of ${currentPath.total} total`,
            color: "#10b981",
            bg: "rgba(16,185,129,0.1)",
          },
          {
            icon: Zap,
            label: "XP Earned",
            value: `${progress.xp.toLocaleString()} XP`,
            sub: `Level ${progress.level} · ${xpToNextLevel} XP to next`,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.1)",
          },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-muted)]">{stat.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: stat.bg }}>
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</div>
              <div className="mt-0.5 text-xs text-[var(--text-muted)]">{stat.sub}</div>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}>
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">Continue Where You Left Off</h2>
                <Badge variant="brand">{currentLesson ? "In Progress" : "Ready to Start"}</Badge>
              </div>

              {currentLesson ? (
                <div className="flex flex-col items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/15">
                    <span className="text-xl">J</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-2xs text-[var(--text-muted)]">{currentLesson.module}</p>
                      <Badge variant="beginner">Active</Badge>
                    </div>
                    <h3 className="truncate font-semibold text-[var(--text-primary)]">{currentLesson.title}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <ProgressBar value={currentLesson.completion} height={4} className="flex-1" />
                      <span className="whitespace-nowrap text-xs text-[var(--text-muted)]">{currentLesson.completion}%</span>
                    </div>
                  </div>
                  <Link href={`/learn/${currentLesson.courseId}/${currentLesson.id}`} className="flex-shrink-0">
                    <Button variant="brand" size="sm" className="gap-2">
                      <Play className="h-3.5 w-3.5" />
                      Resume
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Your recent lessons will appear here once you open a course. Start with the Java OOP track to begin
                    building streaks, XP, and mastery data in the database.
                  </p>
                  <div className="mt-4">
                    <Link href="/courses">
                      <Button variant="brand" size="sm">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">Recently Accessed</h2>
                <Link href="/courses" className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300">
                  All courses
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-2">
                {recentLessons.length > 0 ? (
                  recentLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/learn/${lesson.courseId}/${lesson.id}`}
                      className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-[var(--bg-elevated)]"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                          lesson.completion === 100
                            ? "border border-accent-500/25 bg-accent-500/15"
                            : "border border-brand-500/25 bg-brand-500/15",
                        )}
                      >
                        {lesson.completion === 100 ? (
                          <CheckCircle2 className="h-4 w-4 text-accent-400" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-brand-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">{lesson.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {lesson.module} · {formatRelativeTime(lesson.lastOpened)}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs font-semibold text-[var(--text-secondary)]">{lesson.completion}%</div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-brand-400" />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">
                    No lesson activity yet. Open a lesson and we&apos;ll start tracking your live progress here.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}>
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">Learning Activity</h2>
                <span className="text-xs text-[var(--text-muted)]">Last 12 weeks</span>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <ActivityHeatmap activity={activity} />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Weekly Goal</h2>
              <div className="mb-4 flex items-center gap-4">
                <ProgressRing value={weeklyPct} size={80} stroke={7}>
                  <div className="text-center">
                    <div className="text-sm font-bold text-[var(--text-primary)]">{weeklyPct}%</div>
                  </div>
                </ProgressRing>
                <div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">{formatDuration(progress.weeklyCompletedMin)}</p>
                  <p className="text-xs text-[var(--text-muted)]">of {formatDuration(progress.weeklyGoalMin)} goal</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{formatDuration(weeklyRemaining)} remaining</p>
                </div>
              </div>
              <ProgressBar value={weeklyPct} height={8} showLabel />
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.25 } }}>
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Topic Mastery</h2>
              <div className="space-y-3">
                {topicMasteries.length > 0 ? (
                  topicMasteries.slice(0, 6).map((topic) => {
                    const config = masteryConfig[topic.mastery];
                    return (
                      <div key={topic.topicId} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">{topic.topicTitle}</span>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{ color: config.color, background: config.bg }}
                        >
                          {config.label}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">
                    Topic mastery will update automatically as you complete lessons and exercises.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}>
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-[var(--text-primary)]">Achievements</h2>
                <Trophy className="h-4 w-4 text-brand-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {achievements.length > 0 ? (
                  achievements.map((item) => (
                    <Tooltip key={item.achievementId} label={item.achievement.description}>
                      <div className="cursor-default rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 transition-colors hover:border-brand-500/30">
                        <div className="mb-2 text-2xl">{item.achievement.icon}</div>
                        <div className="text-2xs leading-tight text-[var(--text-muted)]">{item.achievement.title}</div>
                      </div>
                    </Tooltip>
                  ))
                ) : (
                  <div className="col-span-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-muted)]">
                    Complete your first lesson to unlock achievements here.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.35 } }}>
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-[var(--text-primary)]">Performance</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Quiz Accuracy</span>
                    <span className="font-semibold text-[var(--text-primary)]">{progress.quizAccuracy}%</span>
                  </div>
                  <ProgressBar value={progress.quizAccuracy} color="#f97316" />
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Exercise Pass Rate</span>
                    <span className="font-semibold text-[var(--text-primary)]">{exercisePct}%</span>
                  </div>
                  <ProgressBar value={exercisePct} color="#10b981" />
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Course Progress</span>
                    <span className="font-semibold text-[var(--text-primary)]">{currentPath.pct}%</span>
                  </div>
                  <ProgressBar value={currentPath.pct} color="#3b82f6" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
