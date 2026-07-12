import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <Badge variant="warning" className="mb-4">
          Account Recovery
        </Badge>

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <KeyRound className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Password reset page is now reachable.</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          The previous link from Login went to a missing route. This page fixes the navigation dead end and makes the recovery
          path explicit while the backend email reset flow is still being connected.
        </p>

        <div className="mt-6 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-400" />
            Reset emails are not wired up yet, so this page stays honest instead of pretending to submit a form.
          </div>
          <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
            <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-400" />
            You can return to login, create a new account, or continue exploring the app while recovery is being implemented.
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/login">
            <Button variant="brand" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost">Create Account</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
