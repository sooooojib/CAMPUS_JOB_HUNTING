"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowUpRight,
  Terminal,
  Activity,
  Award,
  Users,
  Briefcase,
  Zap,
} from "lucide-react";

const LIVE_ACTIVITIES = [
  { time: "Just now", text: "Alumni '18 (Lead Eng @ Tech Corp) approved referral for CSE '25", tag: "REFERRAL" },
  { time: "2m ago", text: "Brain Station 23 shortlisted 4 JNU software engineering candidates", tag: "SHORTLIST" },
  { time: "5m ago", text: "Registrar verified academic credentials for student #2022-83-014", tag: "VERIFIED" },
  { time: "9m ago", text: "Dr. A. Rahman (Faculty Chair) endorsed 3 research applicants", tag: "ENDORSE" },
  { time: "14m ago", text: "Optimizely posted 2 exclusive campus intern positions", tag: "OPPORTUNITY" },
];

export function BentoCommandCenter() {
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  // Cycle the live terminal activity every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentActivity = LIVE_ACTIVITIES[activeActivityIndex];

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Background Radial Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 via-primary/10 to-indigo-500/15 blur-3xl pointer-events-none rounded-3xl" />

      {/* 4-Cell Asymmetric Bento Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3.5 z-10">
        {/* ========================================================= */}
        {/* CELL 1: Live Referral & Dispatch Ticker (Monospace Feed)  */}
        {/* ========================================================= */}
        <div className="sm:col-span-2 group relative p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10 overflow-hidden">
          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-primary to-blue-500 opacity-60" />

          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-bold text-foreground tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="size-3 text-emerald-500" />
                Live Referral Feed
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border">
              JNU_NET • ACTIVE
            </span>
          </div>

          {/* Cycling Live Event Line */}
          <div className="pt-3 flex items-start gap-2.5 min-h-[52px]">
            <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
              {currentActivity.tag}
            </span>
            <div className="flex-1">
              <p className="text-xs font-mono text-foreground leading-relaxed transition-all duration-300">
                {currentActivity.text}
              </p>
              <span className="text-[10px] font-mono text-muted-foreground">
                {currentActivity.time}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CELL 2: CGPA & Skill Matcher (Circular Score Gauge)       */}
        {/* ========================================================= */}
        <div className="group relative p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
                <Sparkles className="size-3.5" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Eligibility Match</h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
              AUTO-EVAL
            </span>
          </div>

          {/* Circular Progress Gauge */}
          <div className="my-3 flex items-center justify-center gap-4">
            <div className="relative size-20 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-muted/40 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* 92% Progress Arc */}
                <path
                  className="text-primary stroke-current"
                  strokeWidth="3.5"
                  strokeDasharray="92, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-extrabold text-foreground tracking-tight">
                  92%
                </span>
                <span className="text-[8px] font-mono text-muted-foreground uppercase">
                  Match
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3 shrink-0" />
                <span>CGPA 3.82 ≥ 3.50</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="size-3 shrink-0" />
                <span>Full-Stack Verified</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <CheckCircle2 className="size-3 shrink-0 text-muted-foreground" />
                <span>JNU Dept. of CSE</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Verified Candidate</span>
            <span className="text-emerald-500 font-bold">READY TO APPLY</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CELL 3: The Identity Vault (0% Scraping • Privacy)        */}
        {/* ========================================================= */}
        <div className="group relative p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:shadow-amber-500/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex size-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                <Lock className="size-3.5" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Private Vault</h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              LOCKED
            </span>
          </div>

          <div className="my-2.5 space-y-2">
            <div className="p-2 rounded-xl bg-background/80 border border-border/60">
              <div className="flex items-center justify-between text-[11px] font-bold text-foreground mb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Zero Public Scraping
                </span>
                <span className="text-[10px] font-mono text-emerald-500">ENFORCED</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Candidate resumes & CGPAs are only accessible by verified campus recruiters upon explicit consent.
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1">
              <span>Access Expiry</span>
              <span className="font-bold text-foreground">900s Signed Token</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Registrar Gated</span>
            <span className="text-primary font-bold">INSTITUTIONAL</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CELL 4: Top Alumni Spotlight & Mentorship Bridge          */}
        {/* ========================================================= */}
        <div className="sm:col-span-2 group relative p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-lg bg-purple-500/15 text-purple-500">
                <Award className="size-3.5" />
              </div>
              <h4 className="text-xs font-bold text-foreground">
                Alumni Mentorship & Referral Network
              </h4>
            </div>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
              450+ PARTNERS
            </span>
          </div>

          {/* Featured Alumni Micro-Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
            {/* Alumni 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-background/80 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                  NI
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">Nadia Islam</span>
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Lead Eng @ Tech Corp (JNU &apos;18)</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                1 Slot Open
              </span>
            </div>

            {/* Alumni 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-background/80 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                  TH
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">Tanvir Hasan</span>
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Product Lead @ bKash (JNU &apos;16)</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
                Mentoring
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Grounding Institution Watermark */}
      <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <img
            src="/images/jnu-crest.png"
            alt="Jagannath University"
            className="size-3.5 object-contain"
          />
          <span>জগন্নাথ বিশ্ববিদ্যালয় • Institutional Career Gateway</span>
        </div>
        <span className="text-emerald-500 font-bold">100% VERIFIED</span>
      </div>
    </div>
  );
}

