"use client";

import * as React from "react";
import {
  Users,
  ShieldCheck,
  Briefcase,
  FileCheck,
  AlertTriangle,
  Building2,
  FileText,
  UserX,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminDashboardStats } from "@/types";

interface AdminOverviewViewProps {
  stats: AdminDashboardStats;
  onNavigateTab?: (tab: string) => void;
}

export function AdminOverviewView({ stats, onNavigateTab }: AdminOverviewViewProps) {
  const verifiedPercentage =
    stats.totalMembers > 0
      ? Math.round((stats.verifiedMembers / stats.totalMembers) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Actionable Alerts Bar if there are pending reports */}
      {stats.pendingReports > 0 && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-red-950 dark:text-red-100">
                {stats.pendingReports} Content Report{stats.pendingReports > 1 ? "s" : ""}
              </div>
              <div className="text-xs text-red-700 dark:text-red-400">
                Flagged posts or comments awaiting moderation
              </div>
            </div>
          </div>
          {onNavigateTab && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab("reports")}
              className="border-red-300 text-red-900 hover:bg-red-100 dark:border-red-800 dark:text-red-200 h-8 text-xs gap-1 rounded-full"
            >
              Moderate
              <ArrowRight className="size-3" />
            </Button>
          )}
        </div>
      )}

      {/* Primary Platform Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Members Total */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Members
            </span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {stats.totalMembers.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">registered</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Verified: {stats.verifiedMembers}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {verifiedPercentage}% verified
            </span>
          </div>
        </div>

        {/* Opportunities Active */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Listings
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {stats.activeOpportunities.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">open</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Total posted: {stats.totalOpportunities}</span>
            <span className="font-medium text-foreground">Live: {stats.approvedOpportunities}</span>
          </div>
        </div>

        {/* Applications */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Job Applications
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {stats.totalApplications.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">submitted</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Companies: {stats.totalCompanies}</span>
            <span className="text-primary font-medium">Internal &amp; External</span>
          </div>
        </div>

        {/* Community & Safety */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Community Feed
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <FileText className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
              {stats.communityPosts.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">posts</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Suspended accounts: {stats.suspendedAccounts}</span>
            <Badge
              variant={stats.pendingReports > 0 ? "destructive" : "outline"}
              className="text-[10px] py-0 px-1.5"
            >
              {stats.pendingReports} reports
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

