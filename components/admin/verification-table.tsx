"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Building2,
  GraduationCap,
  Calendar,
  FileText,
  IdCard,
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
import { humanizeTitle } from "@/lib/utils";

export interface PendingVerificationRequestItem {
  id: string;
  userId: string;
  membershipType: string;
  status: string;
  institutionalId?: string | null;
  department?: string | null;
  academicYear?: string | null;
  graduationYear?: number | null;
  organization?: string | null;
  designation?: string | null;
  workEmail?: string | null;
  connectionNote?: string | null;
  proofDetails?: string | null;
  proofDocumentUrl?: string | null;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    membershipType: string;
    verificationStatus: string;
    createdAt: string | Date;
  };
}

interface VerificationTableProps {
  initialRequests?: PendingVerificationRequestItem[];
}

export function VerificationTable({ initialRequests = [] }: VerificationTableProps) {
  const [requests, setRequests] = React.useState<PendingVerificationRequestItem[]>(initialRequests);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const [rejectModalItem, setRejectModalItem] = React.useState<PendingVerificationRequestItem | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [rejectError, setRejectError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (initialRequests) {
      setRequests(initialRequests);
    }
  }, [initialRequests]);

  const handleApprove = async (req: PendingVerificationRequestItem) => {
    setLoadingId(req.id);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: req.id,
          decision: "APPROVE",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Approval failed.");
      }

      setRequests((prev) => prev.filter((r) => r.id !== req.id));
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
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: rejectModalItem.id,
          decision: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Rejection failed.");
      }

      setRequests((prev) => prev.filter((r) => r.id !== rejectModalItem.id));
      setRejectModalItem(null);
      setRejectionReason("");
      router.refresh();
    } catch (err: any) {
      setRejectError(err.message || "Failed to reject verification.");
    } finally {
      setLoadingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
        <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-foreground">All Verification Requests Resolved</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          The membership verification queue is completely clear. Newly submitted student, alumni, faculty, and employer credentials will automatically appear here.
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
              <TableHead className="w-[220px]">Applicant &amp; Account</TableHead>
              <TableHead>Target Identity</TableHead>
              <TableHead>Institutional Affiliation Claim</TableHead>
              <TableHead>Verification Evidence</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => {
              const isLoading = loadingId === req.id;
              const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-bold text-foreground text-sm">{req.user.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{req.user.email}</div>
                    {req.workEmail && req.workEmail !== req.user.email && (
                      <div className="text-[11px] text-primary font-mono mt-0.5">
                        Work: {req.workEmail}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {req.membershipType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs space-y-1">
                    {req.institutionalId ? (
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        <IdCard className="size-3.5 shrink-0" />
                        <span>ID: {req.institutionalId}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground italic">No ID specified</div>
                    )}
                    {req.department && (
                      <div className="flex items-center gap-1 text-foreground font-medium pt-0.5">
                        <GraduationCap className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{req.department}</span>
                      </div>
                    )}
                    {req.organization && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Building2 className="size-3 shrink-0" />
                        <span>{req.organization} ({req.designation || "Affiliate"})</span>
                      </div>
                    )}
                    {req.graduationYear && (
                      <div className="text-[11px] text-muted-foreground">
                        Class of {req.graduationYear}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[260px]">
                    {req.proofDetails && (
                      <p className="line-clamp-2 italic text-[11px] text-foreground">
                        &quot;{req.proofDetails}&quot;
                      </p>
                    )}
                    {req.connectionNote && (
                      <p className="line-clamp-2 text-[11px] text-muted-foreground mt-0.5">
                        Note: {req.connectionNote}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="size-3" />
                      {formattedDate}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isLoading}
                        onClick={() => handleApprove(req)}
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      >
                        {isLoading ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        <span>Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => {
                          setRejectModalItem(req);
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

      {/* Reject Reason Dialog */}
      <Dialog open={!!rejectModalItem} onOpenChange={(open) => !open && setRejectModalItem(null)}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-start gap-1">
            <div className="size-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center ring-8 ring-destructive/5 mb-2">
              <AlertTriangle className="size-5.5 stroke-[2.2]" />
            </div>
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Decline Verification Request
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Provide feedback for declining {humanizeTitle(rejectModalItem?.user.name)}&apos;s{" "}
                {(rejectModalItem?.membershipType || "member").toLowerCase().replace("_", " ")} verification request. They will receive this note and be allowed to resubmit.
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
              <Label htmlFor="rejectionReason" className="text-xs font-semibold text-foreground">
                Explanation for Applicant (Required)
              </Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Student ID could not be verified against the registrar department records. Please check your ID number or submit an enrollment confirmation document."
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
                <span>Decline Request</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
