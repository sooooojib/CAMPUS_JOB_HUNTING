import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, MessageSquare, Award, Briefcase } from "lucide-react";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Contributions",
  description: "Opportunities shared, referrals sponsored, and community discussions initiated.",
};

const SAMPLE_POSTED_OPPORTUNITIES = [
  {
    id: "opp-c1",
    title: "Research Assistant — Machine Learning Lab",
    type: "PART_TIME",
    date: "2026-10-18",
    status: "APPROVED",
    views: 142,
    applicants: 12,
  },
];

export default async function ContributionsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  let canPost = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { membershipType: true, systemRole: true },
    });
    canPost = user?.systemRole === "ADMIN" || user?.membershipType === "ALUMNI";
  }

  return (
    <DashboardTemplate
      title="My Contributions"
      subtitle="Track your community footprint, shared job leads, sponsored referrals, and discussions."
      actions={
        canPost ? (
          <Link
            href="/opportunities/post"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <Plus className="size-4 mr-1.5" />
            <span>Share Opportunity</span>
          </Link>
        ) : (
          <Link
            href="/feed"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <MessageSquare className="size-4 mr-1.5" />
            <span>Join Community Discussion</span>
          </Link>
        )
      }
      metrics={
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Shared Leads</span>
              <Briefcase className="size-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">1</div>
            <div className="text-[11px] text-emerald-600 mt-1">Active on board</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Feed Posts</span>
              <MessageSquare className="size-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">6</div>
            <div className="text-[11px] text-muted-foreground mt-1">Discussions &amp; achievements</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Community Engagement</span>
              <Award className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">34</div>
            <div className="text-[11px] text-muted-foreground mt-1">Community replies &amp; interactions</div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">Opportunities You Have Shared</CardTitle>
            <Link
              href="/opportunities/my"
              className={buttonVariants({ variant: "outline", size: "xs" })}
            >
              Manage Postings
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-border/70 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Live Dashboard
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      Author &amp; Opportunity Management Console
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Track all your published openings, active drafts, revision requests from moderators, and closed opportunities in one unified workspace.
                  </p>
                </div>
                <Link
                  href="/opportunities/my"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  <span>Go to My Opportunities</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}
