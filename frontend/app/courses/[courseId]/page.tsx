"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock, BookOpen, Code2, CheckCircle2, Lock, ChevronDown,
  ChevronUp, Play, Award, Users, Star, ArrowRight,
} from "lucide-react";
import { Button, Badge, Card, ProgressBar } from "@/components/ui";
import { courses } from "@/lib/data/curriculum";
import { courseGuides, moduleGuides } from "@/lib/data/guides";
import { cn } from "@/lib/utils";

const courseProgress: Record<string, number> = {
  "java-foundations": 100,
  "java-oop": 35,
};

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = courses.find(c => c.id === params.courseId);
  if (!course) notFound();

  const progress = courseProgress[course.id] ?? 0;
  const courseGuide = courseGuides[course.id];
  const [openModules, setOpenModules] = useState<Set<string>>(new Set([course.modules[0]?.id]));

  const toggleModule = (id: string) => {
    setOpenModules(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-3xl">{course.icon}</span>
                <Badge variant={
                  course.difficulty === "beginner" ? "beginner" :
                  course.difficulty === "intermediate" ? "intermediate" :
                  course.difficulty === "advanced" ? "advanced" : "brand"
                }>
                  {course.difficulty}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">{course.title}</h1>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{course.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duration}</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{course.lessonCount} lessons</span>
                <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4" />{course.exerciseCount} exercises</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" />Certificate on completion</span>
              </div>
            </div>

            {/* CTA Card */}
            <Card className="w-full lg:w-72 p-5 flex-shrink-0">
              {progress > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--text-secondary)]">Progress</span>
                      <span className="font-semibold text-[var(--text-primary)]">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} height={8} />
                  </div>
                  <Link href="/learn/java-oop/oop-101">
                    <Button variant="brand" size="lg" className="w-full gap-2 mb-3">
                      <Play className="w-4 h-4" /> Continue Learning
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/learn/java-oop/oop-101">
                  <Button variant="brand" size="lg" className="w-full gap-2 mb-3">
                    Start Course <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <div className="text-xs text-[var(--text-muted)] text-center">
                Free to start · No credit card required
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Objectives */}
        {course.objectives.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">What you&apos;ll learn</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {course.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  {obj}
                </div>
              ))}
            </div>
          </Card>
        )}

        {courseGuide && (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="brand">Course Guide</Badge>
              <span className="text-sm text-[var(--text-muted)]">Explanation, examples, and step-by-step learning flow</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)] mb-2">How this course teaches the topic</h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{courseGuide.summary}</p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Why it matters</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{courseGuide.whyItMatters}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Real-time explanation</p>
                  <div className="space-y-2">
                    {courseGuide.realTimeExplanation.map((step, index) => (
                      <div key={step.title} className="flex gap-3 rounded-xl border border-[var(--border)] p-3">
                        <div className="w-6 h-6 rounded-full bg-brand-500/15 text-brand-400 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{step.title}</p>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-accent-500/20 bg-accent-500/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-accent-400 mb-2">Real-world example</p>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{courseGuide.example.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{courseGuide.example.scenario}</p>
                  <p className="text-sm text-accent-300">{courseGuide.example.takeaway}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">By the end of this course</p>
                  <div className="space-y-1.5">
                    {courseGuide.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {course.tags.map(t => (
            <span key={t} className="px-3 py-1 rounded-full text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)]">{t}</span>
          ))}
        </div>

        {/* Modules & Lessons */}
        <div>
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">Course Curriculum</h2>
          <p className="text-sm text-[var(--text-muted)] mb-5">{course.modules.length} modules · {totalLessons} lessons</p>

          <div className="space-y-3">
            {course.modules.map((module, mi) => {
              const isOpen = openModules.has(module.id);
              const moduleGuide = moduleGuides[module.id];
              return (
                <div key={module.id} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-sm font-bold text-brand-400">{mi + 1}</div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{module.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{module.lessons.length} lessons · {module.description}</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
                  </button>

                  {isOpen && (
                    <div className="border-t border-[var(--border)]">
                      {moduleGuide && (
                        <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]/70">
                          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
                            <div>
                              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Module explanation</p>
                              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{moduleGuide.summary}</p>
                              <div className="space-y-2">
                                {moduleGuide.realTimeExplanation.map((step, index) => (
                                  <div key={step.title} className="flex gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-brand-500/15 text-brand-400 text-2xs font-semibold flex items-center justify-center flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-[var(--text-primary)]">{step.title}</p>
                                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3">
                              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Practical example</p>
                              <p className="text-sm font-medium text-brand-400 mb-1">{moduleGuide.example.title}</p>
                              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{moduleGuide.example.scenario}</p>
                              <p className="text-xs text-accent-300 leading-relaxed">{moduleGuide.example.takeaway}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {module.lessons.map((lesson, li) => {
                        const isCompleted = progress === 100;
                        const isCurrent = lesson.id === "oop-101";
                        const isLocked = lesson.isLocked && !isCompleted;

                        return (
                          <Link
                            key={lesson.id}
                            href={isLocked ? "#" : `/learn/${course.id}/${lesson.id}`}
                            className={cn(
                              "flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0 transition-colors group",
                              isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--bg-elevated)]"
                            )}
                          >
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
                              isCompleted ? "bg-green-500/15 border border-green-500/30 text-green-400" :
                              isCurrent ? "bg-brand-500/15 border border-brand-500/30 text-brand-400" :
                              isLocked ? "bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)]" :
                              "bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)]"
                            )}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                               isLocked ? <Lock className="w-3.5 h-3.5" /> :
                               isCurrent ? <Play className="w-3.5 h-3.5" /> :
                               li + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{lesson.title}</p>
                                {lesson.isFree && <Badge variant="accent">Free</Badge>}
                                {isCurrent && <Badge variant="brand">In Progress</Badge>}
                              </div>
                              <p className="text-xs text-[var(--text-muted)]">
                                {lesson.description} · {lesson.estimatedMin} min
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant="muted">{lesson.type}</Badge>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
