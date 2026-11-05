"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [membershipType, setMembershipType] = useState<string>("STUDENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
          <ShieldCheck className="size-5" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create verified account
        </CardTitle>
        <CardDescription>
          Access gated opportunities, alumni mentorship, and campus career referrals
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
            <Label htmlFor="membershipType">Institutional Role</Label>
            <Select
              value={membershipType}
              onValueChange={(val) => {
                if (val) setMembershipType(val);
              }}
              disabled={isLoading}
            >
              <SelectTrigger id="membershipType" className="w-full">
                <SelectValue placeholder="Select your university relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Current Student (Enrolled)</SelectItem>
                <SelectItem value="ALUMNI">University Alumnus / Alumna</SelectItem>
                <SelectItem value="FACULTY">Faculty Member / Academic Advisor</SelectItem>
                <SelectItem value="STAFF">University Career Staff</SelectItem>
                <SelectItem value="EMPLOYER">Corporate Recruiter / Employer Partner</SelectItem>
                <SelectItem value="EXTERNAL_CONNECTION">Verified External Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="pl-9"
                required
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Institutional or Work Email</Label>
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
              Students and alumni should use official university domain addresses for automated verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 chars"
                  className="pl-9"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="pl-9"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-1">
            <Checkbox
              id="agreeTerms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))}
              disabled={isLoading}
              className="mt-0.5"
            />
            <Label
              htmlFor="agreeTerms"
              className="text-xs font-normal text-muted-foreground leading-relaxed cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                Community Honor Code
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                Student Data Protection Policy
              </Link>
              .
            </Label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full gap-2 mt-2">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        <div>
          Already have a verified account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function RegisterFormSkeleton() {
  return (
    <Card className="border-border shadow-lg animate-pulse">
      <CardHeader className="space-y-2 text-center">
        <div className="size-10 bg-muted mx-auto rounded-2xl" />
        <div className="h-6 w-44 bg-muted mx-auto rounded" />
        <div className="h-4 w-64 bg-muted mx-auto rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded mt-2" />
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
