"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message || "Unable to send password recovery email. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Check your inbox
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          If an account exists for <span className="font-semibold text-foreground">{email}</span>, a cryptographic reset link has been dispatched (valid 30 minutes).
        </p>

        <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed text-left">
          <p className="font-semibold text-foreground mb-1">Did not receive it?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check spam or institutional quarantine filters.</li>
            <li>Verify you registered with this university address.</li>
            <li>In local testing, inspect your terminal console for the direct link.</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setEmail("");
          }}
          className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground font-medium text-xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Send to a different address
        </button>

        <div className="pt-2 text-center text-xs">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-[#EB5E28] hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 transition-all">
      <div className="space-y-1 mb-5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          <span>Lets</span>
          <br />
          <span>Reset Password</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground pt-1">
          Enter your registered institutional email to receive a recovery link
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
            <Mail className="size-4" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your University Email"
            required
            disabled={isLoading}
            autoComplete="email"
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-[#EB5E28] hover:bg-[#D84E1B] text-white font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Sending Recovery Link...</span>
            </>
          ) : (
            <span>Send Recovery Email</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-5">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-[#EB5E28] transition-colors underline underline-offset-4"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}

function ForgotPasswordSkeleton() {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 animate-pulse">
      <div className="h-8 w-44 bg-muted rounded-xl mb-2" />
      <div className="h-4 w-60 bg-muted rounded-lg mb-6" />
      <div className="h-12 bg-muted rounded-2xl mb-4" />
      <div className="h-12 bg-muted rounded-2xl" />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
