"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchDashboard } from "@/lib/dashboard/client";
import { getStoredAuthToken, getStoredAuthUser, type AuthenticatedUser } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  Search, Moon, Sun, Bell, ChevronDown,
  BookOpen, LayoutDashboard, Map, Code2, Briefcase,
  Users, Menu, X, Flame, Target,
} from "lucide-react";

const APP_NAME = "JavaForge";

const navLinks = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/roadmap",    label: "Roadmap",    icon: Map },
  { href: "/courses",    label: "Courses",    icon: BookOpen },
  { href: "/practice",  label: "Practice",   icon: Code2 },
  { href: "/projects",  label: "Projects",   icon: Briefcase },
  { href: "/interview", label: "Interview",  icon: Target },
  { href: "/community", label: "Community",  icon: Users },
];

interface NavbarProps {
  theme: string;
  onThemeToggle: () => void;
}

export function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);

  const avatarInitials = getAvatarInitials(authUser);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncNavbarState() {
      const storedUser = getStoredAuthUser();
      setAuthUser(storedUser);

      if (!storedUser || !getStoredAuthToken()) {
        setCurrentStreak(null);
        return;
      }

      try {
        const dashboard = await fetchDashboard();
        if (!cancelled) {
          setCurrentStreak(dashboard.progress.currentStreak);
        }
      } catch {
        if (!cancelled) {
          setCurrentStreak(null);
        }
      }
    }

    void syncNavbarState();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand group-hover:shadow-lg transition-shadow">
                <span className="text-white text-sm font-black">JF</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[var(--text-primary)] font-bold tracking-tight">{APP_NAME}</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 5).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    pathname === href || pathname.startsWith(href + "/")
                      ? "text-brand-400 bg-brand-500/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-150">
                  More <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  {navLinks.slice(5).map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] text-sm hover:border-brand-500/40 transition-all duration-150"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:block">Search...</span>
                <span className="hidden md:flex items-center gap-0.5 ml-2">
                  <kbd className="text-xs bg-[var(--bg-card)] border border-[var(--border)] rounded px-1.5 py-0.5">⌘K</kbd>
                </span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={onThemeToggle}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-brand-400 hover:border-brand-500/40 transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {authUser ? (
                <>
                  {/* Streak indicator */}
                  {typeof currentStreak === "number" && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
                      <Flame className="w-4 h-4 text-brand-400" />
                      <span className="text-sm font-semibold text-brand-400">{currentStreak}</span>
                    </div>
                  )}
                  {/* Notifications */}
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-[var(--bg-surface)]" />
                  </button>
                  {/* User avatar */}
                  <div
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center cursor-pointer hover:shadow-glow-brand transition-shadow"
                    aria-label={authUser.fullName}
                    title={authUser.fullName}
                  >
                    <span className="text-white text-xs font-bold">{avatarInitials}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="brand" size="sm">Start Free</Button>
                  </Link>
                </>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)]"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[var(--bg-surface)] border-t border-[var(--border)] px-4 py-4 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-brand-400 bg-brand-500/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                )}
              >
                <Icon className="w-5 h-5" /> {label}
              </Link>
            ))}
            {authUser ? (
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{authUser.fullName}</p>
                  <p className="text-xs text-[var(--text-muted)]">@{authUser.username}</p>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-[var(--border)] flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="brand" size="sm" className="w-full">Start Free</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Command Palette */}
      {cmdOpen ? <CommandPalette onClose={() => setCmdOpen(false)} /> : null}
    </>
  );
}

function getAvatarInitials(user: AuthenticatedUser | null) {
  if (!user) {
    return "JF";
  }

  const source = user.fullName.trim() || user.username.trim();
  if (!source) {
    return "JF";
  }

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

// ── Command Palette ──────────────────────────────────────────────────────────

const CMD_ITEMS = [
  { label: "Go to Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigation" },
  { label: "View Java Roadmap", href: "/roadmap", icon: Map, group: "Navigation" },
  { label: "Browse Courses", href: "/courses", icon: BookOpen, group: "Navigation" },
  { label: "Open Practice", href: "/practice", icon: Code2, group: "Navigation" },
  { label: "Interview Prep", href: "/interview", icon: Target, group: "Navigation" },
  { label: "Classes and Objects", href: "/learn/java-oop/oop-101", icon: BookOpen, group: "Lessons" },
  { label: "OOP Fundamentals", href: "/courses/java-oop", icon: BookOpen, group: "Lessons" },
  { label: "Java Foundations", href: "/courses/java-foundations", icon: BookOpen, group: "Courses" },
  { label: "Spring Boot", href: "/courses/java-spring-boot", icon: BookOpen, group: "Courses" },
];

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = CMD_ITEMS.filter(item =>
    query === "" || item.label.toLowerCase().includes(query.toLowerCase()) || item.group.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, typeof CMD_ITEMS>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lessons, courses, topics..."
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none text-base"
          />
          <kbd className="text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded border border-[var(--border)]">ESC</kbd>
        </div>
        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="text-2xs text-[var(--text-muted)] font-semibold uppercase tracking-wider px-5 py-2">{group}</p>
              {items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--bg-elevated)] transition-colors group"
                >
                  <item.icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-brand-400 transition-colors" />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-center text-[var(--text-muted)] py-8">No results for &ldquo;{query}&rdquo;</p>
          )}
        </div>
        {/* Footer */}
        <div className="border-t border-[var(--border)] px-5 py-3 flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5"><kbd className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded px-1.5 py-0.5">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded px-1.5 py-0.5">↵</kbd> open</span>
          <span className="flex items-center gap-1.5"><kbd className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded px-1.5 py-0.5">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
