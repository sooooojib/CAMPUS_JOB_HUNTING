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
import { CampusNetworkGraph } from "@/components/landing/campus-network-graph";

export default function WelcomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
              <Lock className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span>Private & Gated Institutional Network</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-[1.1]">
              Connecting University Talent with High-Trust Careers
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
              UniCareer Community connects verified students, distinguished alumni, faculty mentors, and vetted employers. An exclusive ecosystem designed for trusted referrals and career acceleration.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                <span>Create Verified Account</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Link>

              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Member Sign In
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Zero Public Scraping</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Registrar Record Validation</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Private Resume Vault</span>
              </span>
            </div>
          </div>

          {/* Interactive Animated Jagannath University Campus Graph */}
          <div className="w-full max-w-5xl mx-auto pt-10 sm:pt-14">
            <CampusNetworkGraph />
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

