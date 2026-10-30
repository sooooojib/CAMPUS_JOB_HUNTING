"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Award,
  Building2,
  BookOpen,
  Sparkles,
  Lock,
  ArrowUpRight,
} from "lucide-react";

export function IsometricCampusHero() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-xl mx-auto py-8 sm:py-12 flex items-center justify-center select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-blue-500/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Main Container with 3D Perspective */}
      <div className="relative w-full flex items-center justify-between gap-2 sm:gap-6">
        {/* Isometric 3-Layer Stage */}
        <div
          className="relative w-[280px] sm:w-[340px] h-[340px] sm:h-[400px] flex items-center justify-center transition-all duration-700"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 40%",
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(55deg) rotateZ(-32deg)",
            }}
          >
            {/* ========================================================= */}
            {/* LAYER 1 (BOTTOM): Institutional Identity & Evidence Grid  */}
            {/* ========================================================= */}
            <div
              onMouseEnter={() => setActiveLayer(1)}
              onMouseLeave={() => setActiveLayer(null)}
              className={`absolute w-56 sm:w-68 h-56 sm:h-68 rounded-3xl border transition-all duration-500 flex flex-col items-center justify-center p-4 backdrop-blur-md cursor-pointer ${
                activeLayer === 1
                  ? "border-sky-400 bg-card/95 shadow-[0_20px_50px_rgba(14,165,233,0.35)] scale-105"
                  : "border-border/80 bg-card/85 shadow-2xl hover:border-sky-400/60"
              }`}
              style={{
                transform: "translateZ(0px)",
              }}
            >
              {/* Evidence Grid of 9 Academic Micro-Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full h-full p-1.5">
                {[
                  { icon: GraduationCap, color: "text-sky-500 bg-sky-500/10" },
                  { icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
                  { icon: Award, color: "text-blue-500 bg-blue-500/10" },
                  { icon: BookOpen, color: "text-purple-500 bg-purple-500/10" },
                  { icon: Lock, color: "text-amber-500 bg-amber-500/10" },
                  { icon: Building2, color: "text-cyan-500 bg-cyan-500/10" },
                  { icon: Sparkles, color: "text-amber-500 bg-amber-500/10" },
                  { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
                  { icon: GraduationCap, color: "text-blue-500 bg-blue-500/10" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={`grid-${idx}`}
                      className={`flex items-center justify-center rounded-xl border border-border/60 ${item.color} shadow-xs transition-transform hover:scale-110`}
                    >
                      <Icon className="size-4 sm:size-5" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================= */}
            {/* LAYER 2 (MIDDLE): Jagannath University Core Crest Nexus    */}
            {/* ========================================================= */}
            <div
              onMouseEnter={() => setActiveLayer(2)}
              onMouseLeave={() => setActiveLayer(null)}
              className={`absolute w-56 sm:w-68 h-56 sm:h-68 rounded-3xl border transition-all duration-500 flex flex-col items-center justify-center p-4 backdrop-blur-xl cursor-pointer ${
                activeLayer === 2
                  ? "border-primary bg-card/95 shadow-[0_25px_60px_rgba(59,130,246,0.45)] scale-105"
                  : "border-primary/40 bg-card/90 shadow-2xl hover:border-primary"
              }`}
              style={{
                transform: "translateZ(85px)",
              }}
            >
              {/* Concentric Glowing Ring Aperture */}
              <div className="relative flex items-center justify-center size-32 sm:size-38 rounded-full border border-primary/40 bg-primary/5 shadow-inner">
                {/* Rotating Dashed Orbit */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-primary/50 animate-[spin_30s_linear_infinite]" />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/20 via-primary/30 to-amber-500/20 blur-md pointer-events-none" />

                {/* The Official Jagannath University Crest */}
                <div className="relative size-20 sm:size-24 flex items-center justify-center">
                  <img
                    src="/images/jnu-crest.png"
                    alt="Jagannath University Crest"
                    className="w-full h-full object-contain drop-shadow-lg filter brightness-105"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* LAYER 3 (TOP): Verified Career Outcomes & Referrals Card   */}
            {/* ========================================================= */}
            <div
              onMouseEnter={() => setActiveLayer(3)}
              onMouseLeave={() => setActiveLayer(null)}
              className={`absolute w-56 sm:w-68 h-56 sm:h-68 rounded-3xl border transition-all duration-500 flex flex-col justify-between p-4 sm:p-5 backdrop-blur-xl cursor-pointer ${
                activeLayer === 3
                  ? "border-emerald-400 bg-card/95 shadow-[0_30px_70px_rgba(16,185,129,0.4)] scale-105"
                  : "border-border/80 bg-card/90 shadow-2xl hover:border-emerald-400/60"
              }`}
              style={{
                transform: "translateZ(170px)",
              }}
            >
              <div className="space-y-2.5 sm:space-y-3 w-full">
                {/* Outcome Item 1 */}
                <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-500 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-bold text-foreground truncate">
                    Alumni Referral Active
                  </span>
                </div>

                {/* Outcome Item 2 */}
                <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <CheckCircle2 className="size-3.5 sm:size-4 text-blue-500 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-bold text-foreground truncate">
                    Direct Campus Shortlist
                  </span>
                </div>

                {/* Outcome Item 3 */}
                <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <CheckCircle2 className="size-3.5 sm:size-4 text-purple-500 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-bold text-foreground truncate">
                    Faculty Endorsement
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>0% PUBLIC SCRAPING</span>
                <span className="text-emerald-500 font-bold">100% VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT CALLOUT LABELS (Accrely-Style Floating Pills)       */}
        {/* ========================================================= */}
        <div className="flex flex-col justify-between h-[300px] sm:h-[360px] pl-2 sm:pl-4 space-y-4 sm:space-y-6">
          {/* Callout 3 (Top - Outcomes) */}
          <div
            onMouseEnter={() => setActiveLayer(3)}
            onMouseLeave={() => setActiveLayer(null)}
            className={`group relative flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
              activeLayer === 3
                ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 translate-x-1"
                : "border-border/60 bg-card/60 hover:bg-card/90 hover:border-emerald-500/40"
            }`}
          >
            <div className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">
              3
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  Career Outcomes
                </span>
                <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                Direct referrals · Vetted roles · Private vault
              </p>
            </div>
          </div>

          {/* Callout 2 (Middle - JNU Nexus) */}
          <div
            onMouseEnter={() => setActiveLayer(2)}
            onMouseLeave={() => setActiveLayer(null)}
            className={`group relative flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
              activeLayer === 2
                ? "border-primary/60 bg-primary/10 shadow-lg shadow-primary/10 translate-x-1"
                : "border-border/60 bg-card/60 hover:bg-card/90 hover:border-primary/40"
            }`}
          >
            <div className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs shrink-0">
              2
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  JNU Community Nexus
                </span>
                <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                Official Crest · Alumni · Mentors · Industry
              </p>
            </div>
          </div>

          {/* Callout 1 (Bottom - Evidence) */}
          <div
            onMouseEnter={() => setActiveLayer(1)}
            onMouseLeave={() => setActiveLayer(null)}
            className={`group relative flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
              activeLayer === 1
                ? "border-sky-500/60 bg-sky-500/10 shadow-lg shadow-sky-500/10 translate-x-1"
                : "border-border/60 bg-card/60 hover:bg-card/90 hover:border-sky-500/40"
            }`}
          >
            <div className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0">
              1
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  Verified Identity
                </span>
                <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-sky-500 transition-colors" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                Registrar records · CGPA check · Departments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

