import * as React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-primary/5 via-background to-background text-foreground">
      {/* Top Bar with Back Link & Theme Toggle */}
      <header className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Form Centerpiece */}
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          {/* Logo & Platform Name */}
          <div className="flex flex-col items-center text-center space-y-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
                <GraduationCap className="size-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-tight text-foreground leading-none">
                  UniCareer
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Community Network
                </span>
              </div>
            </Link>
          </div>

          {/* Form Content */}
          {children}

          {/* Security Assurance Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>Encrypted Institutional Authentication</span>
          </div>
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="container mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40">
        <p>© 2026 UniCareer Community. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
      </footer>
    </div>
  );
}

