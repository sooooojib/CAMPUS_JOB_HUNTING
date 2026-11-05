"use client";

import * as React from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  AlertTriangle,
  Building2,
  BarChart3,
  FileText,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdminOverviewView } from "@/components/admin/admin-overview-view";
import { AdminMembersTable } from "@/components/admin/admin-members-table";
import { AdminOpportunityTable } from "@/components/admin/admin-opportunity-table";
import { VerificationTable } from "@/components/admin/verification-table";
import { AdminReportsTable } from "@/components/admin/admin-reports-table";
import { AdminCompaniesTable } from "@/components/admin/admin-companies-table";
import { AdminAnalyticsView } from "@/components/admin/admin-analytics-view";
import { AdminAuditTable } from "@/components/admin/admin-audit-table";
import type { AdminDashboardStats } from "@/types";

interface AdminDashboardContainerProps {
  stats: AdminDashboardStats;
  initialPendingRequests: any[];
  currentAdminId: string;
}

export function AdminDashboardContainer({
  stats,
  initialPendingRequests,
  currentAdminId,
}: AdminDashboardContainerProps) {
  const [activeTab, setActiveTab] = React.useState<string>("overview");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Horizontal scrollable tab list with badge notifications */}
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-muted/70 p-1 rounded-xl h-auto flex flex-nowrap min-w-max">
            <TabsTrigger value="overview" className="text-xs gap-1.5 py-1.5 px-3">
              <LayoutDashboard className="size-3.5" />
              <span>Overview</span>
            </TabsTrigger>

            <TabsTrigger value="members" className="text-xs gap-1.5 py-1.5 px-3">
              <Users className="size-3.5" />
              <span>Members</span>
              <span className="text-[10px] text-muted-foreground ml-0.5">({stats.totalMembers})</span>
            </TabsTrigger>

            <TabsTrigger value="opportunities" className="text-xs gap-1.5 py-1.5 px-3">
              <Briefcase className="size-3.5" />
              <span>Opportunities</span>
              {stats.pendingOpportunities > 0 && (
                <Badge variant="outline" className="ml-1 text-[9px] py-0 px-1 border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-950/40">
                  {stats.pendingOpportunities}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="verifications" className="text-xs gap-1.5 py-1.5 px-3">
              <FileCheck className="size-3.5" />
              <span>Verifications</span>
              {stats.pendingVerifications > 0 && (
                <Badge variant="outline" className="ml-1 text-[9px] py-0 px-1 border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/40">
                  {stats.pendingVerifications}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="reports" className="text-xs gap-1.5 py-1.5 px-3">
              <AlertTriangle className="size-3.5" />
              <span>Content Reports</span>
              {stats.pendingReports > 0 && (
                <Badge variant="destructive" className="ml-1 text-[9px] py-0 px-1">
                  {stats.pendingReports}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="companies" className="text-xs gap-1.5 py-1.5 px-3">
              <Building2 className="size-3.5" />
              <span>Companies</span>
              <span className="text-[10px] text-muted-foreground ml-0.5">({stats.totalCompanies})</span>
            </TabsTrigger>

            <TabsTrigger value="analytics" className="text-xs gap-1.5 py-1.5 px-3">
              <BarChart3 className="size-3.5" />
              <span>Analytics</span>
            </TabsTrigger>

            <TabsTrigger value="audit" className="text-xs gap-1.5 py-1.5 px-3">
              <ShieldCheck className="size-3.5" />
              <span>Audit Trail</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4">
          <AdminOverviewView stats={stats} onNavigateTab={setActiveTab} />
        </TabsContent>

        {/* Tab 2: Members */}
        <TabsContent value="members" className="space-y-4">
          <AdminMembersTable currentAdminId={currentAdminId} />
        </TabsContent>

        {/* Tab 3: Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <AdminOpportunityTable />
        </TabsContent>

        {/* Tab 4: Verifications */}
        <TabsContent value="verifications" className="space-y-4">
          <VerificationTable initialRequests={initialPendingRequests} />
        </TabsContent>

        {/* Tab 5: Content Reports */}
        <TabsContent value="reports" className="space-y-4">
          <AdminReportsTable />
        </TabsContent>

        {/* Tab 6: Companies */}
        <TabsContent value="companies" className="space-y-4">
          <AdminCompaniesTable />
        </TabsContent>

        {/* Tab 7: Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <AdminAnalyticsView />
        </TabsContent>

        {/* Tab 8: Audit Trail */}
        <TabsContent value="audit" className="space-y-4">
          <AdminAuditTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

