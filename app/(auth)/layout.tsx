import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  AuthStudentIllustration,
  AuthPedestalIllustration,
} from "@/components/auth/auth-illustrations";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12 bg-[#F6F5F0] dark:bg-slate-950 text-foreground transition-colors">
      {/* Outer Framed Canvas matching the reference aesthetic */}
      <div className="relative w-full max-w-5xl rounded-[2.5rem] bg-[#FAF9F5] dark:bg-slate-900/90 border border-black/5 dark:border-white/10 shadow-2xl p-6 sm:p-10 md:p-12 overflow-hidden flex flex-col justify-between min-h-[660px] sm:min-h-[720px]">
        
        {/* Top Header Row inside the Frame */}
        <header className="relative z-20 flex items-center justify-between w-full">
          {/* Brand Logo with Orange Circle Mark & "UniCareer." */}
          <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative flex size-9 sm:size-10 items-center justify-center rounded-full bg-[#EB5E28] text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="size-3.5 rounded-full border-2 border-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
              UniCareer<span className="text-[#EB5E28]">.</span>
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
        <main className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-8 my-auto">
          {children}
        </main>

        {/* Decorative Vector Artwork at Bottom Corners */}
        <AuthStudentIllustration className="absolute -bottom-1 left-4 sm:left-8 md:left-12 w-48 sm:w-56 md:w-64 z-0 hidden lg:block" />
        <AuthPedestalIllustration className="absolute -bottom-1 right-4 sm:right-8 md:right-12 w-40 sm:w-48 md:w-56 z-0 hidden lg:block" />

        {/* Footer info line */}
        <footer className="relative z-20 text-center text-[11px] text-muted-foreground/80 pt-2">
          <span>Verified University Network • Encrypted Campus Authentication</span>
        </footer>
      </div>
    </div>
  );
}
