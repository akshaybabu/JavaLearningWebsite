// ── Core Domain Types ─────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export type MasteryLevel = 'not_started' | 'learning' | 'practising' | 'proficient' | 'mastered';

export type ExecStatus =
  | 'idle' | 'queued' | 'compiling' | 'running'
  | 'passed' | 'failed' | 'compile_error' | 'runtime_error'
  | 'time_limit' | 'memory_limit';

// ── User ─────────────────────────────────────────────────────

export interface User {
  id:          string;
  name:        string;
  email:       string;
  avatarUrl?:  string;
  role:        'learner' | 'instructor' | 'admin';
  createdAt:   string;
}

export interface UserProfile {
  userId:          string;
  displayName:     string;
  bio?:            string;
  githubUrl?:      string;
  linkedinUrl?:    string;
  targetRole:      TargetRole;
  experienceLevel: ExperienceLevel;
  weeklyGoalHours: number;
  timezone:        string;
}

export type ExperienceLevel =
  | 'absolute_beginner'
  | 'some_programming'
  | 'junior_developer'
  | 'mid_developer'
  | 'senior_developer';

export type TargetRole =
  | 'java_developer'
  | 'backend_developer'
  | 'automation_engineer'
  | 'sdet'
  | 'spring_boot_developer'
  | 'api_developer'
  | 'interview_prep';

// ── Curriculum ───────────────────────────────────────────────

export interface LearningPath {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  icon:        string;
  color:       string;
  totalHours:  number;
  courseCount: number;
  difficulty:  Difficulty;
  courses:     Course[];
  tags:        string[];
}

export interface Course {
  id:           string;
  slug:         string;
  pathId:       string;
  title:        string;
  description:  string;
  icon:         string;
  difficulty:   Difficulty;
  duration:     string; // e.g. "8 hours"
  lessonCount:  number;
  exerciseCount:number;
  tags:         string[];
  modules:      Module[];
  prerequisites:string[];
  objectives:   string[];
}

export interface Module {
  id:          string;
  courseId:    string;
  order:       number;
  title:       string;
  description: string;
  lessons:     Lesson[];
}

export interface Lesson {
  id:           string;
  moduleId:     string;
  order:        number;
  slug:         string;
  title:        string;
  description:  string;
  difficulty:   Difficulty;
  estimatedMin: number;
  type:         'concept' | 'exercise' | 'quiz' | 'project' | 'challenge';
  objectives:   string[];
  content?:     LessonContent;
  isLocked?:    boolean;
  isFree?:      boolean;
}

export interface LessonContent {
  sections:   ContentSection[];
  exercises:  Exercise[];
  quiz?:      Quiz;
  summary:    string;
  nextLesson? : string;
}

export interface ContentSection {
  id:      string;
  type:    'explanation' | 'code' | 'visual' | 'callout' | 'comparison' | 'realworld';
  title?:  string;
  body:    string;
  code?:   CodeBlock;
  visual?: string; // component name
}

export interface CodeBlock {
  language: string;
  code:     string;
  fileName?: string;
  highlight?: number[];
  runnable?:  boolean;
  output?:    string;
}

// ── Exercise ─────────────────────────────────────────────────

export interface Exercise {
  id:              string;
  lessonId:        string;
  title:           string;
  description:     string;
  instructions:    string;
  starterCode:     string;
  solutionCode:    string;
  testCases:       TestCase[];
  hints:           string[];
  difficulty:      Difficulty;
  expectedOutput?: string;
}

export interface TestCase {
  id:          string;
  exerciseId:  string;
  description: string;
  input?:      string;
  expected:    string;
  isHidden:    boolean;
}

export interface ExerciseAttempt {
  id:         string;
  exerciseId: string;
  userId:     string;
  code:       string;
  status:     ExecStatus;
  output?:    string;
  error?:     string;
  passedTests:number;
  totalTests: number;
  timeTaken:  number; // ms
  submittedAt:string;
}

// ── Quiz ─────────────────────────────────────────────────────

export interface Quiz {
  id:        string;
  lessonId:  string;
  title:     string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id:          string;
  type:        'mcq' | 'multi_select' | 'true_false' | 'code_output' | 'fill_blank';
  question:    string;
  code?:       string;
  options:     AnswerOption[];
  explanation: string;
  difficulty:  Difficulty;
}

export interface AnswerOption {
  id:        string;
  text:      string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id:        string;
  quizId:    string;
  userId:    string;
  answers:   Record<string, string[]>;
  score:     number; // 0-100
  completedAt:string;
}

// ── Progress ─────────────────────────────────────────────────

export interface UserProgress {
  userId:            string;
  lessonsCompleted:  number;
  exercisesAttempted:number;
  exercisesPassed:   number;
  quizAccuracy:      number;
  projectsCompleted: number;
  timeSpentMin:      number;
  currentStreak:     number;
  longestStreak:     number;
  lastActivityDate:  string;
  weeklyGoalMin:     number;
  weeklyCompletedMin:number;
  xp:                number;
  level:             number;
}

export interface TopicMastery {
  userId:     string;
  topicId:    string;
  topicTitle: string;
  mastery:    MasteryLevel;
  lastPracticed:string;
}

export interface LearningActivity {
  date:     string; // YYYY-MM-DD
  minutes:  number;
  lessons:  number;
  exercises:number;
}

// ── Achievement ──────────────────────────────────────────────

export interface Achievement {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  icon:        string;
  color:       string;
  xpReward:    number;
  criteria:    string;
}

export interface UserAchievement {
  achievementId: string;
  userId:        string;
  earnedAt:      string;
  achievement:   Achievement;
}

// ── Roadmap ──────────────────────────────────────────────────

export interface RoadmapNode {
  id:          string;
  title:       string;
  subtitle?:   string;
  icon:        string;
  color:       string;
  status:      'not_started' | 'in_progress' | 'completed' | 'locked';
  difficulty:  Difficulty;
  courseId?:   string;
  children:    string[]; // node ids
  x:           number;
  y:           number;
  level:       number;
}

// ── Interview ────────────────────────────────────────────────

export interface InterviewQuestion {
  id:         string;
  topic:      string;
  question:   string;
  difficulty: Difficulty;
  roles:      TargetRole[];
  tags:       string[];
  answer:     string;
  keyPoints:  string[];
  followUps:  string[];
  frequency:  'rare' | 'common' | 'very_common' | 'always_asked';
}

// ── Project ──────────────────────────────────────────────────

export interface Project {
  id:             string;
  title:          string;
  description:    string;
  icon:           string;
  difficulty:     Difficulty;
  duration:       string;
  techStack:      string[];
  objectives:     string[];
  milestones:     ProjectMilestone[];
  tags:           string[];
  pathId?:        string;
}

export interface ProjectMilestone {
  id:          string;
  order:       number;
  title:       string;
  description: string;
  tasks:       string[];
}
