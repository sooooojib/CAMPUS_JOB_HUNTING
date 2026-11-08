"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Trash2,
  Plus,
  ShieldAlert,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/feedback/empty-state";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const CANONICAL_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Software Engineering",
  "Electrical & Electronic Engineering",
  "Mathematics",
  "Statistics",
  "Physics",
  "Chemistry",
  "Finance & Banking",
  "Marketing",
  "Accounting & Information Systems",
  "Management Studies",
  "English Language & Literature",
  "Law & Justice",
  "Economics",
  "Pharmacy",
  "Microbiology",
];

interface MyOpportunity {
  id: string;
  title: string;
  description: string;
  companyName: string;
  type: string;
  sourceType: string;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "CLOSED";
  location: string;
  workplaceType: string;
  salaryOrStipend?: string | null;
  deadline: string;
  createdAt: string;
  poster?: {
    id: string;
    name: string;
    email: string;
    membershipType: string;
  };
  _count?: {
    bookmarks: number;
  };
}

interface MyOpportunitiesViewProps {
  isAdmin?: boolean;
}

export function MyOpportunitiesView({ isAdmin = false }: MyOpportunitiesViewProps) {
  const [opportunities, setOpportunities] = React.useState<MyOpportunity[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({
    ALL: 0,
    APPROVED: 0,
    CLOSED: 0,
    EXPIRED: 0,
  });
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState(true);

  // Admin filter dropdown states (Screenshot 3)
  const [roleType, setRoleType] = React.useState<string>("ALL");
  const [workplaceType, setWorkplaceType] = React.useState<string>("ALL");
  const [sourceType, setSourceType] = React.useState<string>("ALL");
  const [department, setDepartment] = React.useState<string>("ALL");
  const [maxMinCgpa, setMaxMinCgpa] = React.useState<string>("ALL");

  // Dialog states
  const [confirmCloseId, setConfirmCloseId] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const fetchOpportunities = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "ALL") params.set("status", activeTab);
      if (isAdmin) {
        if (roleType !== "ALL") params.set("roleType", roleType);
        if (workplaceType !== "ALL") params.set("workplaceType", workplaceType);
        if (sourceType !== "ALL") params.set("sourceType", sourceType);
        if (department !== "ALL") params.set("department", department);
        if (maxMinCgpa !== "ALL") params.set("maxMinCgpa", maxMinCgpa);
      }

      const res = await fetch(`/api/opportunities/my?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data || []);
        if (json.counts) {
          setCounts({
            ALL: json.counts.ALL || 0,
            APPROVED: json.counts.APPROVED || 0,
            CLOSED: json.counts.CLOSED || 0,
            EXPIRED: json.counts.EXPIRED || 0,
          });
        }
      } else {
        throw new Error(json.error || "Failed to load opportunities");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not fetch postings");
    } finally {
      setLoading(false);
    }
  }, [activeTab, isAdmin, roleType, workplaceType, sourceType, department, maxMinCgpa]);

  React.useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleCloseOpportunity = async () => {
    if (!confirmCloseId) return;
    try {
      const res = await fetch(`/api/opportunities/${confirmCloseId}/close`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to close opportunity");
      toast.success("Opportunity successfully closed.");
      setConfirmCloseId(null);
      fetchOpportunities();
    } catch (err: any) {
      toast.error(err.message || "Failed to close opportunity");
    }
  };

  const handleDeleteOpportunity = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`/api/opportunities/${confirmDeleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete opportunity");
      toast.success("Opportunity removed from the platform.");
      setConfirmDeleteId(null);
      fetchOpportunities();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete opportunity");
    }
  };

  const TABS = [
    { key: "ALL", label: "All Postings", count: counts.ALL },
    { key: "APPROVED", label: "Active", count: counts.APPROVED },
    { key: "CLOSED", label: "Closed", count: counts.CLOSED },
    { key: "EXPIRED", label: "Expired", count: counts.EXPIRED },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {isAdmin ? "Manage Career Opportunities" : "My Opportunity Postings"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isAdmin
              ? "Platform-wide opportunity moderation console. Filter, close, or remove postings across the campus network."
              : "Manage your submitted openings, track status, and close listings."}
          </p>
        </div>

        <Link
          href="/opportunities/post"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <Plus className="size-4 mr-1.5" />
          <span>Post New Opening</span>
        </Link>
      </div>

      {/* Admin Advanced Filter Bar (Screenshot 3) */}
      {isAdmin && (
        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 1. Role Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Role Type
              </label>
              <Select value={roleType} onValueChange={(val) => setRoleType(val || "ALL")}>
                <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Workplace */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Workplace
              </label>
              <Select value={workplaceType} onValueChange={(val) => setWorkplaceType(val || "ALL")}>
                <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="ON_SITE">On-Site</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Posting Source */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Posting Source
              </label>
              <Select value={sourceType} onValueChange={(val) => setSourceType(val || "ALL")}>
                <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="OFFICIAL_EMPLOYER">Official Employer</SelectItem>
                  <SelectItem value="COMMUNITY_SHARED">Community Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Department / Major */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Department / Major
              </label>
              <Select value={department} onValueChange={(val) => setDepartment(val || "ALL")}>
                <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-56">
                  <SelectItem value="ALL">ALL</SelectItem>
                  {CANONICAL_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 5. Max Min CGPA */}
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Max Min CGPA
              </label>
              <Select value={maxMinCgpa} onValueChange={(val) => setMaxMinCgpa(val || "ALL")}>
                <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="3.00">3.00</SelectItem>
                  <SelectItem value="3.25">3.25</SelectItem>
                  <SelectItem value="3.50">3.50</SelectItem>
                  <SelectItem value="3.75">3.75</SelectItem>
                  <SelectItem value="4.00">4.00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Status Filter Tabs (Only Active, Closed, Expired) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className="text-xs font-semibold shrink-0 gap-1.5 rounded-full"
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.count || 0}
            </span>
          </Button>
        ))}
      </div>

      {/* Main Stream */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border/80 p-5 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === "ALL" ? "" : activeTab.toLowerCase()} opportunities`}
          description={
            activeTab === "ALL"
              ? "No career opportunities found matching current filters."
              : `There are currently no opportunities in ${activeTab.toLowerCase()} status.`
          }
          action={
            <Link
              href="/opportunities/post"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <Plus className="size-4 mr-1.5" />
              <span>Post New Opening</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const isApproved = opp.status === "APPROVED";
            const isClosed = opp.status === "CLOSED";
            const isExpired = opp.status === "EXPIRED";

            return (
              <Card
                key={opp.id}
                className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          isApproved
                            ? "default"
                            : isClosed
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs uppercase font-mono rounded-full px-2.5 py-0.5"
                      >
                        {isApproved ? "LIVE" : opp.status}
                      </Badge>

                      <Badge variant="outline" className="text-xs font-normal rounded-full">
                        {opp.type.replace("_", " ")}
                      </Badge>

                      {isAdmin && opp.poster && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Posted by: {opp.poster.name} ({opp.poster.membershipType})
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-foreground">
                      <Link
                        href={`/opportunities/${opp.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {opp.title}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="size-3.5 text-muted-foreground" />
                        {opp.companyName}
                      </span>
                      <span>•</span>
                      <span>{opp.location}</span>
                      <span>•</span>
                      <span>{opp.workplaceType}</span>
                      {opp.salaryOrStipend && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {opp.salaryOrStipend}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* View Details */}
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      <span>View Details</span>
                    </Link>

                    {/* Close Active Opportunity */}
                    {isApproved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmCloseId(opp.id)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 rounded-full text-xs"
                      >
                        <span>Close Opportunity</span>
                      </Button>
                    )}

                    {/* Delete / Remove Opportunity (Admin or Author) */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDeleteId(opp.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full text-xs gap-1"
                      aria-label="Remove opportunity"
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                      <span className="text-destructive font-medium">Remove</span>
                    </Button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
                  <div className="flex items-center gap-3">
                    <span>
                      Created:{" "}
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                        new Date(opp.createdAt)
                      )}
                    </span>
                    <span>•</span>
                    <span>
                      Deadline:{" "}
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                        new Date(opp.deadline)
                      )}
                    </span>
                  </div>

                  {opp._count && (
                    <span>{opp._count.bookmarks} students bookmarked</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={!!confirmCloseId}
        onOpenChange={(open) => !open && setConfirmCloseId(null)}
        title="Close this opportunity?"
        description="Closing this opportunity will archive it immediately and mark it closed. Candidates will see that applications are no longer accepted."
        confirmLabel="Confirm Closure"
        variant="default"
        onConfirm={handleCloseOpportunity}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title={isAdmin ? "Remove this opportunity from platform?" : "Delete this opportunity?"}
        description={
          isAdmin
            ? "Are you sure you want to remove this opportunity? It will be deleted from the university network immediately."
            : "Are you sure you want to delete this opportunity? This action cannot be undone."
        }
        confirmLabel="Remove Opportunity"
        variant="destructive"
        onConfirm={handleDeleteOpportunity}
      />
    </div>
  );
}
