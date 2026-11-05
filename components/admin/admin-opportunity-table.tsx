"use client";

import * as React from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
  Lock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import type { AdminOpportunityItem } from "@/types";

export function AdminOpportunityTable() {
  const [opportunities, setOpportunities] = React.useState<AdminOpportunityItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<string>("PENDING");
  const [typeFilter, setTypeFilter] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Action modals
  const [selectedItem, setSelectedItem] = React.useState<AdminOpportunityItem | null>(null);
  const [actionItem, setActionItem] = React.useState<AdminOpportunityItem | null>(null);
  const [actionType, setActionType] = React.useState<"APPROVE" | "REJECT" | "CLOSE" | "DELETE">("APPROVE");
  const [actionReason, setActionReason] = React.useState("");
  const [submittingAction, setSubmittingAction] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const fetchOpportunities = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      params.set("page", String(page));
      params.set("pageSize", "12");

      const res = await fetch(`/api/admin/opportunities?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setOpportunities(json.data);
        setTotalCount(json.totalCount);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load opportunities:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, searchQuery, page]);

  React.useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleOpenActionModal = (
    item: AdminOpportunityItem,
    type: "APPROVE" | "REJECT" | "CLOSE" | "DELETE"
  ) => {
    setActionItem(item);
    setActionType(type);
    setActionReason("");
    setActionError(null);
  };

  const handleExecuteAction = async () => {
    if (!actionItem) return;

    if (actionType === "REJECT" && actionReason.trim().length < 5) {
      setActionError("A rejection feedback reason of at least 5 characters is required.");
      return;
    }

    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/opportunities/${actionItem.id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          reason: actionReason.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to moderate opportunity.");
      }

      setActionItem(null);
      await fetchOpportunities();
    } catch (err: any) {
      setActionError(err.message || "Failed to execute moderation action.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-600 text-white text-[11px]">Approved</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[11px]">Pending Review</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="text-[11px]">Rejected</Badge>;
      case "CLOSED":
        return <Badge variant="secondary" className="text-[11px]">Closed</Badge>;
      case "EXPIRED":
        return <Badge variant="outline" className="text-muted-foreground text-[11px]">Expired</Badge>;
      default:
        return <Badge variant="secondary" className="text-[11px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Tab Navigation & Search Bar */}
      <div className="flex flex-col gap-3">
        {/* Quick Status Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { label: "Pending Review", value: "PENDING" },
            { label: "Approved Postings", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Closed", value: "CLOSED" },
            { label: "All Postings", value: "ALL" },
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

        {/* Filter inputs */}
        <div className="p-4 rounded-xl border border-border bg-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunity title, description, company..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Opportunity Types</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Role / Opportunity</TableHead>
              <TableHead className="text-xs font-semibold">Company &amp; Source</TableHead>
              <TableHead className="text-xs font-semibold">Poster Details</TableHead>
              <TableHead className="text-xs font-semibold">Eligibility</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Deadline</TableHead>
              <TableHead className="text-xs font-semibold text-right">Moderation Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs">Loading opportunities moderation queue...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Briefcase className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No opportunities match this filter</p>
                    <p className="text-xs">Switch tabs or adjust your search keywords.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opp) => (
                <TableRow key={opp.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground">{opp.title}</span>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <Badge variant="secondary" className="text-[10px] py-0 px-1">
                          {opp.type.replace("_", " ")}
                        </Badge>
                        <span>•</span>
                        <span>{opp.workplaceType.replace("_", " ")}</span>
                        <span>•</span>
                        <span>{opp.location}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground">{opp.companyName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {opp.isOfficial ? "Official Employer" : "Community Shared"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground font-medium">{opp.posterName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{opp.posterEmail}</span>
                      <span className="text-[10px] text-primary">{opp.posterRole}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[11px] text-foreground">
                      {opp.openToAllDepartments
                        ? "Open to all"
                        : opp.targetDepartments.join(", ") || "Any"}
                    </div>
                    {opp.minCgpa && (
                      <div className="text-[10px] text-muted-foreground">
                        Min CGPA: {opp.minCgpa.toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(opp.status)}
                      {opp.rejectionReason && (
                        <span className="text-[10px] text-destructive truncate max-w-[120px]" title={opp.rejectionReason}>
                          Reason: {opp.rejectionReason}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(opp.deadline).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedItem(opp)}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        title="View full posting"
                      >
                        <Eye className="size-3.5" />
                      </Button>

                      {opp.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenActionModal(opp, "APPROVE")}
                            className="h-7 px-2 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          >
                            <CheckCircle2 className="size-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenActionModal(opp, "REJECT")}
                            className="h-7 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="size-3.5 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {opp.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenActionModal(opp, "CLOSE")}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Lock className="size-3 mr-1" />
                          Close
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenActionModal(opp, "DELETE")}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        title="Delete listing"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total Opportunities: <strong className="text-foreground">{totalCount}</strong> (Page {page} of {totalPages})
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

      {/* Opportunity Detail Viewer Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center justify-between">
                <span>{selectedItem.title}</span>
                {getStatusBadge(selectedItem.status)}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedItem.companyName} • {selectedItem.location} ({selectedItem.workplaceType})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Poster Name</span>
                  <span className="font-semibold text-foreground">{selectedItem.posterName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Poster Email</span>
                  <span className="font-mono text-foreground">{selectedItem.posterEmail}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Target Departments</span>
                  <span className="text-foreground">
                    {selectedItem.openToAllDepartments
                      ? "All university departments"
                      : selectedItem.targetDepartments.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Total Applications</span>
                  <span className="font-semibold text-foreground">{selectedItem.applicationsCount}</span>
                </div>
              </div>

              {selectedItem.salaryOrStipend && (
                <div>
                  <span className="text-muted-foreground block text-[11px]">Compensation</span>
                  <span className="font-medium text-foreground">{selectedItem.salaryOrStipend}</span>
                </div>
              )}

              {selectedItem.rejectionReason && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                  <span className="font-semibold block text-xs">Administrative Rejection Feedback:</span>
                  <p className="mt-1">{selectedItem.rejectionReason}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Moderation Action Modal */}
      {actionItem && (
        <Dialog open={!!actionItem} onOpenChange={() => setActionItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                {actionType === "APPROVE" ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : actionType === "REJECT" ? (
                  <XCircle className="size-4 text-destructive" />
                ) : actionType === "DELETE" ? (
                  <Trash2 className="size-4 text-destructive" />
                ) : (
                  <Lock className="size-4 text-amber-600" />
                )}
                <span>
                  {actionType === "APPROVE"
                    ? "Approve Opportunity"
                    : actionType === "REJECT"
                    ? "Reject Opportunity"
                    : actionType === "CLOSE"
                    ? "Close Opportunity Posting"
                    : "Delete Opportunity Listing"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {actionType === "APPROVE"
                  ? `Authorize "${actionItem.title}" to be visible across university job feeds.`
                  : actionType === "REJECT"
                  ? `Reject "${actionItem.title}". Mandatory feedback will be sent to the poster.`
                  : actionType === "CLOSE"
                  ? `Mark "${actionItem.title}" as closed so no new applications can be accepted.`
                  : `Permanently delete "${actionItem.title}". This cannot be undone.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="actionReason" className="text-xs">
                  {actionType === "REJECT"
                    ? "Mandatory Rejection Feedback (min 5 chars) *"
                    : "Optional Administrative Note / Stated Reason"}
                </Label>
                <Textarea
                  id="actionReason"
                  placeholder={
                    actionType === "REJECT"
                      ? "Explain what is missing or non-compliant with campus career standards..."
                      : "Optional explanation for audit logging..."
                  }
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="text-xs h-24"
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
                onClick={() => setActionItem(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={
                  actionType === "APPROVE"
                    ? "default"
                    : actionType === "CLOSE"
                    ? "secondary"
                    : "destructive"
                }
                disabled={submittingAction}
                onClick={handleExecuteAction}
              >
                {submittingAction && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                {actionType === "APPROVE"
                  ? "Authorize & Approve"
                  : actionType === "REJECT"
                  ? "Reject Posting"
                  : actionType === "CLOSE"
                  ? "Confirm Closure"
                  : "Delete Listing"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

