"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Lock,
} from "lucide-react";

const LIVE_TICKER_ITEMS = [
  {
    tag: "REFERRAL",
    text: "Nadia Islam (CSE '18) referred Tanvir Ahmed → Interview Shortlisted at Optimizely",
    time: "Just now",
  },
  {
    tag: "OPPORTUNITY",
    text: "Brain Station 23 opened 6 exclusive internship positions for JNU students",
    time: "3m ago",
  },
  {
    tag: "ENDORSEMENT",
    text: "Dr. A. Rahman (Faculty Chair) endorsed 3 research candidates for Fellowships",
    time: "7m ago",
  },
  {
    tag: "SHORTLIST",
    text: "Sabrina Mostafa (BBA '24) shortlisted for Management Trainee at bKash FinTech",
    time: "12m ago",
  },
  {
    tag: "REGISTRAR",
    text: "12,540 verified student credentials synchronized with university registrar records",
    time: "18m ago",
  },
];

export function HeritageCampusPanorama() {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Auto-cycle the ticker every 3.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentTicker = LIVE_TICKER_ITEMS[tickerIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-border/90 bg-card shadow-2xl overflow-hidden select-none transition-all duration-300">
      {/* Top Heritage Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            src="/images/jnu-crest.png"
            alt="Jagannath University"
            className="size-7 object-contain"
          />
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
              <span>Jagannath University Administrative Core</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Est. 1858
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Heritage Campus Gateway • Verified Academic & Career Nexus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span className="font-semibold text-foreground">Registrar Validated Community</span>
        </div>
      </div>

      {/* Main Photographic Heritage Stage */}
      <div className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[440px] max-h-[560px] overflow-hidden group">
        {/* Real High-Resolution Photo of Jagannath University Building */}
        <img
          src="/images/jnu-building.jpg"
          alt="Jagannath University Heritage Building"
          className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-95 dark:brightness-85 transition-transform duration-700 group-hover:scale-102"
        />

        {/* Ambient Gradient Overlays for Theme Harmonization */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-card/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-card/10 to-card/40 pointer-events-none" />

        {/* ========================================================= */}
        {/* INTERACTIVE MILESTONE PINS FLOATING OVER THE FACADE       */}
        {/* ========================================================= */}

        {/* PIN 1: Over Grand Archway / Center Gateway */}
        <div
          onMouseEnter={() => setActivePin("gateway")}
          onMouseLeave={() => setActivePin(null)}
          className="absolute left-1/2 -translate-x-1/2 top-[32%] sm:top-[28%] z-20 cursor-pointer"
        >
          <div className="relative flex flex-col items-center">
            {/* The Glassmorphic Milestone Pill */}
            <div
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl transition-all duration-300 ${
                activePin === "gateway"
                  ? "scale-105 border-primary ring-2 ring-primary/20 shadow-primary/20"
                  : "border-border/80 hover:border-primary/60"
              }`}
            >
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0">
                <Building2 className="size-4 sm:size-4.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">
                    Central Registrar Gateway
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  12,500+ Verified Students
                </p>
              </div>
            </div>

            {/* Vertical Indicator Pointer Line to Building Entrance */}
            <div className="h-6 sm:h-9 w-[2px] bg-gradient-to-b from-primary via-blue-500/60 to-transparent" />
            <div className="size-2 rounded-full bg-primary shadow-xs ring-2 ring-background" />
          </div>
        </div>

        {/* PIN 2: Over Left Wing / Science & Technology Faculty */}
        <div
          onMouseEnter={() => setActivePin("alumni")}
          onMouseLeave={() => setActivePin(null)}
          className="absolute left-[8%] sm:left-[16%] top-[16%] sm:top-[18%] z-20 cursor-pointer"
        >
          <div className="relative flex flex-col items-center">
            {/* Glassmorphic Pill */}
            <div
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl transition-all duration-300 ${
                activePin === "alumni"
                  ? "scale-105 border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/20"
                  : "border-border/80 hover:border-amber-500/60"
              }`}
            >
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                <GraduationCap className="size-4 sm:size-4.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">
                    Alumni Mentorship Network
                  </span>
                  <span className="size-1.5 rounded-full bg-amber-500" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  450+ Mentors Across Top Tech
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line */}
            <div className="h-7 sm:h-12 w-[2px] bg-gradient-to-b from-amber-500 via-amber-500/60 to-transparent" />
            <div className="size-2 rounded-full bg-amber-500 shadow-xs ring-2 ring-background" />
          </div>
        </div>

        {/* PIN 3: Over Right Wing / Corporate Placement Drives */}
        <div
          onMouseEnter={() => setActivePin("corporate")}
          onMouseLeave={() => setActivePin(null)}
          className="absolute right-[8%] sm:right-[16%] top-[16%] sm:top-[18%] z-20 cursor-pointer"
        >
          <div className="relative flex flex-col items-center">
            {/* Glassmorphic Pill */}
            <div
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl transition-all duration-300 ${
                activePin === "corporate"
                  ? "scale-105 border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/20"
                  : "border-border/80 hover:border-emerald-500/60"
              }`}
            >
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Briefcase className="size-4 sm:size-4.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">
                    Direct Corporate Placement
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  120+ Vetted Enterprise Partners
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line */}
            <div className="h-7 sm:h-12 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-500/60 to-transparent" />
            <div className="size-2 rounded-full bg-emerald-500 shadow-xs ring-2 ring-background" />
          </div>
        </div>

        {/* Bottom Banner Inside Panorama */}
        <div className="absolute bottom-4 left-4 right-4 z-20 hidden sm:flex items-center justify-between text-xs font-mono text-muted-foreground bg-card/85 dark:bg-card/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border/80 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-foreground">Authentic Campus Network</span>
            <span>•</span>
            <span>Tied to Official Student & Alumni Records</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Zero Public Web Scraping</span>
            <span className="text-primary font-bold">100% PRIVATE VAULT</span>
          </div>
        </div>
      </div>

      {/* Auto-Updating Live Monospace Campus Ticker */}
      <div className="relative z-10 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-border/80 bg-muted/40 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                LIVE DISPATCH
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-foreground truncate">
              <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
                [{currentTicker.tag}]
              </span>
              <span className="truncate">{currentTicker.text}</span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-muted-foreground shrink-0 self-end sm:self-auto">
            {currentTicker.time}
          </span>
        </div>
      </div>
    </div>
  );
}
