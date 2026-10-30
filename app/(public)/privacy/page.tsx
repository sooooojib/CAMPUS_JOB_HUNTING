import Link from "next/link";
import { Lock, ShieldCheck, CheckCircle2, EyeOff, Server, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Student privacy, private resume vault, and data protection architecture of UniCareer Community.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 space-y-3 border-b border-border/80 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
          <Lock className="size-3.5" />
          <span>Data Protection &amp; Confidentiality</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy &amp; Candidate Protection
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026 • Strict university privacy compliance
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-foreground text-sm sm:text-base leading-relaxed">
        {/* Highlight box */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-950/30 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300">
            <ShieldCheck className="size-5" />
            <span>Core Privacy Commitment</span>
          </div>
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            UniCareer Community is engineered so that your academic metrics, contact records, and uploaded resume documents are never indexed by external search engines, sold to third parties, or exposed to unauthorized visitors.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <EyeOff className="size-5 text-primary" />
            1. Zero Public Indexing &amp; Scraping Protection
          </h2>
          <p className="text-muted-foreground">
            Unlike commercial networks, all member profiles, student directories, and opportunity feeds require verified authentication. Automated web scrapers and unauthorized bots are prevented from harvesting student or alumni personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Server className="size-5 text-primary" />
            2. Private Resume Vault &amp; Signed URLs
          </h2>
          <p className="text-muted-foreground">
            When you upload a resume or portfolio artifact:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Files are encrypted at rest in isolated private object storage.</li>
            <li>No resume has a permanent or publicly accessible HTTP link.</li>
            <li>
              When an employer reviews your application, access is granted via a strictly time-limited (15-minute) signed URL generated only for verified hiring managers of that opportunity.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            3. Academic Data &amp; CGPA Privacy
          </h2>
          <p className="text-muted-foreground">
            Academic records and CGPA metrics are accessible exclusively to verified student accounts and designated academic advisors. Other community members and public employers cannot browse your academic transcript unless you explicitly attach it to a specific job application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            4. Candidate Data Rights
          </h2>
          <p className="text-muted-foreground">
            As a student or alumnus, you maintain full control over your career data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>
              <strong>Application Withdrawal:</strong> You may withdraw pending applications at any time before interview stages.
            </li>
            <li>
              <strong>Resume Version Deletion:</strong> You may delete outdated resume drafts from your vault immediately.
            </li>
            <li>
              <strong>Account Deletion:</strong> You have the right to request full erasure of your community presence and application archives.
            </li>
          </ul>
        </section>

        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          For technical inquiries regarding data retention or to request an export of your application data, contact the{" "}
          <Link href="/about" className="text-primary hover:underline font-semibold">
            Institutional Privacy Office
          </Link>.
        </div>
      </div>
    </div>
  );
}

