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
  ShieldAlert,
  Send,
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

  const user = session?.user as any;
  const userId = session?.user?.id;
  const userRole = user?.membershipType || "STUDENT";
  const systemRole = user?.systemRole || "MEMBER";
  const isAdmin = systemRole === "ADMIN" || userRole === "ADMIN";
  const isStudent = userRole === "STUDENT";
  const isAlumni = userRole === "ALUMNI";
  const canPost = Boolean(user?.canPostOpportunities || isAdmin || isAlumni);

  // Real aggregate metrics from PostgreSQL
  const [
    opportunitiesCount,
    postsCount,
    userApplicationsCount,
    pendingVerificationsCount,
    verifiedUsersCount,
    featuredOpportunity,
  ] = await Promise.all([
    prisma.opportunity.count({
      where: { status: "APPROVED", deadline: { gte: new Date() } },
    }),
    prisma.post.count({
      where: { status: "ACTIVE" },
    }),
    userId && (isStudent || isAlumni)
      ? prisma.application.count({
          where: { applicantId: userId },
        })
      : 0,
    isAdmin
      ? prisma.user.count({
          where: { verificationStatus: "PENDING" },
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

  const dashboardTitle = isAdmin
    ? "Administrative Command & Community Dispatch"
    : isAlumni
    ? "Alumni Network & Career Discussions"
    : "Student Career Hub & Opportunities";

  const dashboardSubtitle = isAdmin
    ? "Campus platform governance, member verifications, and approved job postings."
    : isAlumni
    ? "Connect with fellow graduates, explore postings, and discover opportunities."
    : "Curated campus listings, verified community networking, and discussions.";

  return (
    <DashboardTemplate
      title={dashboardTitle}
      subtitle={dashboardSubtitle}
      actions={
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Link
                href="/admin"
                className={buttonVariants({ variant: "destructive", size: "sm" })}
              >
                <ShieldAlert className="size-3.5 mr-1.5" />
                <span>Admin Command</span>
              </Link>
              <Link
                href="/opportunities/post"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Briefcase className="size-3.5 mr-1.5" />
                <span>Post Opportunity</span>
              </Link>
            </>
          ) : isAlumni ? (
            <>
              {canPost && (
                <Link
                  href="/opportunities/post"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Briefcase className="size-3.5 mr-1.5" />
                  <span>Share Lead</span>
                </Link>
              )}
              <Link
                href="/community"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                <Users className="size-3.5 mr-1.5" />
                <span>Member Network</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/opportunities"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Briefcase className="size-3.5 mr-1.5" />
                <span>Browse Opportunities</span>
              </Link>
              <Link
                href="/applications"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                <FileText className="size-3.5 mr-1.5" />
                <span>My Applications</span>
              </Link>
            </>
          )}
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
              <span className="text-xs font-medium">
                {isAdmin
                  ? "Pending Verifications"
                  : "My Applications"}
              </span>
              {isAdmin ? (
                <ShieldAlert className="size-4 text-destructive" />
              ) : (
                <FileText className="size-4 text-blue-500" />
              )}
            </div>
            <div className="text-2xl font-bold text-foreground">
              {isAdmin
                ? pendingVerificationsCount
                : userApplicationsCount}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
              {isAdmin ? (
                <Link href="/admin" className="hover:underline">
                  Review queue →
                </Link>
              ) : (
                <Link href="/applications" className="hover:underline">
                  View submitted dossier →
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Verified Network</span>
              <Users className="size-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{verifiedUsersCount}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Students &amp; alumni
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

          {/* Role-Specific Quick Actions Card */}
          {isAdmin ? (
            <Card className="rounded-xl border border-destructive/30 bg-destructive/5 shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wide">
                  <ShieldAlert className="size-4" />
                  <span>Admin Governance</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Platform Moderation &amp; Claims
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Review pending registrar verification claims, audit log trail, and moderate opportunities.
                </p>
                <Link
                  href="/admin"
                  className={buttonVariants({ variant: "destructive", size: "sm", className: "w-full text-xs" })}
                >
                  Open Admin Command
                </Link>
              </CardContent>
            </Card>
          ) : isAlumni ? (
            <Card className="rounded-xl border border-amber-500/30 bg-amber-500/5 shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wide">
                  <Users className="size-4" />
                  <span>Campus &amp; Alumni Network</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Connect With Campus Community
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Engage with students, alumni, and campus initiatives through the verified university network.
                </p>
                <Link
                  href="/community"
                  className={buttonVariants({ variant: "default", size: "sm", className: "w-full text-xs" })}
                >
                  Explore Member Network
                </Link>
              </CardContent>
            </Card>
          ) : (
            /* Student Applications Tracker Widget */
            <Card className="rounded-xl border border-blue-200/80 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20 shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                  <FileText className="size-4" />
                  <span>Applications Hub</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Track Your Job &amp; Internship Applications
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Monitor application review stages across campus opportunities and externally tracked portals.
                </p>
                <Link
                  href="/applications"
                  className={buttonVariants({ variant: "default", size: "sm", className: "w-full text-xs" })}
                >
                  View My Applications
                </Link>
              </CardContent>
            </Card>
          )}
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
