import Link from "next/link";
import {
  Briefcase,
  Award,
  Users,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building,
} from "lucide-react";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { CreatePostBox } from "@/components/community/create-post-box";
import { FeedPostCard } from "@/components/community/feed-post-card";
import { JobCard } from "@/components/opportunities/job-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Community Dashboard",
  description: "University career activity, opportunities, and discussions.",
};

const SAMPLE_POST = {
  id: "post-1",
  authorId: "usr-1",
  authorName: "Sarah Chen",
  authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  authorMembership: "ALUMNI" as const,
  title: "Stripe 2027 SWE Internships & Full-Time Openings",
  content:
    "Hi everyone! Applications for Stripe's Dublin and Seattle engineering teams just opened. If you're a junior or senior interested in backend distributed systems, feel free to submit a referral request on our campus network. Happy to review portfolios first!",
  category: "JOB_ANNOUNCEMENT" as const,
  createdAt: "2026-10-30T16:00:00.000Z",
  commentsCount: 9,
};

const SAMPLE_JOB = {
  id: "opp-101",
  title: "Distributed Systems Software Intern (Summer 2027)",
  companyName: "Google Cloud",
  classification: "OFFICIAL_EMPLOYER" as const,
  type: "INTERNSHIP" as const,
  workplaceType: "HYBRID" as const,
  location: "Sunnyvale, CA (or Remote)",
  salaryRange: "$55 - $65 / hr",
  deadline: "2026-11-20T23:59:59.000Z",
  skills: ["Go", "Kubernetes", "gRPC", "Distributed Systems"],
  matchScore: 92,
};

export default function DashboardPage() {
  return (
    <DashboardTemplate
      title="Community Feed & Career Dispatch"
      subtitle="Institutional updates, verified alumni referrals, and curated campus postings."
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/opportunities/post"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <span>Post Opportunity</span>
          </Link>
          <Link
            href="/referrals"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <span>Request Referral</span>
          </Link>
        </div>
      }
      metrics={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Curated Openings</span>
              <Briefcase className="size-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">128</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span>12 added this week</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Active Referrals</span>
              <Award className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">42</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Across 28 verified firms
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">My Applications</span>
              <FileText className="size-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">3</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              1 in review stage
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Verified Network</span>
              <Users className="size-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">2,410</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Students, alumni &amp; faculty
            </div>
          </div>
        </div>
      }
      sidebar={
        <div className="space-y-6">
          {/* Featured Campus Opportunity */}
          <Card className="rounded-xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Featured Opportunity</CardTitle>
                <Badge variant="info" className="text-[10px]">92% Match</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                  <Building className="size-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground leading-snug truncate">
                    Google Cloud • SWE Intern
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Sunnyvale, CA • Hybrid</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Distributed systems engineering on next-generation cloud infrastructure.
              </p>
              <div className="pt-1">
                <Link
                  href="/opportunities/opp-101"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "w-full text-xs" })}
                >
                  View Details &amp; Apply
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / University Career Center */}
          <Card className="rounded-xl border border-blue-200/80 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                <Sparkles className="size-4" />
                <span>Career Tooling</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">
                Check Academic CGPA &amp; Skill Eligibility
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run an automated match against all open campus opportunities using your verified transcript.
              </p>
              <Link
                href="/career-tools"
                className={buttonVariants({ variant: "default", size: "sm", className: "w-full text-xs" })}
              >
                Launch Career Toolkit
              </Link>
            </CardContent>
          </Card>
        </div>
      }
    >
      {/* Create Post Prompt */}
      <CreatePostBox />

      {/* Main Stream Posts */}
      <div className="space-y-4">
        <FeedPostCard {...SAMPLE_POST} />

        {/* Inline Curated Job Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trending In Your Department
            </span>
            <Link
              href="/opportunities"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
          <JobCard {...SAMPLE_JOB} />
        </div>
      </div>
    </DashboardTemplate>
  );
}
