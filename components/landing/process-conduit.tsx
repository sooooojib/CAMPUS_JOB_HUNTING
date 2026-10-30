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
      "Academic standing, CGPA records, and enrollment status are verified against official registrar databases. Zero fake claims.",
    badge: "ID Verified • Registrar Synced",
    icon: GraduationCap,
    color: "blue",
    borderActive:
      "border-blue-500/80 ring-2 ring-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.18)] bg-card",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    badgeBg:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    dotColor: "bg-blue-500",
  },
  {
    id: 1,
    station: "Station 02",
    title: "Faculty Academic Endorsement",
    description:
      "Department chairs and professors endorse top student talents, research assistants, and fellowship candidates with verifiable seals.",
    badge: "Faculty Endorsed • Academic Seal",
    icon: ShieldCheck,
    color: "purple",
    borderActive:
      "border-purple-500/80 ring-2 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.18)] bg-card",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    badgeBg:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    dotColor: "bg-purple-500",
  },
  {
    id: 2,
    station: "Station 03",
    title: "Alumni Referral Exchange",
    description:
      "Students connect directly with Jagannath University alumni working in tech, banking, and government for internal referral pitches.",
    badge: "Internal Referral • 1-on-1 Pitch",
    icon: Award,
    color: "amber",
    borderActive:
      "border-amber-500/80 ring-2 ring-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.18)] bg-card",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    badgeBg:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dotColor: "bg-amber-500",
  },
  {
    id: 3,
    station: "Station 04",
    title: "Vetted Employer Placement",
    description:
      "Partner corporations receive candidate portfolios through consent-gated links, shortlisting candidates for priority interview rounds.",
    badge: "Interview Shortlisted • Priority Slot",
    icon: Building2,
    color: "emerald",
    borderActive:
      "border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.18)] bg-card",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    badgeBg:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-500",
  },
];

export function ProcessConduit() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.25);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when top enters 75% of viewport; complete when section center is reached
      const start = windowHeight * 0.75;
      const end = windowHeight * 0.15;
      const totalDistance = start - end;
      const currentDistance = start - rect.top;

      const p = Math.min(Math.max(currentDistance / totalDistance, 0.1), 1);
      setProgress(p);

      // Determine active station from scroll position
      if (p < 0.3) setActiveStep(0);
      else if (p < 0.55) setActiveStep(1);
      else if (p < 0.8) setActiveStep(2);
      else setActiveStep(3);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentActive = hoveredStep !== null ? hoveredStep : activeStep;

  return (
    <div ref={sectionRef} className="space-y-10">
      {/* Desktop Horizontal Glowing Laser Conduit */}
      <div className="hidden lg:block relative mx-auto max-w-5xl px-8">
        {/* Background Track */}
        <div className="h-2 w-full bg-border/60 rounded-full overflow-hidden" />

        {/* Luminous Progress Laser Line */}
        <div
          className="absolute top-0 left-8 h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-emerald-500 shadow-[0_0_16px_rgba(59,130,246,0.7)] transition-all duration-300 ease-out"
          style={{ width: `calc(${progress * 100}% - 4rem)` }}
        />

        {/* Station Node Anchors */}
        <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 flex justify-between pointer-events-none">
          {STATIONS.map((station, i) => {
            const isCompletedOrActive = currentActive >= i;
            const isCurrent = currentActive === i;
            return (
              <div
                key={station.id}
                className={`relative flex items-center justify-center size-6 rounded-full border-2 bg-card transition-all duration-300 ${
                  isCurrent
                    ? `${station.dotColor} border-background scale-130 shadow-lg ring-4 ring-primary/20`
                    : isCompletedOrActive
                    ? `${station.dotColor} border-background scale-110`
                    : "border-border bg-muted scale-95"
                }`}
              >
                {isCurrent && (
                  <span className="size-2 rounded-full bg-white animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* The 4 Station Cards - With Organic Human Roundness */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATIONS.map((station, idx) => {
          const isActive = currentActive === idx;
          const isPassed = currentActive > idx;

          return (
            <div
              key={station.id}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`rounded-[2rem] sm:rounded-[2.5rem] border p-7 transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? `${station.borderActive} scale-102 opacity-100`
                  : isPassed
                  ? "border-border/70 bg-background/80 opacity-80"
                  : "border-border/50 bg-background/50 opacity-45 hover:opacity-85 hover:scale-100"
              }`}
            >
              <div>
                {/* Station Icon & Number */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                      isActive
                        ? station.iconBg
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <station.icon className="size-6" />
                  </div>

                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full">
                    {station.station}
                  </span>
                </div>

                {/* Station Title */}
                <h3
                  className={`text-base font-bold transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {station.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  {station.description}
                </p>
              </div>

              {/* Station Badge (Active Indicator) */}
              <div className="pt-5 mt-5 border-t border-border/40">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold border transition-all duration-300 ${
                    isActive
                      ? `${station.badgeBg} shadow-xs`
                      : "bg-muted/50 text-muted-foreground/70 border-border/40"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      isActive ? station.dotColor : "bg-muted-foreground/50"
                    } ${isActive ? "animate-pulse" : ""}`}
                  />
                  <span>{station.badge}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
