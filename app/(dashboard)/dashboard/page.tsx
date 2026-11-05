import { headers } from "next/headers";
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
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { CommunityFeedView } from "@/components/community/community-feed-view";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Community Dashboard",
  description: "University career activity, opportunities, and discussions.",
};

export default async function DashboardPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const userId = session?.user?.id;

  // Real aggregate metrics from PostgreSQL
  const [opportunitiesCount, postsCount, userApplicationsCount, verifiedUsersCount, featuredOpportunity] =
    await Promise.all([
      prisma.opportunity.count({
        where: { status: "APPROVED", deadline: { gte: new Date() } },
      }),
      prisma.post.count({
        where: { status: "ACTIVE" },
      }),
      userId
        ? prisma.application.count({
            where: { applicantId: userId },
          })
        : 0,
      prisma.user.count({
        where: { verificationStatus: "VERIFIED" },
      }),
      prisma.opportunity.findFirst({
        where: { status: "APPROVED", deadline: { gte: new Date() } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          companyName: true,
          type: true,
          workplaceType: true,
          location: true,
          description: true,
        },
      }),
    ]);

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
            <Briefcase className="size-3.5 mr-1.5" />
            <span>Post Opportunity</span>
          </Link>
          <Link
            href="/referrals"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <Award className="size-3.5 mr-1.5" />
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
            <div className="text-2xl font-bold text-foreground">{opportunitiesCount}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span>Active campus listings</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Community Posts</span>
              <Award className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{postsCount}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Discussions &amp; advice
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">My Applications</span>
              <FileText className="size-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{userApplicationsCount}</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              <Link href="/applications" className="hover:underline">
                View submitted dossier →
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Verified Network</span>
              <Users className="size-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{verifiedUsersCount}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Students, alumni &amp; faculty
            </div>
          </div>
        </div>
      }
      sidebar={
        <div className="space-y-6">
          {/* Featured Campus Opportunity */}
          {featuredOpportunity ? (
            <Card className="rounded-xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Featured Opportunity</CardTitle>
                  <Badge variant="info" className="text-[10px] uppercase">
                    {featuredOpportunity.type.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                    <Building className="size-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-foreground leading-snug truncate">
                      {featuredOpportunity.companyName} • {featuredOpportunity.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {featuredOpportunity.location} • {featuredOpportunity.workplaceType.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {featuredOpportunity.description}
                </p>
                <div className="pt-1">
                  <Link
                    href={`/opportunities/${featuredOpportunity.id}`}
                    className={buttonVariants({ variant: "outline", size: "sm", className: "w-full text-xs" })}
                  >
                    View Details &amp; Apply
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-2 border-b border-border/60">
                <CardTitle className="text-sm font-bold">Campus Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-xs text-muted-foreground">
                <p>Browse open internships and full-time listings submitted by partner organizations.</p>
                <div className="pt-3">
                  <Link
                    href="/opportunities"
                    className={buttonVariants({ variant: "outline", size: "sm", className: "w-full text-xs" })}
                  >
                    Browse Opportunities →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

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
      {/* Live Community Feed Stream */}
      <CommunityFeedView
        currentUser={
          session?.user
            ? {
                id: session.user.id,
                name: session.user.name,
                avatarUrl: session.user.image,
                membershipType: session.user.membershipType,
              }
            : undefined
        }
      />
    </DashboardTemplate>
  );
}
