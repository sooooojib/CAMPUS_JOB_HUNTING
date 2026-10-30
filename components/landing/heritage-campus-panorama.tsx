"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Zap,
  ArrowRight,
  Lock,
  CheckCircle2,
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

interface PinDetail {
  id: "gateway" | "alumni" | "corporate";
  badge: string;
  title: string;
  tagline: string;
  stats: { label: string; value: string }[];
  ctaText: string;
  ctaHref: string;
}

const PIN_DETAILS: Record<string, PinDetail> = {
  gateway: {
    id: "gateway",
    badge: "Office of the Registrar",
    title: "Central Academic Registry",
    tagline:
      "Direct integration with Jagannath University official records. Academic credentials, CGPA records, and enrollment status are validated at the institutional source.",
    stats: [
      { label: "Active Student Records", value: "12,540 Verified" },
      { label: "Verification Source", value: "Registrar Database" },
      { label: "Data Protection", value: "Zero Public Scraping" },
    ],
    ctaText: "Verify Your University Profile",
    ctaHref: "/register",
  },
  alumni: {
    id: "alumni",
    badge: "Alumni Association Network",
    title: "Distinguished Alumni Mentorship",
    tagline:
      "A trusted bridge between graduates and current students. Connect with senior alumni working across multinational software firms, commercial banks, and research institutes.",
    stats: [
      { label: "Mentors in Leading Tech", value: "450+ Active" },
      { label: "Open Referral Slots", value: "14 This Week" },
      { label: "Primary Sectors", value: "Tech, Finance & MNCs" },
    ],
    ctaText: "Connect with Alumni Mentors",
    ctaHref: "/register",
  },
  corporate: {
    id: "corporate",
    badge: "Institutional Placement",
    title: "Direct Corporate Placement Drives",
    tagline:
      "Official university career partnerships. Vetted partner employers receive curated, consent-gated candidate rosters for exclusive campus recruitment rounds.",
    stats: [
      { label: "Accredited Partners", value: "120+ Employers" },
      { label: "Hiring Pipeline", value: "Fall '26 Cohort" },
      { label: "Interview Format", value: "Direct Priority Slots" },
    ],
    ctaText: "Explore Placement Drives",
    ctaHref: "/register",
  },
};

