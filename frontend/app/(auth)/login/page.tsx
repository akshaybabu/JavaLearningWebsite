"use client";

import React, { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, GitBranch, Mail, ArrowRight } from "lucide-react";
import { Button, Divider } from "@/components/ui";
import { AuthApiError, clearAuthSession, loginUser, persistAuthSession } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      clearAuthSession();
      const session = await loginUser({
        usernameOrEmail: identifier,
        password,
      });
      persistAuthSession(session);
      startTransition(() => {
        router.push("/dashboard");
      });
    } catch (err) {
      if (err instanceof AuthApiError) {
        setError(err.message);
        setFieldErrors(err.validationErrors ?? {});
      } else {
        setError("Unable to sign in right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-brand-500/5 via-transparent to-transparent" style={{ backgroundSize: "80% 80%", backgroundPosition: "center top" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand">
            <span className="text-white font-black">JF</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">JavaForge</span>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 shadow-card">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Welcome back</h1>
          <p className="text-[var(--text-secondary)] mb-6">Sign in to continue your Java journey</p>

          {/* Social auth */}
          <div className="flex gap-3 mb-6">
            <button type="button" disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] opacity-60 cursor-not-allowed text-sm font-medium">
              <GitBranch className="w-4 h-4" /> GitHub
            </button>
            <button type="button" disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] opacity-60 cursor-not-allowed text-sm font-medium">
              <Mail className="w-4 h-4" /> Google
            </button>
          </div>

          <Divider label="or continue with email" className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Username or Email</label>
              <input
                type="text"
                value={identifier}
                onChange={e => {
                  setIdentifier(e.target.value);
                  setFieldErrors((current) => ({ ...current, usernameOrEmail: "" }));
                }}
                placeholder="your_username or you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 transition-colors text-sm"
              />
              {fieldErrors.usernameOrEmail && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.usernameOrEmail}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setFieldErrors((current) => ({ ...current, password: "" }));
                  }}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 transition-colors text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="brand"
              size="lg"
              loading={loading}
              className="w-full gap-2"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
