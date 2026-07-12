"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Play, CheckCircle2, Zap, BookOpen, Map,
  Code2, Brain, Target, BarChart3, Rocket, Trophy,
  Star, Users,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

// ── Animation variants ────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

// ── Hero Code Demo ────────────────────────────────────────────

const DEMO_CODE = `public class BankAccount {
    private String holder;
    private double balance;

    public BankAccount(String holder, double balance) {
        this.holder = holder;
        this.balance = balance;
    }

    public void deposit(double amount) {
        balance += amount;
        System.out.printf("✓ Deposited %.2f%n", amount);
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Alice", 5000);
        acc.deposit(2000);
        System.out.println("Balance: " + acc.balance);
    }
}`;

const DEMO_OUTPUT = `✓ Deposited 2000.00
Balance: 7000.0`;

function CodeDemo() {
  const [tab, setTab] = useState<"code" | "output" | "explain">("code");
  const [running, setRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  function handleRun() {
    setRunning(true);
    setTab("output");
    setTimeout(() => {
      setRunning(false);
      setShowOutput(true);
    }, 1200);
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--editor-bg)] shadow-2xl">
      {/* Window bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-4 text-xs text-[var(--text-muted)] font-mono">BankAccount.java</span>
        <div className="ml-auto flex gap-1">
          {(["code", "output", "explain"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium capitalize transition-colors",
                tab === t ? "bg-brand-500/20 text-brand-400" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 min-h-[280px] font-mono text-sm leading-relaxed">
        {tab === "code" && (
          <pre className="text-sm">
            {DEMO_CODE.split("\n").map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-[var(--text-muted)] select-none w-6 text-right text-xs leading-5">{i + 1}</span>
                <span dangerouslySetInnerHTML={{ __html: colorizeJava(line) }} />
              </div>
            ))}
          </pre>
        )}
        {tab === "output" && (
          <div>
            {running ? (
              <div className="flex items-center gap-2 text-brand-400">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-sm">Compiling & running...</span>
              </div>
            ) : showOutput ? (
              <div className="space-y-1">
                <div className="text-xs text-accent-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Program exited successfully (0ms)
                </div>
                {DEMO_OUTPUT.split("\n").map((line, i) => (
                  <div key={i} className="text-accent-300 font-mono">{line}</div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">Click Run to execute</p>
            )}
          </div>
        )}
        {tab === "explain" && (
          <div className="space-y-3 font-sans text-sm">
            <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <p className="font-semibold text-brand-400 mb-1">📌 Class Blueprint</p>
              <p className="text-[var(--text-secondary)]"><code className="text-brand-300">BankAccount</code> is a class — a template that defines what every bank account looks like and how it behaves.</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20">
              <p className="font-semibold text-accent-400 mb-1">🔒 Encapsulation</p>
              <p className="text-[var(--text-secondary)]"><code className="text-accent-300">private</code> fields mean only the class can touch them directly — protecting your data.</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="font-semibold text-blue-400 mb-1">🔧 Constructor</p>
              <p className="text-[var(--text-secondary)]">The constructor runs when you write <code className="text-blue-300">new BankAccount(...)</code> to initialize the object&apos;s state.</p>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="text-accent-400">Java 21</span>
          <span>·</span>
          <span>JVM ready</span>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-400 disabled:opacity-50 transition-colors"
        >
          {running ? <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          {running ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}

function colorizeJava(line: string): string {
  return line
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\b(public|private|static|void|class|new|this|double|String|return|if|else)\b/g, '<span style="color:#f97316">$1</span>')
    .replace(/"([^"]*)"/g, '<span style="color:#22c55e">"$1"</span>')
    .replace(/\/\/.*/g, '<span style="color:#64748b;font-style:italic">$&</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#a78bfa">$1</span>')
    .replace(/[^<>\s"a-zA-Z0-9_](?=[^<])/g, m => `<span style="color:#94a3b8">${m}</span>`)
    || `<span style="color:#94a3b8">${line}</span>`;
}

// ── Features ──────────────────────────────────────────────────

const features = [
  { icon: Map, title: "Structured Java Roadmap", desc: "A clear, opinionated path from first println to production microservices.", color: "#f97316" },
  { icon: Code2, title: "Interactive Coding Exercises", desc: "Write and run real Java code in the browser with instant feedback.", color: "#3b82f6" },
  { icon: Brain, title: "AI Learning Assistant", desc: "Get hints, explanations, and code reviews from an AI tutor.", color: "#8b5cf6" },
  { icon: Target, title: "Real-World Examples", desc: "Every concept taught through BankAccounts, Orders, and Employee systems.", color: "#10b981" },
  { icon: Trophy, title: "Achievements & Streaks", desc: "Stay motivated with XP, badges, streaks, and weekly goals.", color: "#f59e0b" },
  { icon: BarChart3, title: "Progress Tracking", desc: "Track mastery across every topic with spaced-repetition recommendations.", color: "#ec4899" },
  { icon: Rocket, title: "Guided Projects", desc: "Build 12 production-quality Java projects with milestone-based guidance.", color: "#06b6d4" },
  { icon: BookOpen, title: "Interview Preparation", desc: "200+ interview questions with mock interview mode and performance tracking.", color: "#84cc16" },
];

// ── Learning Roadmap Preview ──────────────────────────────────

const roadmapPreview = [
  { icon: "🏗️", title: "Foundations",     color: "#22c55e", done: true },
  { icon: "🧩", title: "OOP",              color: "#f97316", active: true },
  { icon: "⚡", title: "Intermediate",     color: "#3b82f6" },
  { icon: "📦", title: "Collections",      color: "#8b5cf6" },
  { icon: "🚀", title: "Advanced Java",    color: "#ec4899" },
  { icon: "🌳", title: "DSA",              color: "#06b6d4" },
  { icon: "🗄️", title: "Database",         color: "#f59e0b" },
  { icon: "🧪", title: "Testing",          color: "#10b981" },
  { icon: "🌱", title: "Spring Boot",      color: "#84cc16" },
  { icon: "☁️", title: "Microservices",    color: "#6366f1" },
];

// ── Projects ──────────────────────────────────────────────────

const projects = [
  { icon: "🏦", title: "Banking Management System",   level: "Beginner",      tech: ["Java OOP", "Collections", "CLI"] },
  { icon: "👥", title: "Employee Management System",  level: "Intermediate",   tech: ["JDBC", "PostgreSQL", "DAO"] },
  { icon: "📚", title: "Library Management System",   level: "Intermediate",   tech: ["OOP", "File I/O", "Search"] },
  { icon: "🛒", title: "E-Commerce REST API",         level: "Advanced",       tech: ["Spring Boot", "JPA", "JWT"] },
  { icon: "💰", title: "Expense Tracker API",         level: "Advanced",       tech: ["Spring Boot", "PostgreSQL", "Swagger"] },
  { icon: "🎫", title: "Ticket Booking System",       level: "Advanced",       tech: ["Multithreading", "Concurrency"] },
  { icon: "🤖", title: "Selenium Test Framework",     level: "Intermediate",   tech: ["Selenium", "TestNG", "POM"] },
  { icon: "🔧", title: "Microservices Platform",      level: "Professional",   tech: ["Spring Cloud", "Kafka", "Docker"] },
];

// ── Stats ──────────────────────────────────────────────────────

const stats = [
  { label: "Courses", value: "15+", note: "structured learning paths" },
  { label: "Lessons",  value: "400+", note: "interactive lessons" },
  { label: "Exercises",value: "600+", note: "coding challenges" },
  { label: "Projects", value: "12",  note: "real-world projects" },
];

// ── Testimonials ──────────────────────────────────────────────

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Junior Java Developer",
    text: "The real-world examples made OOP finally click for me. The BankAccount and Employee examples are brilliant — I can see exactly how code maps to business problems.",
    avatar: "PS",
    color: "#f97316",
  },
  {
    name: "Marcus Chen",
    role: "SDET at a Fintech Company",
    text: "The testing path is comprehensive. The Selenium + REST Assured combination with real project guidance helped me land my automation role.",
    avatar: "MC",
    color: "#3b82f6",
  },
  {
    name: "Rahul Verma",
    role: "Backend Developer",
    text: "I went from knowing basic Java to building full Spring Boot REST APIs. The progression from OOP → Collections → Spring is perfectly structured.",
    avatar: "RV",
    color: "#10b981",
  },
];

