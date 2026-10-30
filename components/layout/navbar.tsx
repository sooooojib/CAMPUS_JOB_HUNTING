"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function AppNavbar() {
  const [isFooterReached, setIsFooterReached] = useState(false);

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
      <div className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 h-13 sm:h-14 px-4 sm:px-6 rounded-full bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-2xl border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white w-full max-w-4xl transition-all">
        {/* Left: Brand Icon + Title */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-sm tracking-tight text-white hover:text-white/90 transition-opacity shrink-0"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white border border-white/15">
            <GraduationCap className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-white">UniCareer</span>
        </Link>

        {/* Center: Clean Nav Links (Image 2 style) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-medium text-slate-300">
          <Link
            href="/#pipeline"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Explore</span>
            <ChevronDown className="size-3 opacity-60" />
          </Link>
          <Link
            href="/opportunities"
            className="hover:text-white transition-colors"
          >
            Opportunities
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link
            href="/design-system"
            className="hover:text-white transition-colors"
          >
            Design
          </Link>
        </nav>

        {/* Right: Theme Toggle + Log In + Start Free (Pill Button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle className="size-8 border-white/15 bg-white/5 text-white hover:bg-white/15 hover:text-white" />

          <Link
            href="/login"
            className="text-xs font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="text-xs font-semibold px-4 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-100 shadow-xs transition-all hover:scale-103 shrink-0"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
