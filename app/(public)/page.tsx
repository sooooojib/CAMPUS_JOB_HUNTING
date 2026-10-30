import Link from "next/link";
import {
  ShieldCheck,
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BentoCommandCenter } from "@/components/landing/bento-command-center";

export default function WelcomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section — Clean, Uncluttered Split Layout (Accrely-Inspired) */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-blue-950/15 via-background to-background py-16 sm:py-24">
        {/* Modern Engineering Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 size-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column (6 cols): Authoritative, Spacious Typography & Actions */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 max-w-2xl">
              {/* Accrely-Style Feature Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-900 dark:border-blue-800/60 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs">
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  NEW
                </span>
                <span>Jagannath University Career Network</span>
              </div>

              {/* Bold, Elegant Headline */}
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
                Careers that elevate talent, for Jagannath University.
              </h1>

              {/* High-Readability Description */}
              <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-xl">
                UniCareer Community connects verified students, distinguished alumni, faculty mentors, and vetted employers into a private, high-trust ecosystem for internal referrals and direct campus placement.
              </p>

              {/* Pill Action Buttons (Accrely Style) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm px-6 py-3 shadow-md hover:bg-primary/90 transition-all hover:scale-102"
                >
                  <span>Create Verified Account</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-card/80 text-foreground font-medium text-sm px-6 py-3 backdrop-blur-md hover:bg-muted transition-all hover:scale-102"
                >
                  Member Sign In
                </Link>
              </div>

              {/* Trust Announcement Pill Banner */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-muted/40 text-xs text-muted-foreground font-medium">
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                    VERIFIED
                  </span>
                  <span>Registrar-validated records · 0% public scraping · Private vault</span>
                </div>
              </div>
            </div>

            {/* Right Column (6 cols): Bento Command Center Visual */}
            <div className="lg:col-span-6 flex items-center justify-center w-full">
              <BentoCommandCenter />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Platform Pillars */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-card">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built Specifically for the Campus Community
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Unlike generic public job boards, every opportunity and interaction is backed by verified institutional identity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pillar 1 */}
            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 mb-4">
                <Briefcase className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Curated Opportunities
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Internships and full-time roles strictly differentiated between official employer postings and verified community referrals.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 mb-4">
                <Award className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Alumni Referral Network
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Connect directly with alumni working at top companies. Submit structured elevator pitches for internal recommendations.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 mb-4">
                <Users className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Verified Directory
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Discover mentors by graduation year, field of study, current employer, and industry. No spam or unverified recruiters.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-xl border border-border/80 bg-background p-6 shadow-xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 mb-4">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Student Career Tools
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                CGPA eligibility verification, automated skill matching, and tailored gap analysis to guide student career development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Access Gate Callout */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-4xl px-4 text-center space-y-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
            <ShieldCheck className="size-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Members-Only Authenticated Access
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            To safeguard applicant resumes, CGPA records, and internal referral communications, all opportunities and community feeds require verified login credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