// ── Main Landing Page ─────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-16 pb-24">
        {/* Background */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-radial from-brand-500/8 via-transparent to-transparent" style={{ backgroundSize: "100% 100%", backgroundPosition: "50% 30%" }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left"
          >
            {/* Pill badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-sm font-medium">
                <Zap className="w-4 h-4" />
                Structured · Interactive · Job-Ready
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Master Java
              <span className="block text-gradient-brand">from Zero to</span>
              Professional
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xl lg:mx-0 mx-auto">
              Learn Java through interactive lessons, real-world examples, coding exercises, debugging challenges, guided projects, and industry-standard backend development.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/register">
                <Button variant="brand" size="lg" className="gap-2">
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/roadmap">
                <Button variant="ghost" size="lg" className="gap-2">
                  <Map className="w-4 h-4" />
                  Explore Roadmap
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-400" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-400" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-400" /> 15+ courses</span>
            </motion.div>
          </motion.div>

          {/* Right — Code Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } }}
          >
            <CodeDemo />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gradient-brand">{s.value}</div>
              <div className="text-sm font-semibold text-[var(--text-primary)] mt-1">{s.label}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.note}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-[var(--text-muted)] mt-6">* Sample figures for demonstration. Actual numbers grow as the platform expands.</p>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="brand" className="mb-4">Platform Features</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to master Java
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              A comprehensive learning environment built specifically for developers, not students.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card hoverable className="h-full flex flex-col gap-4 p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{f.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ROADMAP PREVIEW ── */}
      <section className="py-24 px-4 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="brand" className="mb-4">Learning Roadmap</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Your path to Java mastery</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              A structured, opinionated roadmap that takes you from writing your first program to deploying production microservices.
            </p>
          </motion.div>

          {/* Roadmap nodes */}
          <div className="flex flex-wrap justify-center gap-3">
            {roadmapPreview.map((node, i) => (
              <motion.div
                key={node.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href="/roadmap">
                  <div className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-1 cursor-pointer",
                    node.done
                      ? "border-accent-500/40 bg-accent-500/10"
                      : node.active
                        ? "border-brand-500/50 bg-brand-500/10"
                        : "border-[var(--border)] bg-[var(--bg-card)] hover:border-brand-500/30"
                  )}>
                    <span className="text-xl">{node.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{node.title}</div>
                    </div>
                    {node.done && <CheckCircle2 className="w-4 h-4 text-accent-400 ml-1" />}
                    {node.active && <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse ml-1" />}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/roadmap">
              <Button variant="brand" size="lg">
                View Full Roadmap <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="accent" className="mb-4">Real-World Projects</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Build projects that matter</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Not toy examples — real-world, portfolio-worthy applications with business requirements, architecture, and guided milestones.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Card hoverable className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{p.icon}</span>
                    <Badge variant={
                      p.level === "Beginner" ? "beginner" :
                      p.level === "Intermediate" ? "intermediate" :
                      p.level === "Advanced" ? "advanced" : "brand"
                    }>
                      {p.level}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] leading-snug">{p.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {p.tech.map(t => (
                      <span key={t} className="text-2xs px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]">{t}</span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="muted" className="mb-4">Learner Stories</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">From learners to professionals</h2>
            <p className="text-xs text-[var(--text-muted)]">(Sample testimonials — illustrative content for demonstration)</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="p-6 flex flex-col gap-4">
                  <div className="flex gap-1">
                    {Array(5).fill(null).map((_, j) => <Star key={j} className="w-4 h-4 fill-brand-500 text-brand-500" />)}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: t.color }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{t.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-500/10 via-transparent to-transparent" style={{ backgroundSize: "80% 100%", backgroundPosition: "center" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 leading-[1.1]">
              Ready to become a
              <span className="block text-gradient-brand">Java professional?</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Join thousands of developers learning Java the right way — through structured paths, real-world projects, and hands-on practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="brand" size="xl" className="gap-2">
                  Create Free Account <Rocket className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="ghost" size="xl">
                  Browse Courses
                </Button>
              </Link>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-6">No credit card required · Start in 60 seconds · Free tier always available</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white text-xs font-black">JF</span>
            </div>
            <span className="font-bold text-[var(--text-primary)]">JavaForge</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <Link href="/courses" className="hover:text-[var(--text-primary)] transition-colors">Courses</Link>
            <Link href="/roadmap" className="hover:text-[var(--text-primary)] transition-colors">Roadmap</Link>
            <Link href="/practice" className="hover:text-[var(--text-primary)] transition-colors">Practice</Link>
            <Link href="/interview" className="hover:text-[var(--text-primary)] transition-colors">Interview</Link>
          </div>
          <p className="text-xs text-[var(--text-muted)]">© 2026 JavaForge. Built for Java learners.</p>
        </div>
      </footer>
    </div>
  );
}
