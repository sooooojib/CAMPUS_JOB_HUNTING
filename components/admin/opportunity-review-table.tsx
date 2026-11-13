"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Building,
  GraduationCap,
  Calendar,
  Briefcase,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface PendingOpportunityItem {
  id: string;
  title: string;
  description: string;
  type: string;
  sourceType: string;
  companyName: string;
  companyId?: string | null;
  location: string;
  workplaceType: string;
  minCgpa?: number | null;
  minAcademicYear?: string | null;
  targetDepartments: string[];
  openToAllDepartments: boolean;
  deadline: string | Date;
  createdAt: string | Date;
  poster: {
    id: string;
    name: string;
    email: string;
    membershipType: string;
    verificationStatus: string;
  };
}

interface OpportunityReviewTableProps {
  initialOpportunities: PendingOpportunityItem[];
}

export function OpportunityReviewTable({ initialOpportunities }: OpportunityReviewTableProps) {
  const [opportunities, setOpportunities] = React.useState<PendingOpportunityItem[]>(initialOpportunities);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [rejectModalItem, setRejectModalItem] = React.useState<PendingOpportunityItem | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [rejectError, setRejectError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async (opp: PendingOpportunityItem) => {
    setLoadingId(opp.id);
    try {
      const res = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opp.id,
          decision: "APPROVE",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to approve opportunity.");
      }

      setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    if (!rejectionReason.trim()) {
      setRejectError("A rejection reason is mandatory.");
      return;
    }

    setLoadingId(rejectModalItem.id);
    setRejectError(null);

    try {
      const res = await fetch("/api/admin/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: rejectModalItem.id,
          decision: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to reject opportunity.");
      }

      setOpportunities((prev) => prev.filter((o) => o.id !== rejectModalItem.id));
      setRejectModalItem(null);
      setRejectionReason("");
      router.refresh();
    } catch (err: any) {
      setRejectError(err.message || "Failed to reject opportunity.");
    } finally {
      setLoadingId(null);
    }
  };

  if (opportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
        <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-foreground">Opportunity Queue is Clear</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          No pending career opportunities currently require moderation. Newly submitted official employer postings and verified community leads will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[280px]">Opportunity &amp; Company</TableHead>
              <TableHead>Submitting Member</TableHead>
              <TableHead>Provenance</TableHead>
              <TableHead>Academic Targeting</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp) => {
              const isLoading = loadingId === opp.id;
              const formattedDeadline = new Date(opp.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <TableRow key={opp.id}>
                  <TableCell>
                    <div className="font-bold text-foreground text-sm">{opp.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Building className="size-3 text-muted-foreground" />
                      <span>{opp.companyName}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-[10px] h-4">
                        {opp.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-foreground">{opp.poster.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{opp.poster.email}</div>
                    <Badge variant="secondary" className="text-[9px] h-4 mt-0.5">
                      {opp.poster.membershipType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                    >
                      Community Shared
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground space-y-0.5">
                    <div className="flex items-center gap-1 text-foreground font-medium">
                      <GraduationCap className="size-3 text-muted-foreground" />
                      <span>
                        {opp.openToAllDepartments
                          ? "Open to All Departments"
                          : opp.targetDepartments.join(", ") || "Targeted"}
                      </span>
                    </div>
                    {opp.minCgpa && (
                      <div className="text-[11px] text-muted-foreground">
                        Min CGPA: <span className="font-mono font-semibold text-foreground">{opp.minCgpa.toFixed(2)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="size-3" />
                      {formattedDeadline}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isLoading}
                        onClick={() => handleApprove(opp)}
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      >
                        {isLoading ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                        <span>Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => {
                          setRejectModalItem(opp);
                          setRejectionReason("");
                          setRejectError(null);
                        }}
                        className="text-xs h-8 text-destructive hover:bg-destructive/10 border-destructive/30 gap-1"
                      >
                        <XCircle className="size-3.5" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={!!rejectModalItem} onOpenChange={(open) => !open && setRejectModalItem(null)}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-start gap-1">
            <div className="size-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center ring-8 ring-destructive/5 mb-2">
              <AlertTriangle className="size-5.5 stroke-[2.2]" />
            </div>
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Decline Job Opportunity
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Provide feedback for not approving &ldquo;{rejectModalItem?.title.replace(/\b\d{10,14}\b/g, "").trim()}&rdquo; at{" "}
                {rejectModalItem?.companyName.replace(/\b\d{10,14}\b/g, "").trim()}. The poster will receive this guidance.
              </DialogDescription>
            </DialogHeader>
          </div>

          {rejectError && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
              {rejectError}
            </div>
          )}

          <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="oppRejectionReason" className="text-xs font-semibold text-foreground">
                Feedback for Poster (Required)
              </Label>
              <Textarea
                id="oppRejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please provide a verified corporate email, full job requirements, or valid compensation details..."
                rows={4}
                className="text-xs rounded-xl"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectModalItem(null)}
                className="rounded-xl text-xs font-medium px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={loadingId === rejectModalItem?.id}
                className="rounded-xl text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
              >
                {loadingId === rejectModalItem?.id && <Loader2 className="size-3.5 animate-spin" />}
                <span>Decline Opportunity</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
