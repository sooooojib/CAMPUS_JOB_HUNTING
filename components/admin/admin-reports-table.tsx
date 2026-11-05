"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  UserX,
  MessageSquare,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminReportItem } from "@/types";

export function AdminReportsTable() {
  const [reports, setReports] = React.useState<AdminReportItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<string>("PENDING");
  const [targetTypeFilter, setTargetTypeFilter] = React.useState<string>("");

  // Action Modal
  const [actionReport, setActionReport] = React.useState<AdminReportItem | null>(null);
  const [actionType, setActionType] = React.useState<
    "RESOLVE" | "DISMISS" | "REMOVE_CONTENT" | "SUSPEND_AUTHOR"
  >("DISMISS");
  const [reviewNotes, setReviewNotes] = React.useState("");
  const [submittingAction, setSubmittingAction] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const fetchReports = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL") params.set("status", statusFilter);
      if (targetTypeFilter) params.set("targetType", targetTypeFilter);
      params.set("page", String(page));
      params.set("pageSize", "10");

      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
        setTotalCount(json.totalCount);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load moderation reports:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, targetTypeFilter, page]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleOpenActionModal = (
    report: AdminReportItem,
    type: "RESOLVE" | "DISMISS" | "REMOVE_CONTENT" | "SUSPEND_AUTHOR"
  ) => {
    setActionReport(report);
    setActionType(type);
    setReviewNotes("");
    setActionError(null);
  };

  const handleExecuteAction = async () => {
    if (!actionReport) return;

    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/reports/${actionReport.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          reviewNotes: reviewNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to process moderation action.");
      }

      setActionReport(null);
      await fetchReports();
    } catch (err: any) {
      setActionError(err.message || "Failed to execute report action.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="border-red-500 text-red-600 bg-red-500/10 text-[11px]">Pending Review</Badge>;
      case "RESOLVED":
        return <Badge className="bg-emerald-600 text-white text-[11px]">Resolved</Badge>;
      case "DISMISSED":
        return <Badge variant="secondary" className="text-[11px]">Dismissed</Badge>;
      case "REVIEWED":
        return <Badge variant="outline" className="border-blue-500 text-blue-600 text-[11px]">Reviewed</Badge>;
      default:
        return <Badge variant="secondary" className="text-[11px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top filter tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { label: "Pending Moderation", value: "PENDING" },
            { label: "Resolved Reports", value: "RESOLVED" },
            { label: "Dismissed Reports", value: "DISMISSED" },
            { label: "All Reports", value: "ALL" },
          ].map((tab) => (
            <Button
              key={tab.value}
              size="sm"
              variant={statusFilter === tab.value ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className="h-8 text-xs font-medium shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <select
          value={targetTypeFilter}
          onChange={(e) => {
            setTargetTypeFilter(e.target.value);
            setPage(1);
          }}
          className="h-8 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Content Types</option>
          <option value="POST">Posts Only</option>
          <option value="COMMENT">Comments Only</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Reported Entity</TableHead>
              <TableHead className="text-xs font-semibold">Violation Reason</TableHead>
              <TableHead className="text-xs font-semibold">Content Snippet</TableHead>
              <TableHead className="text-xs font-semibold">Author</TableHead>
              <TableHead className="text-xs font-semibold">Reporter</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Moderation Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs">Loading community moderation queue...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <CheckCircle2 className="size-8 text-emerald-500/80" />
                    <p className="text-sm font-medium">Moderation queue is clean</p>
                    <p className="text-xs">No pending community reports requiring administrator intervention.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {report.targetType === "POST" ? (
                        <FileText className="size-3.5 text-primary" />
                      ) : (
                        <MessageSquare className="size-3.5 text-indigo-500" />
                      )}
                      <span className="font-semibold text-xs text-foreground">
                        {report.targetType}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-red-300 text-red-700 dark:border-red-800 dark:text-red-300 text-[10px]">
                      {report.reason}
                    </Badge>
                    {report.description && (
                      <p className="text-[11px] text-muted-foreground mt-1 max-w-[180px] truncate" title={report.description}>
                        {report.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-foreground italic max-w-[220px] line-clamp-2 bg-muted/40 p-1.5 rounded">
                      &quot;{report.contentSnippet || "Content unavailable or removed"}&quot;
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground">{report.authorName || "Unknown"}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{report.authorEmail || "—"}</span>
                      {report.authorSuspended && (
                        <Badge variant="destructive" className="text-[9px] py-0 px-1 w-fit mt-0.5">
                          Suspended
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground">{report.reporterName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{report.reporterEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    {report.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenActionModal(report, "DISMISS")}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          title="Dismiss report as invalid"
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenActionModal(report, "REMOVE_CONTENT")}
                          className="h-7 px-2 text-xs border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          title="Remove offending content"
                        >
                          <Trash2 className="size-3 mr-1" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenActionModal(report, "SUSPEND_AUTHOR")}
                          className="h-7 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                          title="Remove content and suspend author"
                        >
                          <UserX className="size-3 mr-1" />
                          Suspend
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total Reports: <strong className="text-foreground">{totalCount}</strong> (Page {page} of {totalPages})
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Moderation Resolution Modal */}
      {actionReport && (
        <Dialog open={!!actionReport} onOpenChange={() => setActionReport(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="size-4 text-destructive" />
                <span>
                  {actionType === "DISMISS"
                    ? "Dismiss Content Report"
                    : actionType === "REMOVE_CONTENT"
                    ? "Remove Inappropriate Content"
                    : actionType === "SUSPEND_AUTHOR"
                    ? "Remove Content & Suspend Author"
                    : "Resolve Report"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {actionType === "DISMISS"
                  ? "Mark this report as dismissed. The reported content will remain intact and visible."
                  : actionType === "REMOVE_CONTENT"
                  ? "The reported post/comment will immediately be marked as REMOVED and hidden from all community members."
                  : actionType === "SUSPEND_AUTHOR"
                  ? "The reported content will be removed, and the author's account will be suspended from platform activities."
                  : "Resolve this report without modifying content."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                <span className="text-[11px] text-muted-foreground block font-medium">Flagged Content:</span>
                <p className="italic text-foreground">&quot;{actionReport.contentSnippet}&quot;</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reviewNotes" className="text-xs">
                  Administrative Review Notes (Logged to Audit Trail)
                </Label>
                <Textarea
                  id="reviewNotes"
                  placeholder="Explain the moderation action or findings..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="text-xs h-20"
                />
              </div>

              {actionError && (
                <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {actionError}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                size="sm"
                variant="outline"
                disabled={submittingAction}
                onClick={() => setActionReport(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={
                  actionType === "DISMISS"
                    ? "outline"
                    : actionType === "SUSPEND_AUTHOR"
                    ? "destructive"
                    : "default"
                }
                disabled={submittingAction}
                onClick={handleExecuteAction}
              >
                {submittingAction && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                {actionType === "DISMISS"
                  ? "Confirm Dismissal"
                  : actionType === "REMOVE_CONTENT"
                  ? "Confirm Content Removal"
                  : actionType === "SUSPEND_AUTHOR"
                  ? "Confirm Suspension & Removal"
                  : "Resolve Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

