"use client";

import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. If token is present in the URL, verify it via Better Auth API
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function verify() {
      setIsVerifying(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token!)}`);
        
        if (response.ok) {
          if (isMounted) {
            setIsVerified(true);
            setIsVerifying(false);
          }
        } else {
          const data = await response.json().catch(() => ({}));
          if (isMounted) {
            setErrorMessage(data.message || "Email verification token is invalid or has expired.");
            setIsVerifying(false);
          }
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        if (isMounted) {
          setErrorMessage("Failed to connect to verification server. Please try again.");
          setIsVerifying(false);
        }
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // 2. Check if the email is already verified
  useEffect(() => {
    if (!email.trim() || !email.includes("@")) return;

    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetch(`/api/auth/verification-status?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.user?.emailVerified) {
            setIsVerified(true);
          }
        }
      } catch (err) {
        console.error("Failed to check status:", err);
      }
    }

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [email]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid university email to resend verification.");
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    setResendSuccess(false);

    try {
      const response = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), callbackURL: "/feed" }),
      });

      if (response.ok) {
        setResendSuccess(true);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.message || "Unable to resend verification email at this moment.");
      }
    } catch (err: any) {
      console.error("Resend error:", err);
      setErrorMessage("Network error while requesting verification email.");
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Verifying email address</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Validating your cryptographic institutional token against university records...
        </p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Email Verified Successfully
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your university identity is verified. You now have full access to campus opportunities, career tools, and the alumni network.
        </p>

        <div className="pt-2 space-y-2.5">
          <button
            onClick={() => router.push("/feed")}
            className="w-full h-11 sm:h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Community Feed</span>
            <ArrowRight className="size-4" />
          </button>
          
          <Link
            href="/login"
            className="w-full h-10 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-foreground transition-all flex items-center justify-center"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 transition-all">
      <div className="space-y-1 mb-5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          <span>Verify</span>
          <br />
          <span>Your Email</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground pt-1">
          {emailParam ? (
            <>
              We sent a verification link to{" "}
              <span className="font-semibold text-foreground">{emailParam}</span>.
            </>
          ) : (
            "Confirm your university email to activate verified member access."
          )}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {resendSuccess && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in-50">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            A fresh verification email has been dispatched. Please check your inbox and click the link to activate your account.
          </div>
        </div>
      )}

      <form onSubmit={handleResend} className="space-y-3.5">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
            <Mail className="size-4" />
          </div>
          <input
            id="resendEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your University Email"
            required
            disabled={isResending}
            className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        {/* Resend Link Button */}
        <button
          type="submit"
          disabled={isResending}
          className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {isResending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Dispatching Link to Inbox...</span>
            </>
          ) : (
            <>
              <RefreshCw className="size-3.5" />
              <span>Resend Verification Link</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-4">
        Ready to sign in?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}

function VerifyEmailSkeleton() {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 animate-pulse">
      <div className="h-8 w-44 bg-muted rounded-xl mb-2" />
      <div className="h-4 w-60 bg-muted rounded-lg mb-6" />
      <div className="h-12 bg-muted rounded-2xl mb-4" />
      <div className="h-11 bg-muted rounded-2xl" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailSkeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
