import type { UserProgress, UserAchievement, LearningActivity, TopicMastery } from "@/types";

// NOTE: This is clearly labeled sample/mock data for development.
// Replace with real API calls in production.

export const MOCK_USER = {
  id: "usr_01",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatarUrl: "",
  role: "learner" as const,
  createdAt: "2026-04-10T00:00:00Z",
};

export const MOCK_PROGRESS: UserProgress = {
  userId: "usr_01",
  lessonsCompleted: 24,
  exercisesAttempted: 38,
  exercisesPassed: 31,
  quizAccuracy: 82,
  projectsCompleted: 2,
  timeSpentMin: 2180,        // ~36 hours
  currentStreak: 8,
  longestStreak: 21,
  lastActivityDate: new Date().toISOString().split("T")[0],
  weeklyGoalMin: 300,        // 5 hours
  weeklyCompletedMin: 220,   // 3h 40m
  xp: 3450,
  level: 7,
};

export const MOCK_TOPIC_MASTERY: TopicMastery[] = [
  { userId: "usr_01", topicId: "variables",      topicTitle: "Variables & Types",   mastery: "mastered",    lastPracticed: "2026-07-10" },
  { userId: "usr_01", topicId: "oop",            topicTitle: "OOP Fundamentals",    mastery: "proficient",  lastPracticed: "2026-07-11" },
  { userId: "usr_01", topicId: "collections",    topicTitle: "Collections",          mastery: "practising",  lastPracticed: "2026-07-09" },
  { userId: "usr_01", topicId: "exceptions",     topicTitle: "Exception Handling",  mastery: "proficient",  lastPracticed: "2026-07-08" },
  { userId: "usr_01", topicId: "streams",        topicTitle: "Streams & Lambdas",   mastery: "learning",    lastPracticed: "2026-07-12" },
  { userId: "usr_01", topicId: "multithreading", topicTitle: "Multithreading",       mastery: "learning",    lastPracticed: "2026-07-07" },
  { userId: "usr_01", topicId: "spring-boot",    topicTitle: "Spring Boot",          mastery: "not_started", lastPracticed: "" },
  { userId: "usr_01", topicId: "testing",        topicTitle: "Testing & JUnit",      mastery: "practising",  lastPracticed: "2026-07-06" },
];

// Generate realistic 12-week activity heatmap
function generateActivity(): LearningActivity[] {
  const activity: LearningActivity[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay();
    // Less activity on weekends, none some days
    const hasActivity = Math.random() > (dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 0.25);
    activity.push({
      date: d.toISOString().split("T")[0],
      minutes:  hasActivity ? Math.floor(Math.random() * 90) + 15 : 0,
      lessons:  hasActivity ? Math.floor(Math.random() * 3) + 1 : 0,
      exercises:hasActivity ? Math.floor(Math.random() * 4) : 0,
    });
  }
  return activity;
}

export const MOCK_ACTIVITY: LearningActivity[] = generateActivity();

export const MOCK_ACHIEVEMENTS: UserAchievement[] = [
  {
    achievementId: "first-program",
    userId: "usr_01",
    earnedAt: "2026-04-10T00:00:00Z",
    achievement: {
      id: "first-program", slug: "first-program",
      title: "Hello, World!", description: "Ran your first Java program",
      icon: "🎉", color: "#f97316", xpReward: 50, criteria: "Complete lesson: Your First Java Program",
    },
  },
  {
    achievementId: "loop-master",
    userId: "usr_01",
    earnedAt: "2026-04-18T00:00:00Z",
    achievement: {
      id: "loop-master", slug: "loop-master",
      title: "Loop Master", description: "Completed all loop exercises",
      icon: "🔄", color: "#3b82f6", xpReward: 100, criteria: "Complete all loop exercises",
    },
  },
  {
    achievementId: "oop-explorer",
    userId: "usr_01",
    earnedAt: "2026-05-02T00:00:00Z",
    achievement: {
      id: "oop-explorer", slug: "oop-explorer",
      title: "OOP Explorer", description: "Started the OOP course",
      icon: "🧩", color: "#8b5cf6", xpReward: 75, criteria: "Begin the OOP course",
    },
  },
  {
    achievementId: "streak-7",
    userId: "usr_01",
    earnedAt: "2026-07-05T00:00:00Z",
    achievement: {
      id: "streak-7", slug: "streak-7",
      title: "Week Warrior", description: "Maintained a 7-day streak",
      icon: "🔥", color: "#f43f5e", xpReward: 200, criteria: "7 consecutive learning days",
    },
  },
];

export const MOCK_RECENT_LESSONS = [
  { id: "oop-101", title: "Classes and Objects in Java", module: "OOP Fundamentals", courseId: "java-oop", lastOpened: "2026-07-12", completion: 65 },
  { id: "f-11",   title: "Project: Calculator App",      module: "Methods & Arrays",    courseId: "java-foundations", lastOpened: "2026-07-11", completion: 100 },
  { id: "f-10",   title: "Working with Strings",          module: "Methods & Arrays",    courseId: "java-foundations", lastOpened: "2026-07-10", completion: 100 },
  { id: "f-9",    title: "Arrays",                        module: "Methods & Arrays",    courseId: "java-foundations", lastOpened: "2026-07-09", completion: 100 },
];

export const MOCK_CURRENT_LESSON = MOCK_RECENT_LESSONS[0];

export const MOCK_CURRENT_PATH = {
  title: "Core Java Developer",
  completed: 24,
  total: 180,
  pct: Math.round(24 / 180 * 100),
};
