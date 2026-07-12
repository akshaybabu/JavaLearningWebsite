"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { Button, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "level",    title: "What's your experience level?",         subtitle: "This helps us personalize your learning path." },
  { id: "goal",     title: "What's your main learning goal?",       subtitle: "We'll tailor the curriculum and projects for you." },
  { id: "role",     title: "Which role are you targeting?",         subtitle: "We'll emphasize the most relevant skills for your goal." },
  { id: "time",     title: "How much time can you dedicate weekly?", subtitle: "We'll set realistic milestones for your schedule." },
  { id: "known",    title: "Topics you already know",               subtitle: "We'll skip basics and focus on what you need." },
];

const OPTIONS: Record<string, { id: string; label: string; sub?: string; icon: string }[]> = {
  level: [
    { id: "absolute_beginner", label: "Complete Beginner", sub: "Never written code before", icon: "🌱" },
    { id: "some_programming",  label: "Some Programming",  sub: "Know basics of another language", icon: "📖" },
    { id: "junior_developer",  label: "Junior Java Dev",   sub: "Know Java basics, want to level up", icon: "⚡" },
    { id: "mid_developer",     label: "Mid-Level Dev",     sub: "Solid Java knowledge, want advanced", icon: "🚀" },
    { id: "senior_developer",  label: "Senior Developer",  sub: "Refreshing or upskilling", icon: "🎯" },
  ],
  goal: [
    { id: "job_ready",       label: "Get a Java Job",          sub: "Become job-ready as a developer", icon: "💼" },
    { id: "spring_boot",     label: "Build REST APIs",         sub: "Spring Boot & backend development", icon: "🌱" },
    { id: "automation",      label: "Test Automation",         sub: "Selenium, REST Assured, JUnit", icon: "🤖" },
    { id: "interview_prep",  label: "Crack Interviews",        sub: "DSA, system design, core Java", icon: "🎯" },
    { id: "upskill",         label: "Level Up Skills",         sub: "Fill knowledge gaps, go deeper", icon: "📈" },
  ],
  role: [
    { id: "java_developer",      label: "Java Developer",         icon: "☕" },
    { id: "backend_developer",   label: "Backend Developer",      icon: "⚙️" },
    { id: "automation_engineer", label: "Automation Engineer",    icon: "🤖" },
    { id: "sdet",                label: "SDET",                   icon: "🧪" },
    { id: "spring_boot_dev",     label: "Spring Boot Developer",  icon: "🌱" },
    { id: "interview_prep",      label: "Interview Prep",         icon: "🎯" },
  ],
  time: [
    { id: "30min",  label: "30 min / day",    sub: "Casual, 3–4h/week",  icon: "⏰" },
    { id: "1hour",  label: "1 hour / day",    sub: "Steady, 7h/week",    icon: "⏱️" },
    { id: "2hours", label: "2 hours / day",   sub: "Serious, 14h/week",  icon: "🔥" },
    { id: "more",   label: "As much as I can", sub: "Full-time learner", icon: "💪" },
  ],
  known: [
    { id: "variables",    label: "Variables & Types",  icon: "📝" },
    { id: "oop",          label: "OOP Basics",          icon: "🧩" },
    { id: "collections",  label: "Collections",         icon: "📦" },
    { id: "exceptions",   label: "Exception Handling",  icon: "⚠️" },
    { id: "streams",      label: "Streams & Lambdas",   icon: "🌊" },
    { id: "spring",       label: "Spring Boot",         icon: "🌱" },
  ],
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentStep = STEPS[step];
  const isMultiSelect = currentStep.id === "known";

  const handleSelect = (optId: string) => {
    if (isMultiSelect) {
      const current = (answers[currentStep.id] as string[]) || [];
      setAnswers(a => ({
        ...a,
        [currentStep.id]: current.includes(optId)
          ? current.filter(id => id !== optId)
          : [...current, optId],
      }));
    } else {
      setAnswers(a => ({ ...a, [currentStep.id]: optId }));
    }
  };

  const isSelected = (optId: string) => {
    const ans = answers[currentStep.id];
    if (isMultiSelect) return Array.isArray(ans) && ans.includes(optId);
    return ans === optId;
  };

  const canProceed = isMultiSelect
    ? true // known topics is optional
    : !!answers[currentStep.id];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Submit → redirect to personalized roadmap
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-2.5 justify-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand">
              <span className="text-white font-black">JF</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">JavaForge</span>
          </div>
          <ProgressBar value={((step + 1) / STEPS.length) * 100} height={4} className="mb-3" />
          <p className="text-xs text-[var(--text-muted)]">Step {step + 1} of {STEPS.length}</p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 shadow-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{currentStep.title}</h2>
              <p className="text-[var(--text-secondary)] mb-6">{currentStep.subtitle}</p>
              {isMultiSelect && <p className="text-xs text-[var(--text-muted)] mb-4">Select all that apply (optional)</p>}

              <div className={cn(
                "grid gap-3",
                OPTIONS[currentStep.id].length > 4 ? "grid-cols-2" : "grid-cols-1"
              )}>
                {OPTIONS[currentStep.id].map((opt) => {
                  const selected = isSelected(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                        selected
                          ? "border-brand-500/50 bg-brand-500/10"
                          : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-brand-500/30"
                      )}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--text-primary)] text-sm">{opt.label}</div>
                        {opt.sub && <div className="text-xs text-[var(--text-muted)] mt-0.5">{opt.sub}</div>}
                      </div>
                      {selected && <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              variant="brand"
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-1.5"
            >
              {step < STEPS.length - 1 ? (
                <>Continue <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Build My Roadmap <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          You can change these preferences anytime in your profile settings.
        </p>
      </motion.div>
    </div>
  );
}
