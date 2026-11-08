"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  GraduationCap,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Users,
  X,
  ExternalLink,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { ConnectionButton, ConnectionState } from "@/components/community/connection-button";
import type { MemberDirectoryItem, AdminMemberItem, VerificationStatus, AccountStatus } from "@/types";

interface MemberDirectoryViewProps {
  isAdmin?: boolean;
  currentAdminId?: string;
}

export function MemberDirectoryView({
  isAdmin = false,
  currentAdminId,
}: MemberDirectoryViewProps) {
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Search and Pagination
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  // Admin filter dropdowns
  const [membershipTypeFilter, setMembershipTypeFilter] = React.useState<string>("ALL");
  const [verificationFilter, setVerificationFilter] = React.useState<string>("ALL");
  const [accountStatusFilter, setAccountStatusFilter] = React.useState<string>("ALL");

  // Admin modal states
  const [suspendModalMember, setSuspendModalMember] = React.useState<any | null>(null);
  const [suspendAction, setSuspendAction] = React.useState<"SUSPEND" | "RESTORE">("SUSPEND");
  const [actionReason, setActionReason] = React.useState("");
  const [submittingSuspend, setSubmittingSuspend] = React.useState(false);

  const [confirmDeleteMember, setConfirmDeleteMember] = React.useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [confirmRevokeMember, setConfirmRevokeMember] = React.useState<any | null>(null);
  const [revokeLoading, setRevokeLoading] = React.useState(false);

  // Fetch directory members
  const fetchMembers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        // Query admin member management endpoint
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        if (membershipTypeFilter !== "ALL") params.set("membershipType", membershipTypeFilter);
        if (verificationFilter !== "ALL") params.set("verificationStatus", verificationFilter);
        if (accountStatusFilter !== "ALL") params.set("accountStatus", accountStatusFilter);
        params.set("page", String(page));
        params.set("pageSize", "12");

        const res = await fetch(`/api/admin/members?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to load member records.");
        }

        setMembers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } else {
        // Query general member directory endpoint
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        params.set("page", String(page));
        params.set("pageSize", "12");

        const res = await fetch(`/api/members?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to load directory.");
        }

        setMembers(data.items || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, search, page, membershipTypeFilter, verificationFilter, accountStatusFilter]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const handleResetFilters = () => {
    setSearch("");
    setMembershipTypeFilter("ALL");
    setVerificationFilter("ALL");
    setAccountStatusFilter("ALL");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search.trim() ||
      (isAdmin &&
        (membershipTypeFilter !== "ALL" ||
          verificationFilter !== "ALL" ||
          accountStatusFilter !== "ALL"))
  );

  // Admin Action: Quick Verify Member
  const handleVerifyMember = async (memberId: string, memberName: string) => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "VERIFIED",
          reason: "Approved by administrator via Member Network.",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to verify member.");
      }
      toast.success(`${memberName} has been verified!`);
      await fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Failed to verify member.");
    }
  };

  // Admin Action: Revoke Verification
  const handleConfirmRevoke = async () => {
    if (!confirmRevokeMember) return;
    setRevokeLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${confirmRevokeMember.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PENDING",
          reason: "Verification revoked by administrator.",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to revoke verification.");
      }
      toast.success(`Verification revoked for ${confirmRevokeMember.name}.`);
      setConfirmRevokeMember(null);
      await fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke verification.");
    } finally {
      setRevokeLoading(false);
    }
  };

  // Admin Action: Suspend / Restore Account
  const handleOpenSuspendModal = (member: any, action: "SUSPEND" | "RESTORE") => {
    setSuspendModalMember(member);
    setSuspendAction(action);
    setActionReason("");
  };

  const handleConfirmSuspension = async () => {
    if (!suspendModalMember) return;
    if (suspendAction === "SUSPEND" && actionReason.trim().length < 5) {
      toast.error("A stated reason of at least 5 characters is required.");
      return;
    }

    setSubmittingSuspend(true);
    try {
      const res = await fetch(`/api/admin/members/${suspendModalMember.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: suspendAction,
          reason: actionReason.trim() || "Status updated by administrator.",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update account status.");
      }

      toast.success(
        suspendAction === "SUSPEND"
          ? `${suspendModalMember.name}'s account has been suspended.`
          : `${suspendModalMember.name}'s account has been restored.`
      );
      setSuspendModalMember(null);
      await fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update account status.");
    } finally {
      setSubmittingSuspend(false);
    }
  };

  // Admin Action: Delete Member
  const handleDeleteMember = async () => {
    if (!confirmDeleteMember) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${confirmDeleteMember.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete account.");
      }
      toast.success(`Account for ${confirmDeleteMember.name} has been permanently deleted.`);
      setConfirmDeleteMember(null);
      await fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderVerificationBadge = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <Badge className="bg-emerald-600/90 text-white hover:bg-emerald-700 text-[10px] font-semibold rounded-full px-2 py-0.5 gap-1">
            <CheckCircle2 className="size-3" />
            <span>Verified</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/60 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[10px] font-semibold rounded-full px-2 py-0.5 gap-1"
          >
            <Clock className="size-3" />
            <span>Pending</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="text-[10px] font-semibold rounded-full px-2 py-0.5">
            Rejected
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge variant="destructive" className="bg-rose-800 text-white text-[10px] font-semibold rounded-full px-2 py-0.5">
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] font-semibold rounded-full px-2 py-0.5">
            {status || "Unverified"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header & Admin Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={
              isAdmin
                ? "Search members by name, email, department, student ID..."
                : "Search directory by name, department, or keyword..."
            }
            className="pl-11 pr-11 bg-card h-12 text-xs sm:text-sm rounded-2xl border-border/70 shadow-2xs focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Admin Filter Toolbar (Strictly for Admin) */}
        {isAdmin && (
          <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-b border-border/40 pb-2">
              <div className="flex items-center gap-1.5 text-foreground">
                <Filter className="size-3.5 text-primary" />
                <span>Admin Member Governance Filters</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Showing {totalCount} records
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Membership Type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Membership Type
                </label>
                <Select
                  value={membershipTypeFilter}
                  onValueChange={(val) => {
                    setMembershipTypeFilter(val || "ALL");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                    <SelectValue placeholder="All Membership Types" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Membership Types</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="ALUMNI">Alumni</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verification Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Verification Status
                </label>
                <Select
                  value={verificationFilter}
                  onValueChange={(val) => {
                    setVerificationFilter(val || "ALL");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                    <SelectValue placeholder="All Verification Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Verification Statuses</SelectItem>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="PENDING">Pending Review</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Account Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Account Status
                </label>
                <Select
                  value={accountStatusFilter}
                  onValueChange={(val) => {
                    setAccountStatusFilter(val || "ALL");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="rounded-xl text-xs bg-background h-9">
                    <SelectValue placeholder="All Account Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Account Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Directory Stats Bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{totalCount}</span>
            <span>
              {isAdmin
                ? "total members registered in university database"
                : "verified university members found"}
            </span>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                Filters Active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-full"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid or Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-4 rounded-3xl border border-border bg-card animate-pulse">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-2xl bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                  <div className="h-3 bg-muted rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-muted rounded-md w-full" />
              <div className="h-3 bg-muted rounded-md w-2/3" />
              <div className="pt-2 flex justify-between items-center">
                <div className="h-6 bg-muted rounded-full w-20" />
                <div className="h-6 bg-muted rounded-full w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-3xl border border-destructive/30 bg-destructive/5 space-y-3">
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchMembers()} className="rounded-full">
            Retry Query
          </Button>
        </div>
      ) : members.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Users className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No members match your criteria</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or clearing some filters to broaden your search within the campus network.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs mt-2 rounded-full">
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {members.map((member) => {
            const isVerified = member.verificationStatus === "VERIFIED";
            const isSuspended = member.accountStatus === "SUSPENDED";
            const isSelf = member.id === currentAdminId;

            const initials = member.name
              .split(" ")
              .map((n: string) => n[0])
              .filter(Boolean)
              .join("")
              .slice(0, 2)
              .toUpperCase() || "UC";

            return (
              <Card
                key={member.id}
                className={`rounded-3xl border transition-all hover:border-primary/40 hover:shadow-lg flex flex-col justify-between p-6 ${
                  isSuspended
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border/70 bg-card"
                }`}
              >
                <CardContent className="p-0 space-y-4">
                  {/* Member Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <Avatar className="size-12 border-2 border-background shadow-xs shrink-0 rounded-2xl">
                        <AvatarImage src={member.image || undefined} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm rounded-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/profile/${member.id}`}
                            className="text-base font-bold text-foreground hover:text-primary transition-colors leading-snug break-words"
                          >
                            {member.name}
                          </Link>
                          {isVerified && (
                            <span title="Registrar-Verified Member">
                              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>

                        {/* Email for admin */}
                        {isAdmin && member.email && (
                          <div className="text-[11px] text-muted-foreground font-mono truncate">
                            {member.email}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-mono tracking-wider rounded-full px-2 py-0.5"
                          >
                            {(member.membershipType || "MEMBER").replace("_", " ")}
                          </Badge>
                          {isAdmin && (
                            <>
                              {renderVerificationBadge(member.verificationStatus)}
                              {isSuspended && (
                                <Badge variant="destructive" className="text-[10px] rounded-full px-2 py-0.5">
                                  Suspended
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Non-Admin: Connection Button */}
                    {!isAdmin && (
                      <div className="shrink-0 pt-0.5">
                        <ConnectionButton
                          userId={member.id}
                          initialState={(member.connectionStatus as ConnectionState) || "NONE"}
                          connectionId={member.connectionId}
                          size="xs"
                          className="rounded-full px-3 py-1 font-semibold"
                          onStateChange={() => {
                            fetchMembers();
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Headline & Bio */}
                  {member.headline ? (
                    <p className="text-xs text-foreground/90 font-medium line-clamp-2">
                      {member.headline}
                    </p>
                  ) : member.bio ? (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {member.bio}
                    </p>
                  ) : null}

                  {/* Context Info (Dept, Student ID, Company) */}
                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    {member.department && (
                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {member.department}
                          {member.graduationYear
                            ? ` ('${String(member.graduationYear).slice(-2)})`
                            : ""}
                        </span>
                      </div>
                    )}

                    {isAdmin && member.studentId && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground truncate">
                        <span>Student ID:</span>
                        <span className="font-semibold text-foreground">{member.studentId}</span>
                      </div>
                    )}

                    {(member.company || member.designation) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {member.designation ? `${member.designation} at ` : ""}
                          {member.company || "Enterprise Partner"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags (for non-admin or general view) */}
                  {!isAdmin && member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.skills.slice(0, 3).map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-muted/60 px-2.5 py-0.5 rounded-full text-foreground/80 font-medium border border-border/40"
                        >
                          {s}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground px-1 self-center">
                          +{member.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Admin Moderation Toolbar on Each Card */}
                  {isAdmin ? (
                    <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Verify / Revoke Verification */}
                        {isVerified ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirmRevokeMember(member)}
                            className="h-7 px-2.5 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 rounded-full"
                          >
                            <span>Revoke</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleVerifyMember(member.id, member.name)}
                            className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-full gap-1"
                          >
                            <CheckCircle2 className="size-3" />
                            <span>Verify</span>
                          </Button>
                        )}

                        {/* Suspend / Restore (blocked for current admin self) */}
                        {!isSelf && (
                          isSuspended ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSuspendModal(member, "RESTORE")}
                              className="h-7 px-2.5 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-full gap-1"
                            >
                              <UserCheck className="size-3" />
                              <span>Restore</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSuspendModal(member, "SUSPEND")}
                              className="h-7 px-2.5 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 rounded-full gap-1"
                            >
                              <UserX className="size-3" />
                              <span>Suspend</span>
                            </Button>
                          )
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Delete account */}
                        {!isSelf && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setConfirmDeleteMember(member)}
                            className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                            title="Delete member permanently"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}

                        <Link
                          href={`/profile/${member.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline py-1 px-2 rounded-full hover:bg-primary/5 transition-colors"
                        >
                          <span>Profile</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Non-Admin Actions */
                    <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                      <Link
                        href={`/profile/${member.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline py-1 px-2.5 rounded-full hover:bg-primary/5 transition-colors"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="text-xs rounded-full"
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            Page <span className="font-semibold text-foreground">{page}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="text-xs rounded-full"
          >
            Next
          </Button>
        </div>
      )}

      {/* Suspend Account Modal */}
      <Dialog
        open={!!suspendModalMember}
        onOpenChange={(open) => !open && setSuspendModalMember(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {suspendAction === "SUSPEND" ? "Suspend Member Account" : "Restore Member Account"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {suspendAction === "SUSPEND"
                ? `Suspending ${suspendModalMember?.name} will immediately block their access to community posts, applications, and messaging.`
                : `Restoring ${suspendModalMember?.name} will reactivate their credentials and community access.`}
            </DialogDescription>
          </DialogHeader>

          {suspendAction === "SUSPEND" && (
            <div className="space-y-2 py-2">
              <Label htmlFor="suspendReason" className="text-xs font-bold text-foreground">
                Accountability Reason (Required)
              </Label>
              <Textarea
                id="suspendReason"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Detail the policy violation or reason for suspension (minimum 5 characters)..."
                className="text-xs min-h-[90px] rounded-2xl"
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuspendModalMember(null)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              variant={suspendAction === "SUSPEND" ? "destructive" : "default"}
              size="sm"
              disabled={submittingSuspend || (suspendAction === "SUSPEND" && actionReason.trim().length < 5)}
              onClick={handleConfirmSuspension}
              className="rounded-full text-xs"
            >
              {submittingSuspend && <Loader2 className="size-3 animate-spin mr-1.5" />}
              {suspendAction === "SUSPEND" ? "Confirm Suspension" : "Restore Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Revoke Verification Dialog */}
      <ConfirmDialog
        open={!!confirmRevokeMember}
        onOpenChange={(open) => !open && setConfirmRevokeMember(null)}
        title="Revoke Verification?"
        description={`Are you sure you want to revoke university verification for ${confirmRevokeMember?.name}? Their status will revert to Pending.`}
        confirmLabel="Revoke Verification"
        variant="destructive"
        isLoading={revokeLoading}
        onConfirm={handleConfirmRevoke}
      />

      {/* Confirm Delete Member Dialog */}
      <ConfirmDialog
        open={!!confirmDeleteMember}
        onOpenChange={(open) => !open && setConfirmDeleteMember(null)}
        title="Delete Member Account?"
        description={`Are you sure you want to permanently delete the account for ${confirmDeleteMember?.name}? This action is irreversible and removes their profile, postings, and records from the platform.`}
        confirmLabel="Permanently Delete"
        variant="destructive"
        isLoading={deleteLoading}
        onConfirm={handleDeleteMember}
      />
    </div>
  );
}
