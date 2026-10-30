import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Users2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Building2,
  Award,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "About Our Network",
  description:
    "Learn about UniCareer Community — a private, high-trust university-connected career and mentorship ecosystem.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border/80 bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300 mb-6">
            <GraduationCap className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Our Institutional Mission</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            A Gated Career Ecosystem Built on Institutional Trust
          </h1>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed max-w-3xl mx-auto">
            UniCareer Community is not a public advertising board or a mass scraping aggregator.
            It is a closed, authenticated network where university students, distinguished alumni,
            faculty advisors, and verified corporate partners collaborate with genuine accountability.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              <span>Join Your Campus Network</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Existing Member Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy & Pillars */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-card">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Why Institutional Verification Matters
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Traditional job boards suffer from ghost postings, unvetted applications, and impersonal recruitment. We rebuilt the experience from first principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Authentic Verification
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Students and alumni are verified directly against official institutional records. External employers must be vouched for or approved through university administration before posting opportunities.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Registrar-linked student identity verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Vetted recruiter affiliation and domain confirmation</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                <Users2 className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                High-Trust Alumni Referrals
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Alumni in top tech, engineering, business, and research firms share internal openings and sponsor candidates directly with high-confidence internal referrals.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Structured referral requests with verified skill matches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Direct alumni mentorship &amp; portfolio reviews</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                <Briefcase className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Strict Opportunity Classification
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We clearly differentiate between Official Employer Postings submitted by authorized corporate representatives, and Community Shared Leads posted by alumni peers.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Full disclosure on poster authority and hiring status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Mandatory salary ranges and deadline transparency</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300">
                <Award className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Privacy-First Career Tools
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Student resumes are protected in private object storage accessible only via time-limited signed URLs to designated recruiters. No candidate records are ever exposed publicly.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Zero web crawler indexing of personal profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Candidate withdrawal &amp; data deletion rights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Community Governance Callout */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="flex size-12 mx-auto items-center justify-center rounded-2xl bg-blue-500/10 text-primary mb-4">
            <Building2 className="size-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Governed by University Career Services
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
            The platform is operated in partnership with faculty advisors, department career centers, and student associations to ensure fair recruitment ethics and high quality standards.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className={buttonVariants({ variant: "default", size: "default" })}
            >
              Get Started with Your University ID
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

