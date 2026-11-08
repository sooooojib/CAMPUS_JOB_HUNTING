"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/auth/google-icon";
import { toast } from "sonner";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/feed";

  const [membershipType, setMembershipType] = useState<string>("STUDENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid university or institutional email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("You must accept the Community Honor Code and Institutional Privacy Terms to register.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: fullName.trim(),
        callbackURL: callbackUrl,
        membershipType,
      } as any);

      if (error) {
        if (
          error.status === 422 ||
          error.code === "USER_ALREADY_EXISTS" ||
          error.message?.toLowerCase().includes("already exists")
        ) {
          setErrorMessage("An account with this email address already exists. Please sign in instead.");
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Registration failed. Please check your details and try again.");
        }
        setIsLoading(false);
        return;
      }

      // Success -> Redirect to verification notification screen
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: any) {
      console.error("Registration submission error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info("Connecting to Google Institutional Workspace identity provider...");
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 transition-all">
      {/* Title block matching reference image */}
      <div className="space-y-1 mb-5 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          <span>Lets</span>
          <br />
          <span>Start Learning</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground pt-1">
          Please login or sign up to continue
        </p>
      </div>

      {/* Role Selector Pill */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F4F3F1] dark:bg-slate-800/80 rounded-2xl border border-transparent">
          <button
            type="button"
            onClick={() => setMembershipType("STUDENT")}
            className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              membershipType === "STUDENT"
                ? "bg-white dark:bg-slate-900 text-[#EB5E28] shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎓 Current Student
          </button>
          <button
            type="button"
            onClick={() => setMembershipType("ALUMNI")}
            className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              membershipType === "ALUMNI"
                ? "bg-white dark:bg-slate-900 text-[#EB5E28] shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💼 Alumnus / Alumna
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Form inputs */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
            <User className="size-4" />
          </div>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Full Name"
            required
            disabled={isLoading}
            autoComplete="name"
            className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        {/* Email */}
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
            className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        {/* Passwords in 2 columns on small screens, or stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
              <Lock className="size-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              required
              disabled={isLoading}
              autoComplete="new-password"
              className="w-full h-11 sm:h-12 pl-11 pr-9 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
              <Lock className="size-4" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              disabled={isLoading}
              autoComplete="new-password"
              className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Honor code agreement */}
        <div className="flex items-start gap-2 pt-1 px-1">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={isLoading}
            className="mt-0.5 rounded-md border-border text-[#EB5E28] focus:ring-[#EB5E28] size-3.5 cursor-pointer"
          />
          <label
            htmlFor="agreeTerms"
            className="text-[11px] text-muted-foreground leading-snug cursor-pointer select-none"
          >
            I agree to the Community Honor Code and verify my university affiliation.
          </label>
        </div>

        {/* Primary CTA: Orange Sign Up */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-[#EB5E28] hover:bg-[#D84E1B] text-white font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>

        {/* Secondary Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <GoogleIcon className="size-4" />
          <span>Google</span>
        </button>
      </form>

      {/* Switch to Login link */}
      <div className="text-center text-xs text-muted-foreground pt-5">
        Already Have An Account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground hover:text-[#EB5E28] transition-colors underline underline-offset-4"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

function RegisterFormSkeleton() {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 animate-pulse">
      <div className="h-8 w-44 bg-muted rounded-xl mb-2" />
      <div className="h-4 w-60 bg-muted rounded-lg mb-5" />
      <div className="h-10 bg-muted rounded-2xl mb-4" />
      <div className="space-y-3">
        <div className="h-11 bg-muted rounded-2xl" />
        <div className="h-11 bg-muted rounded-2xl" />
        <div className="h-11 bg-muted rounded-2xl" />
        <div className="h-12 bg-muted rounded-2xl mt-4" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
