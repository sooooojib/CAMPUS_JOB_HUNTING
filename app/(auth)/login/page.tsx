"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/auth/google-icon";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/feed";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "account_suspended"
      ? "Your account has been suspended by campus administration. Please contact registrar support."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your university email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: callbackUrl,
        rememberMe,
      });

      if (error) {
        if (error.status === 401 || error.code === "INVALID_EMAIL_OR_PASSWORD") {
          setErrorMessage("Invalid university email or password. Please try again.");
        } else if (error.status === 500) {
          setErrorMessage("Database connection failed on server. Please verify server configuration.");
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Authentication failed. Please verify your credentials.");
        }
        setIsLoading(false);
        return;
      }

      // Successful sign in -> hard redirect to callbackUrl to load fresh session state
      window.location.href = callbackUrl;
    } catch (err: any) {
      console.error("Login submission error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const fillDemo = (role: "student" | "alumni" | "admin") => {
    setErrorMessage(null);
    if (role === "student") {
      setEmail("farhan.student@unicareer.edu");
      setPassword("Password123!");
    } else if (role === "alumni") {
      setEmail("tariqul.alumni@unicareer.edu");
      setPassword("Password123!");
    } else {
      setEmail("admin@unicareer.edu");
      setPassword("Password123!");
    }
    toast.info(`Filled demo ${role.toUpperCase()} credentials`);
  };

  const handleGoogleSignIn = () => {
    toast.info("Connecting to Google Institutional Workspace identity provider...");
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 transition-all">
      {/* Title block matching reference image */}
      <div className="space-y-1 mb-6 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          <span>Lets</span>
          <br />
          <span>Start Connecting</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground pt-1">
          Please login or sign up to continue
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Form inputs */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Email field */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none">
            <Mail className="size-4" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
            disabled={isLoading}
            autoComplete="email"
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
        </div>

        {/* Password field */}
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
            autoComplete="current-password"
            className="w-full h-12 pl-11 pr-11 rounded-2xl bg-[#F4F3F1] dark:bg-slate-800/80 border border-transparent focus:border-[#EB5E28] focus:bg-white dark:focus:bg-slate-900 text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-0.5 px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="rounded-md border-border text-[#EB5E28] focus:ring-[#EB5E28] size-3.5"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-medium text-[#EB5E28] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Primary CTA Button: Vibrant Terracotta / Orange */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-2xl bg-[#EB5E28] hover:bg-[#D84E1B] text-white font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Logging In...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>

        {/* Secondary Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-foreground font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <GoogleIcon className="size-4" />
          <span>Google</span>
        </button>
      </form>

      {/* Switch to Register link */}
      <div className="text-center text-xs text-muted-foreground pt-5">
        Don&apos;t Have An Account?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground hover:text-[#EB5E28] transition-colors underline underline-offset-4"
        >
          Sign Up
        </Link>
      </div>

      {/* Quick Campus Demo Accounts Helper */}
      <div className="mt-5 pt-4 border-t border-border/50 text-center">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 block mb-2">
          One-Click Demo Access
        </span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => fillDemo("student")}
            className="px-3 py-1 text-[11px] rounded-xl bg-muted/70 hover:bg-muted text-foreground font-medium transition-colors cursor-pointer border border-border/40"
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => fillDemo("alumni")}
            className="px-3 py-1 text-[11px] rounded-xl bg-muted/70 hover:bg-muted text-foreground font-medium transition-colors cursor-pointer border border-border/40"
          >
            💼 Alumni
          </button>
          <button
            type="button"
            onClick={() => fillDemo("admin")}
            className="px-3 py-1 text-[11px] rounded-xl bg-muted/70 hover:bg-muted text-foreground font-medium transition-colors cursor-pointer border border-border/40"
          >
            🛡️ Admin
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-9 shadow-xl border border-black/5 dark:border-white/10 animate-pulse">
      <div className="h-8 w-44 bg-muted rounded-xl mb-2" />
      <div className="h-4 w-60 bg-muted rounded-lg mb-6" />
      <div className="space-y-3.5">
        <div className="h-12 bg-muted rounded-2xl" />
        <div className="h-12 bg-muted rounded-2xl" />
        <div className="h-12 bg-muted rounded-2xl mt-4" />
        <div className="h-12 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
