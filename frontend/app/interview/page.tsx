"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target, Search, ChevronRight, CheckCircle2, BookOpen,
  MessageSquare, BarChart3, Clock, Star, Filter,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const TOPICS = ["All", "Core Java", "OOP", "Collections", "Exceptions", "Java 8+", "Multithreading", "JVM", "Spring Boot", "SQL", "Testing", "System Design"];
const ROLES = ["All", "Java Developer", "Backend", "SDET", "Spring Boot Dev", "Interview Prep"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const questions = [
  { id: "q1", topic: "OOP", question: "What is the difference between an abstract class and an interface in Java?", difficulty: "Intermediate", role: "Java Developer", keyPoints: ["Abstract classes can have state (fields)", "Interfaces support multiple inheritance", "Default methods added in Java 8", "Abstract class for partial implementation, interface for contract"], frequency: "always_asked" },
  { id: "q2", topic: "Core Java", question: "Explain how the Java memory model works: stack vs heap.", difficulty: "Intermediate", role: "Java Developer", keyPoints: ["Stack stores primitives and references", "Heap stores objects", "GC manages heap", "Stack is thread-safe by default"], frequency: "always_asked" },
  { id: "q3", topic: "Collections", question: "What is the difference between HashMap, LinkedHashMap, and TreeMap?", difficulty: "Intermediate", role: "Java Developer", keyPoints: ["HashMap: O(1) but unordered", "LinkedHashMap: insertion order", "TreeMap: sorted, O(log n)", "Thread safety: none by default"], frequency: "always_asked" },
  { id: "q4", topic: "Java 8+", question: "What are the main features introduced in Java 8?", difficulty: "Beginner", role: "Java Developer", keyPoints: ["Lambda expressions", "Stream API", "Optional", "Default methods", "Method references", "New Date/Time API"], frequency: "always_asked" },
  { id: "q5", topic: "Multithreading", question: "What is a race condition and how do you prevent it?", difficulty: "Advanced", role: "Java Developer", keyPoints: ["Multiple threads accessing shared data", "Synchronized blocks/methods", "ReentrantLock", "Atomic classes", "Volatile keyword"], frequency: "very_common" },
  { id: "q6", topic: "Spring Boot", question: "Explain Spring Boot auto-configuration. How does it work?", difficulty: "Intermediate", role: "Spring Boot Dev", keyPoints: ["@EnableAutoConfiguration", "@Conditional annotations", "spring.factories file", "Starter dependencies", "Property-based configuration"], frequency: "always_asked" },
  { id: "q7", topic: "Exceptions", question: "What is the difference between checked and unchecked exceptions?", difficulty: "Beginner", role: "Java Developer", keyPoints: ["Checked: must handle or declare", "Unchecked: extend RuntimeException", "IOException, SQLException are checked", "NullPointerException is unchecked"], frequency: "very_common" },
  { id: "q8", topic: "JVM", question: "What is garbage collection in Java and what are the GC algorithms?", difficulty: "Advanced", role: "Java Developer", keyPoints: ["Automatic memory management", "Mark-and-sweep", "Generational GC (young/old)", "G1GC, ZGC, Shenandoah", "GC tuning flags"], frequency: "common" },
  { id: "q9", topic: "Testing", question: "Explain the difference between unit tests, integration tests, and end-to-end tests.", difficulty: "Intermediate", role: "SDET", keyPoints: ["Unit: single class/method", "Integration: multiple components", "E2E: full system/UI", "Test pyramid", "JUnit, Spring Test, Selenium"], frequency: "always_asked" },
  { id: "q10", topic: "System Design", question: "How would you design a URL shortener service?", difficulty: "Advanced", role: "Backend", keyPoints: ["Hash function", "Database schema", "Cache layer (Redis)", "API design", "Rate limiting", "Analytics"], frequency: "common" },
];

const freqColors: Record<string, string> = {
  always_asked: "#f97316",
  very_common:  "#f59e0b",
  common:       "#64748b",
};

export default function InterviewPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [level, setLevel] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = questions.filter(q =>
    (topic === "All" || q.topic === topic) &&
    (level === "All" || q.difficulty === level) &&
    (search === "" || q.question.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge variant="brand" className="mb-3">Interview Preparation</Badge>
          <h1 className="text-3xl font-bold mb-3">Java Interview Questions</h1>
          <p className="text-[var(--text-secondary)] mb-6">200+ curated interview questions from Core Java to Spring Boot. Covers technical concepts, coding challenges, and system design.</p>

          {/* Mock Interview CTA */}
          <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
              <Target className="w-6 h-6 text-brand-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text-primary)]">Mock Interview Mode</h3>
              <p className="text-sm text-[var(--text-secondary)]">Simulate a real interview. Answer questions one-by-one, get AI feedback, and track your performance.</p>
            </div>
            <Button variant="brand" size="sm" className="gap-2 flex-shrink-0">
              <MessageSquare className="w-4 h-4" /> Start Mock Interview
            </Button>
          </Card>
        </motion.div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {TOPICS.slice(0, 7).map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  topic === t ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-500/30"
                )}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  level === l ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-500/30"
                )}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {filtered.map((q, i) => {
            const isOpen = expanded === q.id;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
              >
                <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
                  <button
                    onClick={() => setExpanded(isOpen ? null : q.id)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge variant="muted">{q.topic}</Badge>
                        <Badge variant={q.difficulty === "Beginner" ? "beginner" : q.difficulty === "Intermediate" ? "intermediate" : "advanced"}>
                          {q.difficulty}
                        </Badge>
                        {q.frequency !== "common" && (
                          <span className="text-xs font-semibold" style={{ color: freqColors[q.frequency] }}>
                            {q.frequency === "always_asked" ? "🔥 Always Asked" : "⚡ Very Common"}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-[var(--text-primary)]">{q.question}</p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-[var(--text-muted)] flex-shrink-0 transition-transform mt-1", isOpen && "rotate-90")} />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-[var(--border)] p-5"
                    >
                      <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Key Points to Cover</h4>
                      <div className="space-y-2 mb-4">
                        {q.keyPoints.map((point, pi) => (
                          <div key={pi} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                            <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                            {point}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <BookOpen className="w-4 h-4 mr-1" /> Study Topic
                        </Button>
                        <Button variant="brand" size="sm">
                          Practice Answer
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
