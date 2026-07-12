"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// ── Button ────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        brand:   "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md hover:shadow-glow-brand hover:-translate-y-px active:translate-y-0",
        ghost:   "border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-500 hover:text-brand-500 hover:bg-brand-500/5",
        outline: "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
        accent:  "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md hover:shadow-glow-accent hover:-translate-y-px",
        danger:  "bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20",
        muted:   "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        link:    "text-brand-400 hover:text-brand-300 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-lg",
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-5",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon:"h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";

// ── Badge ─────────────────────────────────────────────────────────────────────

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold text-xs px-2.5 py-0.5 border",
  {
    variants: {
      variant: {
        beginner:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        advanced:     "bg-red-500/10 text-red-400 border-red-500/20",
        professional: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        brand:        "bg-brand-500/10 text-brand-400 border-brand-500/20",
        accent:       "bg-accent-500/10 text-accent-400 border-accent-500/20",
        muted:        "bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)]",
        success:      "bg-green-500/10 text-green-400 border-green-500/20",
        warning:      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        error:        "bg-red-500/10 text-red-400 border-red-500/20",
      },
    },
    defaultVariants: { variant: "muted" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = "Badge";

// ── Card ──────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?:      boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, glow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6",
        hoverable && "transition-all duration-300 hover:border-brand-500/30 hover:shadow-card-hover cursor-pointer",
        glow      && "animate-pulse-glow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// ── Progress Bar ──────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value:     number; // 0-100
  color?:    string;
  height?:   number;
  showLabel?:boolean;
  className?:string;
  animated?:boolean;
}

export function ProgressBar({ value, color = "var(--brand)", height = 6, showLabel, className, animated }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[var(--text-muted)]">Progress</span>
          <span className="text-xs font-semibold text-[var(--text-primary)]">{value}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: "var(--bg-elevated)" }}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", animated && "animate-pulse")}
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────────

interface ProgressRingProps {
  value:    number; // 0-100
  size?:    number;
  stroke?:  number;
  color?:   string;
  children?:React.ReactNode;
  className?:string;
}

export function ProgressRing({ value, size = 80, stroke = 7, color = "var(--brand)", children, className }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="progress-ring">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        {children ?? <span className="text-sm font-bold text-[var(--text-primary)]">{value}%</span>}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shimmer rounded-lg", className)} {...props} />;
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) return <hr className={cn("border-[var(--border)]", className)} />;
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <hr className="flex-1 border-[var(--border)]" />
      <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{label}</span>
      <hr className="flex-1 border-[var(--border)]" />
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

export function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-surface-800 border border-[var(--border)] text-xs text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
        {label}
      </span>
    </span>
  );
}
