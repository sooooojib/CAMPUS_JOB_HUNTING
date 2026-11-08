"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    !token ? "Missing or invalid password reset token. Please request a new reset link." : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage("No reset token provided. Please request a new reset link.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        if (
          error.status === 400 ||
          error.code === "INVALID_TOKEN" ||
          error.message?.toLowerCase().includes("token")
        ) {
          setErrorMessage("This password reset token has expired or is invalid. Please request a new recovery link.");
        } else {
          setErrorMessage(error.message || "Failed to reset password. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Password updated
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your account password has been successfully reset. You can now sign in with your new credentials.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-12 rounded-2xl bg-[#EB5E28] hover:bg-[#D84E1B] text-white font-semibold text-sm transition-all shadow-sm"
        >
          <span>Sign In With New Password</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 transition-all">
      <div className="space-y-1 mb-5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          <span>Set New</span>
          <br />
          <span>Password</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground pt-1">
          Enter and confirm your new secure account password
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
            <Lock className="size-4" />
          </div>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password (min 8 chars)"
            required
            disabled={isLoading || !token}
            autoComplete="new-password"
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
            <Lock className="size-4" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
            disabled={isLoading || !token}
            autoComplete="new-password"
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full h-12 rounded-2xl bg-[#EB5E28] hover:bg-[#D84E1B] text-white font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-5">
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-[#EB5E28] transition-colors underline underline-offset-4"
        >
          Return to Member Sign In
        </Link>
      </div>
    </div>
  );
}

function ResetPasswordSkeleton() {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 animate-pulse">
      <div className="h-8 w-44 bg-muted rounded-xl mb-2" />
      <div className="h-4 w-60 bg-muted rounded-lg mb-6" />
      <div className="h-12 bg-muted rounded-2xl mb-3.5" />
      <div className="h-12 bg-muted rounded-2xl mb-3.5" />
      <div className="h-12 bg-muted rounded-2xl" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