export function HeritageCampusPanorama() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-cycle the ticker every 3.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleCardMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setHoveredPin(null);
  };

  const handlePinMouseEnter = (pinId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredPin(pinId);
  };

  const handlePinMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredPin(null);
    }, 240);
  };

  const handleDrawerMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDrawerMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredPin(null);
    }, 240);
  };

  const currentTicker = LIVE_TICKER_ITEMS[tickerIndex];
  const activeDetail = hoveredPin ? PIN_DETAILS[hoveredPin] : null;

  return (
    <div
      ref={cardRef}
      onMouseLeave={handleCardMouseLeave}
      className="relative w-full max-w-5xl mx-auto rounded-[2.5rem] sm:rounded-[3rem] border border-border/70 bg-card shadow-xl hover:shadow-2xl overflow-hidden select-none transition-all duration-500 ease-out"
    >
      {/* Top Heritage Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4.5 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img
            src="/images/jnu-crest.png"
            alt="Jagannath University"
            className="size-7 object-contain hover:scale-110 hover:rotate-6 transition-transform duration-300 cursor-pointer"
          />
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
              <span>Jagannath University Administrative Core</span>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:scale-105 hover:bg-primary/20 transition-all cursor-default">
                Est. 2005
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Heritage Campus Gateway • Verified Academic & Career Nexus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/40 hover:bg-muted/70 hover:border-emerald-500/50 hover:shadow-sm px-3 py-1.5 rounded-full border border-border/50 transition-all duration-300 cursor-default">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span className="font-semibold text-foreground">Registrar Validated Community</span>
        </div>
      </div>

      {/* Main Photographic Heritage Stage */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] max-h-[580px] overflow-hidden">
        {/* Real High-Resolution Photo of Jagannath University Building */}
        <img
          src="/images/jnu-building.jpg"
          alt="Jagannath University Heritage Building"
          className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-95 dark:brightness-85 pointer-events-none"
        />

        {/* Ambient Gradient Overlays for Theme Harmonization */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-card/30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-card/10 to-card/45 pointer-events-none" />

        {/* ========================================================= */}
        {/* REFINED ARCHITECTURAL MILESTONE PINS                     */}
        {/* ========================================================= */}

        {/* PIN 1: Over Grand Archway / Center Gateway */}
        <div
          onMouseEnter={() => handlePinMouseEnter("gateway")}
          onMouseLeave={handlePinMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-[30%] sm:top-[26%] z-20 cursor-pointer p-2"
        >
          <div className="relative flex flex-col items-center">
            {/* The Glassmorphic Milestone Pill */}
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border bg-card/95 backdrop-blur-xl shadow-xl transition-all duration-300 ${
                hoveredPin === "gateway"
                  ? "scale-105 border-primary ring-4 ring-primary/20 shadow-primary/30"
                  : "border-border/70 hover:border-primary/60 hover:scale-102"
              }`}
            >
              <div className="flex size-7.5 items-center justify-center rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0">
                <Building2 className="size-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">
                    Central Registrar Gateway
                  </span>
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  12,500+ Verified Students
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line with Soft Beacon */}
            <div className="h-6 sm:h-9 w-[2px] bg-gradient-to-b from-primary via-blue-500/60 to-transparent" />
            <div className="size-2 rounded-full bg-blue-500 shadow-sm ring-2 ring-background" />
          </div>
        </div>

        {/* PIN 2: Over Left Wing / Alumni Mentorship Network */}
        <div
          onMouseEnter={() => handlePinMouseEnter("alumni")}
          onMouseLeave={handlePinMouseLeave}
          className="absolute left-[6%] sm:left-[14%] top-[14%] sm:top-[16%] z-20 cursor-pointer p-2"
        >
          <div className="relative flex flex-col items-center">
            {/* Glassmorphic Pill */}
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border bg-card/95 backdrop-blur-xl shadow-xl transition-all duration-300 ${
                hoveredPin === "alumni"
                  ? "scale-105 border-amber-500 ring-4 ring-amber-500/20 shadow-amber-500/30"
                  : "border-border/70 hover:border-amber-500/60 hover:scale-102"
              }`}
            >
              <div className="flex size-7.5 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                <GraduationCap className="size-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">
                    Alumni Mentorship Network
                  </span>
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  450+ Mentors Across Top Tech
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line with Soft Beacon */}
            <div className="h-7 sm:h-12 w-[2px] bg-gradient-to-b from-amber-500 via-amber-500/60 to-transparent" />
            <div className="size-2 rounded-full bg-amber-500 shadow-sm ring-2 ring-background" />
          </div>
        </div>

        {/* PIN 3: Over Right Wing / Corporate Placement Drives */}
        <div
          onMouseEnter={() => handlePinMouseEnter("corporate")}
          onMouseLeave={handlePinMouseLeave}
          className="absolute right-[6%] sm:right-[14%] top-[14%] sm:top-[16%] z-20 cursor-pointer p-2"
        >
          <div className="relative flex flex-col items-center">
            {/* Glassmorphic Pill */}
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border bg-card/95 backdrop-blur-xl shadow-xl transition-all duration-300 ${
                hoveredPin === "corporate"
                  ? "scale-105 border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/30"
                  : "border-border/70 hover:border-emerald-500/60 hover:scale-102"
              }`}
            >
              <div className="flex size-7.5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Briefcase className="size-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-foreground">
                    Direct Corporate Placement
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  120+ Vetted Enterprise Partners
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line with Soft Beacon */}
            <div className="h-7 sm:h-12 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-500/60 to-transparent" />
            <div className="size-2 rounded-full bg-emerald-500 shadow-sm ring-2 ring-background" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* LOWER FOG FLANK WIDGETS (Shown when unhovered)            */}
        {/* ========================================================= */}
        {!activeDetail && (
          <>
            {/* Widget 1: Referral Velocity (Tactile Interactive Micro-UI) */}
            <div className="group/velocity cursor-pointer absolute bottom-5 left-5 sm:bottom-6 sm:left-7 z-20 hidden md:flex items-center gap-3 bg-card/90 dark:bg-card/95 backdrop-blur-xl border border-border/70 hover:border-amber-500/70 rounded-full px-5 py-2.5 shadow-lg hover:shadow-[0_12px_32px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition-all duration-300">
              <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 group-hover/velocity:bg-amber-500/25 group-hover/velocity:scale-115 group-hover/velocity:rotate-12 group-hover/velocity:shadow-[0_0_16px_rgba(245,158,11,0.5)] transition-all duration-300">
                <Zap className="size-4 group-hover/velocity:fill-amber-500 transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground group-hover/velocity:text-amber-500 transition-colors">
                    Referral Velocity
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 group-hover/velocity:scale-110 group-hover/velocity:font-bold transition-transform">
                    94% Shortlist
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-foreground">38 Placements Active</span>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 w-[94%] group-hover/velocity:w-full group-hover/velocity:shadow-[0_0_10px_rgba(16,185,129,0.8)] rounded-full transition-all duration-700 ease-out" />
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Campus Hiring Drives (Tactile Interactive Micro-UI) */}
            <div className="group/drives cursor-pointer absolute bottom-5 right-5 sm:bottom-6 sm:right-7 z-20 hidden md:flex items-center gap-3 bg-card/90 dark:bg-card/95 backdrop-blur-xl border border-border/70 hover:border-emerald-500/70 rounded-full px-5 py-2.5 shadow-lg hover:shadow-[0_12px_32px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 transition-all duration-300">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover/drives:bg-emerald-500/25 group-hover/drives:scale-115 group-hover/drives:-rotate-12 group-hover/drives:shadow-[0_0_16px_rgba(16,185,129,0.5)] transition-all duration-300">
                <Briefcase className="size-4 group-hover/drives:fill-emerald-500/30 transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground group-hover/drives:text-emerald-500 transition-colors">
                    Campus Hiring Drives
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse group-hover/drives:scale-150 transition-transform" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-foreground">
                  <span className="bg-muted hover:bg-emerald-500 hover:text-white px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 hover:scale-110 shadow-xs cursor-pointer">
                    Optimizely
                  </span>
                  <span className="bg-muted hover:bg-emerald-500 hover:text-white px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 hover:scale-110 shadow-xs cursor-pointer">
                    bKash
                  </span>
                  <span className="bg-muted hover:bg-emerald-500 hover:text-white px-2 py-0.5 rounded-full text-[11px] transition-all duration-200 hover:scale-110 shadow-xs cursor-pointer">
                    Brain Station
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* HUMAN EDITORIAL DOSSIER (Replaces AI Looking Template)    */}
        {/* ========================================================= */}
        {activeDetail && (
          <div
            onMouseEnter={handleDrawerMouseEnter}
            onMouseLeave={handleDrawerMouseLeave}
            className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-6 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
          >
            <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-border/80 bg-card/95 dark:bg-card/98 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {activeDetail.badge}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    {activeDetail.title}
                  </h4>
                </div>

                <Link
                  href={activeDetail.ctaHref}
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-all shadow-xs self-start sm:self-auto"
                >
                  <span>{activeDetail.ctaText}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeDetail.tagline}
              </p>

              {/* Clean Academic Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {activeDetail.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/40 p-3.5 rounded-2xl border border-border/60 space-y-1"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto-Updating Live Monospace Campus Ticker */}
      <div className="relative z-20 px-5 py-3.5 sm:px-7 sm:py-4 border-t border-border/60 bg-muted/40 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
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
