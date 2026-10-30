"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Building2,
} from "lucide-react";

const STATIONS = [
  {
    id: 0,
    station: "Station 01",
    title: "Registrar Credential Validation",
    description:
      "Academic standing, CGPA records, and enrollment status are validated against official university registrar records. Zero unverified claims.",
    shortBadge: "Registrar Validated",
    icon: GraduationCap,
    color: "blue",
    borderActive:
      "border-blue-500/80 ring-2 ring-blue-500/20 shadow-[0_12px_40px_rgba(59,130,246,0.22)] bg-card",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    badgeBg:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    nodeBg: "bg-blue-600 text-white",
    nodeBorder: "border-blue-400",
    nodeGlow: "shadow-[0_0_24px_rgba(59,130,246,0.7)] ring-4 ring-blue-500/25",
    dotColor: "bg-blue-600",
  },
  {
    id: 1,
    station: "Station 02",
    title: "Faculty Academic Endorsement",
    description:
      "Department chairs and faculty advisors endorse high-performing students, thesis researchers, and fellowship candidates with institutional seals.",
    shortBadge: "Faculty Endorsed",
    icon: ShieldCheck,
    color: "purple",
    borderActive:
      "border-purple-500/80 ring-2 ring-purple-500/20 shadow-[0_12px_40px_rgba(168,85,247,0.22)] bg-card",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    badgeBg:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    nodeBg: "bg-purple-600 text-white",
    nodeBorder: "border-purple-400",
    nodeGlow: "shadow-[0_0_24px_rgba(168,85,247,0.7)] ring-4 ring-purple-500/25",
    dotColor: "bg-purple-600",
  },
  {
    id: 2,
    station: "Station 03",
    title: "Alumni Referral Exchange",
    description:
      "Students connect directly with Jagannath University alumni across technology, commercial banking, and multinational firms for internal recommendations.",
    shortBadge: "Alumni Referral",
    icon: Award,
    color: "amber",
    borderActive:
      "border-amber-500/80 ring-2 ring-amber-500/20 shadow-[0_12px_40px_rgba(245,158,11,0.22)] bg-card",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    badgeBg:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    nodeBg: "bg-amber-600 text-white",
    nodeBorder: "border-amber-400",
    nodeGlow: "shadow-[0_0_24px_rgba(245,158,11,0.7)] ring-4 ring-amber-500/25",
    dotColor: "bg-amber-600",
  },
  {
    id: 3,
    station: "Station 04",
    title: "Vetted Employer Placement",
    description:
      "Partner corporations receive verified candidate dossiers through secure, consent-gated links, shortlisting candidates for direct interviews.",
    shortBadge: "Corporate Placement",
    icon: Building2,
    color: "emerald",
    borderActive:
      "border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-[0_12px_40px_rgba(16,185,129,0.22)] bg-card",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    badgeBg:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    nodeBg: "bg-emerald-600 text-white",
    nodeBorder: "border-emerald-400",
    nodeGlow: "shadow-[0_0_24px_rgba(16,185,129,0.7)] ring-4 ring-emerald-500/25",
    dotColor: "bg-emerald-600",
  },
];

// Discrete fill percentages anchored strictly to the 4 round points:
// Station 1 = 0% (anchored at Node 1)
// Station 2 = 33.333% (anchored at Node 2)
// Station 3 = 66.666% (anchored at Node 3)
// Station 4 = 100% (anchored at Node 4)
const STEP_FILL_PERCENTAGES = [0, 33.333, 66.666, 100];

