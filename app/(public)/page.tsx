import Link from "next/link";
import {
  ShieldCheck,
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  GraduationCap,
  Building2,
  FileText,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeritageCampusPanorama } from "@/components/landing/heritage-campus-panorama";
import { ProcessConduit } from "@/components/landing/process-conduit";

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================= */}
      {/* HERO SECTION: The Direct Line from Campus to Career       */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        {/* Soft Ambient Mesh Texture (Non-Sharp, Seamless) */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f608_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 z-10 space-y-12 sm:space-y-16">
          {/* Header Typography & Narrative Block */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            {/* University Identity Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300 shadow-xs backdrop-blur-md">
              <img
                src="/images/jnu-crest.png"
                alt="Jagannath University"
                className="size-4 object-contain"
              />
              <span className="font-bold">Jagannath University</span>
              <span className="text-muted-foreground/60">•</span>
              <span>Official Career Community</span>
            </div>

            {/* Authoritative Human Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-[1.1]">
              The direct line from campus to career.
            </h1>

            {/* Refined Description */}
            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
              UniCareer Community connects verified Jagannath University students, distinguished alumni mentors, and vetted employers into a private referral ecosystem. Zero public scraping. Zero recruiter spam. Just verified internal recommendations.
            </p>

            {/* Tactile Magnetic Action Buttons - Organic Human Roundness */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm px-8 py-4 shadow-md hover:bg-primary/90 transition-all hover:scale-102 hover:shadow-lg"
              >
                <span>Join the Verified Network</span>
                <ArrowRight className="size-4 ml-2" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/80 text-foreground font-semibold text-sm px-8 py-4 shadow-xs backdrop-blur-md hover:bg-muted transition-all hover:scale-102"
              >
                Member Sign In
              </Link>
            </div>

            {/* Core Integrity Pillars */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2 font-medium bg-card/60 backdrop-blur-md border border-border/50 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Registrar ID Validated</span>
              </span>
              <span className="flex items-center gap-2 font-medium bg-card/60 backdrop-blur-md border border-border/50 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Private 15-Minute Resume Vault</span>
              </span>
              <span className="flex items-center gap-2 font-medium bg-card/60 backdrop-blur-md border border-border/50 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>100% Gated Institutional Network</span>
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* THE HERITAGE CAMPUS PANORAMA & COMMUNITY PINS             */}
          {/* ========================================================= */}
          <div className="w-full">
            <HeritageCampusPanorama />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: The 4 Stations of the University Pipeline      */}
      {/* Smoothly Flowing Section with Synchronized Scroll Conduit */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-24 border-t border-border/40 bg-card/35 dark:bg-card/45 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <ProcessConduit />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: Real Institutional Numbers & Privacy Standard */}
      {/* Unified Institutional Bento Canvas (Mashed Together)     */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-24 border-t border-border/40 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {/* Single Unified Architectural Container - No Disjointed Pieces */}
          <div className="rounded-[2.5rem] sm:rounded-[3rem] border border-border/70 bg-card/80 dark:bg-card/90 backdrop-blur-xl shadow-xl overflow-hidden">
            {/* Unified Top Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-5 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-primary" />
                <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                  Institutional Integrity & Student Protection Guarantee
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                Official Jagannath University Verification Standard
              </span>
            </div>

            {/* 3 Unified Metric Columns with Elegant Dividers */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 text-center">
              {/* Column 1 */}
              <div className="p-8 sm:p-12 space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Registrar Authenticated
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight pt-1">
                  100%
                </div>
                <div className="text-sm font-bold text-foreground">
                  Registrar-Verified Members
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Every student, alumni, and faculty profile is validated against official university records. Zero fake profiles or unaccredited claims.
                </p>
              </div>

              {/* Column 2 */}
              <div className="p-8 sm:p-12 space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  100% Private Cloud Vault
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-primary pt-1">
                  0%
                </div>
                <div className="text-sm font-bold text-foreground">
                  Public Web Scraping
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Candidate resumes are stored in private cloud storage and only accessed via expiring, 15-minute signed links upon explicit student consent.
                </p>
              </div>

              {/* Column 3 */}
              <div className="p-8 sm:p-12 space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Alumni Enterprise Network
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-amber-600 dark:text-amber-400 pt-1">
                  450+
                </div>
                <div className="text-sm font-bold text-foreground">
                  Active Senior Mentors
                </div>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Spanning multinational software houses, commercial banks, government institutions, and global academic research fellowships.
                </p>
              </div>
            </div>

            {/* Bottom Security Footer inside the Container */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-4 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <Lock className="size-3.5 text-primary" />
                <span>Gated Institutional Access • Controlled by University Authorization</span>
              </span>
              <span className="font-mono text-[11px] text-foreground font-semibold">
                Registrar ID Sync: Active
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
