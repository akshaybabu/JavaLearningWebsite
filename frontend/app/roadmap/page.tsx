"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, Lock, PlayCircle, ChevronRight, Info,
  Clock, BookOpen, Code2, Award,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { roadmapNodes } from "@/lib/data/roadmap";
import { roadmapGuides } from "@/lib/data/guides";
import type { RoadmapNode } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig = {
  completed:   { ring: "#22c55e", label: "Completed",   icon: CheckCircle2 },
  in_progress: { ring: "#f97316", label: "In Progress", icon: PlayCircle  },
  not_started: { ring: "#475569", label: "Not Started", icon: Circle       },
  locked:      { ring: "#334155", label: "Locked",      icon: Lock        },
};

import { Circle } from "lucide-react";

export default function RoadmapPage() {
  const [selected, setSelected] = useState<RoadmapNode | null>(null);
  const selectedGuide = selected ? roadmapGuides[selected.id] : null;

  // Group nodes by level
  const levels = Array.from(new Set(roadmapNodes.map(n => n.level))).sort();

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="brand" className="mb-4">Java Learning Path</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Java <span className="text-gradient-brand">Roadmap</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            A structured, opinionated path from your first Java program to deploying production microservices. Click any node to learn more.
          </p>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap text-sm">
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: v.ring }} />
                <span className="text-[var(--text-secondary)]">{v.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap tree */}
        <div className="space-y-6">
          {levels.map(level => {
            const levelNodes = roadmapNodes.filter(n => n.level === level);
            return (
              <div key={level}>
                {/* Level label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                    Level {level + 1}
                  </div>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                {/* Nodes */}
                <div className={cn(
                  "flex gap-4 justify-center flex-wrap",
                  levelNodes.length === 1 ? "" : "flex-row"
                )}>
                  {levelNodes.map((node, i) => {
                    const cfg = statusConfig[node.status];
                    const Icon = cfg.icon;
                    const isSelected = selected?.id === node.id;

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 + level * 0.05 } }}
                        className="flex-1 min-w-[220px] max-w-[280px]"
                      >
                        <button
                          onClick={() => setSelected(isSelected ? null : node)}
                          className={cn(
                            "w-full text-left rounded-2xl border p-5 transition-all duration-200 focus:outline-none",
                            "hover:border-brand-500/40 hover:-translate-y-1",
                            node.status === "locked" && "opacity-60",
                            isSelected
                              ? "border-brand-500/60 bg-brand-500/5 shadow-glow-brand"
                              : "border-[var(--border)] bg-[var(--bg-card)]"
                          )}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                              style={{ background: `${node.color}18`, border: `1px solid ${node.color}35` }}
                            >
                              {node.icon}
                            </div>
                            <Icon className="w-4 h-4 mt-1" style={{ color: cfg.ring }} />
                          </div>

                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">{node.title}</h3>
                          {node.subtitle && (
                            <p className="text-xs text-[var(--text-muted)]">{node.subtitle}</p>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: cfg.ring }}
                            />
                            <span className="text-2xs text-[var(--text-muted)]">{cfg.label}</span>
                            <span className="ml-auto">
                              <Badge variant={node.difficulty === "beginner" ? "beginner" : node.difficulty === "intermediate" ? "intermediate" : node.difficulty === "advanced" ? "advanced" : "brand"}>
                                {node.difficulty}
                              </Badge>
                            </span>
                          </div>
                        </button>

                        {/* Expanded detail */}
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 rounded-xl border border-brand-500/20 bg-[var(--bg-card)] p-4 overflow-hidden"
                          >
                            <div className="space-y-3">
                              {node.status !== "locked" ? (
                                <Link href={`/courses/${node.courseId}`}>
                                  <Button variant="brand" size="sm" className="w-full gap-2">
                                    {node.status === "in_progress" ? "Continue" : node.status === "completed" ? "Review" : "Start"}
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                              ) : (
                                <Button variant="muted" size="sm" className="w-full" disabled>
                                  <Lock className="w-4 h-4 mr-2" /> Complete prerequisites first
                                </Button>
                              )}
                              {node.children.length > 0 && (
                                <p className="text-xs text-[var(--text-muted)]">
                                  Unlocks: {node.children.map(id => roadmapNodes.find(n => n.id === id)?.title).join(", ")}
                                </p>
                              )}
                              {selectedGuide && (
                                <>
                                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
                                    <p className="text-2xs uppercase tracking-wider text-[var(--text-muted)] mb-1">What this stage teaches</p>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selectedGuide.summary}</p>
                                  </div>

                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[var(--border)] p-3">
                                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">Why it matters</p>
                                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selectedGuide.whyItMatters}</p>
                                    </div>
                                    <div className="rounded-xl border border-[var(--border)] p-3">
                                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">Real-world example</p>
                                      <p className="text-sm font-medium text-brand-400 mb-1">{selectedGuide.example.title}</p>
                                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selectedGuide.example.scenario}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">Real-time explanation</p>
                                    <div className="space-y-2">
                                      {selectedGuide.realTimeExplanation.map((step, stepIndex) => (
                                        <div key={step.title} className="flex gap-3 rounded-xl border border-[var(--border)] p-3">
                                          <div className="w-6 h-6 rounded-full bg-brand-500/15 text-brand-400 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                                            {stepIndex + 1}
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">{step.title}</p>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.detail}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 p-3">
                                    <p className="text-xs font-semibold text-accent-400 mb-1">Key takeaway from the example</p>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{selectedGuide.example.takeaway}</p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">By the end of this stage</p>
                                    <div className="space-y-1.5">
                                      {selectedGuide.outcomes.map((outcome) => (
                                        <div key={outcome} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                          <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                                          {outcome}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Connector line to next level */}
                {level < levels[levels.length - 1] && (
                  <div className="flex justify-center mt-4">
                    <div className="w-px h-8 bg-gradient-to-b from-[var(--border)] to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]">
          <h2 className="text-xl font-bold mb-2">Not sure where to start?</h2>
          <p className="text-[var(--text-secondary)] mb-4">Take our onboarding quiz and we&apos;ll build a personalized roadmap for you.</p>
          <Link href="/onboarding">
            <Button variant="brand" size="lg">Get Personalized Roadmap</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
