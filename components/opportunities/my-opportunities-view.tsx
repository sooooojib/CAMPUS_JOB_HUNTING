"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  Calendar,
  Edit3,
  Trash2,
  Send,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Building2,
  XCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

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
  rejectionReason?: string | null;
  createdAt: string;
  _count?: {
    bookmarks: number;
  };
}

export function MyOpportunitiesView() {
  const [opportunities, setOpportunities] = React.useState<MyOpportunity[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({
    ALL: 0,
    DRAFT: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    CLOSED: 0,
    EXPIRED: 0,
  });
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState(true);

  // Dialog states
  const [confirmCloseId, setConfirmCloseId] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchMyOpportunities = React.useCallback(async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/opportunities/my?status=${status}`);
      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data || []);
        if (json.counts) {
          setCounts(json.counts);
        }
      } else {
        throw new Error(json.error || "Failed to load opportunities");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not fetch your postings");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMyOpportunities(activeTab);
  }, [activeTab, fetchMyOpportunities]);

  const handleSubmitForReview = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${id}/submit`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit opportunity");
      toast.success("Opportunity submitted for institutional review!");
      fetchMyOpportunities(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit opportunity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseOpportunity = async () => {
    if (!confirmCloseId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${confirmCloseId}/close`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to close opportunity");
      toast.success("Opportunity successfully closed.");
      setConfirmCloseId(null);
      fetchMyOpportunities(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to close opportunity");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOpportunity = async () => {
    if (!confirmDeleteId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${confirmDeleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete opportunity");
      toast.success("Opportunity deleted.");
      setConfirmDeleteId(null);
      fetchMyOpportunities(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete opportunity");
    } finally {
      setActionLoading(false);
    }
  };

  const TABS = [
    { key: "ALL", label: "All Postings", count: counts.ALL },
    { key: "APPROVED", label: "Active", count: counts.APPROVED },
    { key: "PENDING", label: "In Review", count: counts.PENDING },
    { key: "DRAFT", label: "Drafts", count: counts.DRAFT },
    { key: "REJECTED", label: "Revision Needed", count: counts.REJECTED },
    { key: "CLOSED", label: "Closed", count: counts.CLOSED },
    { key: "EXPIRED", label: "Expired", count: counts.EXPIRED },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            My Opportunity Postings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your submitted openings, track institutional review status, and update listings.
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

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className="text-xs font-semibold shrink-0 gap-1.5"
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
              ? "You haven't created or published any career opportunities yet."
              : `You have no opportunities currently in ${activeTab.toLowerCase()} status.`
          }
          action={
            <Link
              href="/opportunities/post"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <Plus className="size-4 mr-1.5" />
              <span>Create Your First Posting</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const isApproved = opp.status === "APPROVED";
            const isPending = opp.status === "PENDING";
            const isDraft = opp.status === "DRAFT";
            const isRejected = opp.status === "REJECTED";
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
                            : isPending
                            ? "warning"
                            : isRejected
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs uppercase font-mono"
                      >
                        {opp.status}
                      </Badge>

                      <Badge variant="outline" className="text-xs font-normal">
                        {opp.type.replace("_", " ")}
                      </Badge>

                      <span className="text-xs text-muted-foreground font-mono">
                        {opp.sourceType === "OFFICIAL_EMPLOYER"
                          ? "Official Employer"
                          : "Community Shared"}
                      </span>
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
                    {/* Manage Applicants for Official Employer posts */}
                    {opp.sourceType === "OFFICIAL_EMPLOYER" && (isApproved || isClosed) && (
                      <Link
                        href={`/opportunities/${opp.id}/applicants`}
                        className={buttonVariants({ variant: "default", size: "sm" })}
                      >
                        <Users className="size-3.5 mr-1" />
                        <span>Applicants</span>
                      </Link>
                    )}

                    {/* View Live */}
                    {(isApproved || isClosed || isExpired) && (
                      <Link
                        href={`/opportunities/${opp.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <span>View Details</span>
                      </Link>
                    )}

                    {/* Edit */}
                    {(isDraft || isPending || isRejected || isApproved) && (
                      <Link
                        href={`/opportunities/post?editId=${opp.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <Edit3 className="size-3.5 mr-1" />
                        <span>Edit</span>
                      </Link>
                    )}

                    {/* Submit Draft */}
                    {isDraft && (
                      <Button
                        size="sm"
                        disabled={actionLoading}
                        onClick={() => handleSubmitForReview(opp.id)}
                        className="gap-1.5"
                      >
                        <Send className="size-3.5" />
                        <span>Submit for Review</span>
                      </Button>
                    )}

                    {/* Close Active */}
                    {isApproved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmCloseId(opp.id)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                      >
                        <span>Close Opportunity</span>
                      </Button>
                    )}

                    {/* Delete Draft */}
                    {isDraft && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setConfirmDeleteId(opp.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete draft"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Rejection Alert Box */}
                {isRejected && opp.rejectionReason && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-destructive">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>Reviewer Feedback / Rejection Justification:</span>
                    </div>
                    <p className="text-foreground/90 leading-relaxed pl-5 font-mono">
                      {opp.rejectionReason}
                    </p>
                    <div className="pt-2 pl-5">
                      <Link
                        href={`/opportunities/post?editId=${opp.id}`}
                        className={buttonVariants({ variant: "destructive", size: "xs" })}
                      >
                        <span>Revise &amp; Resubmit Listing</span>
                        <ArrowRight className="size-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}

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
        description="Closing this opportunity will archive it immediately and remove it from active member feeds. Applicants will no longer be able to discover or apply to it."
        confirmLabel="Confirm Closure"
        variant="default"
        onConfirm={handleCloseOpportunity}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title="Delete this draft?"
        description="Are you sure you want to delete this draft opportunity? This action is permanent and cannot be undone."
        confirmLabel="Delete Draft"
        variant="destructive"
        onConfirm={handleDeleteOpportunity}
      />
    </div>
  );
}
