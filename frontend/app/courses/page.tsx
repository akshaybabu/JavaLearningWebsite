"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Filter, BookOpen, Clock, Code2, ChevronRight,
  CheckCircle2, Lock, Star, Zap, Users,
} from "lucide-react";
import { Button, Badge, Card, ProgressBar } from "@/components/ui";
import { courses, learningPaths } from "@/lib/data/curriculum";
import { courseGuides } from "@/lib/data/guides";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced", "Professional"];

const courseProgress: Record<string, number> = {
  "java-foundations": 100,
  "java-oop":         35,
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [pathFilter, setPathFilter] = useState<string | null>(null);

  const filtered = courses.filter(c => {
    const matchSearch = search === "" || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.includes(search.toLowerCase()));
    const matchFilter = filter === "All" || c.difficulty === filter.toLowerCase();
    const matchPath = pathFilter === null || c.pathId === pathFilter;
    return matchSearch && matchFilter && matchPath;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge variant="brand" className="mb-3">Curriculum</Badge>
          <h1 className="text-3xl font-bold mb-2">Java Courses</h1>
          <p className="text-[var(--text-secondary)]">Structured courses that take you from first print statement to production Spring Boot APIs.</p>
        </motion.div>

        {/* Learning Paths */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Learning Paths</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningPaths.map((path, i) => (
              <motion.button
                key={path.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
                onClick={() => setPathFilter(pathFilter === path.id ? null : path.id)}
                className={cn(
                  "text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5",
                  pathFilter === path.id
                    ? "border-brand-500/50 bg-brand-500/5"
                    : "border-[var(--border)] bg-[var(--bg-card)] hover:border-brand-500/30"
                )}
              >
                <div className="text-3xl mb-3">{path.icon}</div>
                <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{path.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{path.totalHours}h · {path.courseCount} courses</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {path.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-2xs px-1.5 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]">{t}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                  filter === f
                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-500/30"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const progress = courseProgress[course.id] ?? 0;
            const isStarted = progress > 0;
            const isCompleted = progress === 100;
            const guide = courseGuides[course.id];

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
              >
                <Link href={`/courses/${course.id}`}>
                  <Card hoverable className="p-0 overflow-hidden flex flex-col h-full">
                    {/* Card top accent */}
                    <div
                      className="h-1.5"
                      style={{
                        background: isCompleted ? "#22c55e" : isStarted ? `linear-gradient(90deg, #f97316 ${progress}%, var(--bg-elevated) ${progress}%)` : "var(--bg-elevated)"
                      }}
                    />

                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                          {course.icon}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={course.difficulty === "beginner" ? "beginner" : course.difficulty === "intermediate" ? "intermediate" : course.difficulty === "advanced" ? "advanced" : "brand"}>
                            {course.difficulty}
                          </Badge>
                          {isCompleted && <Badge variant="success">Completed</Badge>}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-2 leading-snug">{course.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">{course.description}</p>
                        {guide && (
                          <p className="text-xs text-brand-400 mt-2 line-clamp-2">
                            Example-driven learning: {guide.example.title}
                          </p>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{course.lessonCount} lessons</span>
                        <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" />{course.exerciseCount} exercises</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {course.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-2xs px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]">{t}</span>
                        ))}
                      </div>

                      {/* Progress */}
                      {isStarted && (
                        <div>
                          <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                            <span>Progress</span>
                            <span className="font-semibold text-[var(--text-primary)]">{progress}%</span>
                          </div>
                          <ProgressBar value={progress} height={4} color={isCompleted ? "#22c55e" : "#f97316"} />
                        </div>
                      )}

                      {/* CTA */}
                      <Button
                        variant={isStarted ? "brand" : "ghost"}
                        size="sm"
                        className="w-full gap-2"
                      >
                        {isCompleted ? "Review Course" : isStarted ? "Continue" : "Start Course"}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">No courses found</h3>
            <p className="text-[var(--text-secondary)]">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
