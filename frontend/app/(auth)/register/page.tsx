"use client";

import React, { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, GitBranch, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, Divider } from "@/components/ui";
import { AuthApiError, clearAuthSession, persistAuthSession, registerUser } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const passwordStrength = (() => {
    const pw = form.password;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  })();

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      clearAuthSession();
      const session = await registerUser({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      persistAuthSession(session);
      startTransition(() => {
        router.push("/onboarding");
      });
    } catch (err) {
      if (err instanceof AuthApiError) {
        setError(err.message);
        setFieldErrors(err.validationErrors ?? {});
      } else {
        setError("Unable to create your account right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-brand-500/5 via-transparent to-transparent" style={{ backgroundSize: "80% 80%", backgroundPosition: "center top" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand">
            <span className="text-white font-black">JF</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">JavaForge</span>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 shadow-card">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Create your account</h1>
          <p className="text-[var(--text-secondary)] mb-6">Start learning Java for free. No credit card required.</p>

          <div className="flex gap-3 mb-6">
            <button type="button" disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] opacity-60 cursor-not-allowed text-sm font-medium">
              <GitBranch className="w-4 h-4" /> GitHub
            </button>
            <button type="button" disabled className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] opacity-60 cursor-not-allowed text-sm font-medium">
              <Mail className="w-4 h-4" /> Google
            </button>
          </div>

          <Divider label="or register with email" className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => {
                  const value = e.target.value;
                  setForm(f => ({ ...f, fullName: value }));
                  setFieldErrors((current) => ({ ...current, fullName: "" }));
                }}
                placeholder="Alex Johnson"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
              />
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => {
                  const value = e.target.value;
                  setForm(f => ({ ...f, username: value }));
                  setFieldErrors((current) => ({ ...current, username: "" }));
                }}
                placeholder="alex_johnson"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
              />
              {fieldErrors.username && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => {
                  const value = e.target.value;
                  setForm(f => ({ ...f, email: value }));
                  setFieldErrors((current) => ({ ...current, email: "" }));
                }}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => {
                    const value = e.target.value;
                    setForm(f => ({ ...f, password: value }));
                    setFieldErrors((current) => ({ ...current, password: "" }));
                  }}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm pr-12"
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

              {/* Password strength */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={cn("flex-1 h-1 rounded-full transition-all", i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-[var(--bg-elevated)]")}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {form.password.length > 0 && strengthLabels[Math.max(passwordStrength, 1) - 1]} password
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
              <input
                type={showPw ? "text" : "password"}
                value={form.confirmPassword}
                onChange={e => {
                  const value = e.target.value;
                  setForm(f => ({ ...f, confirmPassword: value }));
                  setFieldErrors((current) => ({ ...current, confirmPassword: "" }));
                }}
                placeholder="Repeat your password"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-500/50 text-sm"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Benefits */}
            <div className="p-4 rounded-xl bg-accent-500/8 border border-accent-500/20 space-y-2">
              {["400+ interactive lessons", "12 real-world projects", "Progress tracking & achievements"].map(b => (
                <div key={b} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" /> {b}
                </div>
              ))}
            </div>

            <Button type="submit" variant="brand" size="lg" loading={loading} className="w-full gap-2">
              Create Account <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="text-xs text-center text-[var(--text-muted)]">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
