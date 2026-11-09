import * as React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  CampusCareerIllustrationLeft,
  CampusCareerIllustrationRight,
} from "@/components/auth/auth-illustrations";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen max-h-screen w-full flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#F6F5F0] dark:bg-slate-950 text-foreground transition-colors overflow-hidden">
      {/* Outer Framed Canvas matching the reference architecture */}
      <div className="relative w-full max-w-5xl rounded-[2rem] sm:rounded-[2.5rem] bg-[#FAF9F5] dark:bg-slate-900/95 border border-black/5 dark:border-white/10 shadow-2xl p-5 sm:p-7 md:p-8 overflow-hidden flex flex-col justify-between max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)]">
        
        {/* Top Header Row inside the Frame */}
        <header className="relative z-20 flex items-center justify-between w-full shrink-0">
          {/* Brand Logo with Official University Primary Badge & "UniCareer." */}
          <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
            <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
              UniCareer<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Top-Right Circular Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="flex size-9 sm:size-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </header>

        {/* Centerpiece Floating Card Area */}
        <main className="relative z-10 flex-1 flex items-center justify-center py-2 sm:py-3 my-auto overflow-y-auto">
          {children}
        </main>

        {/* Animated University & Career Vector Motion Illustrations at Bottom Corners */}
        <CampusCareerIllustrationLeft className="absolute bottom-2 sm:bottom-3 left-2 sm:left-5 md:left-7 w-48 sm:w-56 md:w-64 z-0 hidden lg:block" />
        <CampusCareerIllustrationRight className="absolute bottom-2 sm:bottom-3 right-2 sm:right-5 md:right-7 w-44 sm:w-52 md:w-60 z-0 hidden lg:block" />
      </div>
    </div>
  );
}
