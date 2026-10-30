import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeritageCampusPanorama } from "@/components/landing/heritage-campus-panorama";
import { ProcessConduit } from "@/components/landing/process-conduit";

export function ContinuousSpine() {
  return (
    <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 select-none">
      {/* Ambient Radial Luminous Glow */}
      <div className="absolute w-[450px] h-[220px] bg-primary/10 dark:bg-primary/15 blur-[100px] rounded-full pointer-events-none -translate-y-4" />

      {/* Narrative Architectural Transition Bridge */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto px-4 space-y-3">
        {/* Luminous Waypoint Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-50/80 dark:bg-blue-950/40 px-4 py-1 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300 shadow-xs backdrop-blur-md">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-blue-600 dark:bg-blue-400" />
          </span>
          <span className="uppercase tracking-wider">Institutional Progression Pathway</span>
        </div>

        {/* Narrative Headline with Editorial Authority */}
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          From Campus Matriculation to Enterprise Placement.
        </h3>

        {/* Supporting Narrative Copy */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
          Connecting 168 years of Jagannath University academic heritage to private, verified career channels. Follow the 4-stage progression pipeline below.
        </p>

        {/* Soft Downward Flow Indicator (No Harsh 1px Skewer Line) */}
        <div className="pt-3 flex flex-col items-center gap-1 text-muted-foreground/50">
          <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function OutcomeSpine() {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 sm:py-12 select-none">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/70 dark:bg-emerald-950/40 px-4 py-1 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs backdrop-blur-md">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="uppercase tracking-wider">Stage 04 Placement Output</span>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          Verified Pipeline Yield • 100% Registrar Synchronized
        </p>
      </div>
      <div className="w-px h-8 bg-gradient-to-b from-emerald-500/50 to-transparent mt-3" />
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-background">
      {/* Continuous Ambient Background Glows isolated in clipped layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/8 blur-[160px] rounded-full" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f608_1px,transparent_1px)] [background-size:28px_28px] opacity-80" />
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: The Direct Line from Campus to Career          */}
      {/* ========================================================= */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-4">
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16">
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
          </div>

          {/* ========================================================= */}
          {/* THE HERITAGE CAMPUS PANORAMA & COMMUNITY PINS             */}
          {/* ========================================================= */}
          <div className="w-full">
            <HeritageCampusPanorama />
          </div>
        </div>
      </section>

      {/* Luminous Connective Spine (Tethering Campus Gateway to Verified Pipeline) */}
      <ContinuousSpine />

      {/* ========================================================= */}
      {/* SECTION 2: The 4 Stations of the University Pipeline      */}
      {/* Flowing Smoothly on the Continuous Canvas (No Border Cut) */}
      {/* ========================================================= */}
      <section id="pipeline" className="relative z-10 pt-4 pb-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <ProcessConduit />
        </div>
      </section>

      {/* Connective Spine (Tethering Pipeline Output to Verified Yield Audit) */}
      <OutcomeSpine />

      {/* ========================================================= */}
      {/* SECTION 3: Verified Pipeline Yield Audit                  */}
      {/* Direct Outcome of Station 04 - Seamless Flow              */}
      {/* ========================================================= */}
      <section className="relative z-10 pt-2 pb-20 sm:pb-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          {/* Continuity Label */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <span>Verified Pipeline Yield</span>
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground font-semibold">Institutional Audit</span>
            </span>
          </div>

          {/* Seamless Blended Container - Clean 3-Metric Presentation */}
          <div className="rounded-[2.5rem] sm:rounded-[3rem] border border-border/50 bg-card/60 dark:bg-card/50 backdrop-blur-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40 text-center">
              {/* Column 1 */}
              <div className="p-8 sm:p-10 space-y-3">
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
              <div className="p-8 sm:p-10 space-y-3">
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
              <div className="p-8 sm:p-10 space-y-3">
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
          </div>
        </div>
      </section>
    </div>
  );
}
