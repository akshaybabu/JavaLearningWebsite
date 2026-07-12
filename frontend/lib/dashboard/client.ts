"use client";

import type { LearningActivity, MasteryLevel, TopicMastery, UserAchievement, UserProgress } from "@/types";
import { API_BASE_URL, getStoredAuthToken } from "@/lib/auth/client";

export interface DashboardUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface RecentLesson {
  id: string;
  title: string;
  module: string;
  courseId: string;
  lastOpened: string;
  completion: number;
}

export interface CurrentPath {
  title: string;
  completed: number;
  total: number;
  pct: number;
}

export interface DashboardData {
  user: DashboardUser;
  progress: UserProgress;
  activity: LearningActivity[];
  topicMasteries: TopicMastery[];
  recentLessons: RecentLesson[];
  currentPath: CurrentPath;
  achievements: UserAchievement[];
}

export interface RecordLearningActivityPayload {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  completionPercent: number;
  minutesSpent: number;
  exercisesAttempted: number;
  exercisesPassed: number;
  lessonCompleted: boolean;
  topicId?: string;
  topicTitle?: string;
  masteryLevel?: Uppercase<MasteryLevel>;
  xpEarned?: number;
}

interface DashboardApiResponse {
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
  };
  progress: UserProgress;
  activity: LearningActivity[];
  topicMasteries: TopicMastery[];
  recentLessons: RecentLesson[];
  currentPath: CurrentPath;
  achievements: Array<{
    achievementId: string;
    earnedAt: string;
    achievement: {
      id: string;
      slug: string;
      title: string;
      description: string;
      icon: string;
      color: string;
      xpReward: number;
      criteria: string;
    };
  }>;
}

interface ApiErrorPayload {
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  validationErrors?: Record<string, string>;
}

export class DashboardApiError extends Error {
  status: number;
  validationErrors?: Record<string, string>;

  constructor(message: string, status: number, validationErrors?: Record<string, string>) {
    super(message);
    this.name = "DashboardApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

async function authorizedRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const token = getStoredAuthToken();
  if (!token) {
    throw new DashboardApiError("Please log in to access your learning dashboard.", 401);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const errorData = (data ?? {}) as ApiErrorPayload;
    throw new DashboardApiError(
      errorData.message || "Dashboard request failed.",
      response.status,
      errorData.validationErrors,
    );
  }

  return data as TResponse;
}

function mapDashboardResponse(response: DashboardApiResponse): DashboardData {
  return {
    user: response.user,
    progress: response.progress,
    activity: response.activity,
    topicMasteries: response.topicMasteries,
    recentLessons: response.recentLessons,
    currentPath: response.currentPath,
    achievements: response.achievements.map((achievement) => ({
      ...achievement,
      userId: String(response.user.id),
    })),
  };
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await authorizedRequest<DashboardApiResponse>("/v1/progress/dashboard", {
    method: "GET",
  });

  return mapDashboardResponse(response);
}

export async function recordLearningActivity(
  payload: RecordLearningActivityPayload,
): Promise<DashboardData> {
  const response = await authorizedRequest<DashboardApiResponse>("/v1/progress/activity", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapDashboardResponse(response);
}
