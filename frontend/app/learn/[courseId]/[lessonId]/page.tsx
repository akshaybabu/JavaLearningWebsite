"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  BookOpen, Clock, ChevronLeft, ChevronRight, CheckCircle2,
  Bookmark, Play, RotateCcw, Maximize2, Minimize2, Info,
  Lightbulb, X, AlertCircle, Terminal, Award, HelpCircle,
  ThumbsUp, ArrowRight, ChevronDown, ChevronUp, Zap, Target, Code2,
} from "lucide-react";
import { Button, Badge, ProgressBar, Card } from "@/components/ui";
import { getStoredAuthToken } from "@/lib/auth/client";
import { classesAndObjectsLesson } from "@/lib/data/curriculum";
import { DashboardApiError, recordLearningActivity } from "@/lib/dashboard/client";
import { cn } from "@/lib/utils";

// Dynamic import for Monaco
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Tab = "lesson" | "exercise" | "quiz" | "summary";
type ExecStatus = "idle" | "running" | "passed" | "failed" | "error";

// ── Syntax-Colored Lesson Content ─────────────────────────────

function JavaCodeBlock({ code, fileName, output, runnable }: {
  code: string; fileName?: string; output?: string; runnable?: boolean;
}) {
  const [showing, setShowing] = useState<"code" | "output">("code");
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--editor-border)] my-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        {fileName && <span className="text-xs text-[var(--text-muted)] font-mono ml-2">{fileName}</span>}
        <div className="ml-auto flex gap-1">
          <button onClick={() => setShowing("code")} className={cn("text-xs px-2.5 py-1 rounded", showing === "code" ? "bg-brand-500/20 text-brand-400" : "text-[var(--text-muted)]")}>Code</button>
          {output && <button onClick={() => setShowing("output")} className={cn("text-xs px-2.5 py-1 rounded", showing === "output" ? "bg-accent-500/20 text-accent-400" : "text-[var(--text-muted)]")}>Output</button>}
        </div>
      </div>
      {/* Body */}
      <div className="p-4 bg-[var(--editor-bg)] overflow-x-auto">
        {showing === "code" ? (
          <pre className="text-sm font-mono leading-relaxed">
            {code.split("\n").map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-[var(--text-muted)] select-none w-6 text-right text-xs leading-6">{i + 1}</span>
                <span
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: colorize(line) }}
                />
              </div>
            ))}
          </pre>
        ) : (
          <pre className="text-sm font-mono text-accent-300">{output}</pre>
        )}
      </div>
    </div>
  );
}

function colorize(line: string): string {
  let result = line
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  result = result
    .replace(/\/\/.*/g, (m) => `<span style="color:#64748b;font-style:italic">${m}</span>`)
    .replace(/\b(public|private|protected|static|void|class|new|this|super|return|if|else|for|while|throws|throw|try|catch|finally|import|package|extends|implements|interface|abstract|final|double|int|long|boolean|String|char|float|byte|short)\b(?![^<]*<\/span>)/g, '<span style="color:#f97316;font-weight:500">$1</span>')
    .replace(/"([^"]*)"/g, (m) => `<span style="color:#22c55e">${m}</span>`)
    .replace(/\b(\d+\.?\d*)\b(?![^<]*<\/span>)/g, '<span style="color:#a78bfa">$1</span>')
    .replace(/\b([A-Z][A-Za-z0-9]*)\b(?![^<]*<\/span>)/g, '<span style="color:#34d399">$1</span>');
  return result || `<span style="color:#94a3b8">&nbsp;</span>`;
}

// ── Lesson Content Renderer ───────────────────────────────────

