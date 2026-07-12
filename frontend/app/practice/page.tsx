"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Code2, CheckCircle2, Clock, BarChart3, Filter,
  ChevronRight, Terminal, Bug, Eye, Shuffle, Star,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const TOPICS = ["All", "OOP", "Collections", "Streams", "Exceptions", "Strings", "Arrays", "Sorting", "DSA", "Spring"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const TYPES = ["All", "Coding", "Debugging", "Output Prediction", "Multiple Choice", "Refactoring"];

const problems = [
  { id: "p1", title: "Reverse a String", topic: "Strings", difficulty: "Easy", type: "Coding", completed: true, frequency: "always_asked" },
  { id: "p2", title: "Find Duplicates in Array", topic: "Arrays", difficulty: "Easy", type: "Coding", completed: true, frequency: "very_common" },
  { id: "p3", title: "Predict: HashMap Iteration Order", topic: "Collections", difficulty: "Medium", type: "Output Prediction", completed: false, frequency: "common" },
  { id: "p4", title: "Fix the NullPointerException", topic: "Exceptions", difficulty: "Easy", type: "Debugging", completed: false, frequency: "very_common" },
  { id: "p5", title: "Implement a Stack using Deque", topic: "DSA", difficulty: "Medium", type: "Coding", completed: false, frequency: "common" },
  { id: "p6", title: "Stream: Filter and Collect", topic: "Streams", difficulty: "Medium", type: "Coding", completed: false, frequency: "always_asked" },
  { id: "p7", title: "Singleton Pattern Implementation", topic: "OOP", difficulty: "Medium", type: "Coding", completed: false, frequency: "very_common" },
  { id: "p8", title: "Binary Search Implementation", topic: "Sorting", difficulty: "Easy", type: "Coding", completed: false, frequency: "always_asked" },
  { id: "p9", title: "Refactor: Replace Magic Numbers", topic: "OOP", difficulty: "Easy", type: "Refactoring", completed: false, frequency: "common" },
  { id: "p10", title: "Custom Exception Hierarchy", topic: "Exceptions", difficulty: "Medium", type: "Coding", completed: false, frequency: "common" },
  { id: "p11", title: "Fibonacci - Iterative vs Recursive", topic: "DSA", difficulty: "Easy", type: "Coding", completed: true, frequency: "always_asked" },
  { id: "p12", title: "Comparable vs Comparator", topic: "Collections", difficulty: "Medium", type: "Multiple Choice", completed: false, frequency: "very_common" },
];

const freqBadge = {
  always_asked: { label: "🔥 Always Asked", color: "#f97316" },
  very_common:  { label: "⚡ Very Common",  color: "#f59e0b" },
  common:       { label: "Common",         color: "#64748b" },
  rare:         { label: "Rare",           color: "#475569" },
};

const typeIcons: Record<string, React.ElementType> = {
  Coding: Code2,
  Debugging: Bug,
  "Output Prediction": Eye,
  "Multiple Choice": BarChart3,
  Refactoring: Shuffle,
};

export default function PracticePage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [type, setType] = useState("All");

  const filtered = problems.filter(p =>
    (topic === "All" || p.topic === topic) &&
    (difficulty === "All" || p.difficulty === difficulty) &&
    (type === "All" || p.type === type) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const solved = problems.filter(p => p.completed).length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge variant="brand" className="mb-3">Practice Arena</Badge>
          <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
          <p className="text-[var(--text-secondary)] mb-4">200+ Java problems across all topics and difficulty levels. Sharpen your skills for interviews and real projects.</p>

          {/* Stats row */}
          <div className="flex gap-6 text-sm">
            <span className="text-accent-400 font-semibold">{solved} solved</span>
            <span className="text-[var(--text-muted)]">{problems.length - solved} remaining</span>
            <span className="text-[var(--text-muted)]">{Math.round(solved/problems.length*100)}% completion</span>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                    topic === t ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-500/30"
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1.5">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    difficulty === d ? "bg-brand-500/15 text-brand-400 border border-brand-500/30" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-500/30"
                  )}>
                  {d}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                    type === t ? "bg-accent-500/15 text-accent-400 border border-accent-500/30" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-brand-500/30"
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          {filtered.map((p, i) => {
            const Icon = typeIcons[p.type] ?? Code2;
            const freq = freqBadge[p.frequency as keyof typeof freqBadge];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              >
                <Link href={`/practice/${p.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-brand-500/30 hover:bg-[var(--bg-elevated)] transition-all group cursor-pointer">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      p.completed ? "bg-green-500/15 border border-green-500/25" : "bg-[var(--bg-elevated)] border border-[var(--border)]"
                    )}>
                      {p.completed
                        ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                        : <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[var(--text-primary)] text-sm">{p.title}</span>
                        <span className="text-xs text-[var(--text-muted)]">·</span>
                        <span className="text-xs text-[var(--text-muted)]">{p.topic}</span>
                        {freq && (
                          <span className="text-xs font-semibold" style={{ color: freq.color }}>{freq.label}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={p.type === "Debugging" ? "warning" : p.type === "Output Prediction" ? "brand" : "muted"} className="hidden sm:flex">
                        {p.type}
                      </Badge>
                      <Badge variant={p.difficulty === "Easy" ? "beginner" : p.difficulty === "Medium" ? "intermediate" : "advanced"}>
                        {p.difficulty}
                      </Badge>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-brand-400 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold mb-2">No problems found</h3>
            <p className="text-[var(--text-secondary)]">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
