"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function AppNavbar() {
  const [isFooterReached, setIsFooterReached] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 1. IntersectionObserver for detecting footer entry
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterReached(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(footer);

    // 2. Scroll event fallback for fast gestures
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= docHeight - 140) {
        setIsFooterReached(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ease-out ${
        isFooterReached
          ? "-translate-y-24 opacity-0 scale-95"
          : "translate-y-0 opacity-100 scale-100"
      }`}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 h-13 sm:h-14 px-4 sm:px-6 rounded-full bg-white/45 dark:bg-slate-950/40 backdrop-blur-2xl saturate-150 border border-black/[0.08] dark:border-white/[0.12] shadow-[0_8px_30px_rgb(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18)] text-slate-900 dark:text-white w-full max-w-4xl transition-colors duration-300">
        {/* Left: Brand Icon + Title */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-sm tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity shrink-0"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-900/10 dark:border-white/15 transition-colors">
            <GraduationCap className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-slate-900 dark:text-white">UniCareer</span>
        </Link>

        {/* Center: Rearranged Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/"
                ? "text-slate-950 dark:text-white font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`transition-colors ${
              pathname === "/about"
                ? "text-slate-950 dark:text-white font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right: Theme Toggle + Log In + Start Free (Adaptive Light/Dark Pill Button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle className="size-8 border-slate-200/80 dark:border-white/15 bg-black/5 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/15 hover:text-slate-900 dark:hover:text-white transition-colors" />

          <Link
            href="/login"
            className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors px-2 py-1"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="text-xs font-semibold px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-sm transition-all hover:scale-103 shrink-0"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
