"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Zap,
  CheckCircle2,
  ArrowRight,
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

interface PinDetail {
  id: "gateway" | "alumni" | "corporate";
  title: string;
  tagline: string;
  color: string;
  badge: string;
  highlights: string[];
  ctaText: string;
  ctaHref: string;
}

const PIN_DETAILS: Record<string, PinDetail> = {
  gateway: {
    id: "gateway",
    title: "Central Registrar Verification Engine",
    tagline: "Synchronized directly with official Jagannath University academic registries.",
    color: "blue",
    badge: "12,540 Student Roll Numbers Synced",
    highlights: [
      "Department and session records validated against registrar database",
      "Automated CGPA threshold filtering for selective internship drives",
      "Encrypted credential vault • 0% public web scraping",
    ],
    ctaText: "Verify Your University Roll ID",
    ctaHref: "/register",
  },
  alumni: {
    id: "alumni",
    title: "Alumni Mentorship & Referral Network",
    tagline: "Direct 1-on-1 recommendations from JNU alumni working in leading enterprises.",
    color: "amber",
    badge: "450+ Active Mentors Across 42 Multinationals",
    highlights: [
      "Direct referral pitches submitted into internal company applicant queues",
      "14 verified mentors offering office hours and CV reviews this week",
      "Top placement destinations: Optimizely, bKash, Brain Station 23, Apex",
    ],
    ctaText: "Connect with Alumni Mentors",
    ctaHref: "/register",
  },
  corporate: {
    id: "corporate",
    title: "Direct Corporate Placement Gateway",
    tagline: "Gated campus interview channels without public recruiter noise.",
    color: "emerald",
    badge: "120+ Vetted Corporate Partners",
    highlights: [
      "Exclusive recruitment rounds designated specifically for JNU cohorts",
      "Expedited fast-track technical and managerial interview slots",
      "15-minute temporary signed URLs for resume reviews upon explicit consent",
    ],
    ctaText: "Explore Partner Placement Drives",
    ctaHref: "/register",
  },
};