function LessonContent() {
  const lesson = classesAndObjectsLesson;
  const content = lesson.content!;

  return (
    <div className="prose-custom max-w-none space-y-6">
      {content.sections.map((section) => (
        <div key={section.id}>
          {section.title && (
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              {section.title}
            </h3>
          )}
          {section.type === "explanation" && (
            <div className="text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: mdToHtml(section.body) }} />
          )}
          {section.type === "code" && section.code && (
            <div>
              {section.body && <p className="text-[var(--text-secondary)] mb-3 leading-relaxed">{section.body}</p>}
              <JavaCodeBlock
                code={section.code.code}
                fileName={section.code.fileName}
                output={section.code.output}
                runnable={section.code.runnable}
              />
            </div>
          )}
          {section.type === "callout" && (
            <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400 mb-2">{section.title}</p>
                <div
                  className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-1"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(section.body) }}
                />
              </div>
            </div>
          )}
          {section.type === "realworld" && (
            <div className="p-4 rounded-xl bg-accent-500/8 border border-accent-500/20 flex gap-3">
              <Zap className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-accent-400 mb-2">{section.title}</p>
                <div
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(section.body) }}
                />
              </div>
            </div>
          )}
          {section.type === "visual" && (
            <StackHeapVisual />
          )}
        </div>
      ))}

      {/* Summary */}
      <div className="p-5 rounded-xl bg-brand-500/8 border border-brand-500/20">
        <h3 className="font-semibold text-brand-400 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Lesson Summary
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content.summary}</p>
      </div>
    </div>
  );
}

function mdToHtml(md: string): string {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, `<code style="background:rgba(249,115,22,0.1);color:#f97316;padding:1px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.875em">$1</code>`)
    .replace(/\n\*/g, "\n• ")
    .replace(/\n-/g, "\n• ")
    .replace(/\n/g, "<br/>");
}

// ── Stack/Heap Visual ─────────────────────────────────────────

