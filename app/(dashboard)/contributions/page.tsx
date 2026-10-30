import Link from "next/link";
import { Plus, MessageSquare, Award, Briefcase, TrendingUp } from "lucide-react";
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

export default function ContributionsPage() {
  return (
    <DashboardTemplate
      title="My Contributions"
      subtitle="Track your community footprint, shared job leads, sponsored referrals, and discussions."
      actions={
        <Link
          href="/opportunities/post"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <Plus className="size-4 mr-1.5" />
          <span>Share Opportunity</span>
        </Link>
      }
      metrics={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Shared Leads</span>
              <Briefcase className="size-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">1</div>
            <div className="text-[11px] text-emerald-600 mt-1">1 active on board</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Referrals Sponsored</span>
              <Award className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">2</div>
            <div className="text-[11px] text-muted-foreground mt-1">1 candidate placed</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Feed Posts</span>
              <MessageSquare className="size-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">6</div>
            <div className="text-[11px] text-muted-foreground mt-1">34 community replies</div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Impact Score</span>
              <TrendingUp className="size-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">94</div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">Top contributor tier</div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="rounded-2xl border border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-base font-bold">Opportunities You Have Shared</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {SAMPLE_POSTED_OPPORTUNITIES.map((opp) => (
                <div
                  key={opp.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-background"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">{opp.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Posted {opp.date}</span>
                      <span>•</span>
                      <span>{opp.views} views</span>
                      <span>•</span>
                      <span className="text-primary font-medium">{opp.applicants} applicants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-xs">
                      {opp.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage Applicants
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}
