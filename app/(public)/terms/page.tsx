import Link from "next/link";
import { ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description:
    "Community membership rules, verification terms, and posting policies for UniCareer Community.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 space-y-3 border-b border-border/80 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
          <FileText className="size-3.5" />
          <span>Institutional Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Terms of Service &amp; Community Standards
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026 • Effective across all UniCareer Community services
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-foreground text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            1. Institutional Eligibility &amp; Account Verification
          </h2>
          <p className="text-muted-foreground">
            UniCareer Community is a private, authenticated university-connected platform. To participate as a verified member, you must satisfy one of the following criteria:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Currently enrolled student with an active university-issued academic credential.</li>
            <li>Verified alumnus/alumna of the institution in good standing.</li>
            <li>Current university faculty or administrative career staff.</li>
            <li>Authorized corporate recruiter or employer with a recognized institutional partnership.</li>
            <li>External professional sponsored by an official university program or verified referral.</li>
          </ul>
          <p className="text-muted-foreground">
            Providing forged credentials or misrepresenting enrollment status constitutes immediate grounds for account termination and reporting to institutional authorities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            2. Opportunity Posting Standards
          </h2>
          <p className="text-muted-foreground">
            All career postings must undergo administrative verification or automated policy compliance checks prior to publication:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>
              <strong>Accurate Classification:</strong> Postings must clearly specify whether they are Official Employer Postings or Community Shared Leads. Members sharing referrals must not pretend to represent company executive leadership without authorization.
            </li>
            <li>
              <strong>Fair Compensation:</strong> Unpaid internships must strictly comply with national labor laws and university academic credit criteria.
            </li>
            <li>
              <strong>Zero Tolerance for Scams:</strong> Postings demanding application fees, multi-level marketing participation, or unverified remote payment schemes are strictly prohibited and immediately purged.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            3. Professional Conduct in Community Feeds
          </h2>
          <p className="text-muted-foreground">
            The community discussion feed and referral network operate under university honor codes. Members must maintain professional etiquette, constructive feedback, and mutual respect. Harassment, discrimination, defamatory statements, or commercial spam will result in immediate suspension.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            4. Applications and Direct Contact Ethics
          </h2>
          <p className="text-muted-foreground">
            Candidates agree to submit authentic academic metrics, accurate work histories, and legitimate contact details. Employers agree to treat all candidate data in confidence and use applicant resumes exclusively for evaluation regarding the designated posting.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="size-5 text-amber-500" />
            5. Moderation, Disciplinary Action &amp; Appeals
          </h2>
          <p className="text-muted-foreground">
            Platform moderators and career services administrators reserve the right to review, edit, unpublish, or delete any content or suspend any member account that violates these terms. Appeals may be lodged with the University Career Development Directorate.
          </p>
        </section>

        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          For governance questions or terms inquiries, please contact{" "}
          <Link href="/privacy" className="text-primary hover:underline font-semibold">
            University Privacy Office
          </Link>{" "}
          or reach out to Career Services administration.
        </div>
      </div>
    </div>
  );
}