function StackHeapVisual() {
  return (
    <div className="rounded-xl bg-[var(--editor-bg)] border border-[var(--editor-border)] p-5 my-4">
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-4 text-center">Java Memory Model: Stack vs Heap</p>
      <div className="flex gap-6 justify-center">
        {/* Stack */}
        <div className="flex-1 max-w-[180px]">
          <div className="text-center text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-wider">📚 Stack</div>
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            {[
              { label: "main() frame", items: ["alice → @0x4A1", "bob → @0x7B2"] },
            ].map(frame => (
              <div key={frame.label} className="border-b border-[var(--border)] last:border-0 p-3">
                <div className="text-2xs text-brand-400 font-semibold mb-2">{frame.label}</div>
                {frame.items.map(item => (
                  <div key={item} className="text-2xs font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] rounded px-2 py-1 mb-1">{item}</div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-2xs text-[var(--text-muted)] text-center mt-2">References live here</p>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <div className="text-[var(--text-muted)] text-lg">→</div>
        </div>

        {/* Heap */}
        <div className="flex-1 max-w-[200px]">
          <div className="text-center text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-wider">🏗️ Heap</div>
          <div className="space-y-2">
            {[
              { addr: "@0x4A1", type: "BankAccount", fields: ["holder: Alice", "balance: 7000.0"] },
              { addr: "@0x7B2", type: "BankAccount", fields: ["holder: Bob", "balance: 500.0"] },
            ].map(obj => (
              <div key={obj.addr} className="border border-accent-500/30 rounded-lg p-3 bg-accent-500/5">
                <div className="text-2xs text-accent-400 font-semibold mb-1">{obj.addr} · {obj.type}</div>
                {obj.fields.map(f => (
                  <div key={f} className="text-2xs font-mono text-[var(--text-secondary)]">{f}</div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-2xs text-[var(--text-muted)] text-center mt-2">Objects live here</p>
        </div>
      </div>
    </div>
  );
}

// ── Code Exercise Panel ───────────────────────────────────────

function ExercisePanel() {
  const exercise = classesAndObjectsLesson.content!.exercises[0];
  const [code, setCode] = useState(exercise.starterCode);
  const [execStatus, setExecStatus] = useState<ExecStatus>("idle");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<Array<{ id: string; passed: boolean; desc: string }>>([]);
  const [showHints, setShowHints] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const handleRun = useCallback(async () => {
    setExecStatus("running");
    setOutput("");
    setTestResults([]);

    // Simulated execution (replace with Judge0 API in production)
    await new Promise(r => setTimeout(r, 1500));

    const hasBankAccount = code.includes("class BankAccount") && code.includes("private");
    const hasDeposit = code.includes("deposit") && code.includes("balance +=");
    const hasWithdraw = code.includes("withdraw") && code.includes("balance -=");
    const hasGetBalance = code.includes("getBalance") && code.includes("return balance");

    const results = [
      { id: "tc1", passed: hasBankAccount, desc: "BankAccount class with private fields" },
      { id: "tc2", passed: hasDeposit,     desc: "deposit() method works correctly" },
      { id: "tc3", passed: hasWithdraw,    desc: "withdraw() reduces balance" },
      { id: "tc4", passed: hasGetBalance,  desc: "getBalance() returns balance" },
    ];

    setTestResults(results);
    const allPassed = results.every(r => r.passed);

    if (allPassed) {
      setOutput("Account Holder: Alice\nCurrent Balance: 6500.0\nBalance: 6500.0");
      setExecStatus("passed");
    } else {
      setOutput("Some tests failed. Check your implementation.");
      setExecStatus("failed");
    }
  }, [code]);

  const handleSubmit = useCallback(() => {
    handleRun();
  }, [handleRun]);

  const handleReset = () => {
    setCode(exercise.starterCode);
    setExecStatus("idle");
    setOutput("");
    setTestResults([]);
  };

  return (
    <div className={cn(
      "flex flex-col lg:flex-row gap-0 h-full",
      fullscreen && "fixed inset-0 z-50 bg-[var(--bg-base)] p-4 overflow-hidden"
    )}>

      {/* Left: Problem */}
      <div className="lg:w-[38%] flex flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">{exercise.title}</h3>
            <Badge variant="beginner" className="mt-1">Beginner</Badge>
          </div>
          <button onClick={() => setFullscreen(!fullscreen)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Instructions */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Instructions</p>
            <div
              className="text-sm text-[var(--text-secondary)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: mdToHtml(exercise.instructions) }}
            />
          </div>

          {/* Test Cases */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Visible Test Cases</p>
            <div className="space-y-2">
              {exercise.testCases.filter(t => !t.isHidden).map((tc, i) => {
                const result = testResults.find(r => r.id === tc.id);
                return (
                  <div key={tc.id} className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-lg border text-xs",
                    result
                      ? result.passed
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-red-500/30 bg-red-500/5"
                      : "border-[var(--border)] bg-[var(--bg-card)]"
                  )}>
                    {result
                      ? result.passed
                        ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        : <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      : <div className="w-4 h-4 rounded-full border border-[var(--border)] flex-shrink-0" />
                    }
                    <span className={cn(
                      result ? result.passed ? "text-green-300" : "text-red-300" : "text-[var(--text-secondary)]"
                    )}>
                      {tc.description}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border)] text-xs text-[var(--text-muted)]">
                <div className="w-4 h-4 rounded-full bg-[var(--bg-elevated)] flex-shrink-0 flex items-center justify-center">
                  <span className="text-2xs">?</span>
                </div>
                2 hidden test cases
              </div>
            </div>
          </div>

          {/* Hints */}
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-brand-400 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              {showHints ? "Hide" : "Show"} Hints ({exercise.hints.length} available)
              {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showHints && (
              <div className="mt-3 space-y-2">
                {exercise.hints.slice(0, hintLevel + 1).map((hint, i) => (
                  <div key={i} className="p-3 rounded-lg bg-brand-500/8 border border-brand-500/20 text-xs text-[var(--text-secondary)]">
                    <span className="text-brand-400 font-semibold">Hint {i + 1}: </span>{hint}
                  </div>
                ))}
                {hintLevel < exercise.hints.length - 1 && (
                  <button
                    onClick={() => setHintLevel(h => h + 1)}
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Reveal next hint →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Editor + Output */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-card)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-mono">BankAccount.java</span>
            <span className="text-xs text-brand-400">Java 21</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={handleRun} disabled={execStatus === "running"} className="flex items-center gap-1.5 text-xs text-white bg-accent-600 hover:bg-accent-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              {execStatus === "running" ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Run
            </button>
            <button onClick={handleSubmit} disabled={execStatus === "running"} className="flex items-center gap-1.5 text-xs text-white bg-brand-600 hover:bg-brand-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-0" style={{ minHeight: "300px" }}>
          <MonacoEditor
            height="100%"
            language="java"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              renderLineHighlight: "line",
              lineDecorationsWidth: 4,
            }}
          />
        </div>

        {/* Output Console */}
        <div className="border-t border-[var(--border)] bg-[var(--editor-bg)]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)]">
            <Terminal className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-xs text-[var(--text-muted)] font-semibold">Output Console</span>
            {execStatus !== "idle" && (
              <span className={cn(
                "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
                execStatus === "running" ? "text-amber-400 bg-amber-500/10" :
                execStatus === "passed"  ? "text-green-400 bg-green-500/10" :
                execStatus === "failed"  ? "text-red-400 bg-red-500/10" :
                "text-[var(--text-muted)]"
              )}>
                {execStatus === "running" ? "⟳ Running..." :
                 execStatus === "passed"  ? "✓ All Tests Passed" :
                 execStatus === "failed"  ? "✗ Tests Failed" : ""}
              </span>
            )}
          </div>
          <div className="p-4 min-h-[100px] max-h-[180px] overflow-y-auto">
            {execStatus === "idle" && (
              <p className="text-xs text-[var(--text-muted)]">Click Run or Submit to execute your code</p>
            )}
            {execStatus === "running" && (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Compiling and running...
              </div>
            )}
            {(execStatus === "passed" || execStatus === "failed") && (
              <div>
                {/* Test results */}
                {testResults.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {testResults.map(r => (
                      <div key={r.id} className={cn("flex items-center gap-2 text-xs", r.passed ? "text-green-400" : "text-red-400")}>
                        {r.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        {r.desc}
                      </div>
                    ))}
                  </div>
                )}
                {output && (
                  <pre className={cn("text-xs font-mono whitespace-pre-wrap", execStatus === "passed" ? "text-green-300" : "text-red-300")}>
                    {output}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quiz Panel ────────────────────────────────────────────────

function QuizPanel() {
  const quiz = classesAndObjectsLesson.content!.quiz!;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;
  const selected = answers[question.id];
  const isAnswered = !!selected;
  const isSubmitted = submitted && !!answers[question.id];

  const handleSelect = (optId: string) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [question.id]: optId }));
  };

  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ(c => c + 1);
      setSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = () => setSubmitted(true);

  const score = quiz.questions.filter(q => {
    const correct = q.options.find(o => o.isCorrect);
    return answers[q.id] === correct?.id;
  }).length;

  if (showResults) {
    return (
      <div className="p-8 text-center space-y-6 max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto">
          <Award className="w-10 h-10 text-brand-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Quiz Complete!</h3>
          <p className="text-[var(--text-secondary)]">You scored</p>
          <div className="text-5xl font-extrabold text-gradient-brand mt-2">{score}/{total}</div>
          <p className="text-[var(--text-muted)] text-sm mt-1">{Math.round(score/total*100)}% accuracy</p>
        </div>
        {score === total ? (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            🎉 Perfect score! You&apos;re ready to move to the next lesson.
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
            Review the explanations above and try the exercise to solidify your understanding.
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => { setCurrentQ(0); setAnswers({}); setSubmitted(false); setShowResults(false); }}>
            Retake Quiz
          </Button>
          <Link href="/learn/java-oop/oop-102">
            <Button variant="brand" className="gap-2">Next Lesson <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-muted)]">Question {currentQ + 1} of {total}</span>
        <ProgressBar value={((currentQ + 1) / total) * 100} className="flex-1" height={4} />
      </div>

      {/* Question */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={question.difficulty === "beginner" ? "beginner" : "intermediate"}>{question.difficulty}</Badge>
          <span className="text-xs text-[var(--text-muted)]">{question.type === "code_output" ? "Predict the Output" : "Multiple Choice"}</span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-3">{question.question}</h3>
        {question.code && (
          <JavaCodeBlock code={question.code} />
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.isCorrect;
          const showFeedback = isSubmitted;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm",
                showFeedback && isCorrect
                  ? "border-green-500/50 bg-green-500/10 text-green-300"
                  : showFeedback && isSelected && !isCorrect
                  ? "border-red-500/50 bg-red-500/10 text-red-300"
                  : isSelected
                  ? "border-brand-500/50 bg-brand-500/10 text-[var(--text-primary)]"
                  : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-brand-500/30 hover:text-[var(--text-primary)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0",
                  showFeedback && isCorrect ? "border-green-500 bg-green-500/20 text-green-400" :
                  showFeedback && isSelected && !isCorrect ? "border-red-500 bg-red-500/20 text-red-400" :
                  isSelected ? "border-brand-500 bg-brand-500/20 text-brand-400" :
                  "border-[var(--border)]"
                )}>
                  {["A","B","C","D"][question.options.indexOf(opt)]}
                </div>
                <span>{opt.text}</span>
                {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />}
                {showFeedback && isSelected && !isCorrect && <X className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-400 mb-1">Explanation</p>
              <p className="text-sm text-[var(--text-secondary)]">{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setCurrentQ(c => Math.max(0, c - 1)); setSubmitted(false); }}
          disabled={currentQ === 0}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        <div className="flex gap-2">
          {!isSubmitted ? (
            <Button
              variant="brand"
              size="sm"
              onClick={handleSubmit}
              disabled={!isAnswered}
            >
              Check Answer
            </Button>
          ) : (
            <Button variant="brand" size="sm" onClick={handleNext}>
              {currentQ < total - 1 ? <>Next <ChevronRight className="w-4 h-4" /></> : "See Results"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lesson Page ───────────────────────────────────────────────

export default function LessonPage() {
  const lesson = classesAndObjectsLesson;
  const [activeTab, setActiveTab] = useState<Tab>("lesson");
  const [bookmarked, setBookmarked] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [progressNotice, setProgressNotice] = useState<string | null>(null);

  const trackLessonView = useCallback(async () => {
    if (typeof window === "undefined" || !getStoredAuthToken()) {
      return;
    }

    const trackingKey = `lesson-view:${lesson.id}:${new Date().toISOString().split("T")[0]}`;
    if (sessionStorage.getItem(trackingKey)) {
      return;
    }

    try {
      await recordLearningActivity({
        courseId: "java-oop",
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        moduleTitle: "OOP Fundamentals",
        completionPercent: 20,
        minutesSpent: 5,
        exercisesAttempted: 0,
        exercisesPassed: 0,
        lessonCompleted: false,
        topicId: "oop",
        topicTitle: "OOP Fundamentals",
      });
      sessionStorage.setItem(trackingKey, "saved");
    } catch {
      // Silent retry on next visit keeps the lesson flow uninterrupted.
    }
  }, [lesson.id, lesson.title]);

  const handleCompleteLesson = useCallback(async () => {
    if (isSavingProgress) {
      return;
    }

    if (!getStoredAuthToken()) {
      setProgressNotice("Log in to save lesson completion, streaks, and XP to your account.");
      return;
    }

    setIsSavingProgress(true);
    setProgressNotice(null);

    try {
      await recordLearningActivity({
        courseId: "java-oop",
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        moduleTitle: "OOP Fundamentals",
        completionPercent: 100,
        minutesSpent: Math.max(lesson.estimatedMin, 20),
        exercisesAttempted: 1,
        exercisesPassed: 1,
        lessonCompleted: true,
        topicId: "oop",
        topicTitle: "OOP Fundamentals",
        masteryLevel: "PROFICIENT",
        xpEarned: 120,
      });
      setLessonComplete(true);
      setProgressNotice("Saved to your account. Your dashboard, streak, XP, and recent activity are updated.");
    } catch (error) {
      const message = error instanceof DashboardApiError
        ? error.message
        : "We could not save your lesson progress right now. Please try again.";
      setProgressNotice(message);
    } finally {
      setIsSavingProgress(false);
    }
  }, [isSavingProgress, lesson.estimatedMin, lesson.id, lesson.title]);

  useEffect(() => {
    void trackLessonView();
  }, [trackLessonView]);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "lesson",   label: "Lesson",   icon: BookOpen },
    { id: "exercise", label: "Exercise", icon: Code2 },
    { id: "quiz",     label: "Quiz",     icon: HelpCircle },
    { id: "summary",  label: "Summary",  icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Lesson Header ── */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3">
            <Link href="/courses" className="hover:text-brand-400 transition-colors">Courses</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/courses/java-oop" className="hover:text-brand-400 transition-colors">OOP in Java</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--text-secondary)]">Classes & Objects</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="beginner">Beginner</Badge>
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5" />{lesson.estimatedMin} min
                </span>
              </div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{lesson.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={cn(
                  "w-9 h-9 rounded-xl border flex items-center justify-center transition-all",
                  bookmarked ? "border-brand-500/50 bg-brand-500/10 text-brand-400" : "border-[var(--border)] text-[var(--text-muted)] hover:text-brand-400"
                )}
              >
                <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
              </button>
              {!lessonComplete && (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => void handleCompleteLesson()}
                  disabled={isSavingProgress}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> {isSavingProgress ? "Saving..." : "Mark Complete"}
                </Button>
              )}
              {lessonComplete && (
                <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
          </div>

          {progressNotice && (
            <div
              className={cn(
                "mt-3 rounded-xl border px-3 py-2 text-sm",
                lessonComplete
                  ? "border-green-500/20 bg-green-500/5 text-green-300"
                  : "border-amber-500/20 bg-amber-500/5 text-amber-300",
              )}
            >
              {progressNotice}
            </div>
          )}

          {/* Tab nav */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-brand-500/15 text-brand-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4">
        <AnimatePresence mode="wait">
          {activeTab === "lesson" && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="py-8 max-w-3xl"
            >
              {/* Learning objectives */}
              <Card className="p-5 mb-8">
                <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-400" />
                  Learning Objectives
                </h2>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </Card>

              <LessonContent />

              {/* Next lesson */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-between p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Next Lesson</p>
                  <p className="font-semibold text-[var(--text-primary)]">Constructors & the this Keyword</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("exercise")}>
                    <Code2 className="w-4 h-4 mr-1" /> Try Exercise
                  </Button>
                  <Button variant="brand" size="sm" className="gap-1.5">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "exercise" && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="h-[calc(100vh-220px)] min-h-[600px]"
            >
              <ExercisePanel />
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="py-8"
            >
              <QuizPanel />
            </motion.div>
          )}

          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="py-8 max-w-2xl"
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Lesson Summary</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{lesson.content?.summary}</p>
                <h3 className="font-semibold mb-3">Key Takeaways</h3>
                <ul className="space-y-2 mb-6">
                  {lesson.objectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" /> {o}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setActiveTab("quiz")}>
                    <HelpCircle className="w-4 h-4 mr-1" /> Take Quiz
                  </Button>
                  <Button variant="brand" className="gap-1.5">
                    Next Lesson <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