export function HeritageCampusPanorama() {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 3D Parallax & Cursor Physics state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-cycle the ticker every 3.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (max 3.2 deg)
    const rotX = ((y - centerY) / centerY) * -3.2;
    const rotY = ((x - centerX) / centerX) * 3.2;

    setTilt({ x: rotX, y: rotY });
    setMousePos({ x, y });
    setIsHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setHoveredPin(null);
  };

  // Pure hover interaction handlers
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
    }, 180);
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
    }, 180);
  };

  const currentTicker = LIVE_TICKER_ITEMS[tickerIndex];
  const activeDetail = hoveredPin ? PIN_DETAILS[hoveredPin] : null;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleCardMouseLeave}
      className="relative w-full max-w-5xl mx-auto rounded-3xl border border-border/90 bg-card shadow-2xl overflow-hidden select-none transition-all duration-300"
      style={{
        transform: isHovered
          ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : "perspective(1200px) rotateX(0deg) rotateY(0deg)",
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Specular Radial Light Glare following Cursor */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 75%)`,
          }}
        />
      )}

      {/* Top Heritage Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border/80 bg-background/85 backdrop-blur-md">
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
      <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] max-h-[580px] overflow-hidden group">
        {/* Real High-Resolution Photo of Jagannath University Building */}
        <img
          src="/images/jnu-building.jpg"
          alt="Jagannath University Heritage Building"
          className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-95 dark:brightness-85 transition-transform duration-700 group-hover:scale-102"
        />

        {/* Ambient Gradient Overlays for Theme Harmonization */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-card/35 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-card/10 to-card/45 pointer-events-none" />

        {/* ========================================================= */}
        {/* LUMINOUS REFERRAL PATHWAY (Animated SVG Laser Beams)       */}
        {/* ========================================================= */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1000 560"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient-blue-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="gradient-amber-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow-laser" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Pathway 1: Central Gateway -> Left Alumni Wing */}
          <path
            id="path-gateway-alumni"
            d="M 500 270 Q 340 260 210 185"
            fill="none"
            stroke="url(#gradient-blue-amber)"
            strokeWidth="2"
            strokeDasharray="4 6"
            className="opacity-60"
          />

          {/* Pathway 2: Left Alumni Wing -> Right Corporate Wing */}
          <path
            id="path-alumni-corporate"
            d="M 210 185 Q 500 120 790 185"
            fill="none"
            stroke="url(#gradient-amber-emerald)"
            strokeWidth="2"
            strokeDasharray="4 6"
            className="opacity-60"
          />

          {/* Animated Traveling Luminous Energy Pulses */}
          <circle r="4" fill="#60a5fa" filter="url(#glow-laser)">
            <animateMotion
              dur="3.6s"
              repeatCount="indefinite"
              path="M 500 270 Q 340 260 210 185"
            />
          </circle>

          <circle r="4.5" fill="#34d399" filter="url(#glow-laser)">
            <animateMotion
              dur="4.4s"
              repeatCount="indefinite"
              path="M 210 185 Q 500 120 790 185"
            />
          </circle>
        </svg>

        {/* ========================================================= */}
        {/* INTERACTIVE MILESTONE PINS (Hover-Only Interaction)       */}
        {/* ========================================================= */}

        {/* PIN 1: Over Grand Archway / Center Gateway */}
        <div
          onMouseEnter={() => handlePinMouseEnter("gateway")}
          onMouseLeave={handlePinMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-[30%] sm:top-[26%] z-20 cursor-pointer group/pin"
        >
          <div className="relative flex flex-col items-center">
            {/* The Glassmorphic Milestone Pill */}
            <div
              className={`flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl transition-all duration-300 ${
                hoveredPin === "gateway"
                  ? "scale-108 border-primary ring-4 ring-primary/20 shadow-primary/30"
                  : "border-border/80 hover:border-primary/60 hover:scale-103"
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
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  12,500+ Verified Students
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line with Architectural Sonar Rings */}
            <div className="h-6 sm:h-9 w-[2px] bg-gradient-to-b from-primary via-blue-500/60 to-transparent" />

            {/* Sonar Beacon on Building Pillar */}
            <div className="relative flex items-center justify-center">
              <span className="absolute size-7 rounded-full border border-blue-500/50 animate-ping opacity-60" />
              <span className="absolute size-4 rounded-full border border-blue-400/40 animate-pulse" />
              <div className="size-2 rounded-full bg-blue-500 shadow-sm ring-2 ring-background" />
            </div>
          </div>
        </div>

        {/* PIN 2: Over Left Wing / Alumni Mentorship Network */}
        <div
          onMouseEnter={() => handlePinMouseEnter("alumni")}
          onMouseLeave={handlePinMouseLeave}
          className="absolute left-[6%] sm:left-[14%] top-[14%] sm:top-[16%] z-20 cursor-pointer group/pin"
        >
          <div className="relative flex flex-col items-center">
            {/* Glassmorphic Pill */}
            <div
              className={`flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl transition-all duration-300 ${
                hoveredPin === "alumni"
                  ? "scale-108 border-amber-500 ring-4 ring-amber-500/20 shadow-amber-500/30"
                  : "border-border/80 hover:border-amber-500/60 hover:scale-103"
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
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  450+ Mentors Across Top Tech
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line with Architectural Sonar Rings */}
            <div className="h-7 sm:h-12 w-[2px] bg-gradient-to-b from-amber-500 via-amber-500/60 to-transparent" />

            {/* Sonar Beacon on Pillar */}
            <div className="relative flex items-center justify-center">
              <span className="absolute size-7 rounded-full border border-amber-500/50 animate-ping opacity-60" />
              <span className="absolute size-4 rounded-full border border-amber-400/40 animate-pulse" />
              <div className="size-2 rounded-full bg-amber-500 shadow-sm ring-2 ring-background" />
            </div>
          </div>
        </div>

        {/* PIN 3: Over Right Wing / Corporate Placement Drives */}
        <div
          onMouseEnter={() => handlePinMouseEnter("corporate")}
          onMouseLeave={handlePinMouseLeave}
          className="absolute right-[6%] sm:right-[14%] top-[14%] sm:top-[16%] z-20 cursor-pointer group/pin"
        >
          <div className="relative flex flex-col items-center">
            {/* Glassmorphic Pill */}
            <div
              className={`flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl transition-all duration-300 ${
                hoveredPin === "corporate"
                  ? "scale-108 border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/30"
                  : "border-border/80 hover:border-emerald-500/60 hover:scale-103"
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
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  120+ Vetted Enterprise Partners
                </p>
              </div>
            </div>

            {/* Vertical Pointer Line with Architectural Sonar Rings */}
            <div className="h-7 sm:h-12 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-500/60 to-transparent" />

            {/* Sonar Beacon on Pillar */}
            <div className="relative flex items-center justify-center">
              <span className="absolute size-7 rounded-full border border-emerald-500/50 animate-ping opacity-60" />
              <span className="absolute size-4 rounded-full border border-emerald-400/40 animate-pulse" />
              <div className="size-2 rounded-full bg-emerald-500 shadow-sm ring-2 ring-background" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LOWER FOG FLANK WIDGETS (Shown when unhovered)            */}
        {/* ========================================================= */}
        {!activeDetail && (
          <>
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6 z-20 hidden md:flex items-center gap-3 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl px-4 py-2.5 shadow-lg transition-opacity duration-300">
              <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                <Zap className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                    Referral Velocity
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    94% Shortlist
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-foreground">38 Placements Active</span>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 w-[94%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-6 z-20 hidden md:flex items-center gap-3 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl px-4 py-2.5 shadow-lg transition-opacity duration-300">
              <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Briefcase className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                    Campus Hiring Drives
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-foreground">
                  <span className="bg-muted px-1.5 py-0.5 rounded text-[11px]">Optimizely</span>
                  <span className="bg-muted px-1.5 py-0.5 rounded text-[11px]">bKash</span>
                  <span className="bg-muted px-1.5 py-0.5 rounded text-[11px]">Brain Station</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* HOVER INSPECTOR TRAY (Smoothly reveals on pin hover)      */}
        {/* ========================================================= */}
        {activeDetail && (
          <div
            onMouseEnter={handleDrawerMouseEnter}
            onMouseLeave={handleDrawerMouseLeave}
            className="absolute inset-x-4 sm:inset-x-8 bottom-4 sm:bottom-6 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
          >
            <div className="rounded-2xl border border-primary/40 bg-card/95 dark:bg-card/98 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {activeDetail.badge}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Hover to Inspect
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                    {activeDetail.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {activeDetail.tagline}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5 pb-2">
                {activeDetail.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-foreground bg-muted/40 p-2.5 rounded-xl border border-border/60"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-tight text-[11px] sm:text-xs">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                  <Lock className="size-3" />
                  <span>Members-Only Encrypted Access</span>
                </span>

                <Link
                  href={activeDetail.ctaHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>{activeDetail.ctaText}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto-Updating Live Monospace Campus Ticker */}
      <div className="relative z-20 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-border/80 bg-muted/40 backdrop-blur-md">
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
