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
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        {/* Harmonized Institutional Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 z-10 space-y-12 sm:space-y-16">
          {/* Header Typography & Narrative Block */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-5">
            {/* University Identity Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-blue-50/90 px-3.5 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs">
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

            {/* Tactile Magnetic Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm px-7 py-3.5 shadow-md hover:bg-primary/90 transition-all hover:scale-102"
              >
                <span>Join the Verified Network</span>
                <ArrowRight className="size-4 ml-2" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card/80 text-foreground font-semibold text-sm px-7 py-3.5 shadow-xs backdrop-blur-md hover:bg-muted transition-all hover:scale-102"
              >
                Member Sign In
              </Link>
            </div>

            {/* Core Integrity Pillars */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Registrar ID Validated</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Private 15-Minute Resume Vault</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
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
      {/* ========================================================= */}
      <section className="py-20 border-b border-border/80 bg-card/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Verified Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How the Campus Network Accelerates Careers
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Every stage of your career transition is backed by official university verification and genuine alumni advocacy.
            </p>
          </div>

          <ProcessConduit />
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: Real Institutional Numbers & Privacy Standard */}
      {/* ========================================================= */}
      <section className="py-20 border-b border-border/80 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/60">
            <div className="px-6 py-4 space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                100%
              </div>
              <div className="text-sm font-bold text-foreground">
                Registrar-Verified Members
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Every student, alumni, and faculty profile is validated against official university records. Zero spam accounts.
              </p>
            </div>

            <div className="px-6 py-4 space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-primary">
                0%
              </div>
              <div className="text-sm font-bold text-foreground">
                Public Web Scraping
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Candidate resumes are stored in private cloud storage and only accessed via expiring, 15-minute signed links upon consent.
              </p>
            </div>

            <div className="px-6 py-4 space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-emerald-600 dark:text-emerald-400">
                450+
              </div>
              <div className="text-sm font-bold text-foreground">
                Alumni Enterprise Connections
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Spanning multinational software houses, commercial banks, government institutions, and global research fellowships.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
