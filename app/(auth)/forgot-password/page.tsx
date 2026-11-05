"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
      // For security, still show generic confirmation or network error
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Check your inbox
          </CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            If an account exists for <span className="font-semibold text-foreground">{email}</span>, we have dispatched a cryptographic reset link valid for 30 minutes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Did not receive the message?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your university spam or quarantine filters.</li>
              <li>Verify that you registered with this exact institutional address.</li>
              <li>In local development, inspect your terminal console for the direct token link.</li>
            </ul>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="w-full text-xs"
          >
            Send to a different address
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to member sign in</span>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
          <KeyRound className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset your password
        </CardTitle>
        <CardDescription>
          Enter the university or verified email address associated with your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Registered Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="pl-9"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              We will send a one-time cryptographic reset token valid for 30 minutes.
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full gap-2 mt-2">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending Recovery Link...</span>
              </>
            ) : (
              <>
                <span>Send Recovery Email</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to member sign in</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

function ForgotPasswordSkeleton() {
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
