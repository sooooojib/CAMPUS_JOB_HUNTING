"use client";

import * as React from "react";
import {
  Search,
  Filter,
  UserX,
  UserCheck,
  Shield,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { humanizeTitle } from "@/lib/utils";
import type { AdminMemberItem, MembershipType, VerificationStatus, AccountStatus } from "@/types";

interface AdminMembersTableProps {
  currentAdminId: string;
}

export function AdminMembersTable({ currentAdminId }: AdminMembersTableProps) {
  const [members, setMembers] = React.useState<AdminMemberItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [membershipTypeFilter, setMembershipTypeFilter] = React.useState<string>("");
  const [verificationFilter, setVerificationFilter] = React.useState<string>("");
  const [accountStatusFilter, setAccountStatusFilter] = React.useState<string>("");

  // Modals
  const [selectedMember, setSelectedMember] = React.useState<AdminMemberItem | null>(null);
  const [suspendModalMember, setSuspendModalMember] = React.useState<AdminMemberItem | null>(null);
  const [suspendAction, setSuspendAction] = React.useState<"SUSPEND" | "RESTORE">("SUSPEND");
  const [actionReason, setActionReason] = React.useState("");
  const [submittingAction, setSubmittingAction] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const fetchMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (membershipTypeFilter) params.set("membershipType", membershipTypeFilter);
      if (verificationFilter) params.set("verificationStatus", verificationFilter);
      if (accountStatusFilter) params.set("accountStatus", accountStatusFilter);
      params.set("page", String(page));
      params.set("pageSize", "15");

      const res = await fetch(`/api/admin/members?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setMembers(json.data);
        setTotalCount(json.totalCount);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, membershipTypeFilter, verificationFilter, accountStatusFilter, page]);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleOpenSuspendModal = (member: AdminMemberItem, action: "SUSPEND" | "RESTORE") => {
    setSuspendModalMember(member);
    setSuspendAction(action);
    setActionReason("");
    setActionError(null);
  };

  const handleConfirmSuspension = async () => {
    if (!suspendModalMember) return;
    if (actionReason.trim().length < 5) {
      setActionError("A stated reason of at least 5 characters is required for accountability.");
      return;
    }

    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/members/${suspendModalMember.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: suspendAction,
          reason: actionReason.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update account status.");
      }

      setSuspendModalMember(null);
      await fetchMembers();
    } catch (err: any) {
      setActionError(err.message || "Failed to execute account action.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VERIFIED":
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 text-[11px]">Verified</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[11px]">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="text-[11px]">Rejected</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive" className="bg-red-800 text-[11px]">Suspended</Badge>;
      default:
        return <Badge variant="secondary" className="text-[11px]">{status}</Badge>;
    }
  };

  const getAccountBadge = (status: AccountStatus) => {
    switch (status) {
      case "ACTIVE":
        return <span className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">● Active</span>;
      case "SUSPENDED":
        return <span className="inline-flex items-center text-xs text-destructive font-medium">● Suspended</span>;
      case "PENDING_VERIFICATION":
        return <span className="inline-flex items-center text-xs text-amber-600 font-medium">● Unverified</span>;
      default:
        return <span className="inline-flex items-center text-xs text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl border border-border bg-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search member by name, email, department..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Membership Type Select */}
          <Select
            value={membershipTypeFilter || "ALL"}
            onValueChange={(val) => {
              setMembershipTypeFilter(val === "ALL" ? "" : (val ?? ""));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs rounded-xl bg-card border-border/80 min-w-[170px]">
              <SelectValue placeholder="All Membership Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Membership Types</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="ALUMNI">Alumni</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Verification Status */}
          <Select
            value={verificationFilter || "ALL"}
            onValueChange={(val) => {
              setVerificationFilter(val === "ALL" ? "" : (val ?? ""));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs rounded-xl bg-card border-border/80 min-w-[175px]">
              <SelectValue placeholder="All Verification Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Verification Statuses</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="PENDING">Pending Review</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Account Status */}
          <Select
            value={accountStatusFilter || "ALL"}
            onValueChange={(val) => {
              setAccountStatusFilter(val === "ALL" ? "" : (val ?? ""));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs rounded-xl bg-card border-border/80 min-w-[160px]">
              <SelectValue placeholder="All Account Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Account Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Member</TableHead>
              <TableHead className="text-xs font-semibold">Membership Type</TableHead>
              <TableHead className="text-xs font-semibold">Department / Info</TableHead>
              <TableHead className="text-xs font-semibold">Verification</TableHead>
              <TableHead className="text-xs font-semibold">Account</TableHead>
              <TableHead className="text-xs font-semibold">Joined</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs">Loading institutional members roster...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <UserX className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No members found</p>
                    <p className="text-xs">Adjust your search query or filter selections.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const isCurrentAdmin = member.id === currentAdminId;
                const isSuspended = member.accountStatus === "SUSPENDED";

                return (
                  <TableRow key={member.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {member.systemRole === "ADMIN" && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/40 text-primary">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono">{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px]">
                        {member.membershipType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-foreground">
                        {member.department || "—"}
                      </div>
                      {member.studentId && (
                        <div className="text-[10px] text-muted-foreground font-mono">
                          ID: {member.studentId}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getVerificationBadge(member.verificationStatus)}</TableCell>
                    <TableCell>{getAccountBadge(member.accountStatus)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedMember(member)}
                          className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                          title="View member details"
                        >
                          <Eye className="size-3.5" />
                          <span>View</span>
                        </Button>

                        {!isCurrentAdmin && (
                          isSuspended ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSuspendModal(member, "RESTORE")}
                              className="h-7 px-2 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            >
                              <UserCheck className="size-3 mr-1" />
                              Restore
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSuspendModal(member, "SUSPEND")}
                              className="h-7 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                            >
                              <UserX className="size-3 mr-1" />
                              Suspend
                            </Button>
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total Members: <strong className="text-foreground">{totalCount}</strong> (Page {page} of {totalPages})
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

      {/* Member Details Modal */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center justify-between">
                <span>Member Profile &amp; Governance Details</span>
                {getVerificationBadge(selectedMember.verificationStatus)}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Permanent institutional identifier: {selectedMember.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Full Name</span>
                  <span className="font-semibold text-foreground">{selectedMember.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Email Address</span>
                  <span className="font-mono text-foreground">{selectedMember.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Membership Role</span>
                  <span className="font-semibold text-foreground">{selectedMember.membershipType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Department</span>
                  <span className="text-foreground">{selectedMember.department || "Not specified"}</span>
                </div>
              </div>

              {selectedMember.lastVerificationRequest && (
                <div className="border border-border/80 rounded-lg p-3 space-y-2">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="size-3.5 text-primary" />
                    <span>Latest Verification Claim</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground">Claimed Role:</span>{" "}
                      <span className="font-medium">{selectedMember.lastVerificationRequest.membershipType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Request Status:</span>{" "}
                      <span className="font-medium">{selectedMember.lastVerificationRequest.status}</span>
                    </div>
                    {selectedMember.lastVerificationRequest.organization && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Organization / Company:</span>{" "}
                        <span className="font-medium">{selectedMember.lastVerificationRequest.organization}</span>
                      </div>
                    )}
                    {selectedMember.lastVerificationRequest.designation && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Designation:</span>{" "}
                        <span className="font-medium">{selectedMember.lastVerificationRequest.designation}</span>
                      </div>
                    )}
                    {selectedMember.lastVerificationRequest.connectionNote && (
                      <div className="col-span-2 p-2 rounded bg-muted/30">
                        <span className="text-muted-foreground block text-[10px]">Connection Explanation:</span>
                        <p className="mt-0.5 text-foreground">{selectedMember.lastVerificationRequest.connectionNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Suspend / Restore Confirmation Modal */}
      {suspendModalMember && (
        <Dialog open={!!suspendModalMember} onOpenChange={() => setSuspendModalMember(null)}>
          <DialogContent className="max-w-md">
            <div className="flex flex-col items-start gap-1">
              <div
                className={`size-11 rounded-2xl flex items-center justify-center mb-2 transition-all ${
                  suspendAction === "SUSPEND"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-8 ring-amber-500/5"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5"
                }`}
              >
                {suspendAction === "SUSPEND" ? (
                  <AlertTriangle className="size-5.5 stroke-[2.2]" />
                ) : (
                  <UserCheck className="size-5.5 stroke-[2.2]" />
                )}
              </div>
              <DialogHeader className="gap-1 text-left">
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                  {suspendAction === "SUSPEND" ? "Suspend Member Account" : "Restore Member Account"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {suspendAction === "SUSPEND"
                    ? `Suspending ${humanizeTitle(suspendModalMember.name)} will temporarily pause their posting, application, and messaging privileges.`
                    : `Restoring ${humanizeTitle(suspendModalMember.name)} will reactivate their full account access.`}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="suspendReason" className="text-xs font-semibold text-foreground">
                  Reason for {suspendAction === "SUSPEND" ? "Suspension" : "Restoration"} (Required)
                </Label>
                <Textarea
                  id="suspendReason"
                  placeholder={
                    suspendAction === "SUSPEND"
                      ? "Please describe why this account is being suspended (e.g. policy violation, inappropriate content, false credentials)..."
                      : "Please state why account access is being restored..."
                  }
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="text-xs min-h-[90px] rounded-xl"
                />
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                  {actionError}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={submittingAction}
                onClick={() => setSuspendModalMember(null)}
                className="rounded-xl text-xs font-medium px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={suspendAction === "SUSPEND" ? "destructive" : "default"}
                disabled={submittingAction}
                onClick={handleConfirmSuspension}
                className="rounded-xl text-xs font-semibold px-4 shadow-xs gap-1.5 cursor-pointer"
              >
                {submittingAction && <Loader2 className="size-3.5 animate-spin" />}
                {suspendAction === "SUSPEND" ? (
                  <>
                    <UserX className="size-3.5" />
                    <span>Suspend Account</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="size-3.5" />
                    <span>Restore Account</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

