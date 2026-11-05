"use client";

import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

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

  // If a token is in the query params, attempt automated verification
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
        body: JSON.stringify({ email: email.trim().toLowerCase(), callbackURL: "/dashboard" }),
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

  // State 1: In progress verification
  if (isVerifying) {
    return (
      <Card className="border-border shadow-lg text-center p-6 space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <CardTitle className="text-xl font-bold">Verifying email address</CardTitle>
        <CardDescription>
          Validating your cryptographic institutional token against university records...
        </CardDescription>
      </Card>
    );
  }

  // State 2: Verification Successful
  if (isVerified) {
    return (
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Email Verified Successfully
          </CardTitle>
          <CardDescription>
            Your university identity is verified. You now have full access to campus opportunities, career tools, and the alumni network.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full gap-2"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // State 3: Waiting for verification (e.g. after registration or if token expired)
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
          <Mail className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Verify your email address
        </CardTitle>
        <CardDescription>
          {emailParam ? (
            <>
              We sent a verification link to{" "}
              <span className="font-semibold text-foreground">{emailParam}</span>.
            </>
          ) : (
            "Confirm your university email to activate member features."
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {resendSuccess && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              A fresh verification email has been dispatched. Please check your inbox.
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">Notice for local development:</p>
          <p>
            Email verification links and tokens are automatically recorded in the development server log. Check your server terminal to click the generated link directly.
          </p>
        </div>

        <form onSubmit={handleResend} className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="resendEmail">University Email</Label>
            <Input
              id="resendEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
              disabled={isResending}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={isResending}
            className="w-full gap-2 text-xs"
          >
            {isResending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Dispatching Email...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" />
                <span>Resend Verification Link</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        <div>
          Ready to sign in?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Return to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function VerifyEmailSkeleton() {
  return (
    <Card className="border-border shadow-lg animate-pulse">
      <CardHeader className="space-y-2 text-center">
        <div className="size-12 bg-muted mx-auto rounded-2xl" />
        <div className="h-6 w-44 bg-muted mx-auto rounded" />
        <div className="h-4 w-60 bg-muted mx-auto rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded mt-2" />
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailSkeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