export function ProcessConduit() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current || !stickyRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 640 ? 96 : 80;

      // Total distance the section remains pinned in view:
      const stickyHeight = stickyRef.current.offsetHeight;
      const totalPinnedDistance = rect.height - stickyHeight;
      if (totalPinnedDistance <= 0) return;

      const scrolledDistance = stickyTop - rect.top;

      // Before lock position is reached: Station 1 is resting
      if (scrolledDistance <= 0) {
        setActiveStep(0);
        return;
      }

      // Discrete step calculation across 4 equal zones
      // Only stopping points are the round nodes (0, 1, 2, 3) — zero in-between stops!
      const p = Math.min(Math.max(scrolledDistance / totalPinnedDistance, 0), 1);

      if (p < 0.25) {
        setActiveStep(0);
      } else if (p < 0.50) {
        setActiveStep(1);
      } else if (p < 0.75) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const targetFill = STEP_FILL_PERCENTAGES[activeStep];

  return (
    <div ref={trackRef} className="relative h-[180vh] sm:h-[210vh]">
      {/* Locked Sticky Showcase Window */}
      <div ref={stickyRef} className="sticky top-20 sm:top-24 z-10 space-y-6 sm:space-y-8 py-3 sm:py-5">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-1">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How the Campus Network Accelerates Careers
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Every stage of your career transition is backed by official university verification and genuine alumni advocacy.
          </p>
        </div>

        {/* Desktop Waypoint Rail & Interactive Nodes */}
        <div className="hidden lg:block relative mx-auto max-w-7xl px-4 h-12 flex items-center mb-6">
          {/* Laser Track spanning between Column 1 Center (12.5%) and Column 4 Center (87.5%) */}
          <div className="absolute inset-x-[12.5%] top-1/2 -translate-y-1/2 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            {/* Luminous Fill - Glides smoothly between round nodes with zero in-between stopping */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-emerald-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${Math.max(targetFill, 4)}%` }}
            />
          </div>

          {/* 4 Node Waypoint Anchors placed directly in 4 grid columns to align with cards */}
          <div className="relative z-10 grid grid-cols-4 gap-4 px-4 w-full pointer-events-auto">
            {STATIONS.map((station, i) => {
              const isCurrent = activeStep === i;
              const isPassed = activeStep > i;

              return (
                <div key={station.id} className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStep(i)}
                    aria-label={`Jump to ${station.station}`}
                    className={`relative flex items-center justify-center size-8 rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                      isCurrent
                        ? `${station.nodeBg} ${station.nodeBorder} ${station.nodeGlow} scale-125 z-20`
                        : isPassed
                        ? "bg-primary border-primary text-white scale-105 shadow-sm z-10"
                        : "bg-card border-border/80 text-muted-foreground scale-95"
                    }`}
                  >
                    {isCurrent ? (
                      <span className="size-2.5 rounded-full bg-white shadow-sm" />
                    ) : isPassed ? (
                      <span className="size-2 rounded-full bg-white/90" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* The 4 Station Cards - With Organic Roundness & 100% Contained Content */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATIONS.map((station, idx) => {
            const isActive = activeStep === idx;
            const isPassed = activeStep > idx;

            return (
              <div
                key={station.id}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-[2rem] border p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden relative ${
                  isActive
                    ? `${station.borderActive} opacity-100 ring-2 ring-primary/30 shadow-xl`
                    : isPassed
                    ? "border-border/70 bg-card/60 opacity-75"
                    : "border-border/40 bg-card/30 opacity-45"
                }`}
              >
                <div className="space-y-3.5">
                  {/* Station Icon & Number */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-2xl transition-all duration-500 ${
                        isActive
                          ? station.iconBg
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <station.icon className="size-5.5" />
                    </div>

                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border/40">
                      {station.station}
                    </span>
                  </div>

                  {/* Station Title */}
                  <h3
                    className={`text-base font-bold transition-colors duration-500 leading-snug ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {station.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {station.description}
                  </p>
                </div>

                {/* Station Verification Footer — 100% Contained, Never Overflows */}
                <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        isActive ? station.dotColor : "bg-muted-foreground/30"
                      } ${isActive ? "animate-pulse" : ""}`}
                    />
                    <span className="font-mono text-[11px] font-semibold text-foreground/85 truncate">
                      {station.shortBadge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/50 shrink-0">
                    Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
