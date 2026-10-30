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
    badge: "Registrar Validated • Official Records",
    icon: GraduationCap,
    color: "blue",
    borderActive:
      "border-blue-500/80 ring-2 ring-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.18)] bg-card",
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
      "Department chairs and faculty advisors endorse high-performing students, thesis researchers, and fellowship candidates with institutional seals.",
    badge: "Faculty Endorsed • Academic Seal",
    icon: ShieldCheck,
    color: "purple",
    borderActive:
      "border-purple-500/80 ring-2 ring-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.18)] bg-card",
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
      "Students connect directly with Jagannath University alumni across technology, commercial banking, and multinational firms for internal recommendations.",
    badge: "Alumni Endorsed • Internal Referral",
    icon: Award,
    color: "amber",
    borderActive:
      "border-amber-500/80 ring-2 ring-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.18)] bg-card",
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
      "Partner corporations receive verified candidate dossiers through secure, consent-gated links, shortlisting candidates for direct interviews.",
    badge: "Corporate Placement • Priority Round",
    icon: Building2,
    color: "emerald",
    borderActive:
      "border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.18)] bg-card",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    badgeBg:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-500",
  },
];

export function ProcessConduit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Exact user activation threshold:
      // When the section header arrives in the upper third of the viewport (Image 2 view)
      // Before reaching this point: NO animation, progress is 0, station 1 is resting
      const activationPoint = windowHeight * 0.35;

      if (rect.top > activationPoint) {
        setProgress(0);
        setActiveStep(0);
        return;
      }

      // Smooth progression as user scrolls through the section
      const scrollRange = rect.height * 0.8;
      const scrolled = activationPoint - rect.top;
      const p = Math.min(Math.max(scrolled / scrollRange, 0), 1);

      setProgress(p);

      if (p < 0.28) {
        setActiveStep(0);
      } else if (p < 0.58) {
        setActiveStep(1);
      } else if (p < 0.85) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          <span>Verified Pipeline</span>
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="text-muted-foreground font-semibold">
            Stage 0{activeStep + 1} of 04 Active
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          How the Campus Network Accelerates Careers
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Every stage of your career transition is backed by official university verification and genuine alumni advocacy.
        </p>
      </div>

      {/* Desktop Horizontal Conduit Line - Mathematically Anchored to Card Centers */}
      <div className="hidden lg:block relative mx-auto max-w-7xl px-4">
        {/* Track spanning exactly between the 1st card center (12.5%) and 4th card center (87.5%) */}
        <div className="relative mx-[12.5%] h-2 bg-border/60 rounded-full overflow-hidden">
          {/* Luminous Fill - Strictly Scroll-Driven */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-emerald-500 shadow-[0_0_16px_rgba(59,130,246,0.7)] transition-all duration-300 ease-out"
            style={{ width: `${Math.max(progress * 100, 2)}%` }}
          />
        </div>

        {/* 4 Node Waypoint Anchors Exactly Above Card Centers */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-around pointer-events-none px-4">
          {STATIONS.map((station, i) => {
            const isCompletedOrActive = activeStep >= i;
            const isCurrent = activeStep === i;
            return (
              <div
                key={station.id}
                className={`relative flex items-center justify-center size-6 rounded-full border-2 bg-card transition-all duration-300 ${
                  isCurrent
                    ? `${station.dotColor} border-background scale-130 shadow-lg ring-4 ring-primary/25`
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

      {/* The 4 Station Cards - With Organic Roundness & Clear Hierarchy */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATIONS.map((station, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep > idx;

          return (
            <div
              key={station.id}
              className={`rounded-[2rem] sm:rounded-[2.5rem] border p-7 transition-all duration-500 flex flex-col justify-between ${
                isActive
                  ? `${station.borderActive} scale-102 opacity-100`
                  : isPassed
                  ? "border-border/70 bg-card/60 opacity-75"
                  : "border-border/50 bg-card/40 opacity-45"
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
