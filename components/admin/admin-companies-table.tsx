"use client";

import * as React from "react";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Users,
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
import type { AdminCompanyItem } from "@/types";

export function AdminCompaniesTable() {
  const [companies, setCompanies] = React.useState<AdminCompanyItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [verifiedFilter, setVerifiedFilter] = React.useState<string>("");
  const [suspendedFilter, setSuspendedFilter] = React.useState<string>("");

  // Action Modal
  const [actionCompany, setActionCompany] = React.useState<AdminCompanyItem | null>(null);
  const [actionType, setActionType] = React.useState<"VERIFY" | "UNVERIFY" | "SUSPEND" | "RESTORE">("VERIFY");
  const [actionReason, setActionReason] = React.useState("");
  const [submittingAction, setSubmittingAction] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const fetchCompanies = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (verifiedFilter) params.set("isVerified", verifiedFilter);
      if (suspendedFilter) params.set("isSuspended", suspendedFilter);
      params.set("page", String(page));
      params.set("pageSize", "12");

      const res = await fetch(`/api/admin/companies?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCompanies(json.data);
        setTotalCount(json.totalCount);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, verifiedFilter, suspendedFilter, page]);

  React.useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenAction = (company: AdminCompanyItem, type: "VERIFY" | "UNVERIFY" | "SUSPEND" | "RESTORE") => {
    setActionCompany(company);
    setActionType(type);
    setActionReason("");
    setActionError(null);
  };

  const handleExecuteAction = async () => {
    if (!actionCompany) return;

    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/companies/${actionCompany.id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          reason: actionReason.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update company status.");
      }

      setActionCompany(null);
      await fetchCompanies();
    } catch (err: any) {
      setActionError(err.message || "Failed to execute company action.");
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="p-4 rounded-xl border border-border bg-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search company name, industry, slug..."
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
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Verification States</option>
            <option value="true">Verified Organizations</option>
            <option value="false">Unverified Organizations</option>
          </select>

          <select
            value={suspendedFilter}
            onChange={(e) => {
              setSuspendedFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Account States</option>
            <option value="false">Active Only</option>
            <option value="true">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Companies Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs font-semibold">Company</TableHead>
              <TableHead className="text-xs font-semibold">Industry &amp; Location</TableHead>
              <TableHead className="text-xs font-semibold">Registered By</TableHead>
              <TableHead className="text-xs font-semibold">Activity</TableHead>
              <TableHead className="text-xs font-semibold">Verification</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs">Loading registered companies...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Building2 className="size-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">No companies found</p>
                    <p className="text-xs">Try adjusting your search query or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                        <span>{company.name}</span>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        slug: /{company.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-foreground">{company.industry || "General Industry"}</div>
                    <div className="text-[10px] text-muted-foreground">{company.location || "Remote / Various"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground">{company.creatorName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{company.creatorEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="size-3 text-primary" />
                        {company.opportunitiesCount} opps
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {company.membersCount} members
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.isVerified ? (
                      <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                        <CheckCircle2 className="size-2.5" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.isSuspended ? (
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <AlertTriangle className="size-2.5" />
                        Suspended
                      </Badge>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">● Active</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {company.isVerified ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenAction(company, "UNVERIFY")}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          title="Revoke verified organization badge"
                        >
                          Unverify
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAction(company, "VERIFY")}
                          className="h-7 px-2 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          title="Grant verified partner badge"
                        >
                          <ShieldCheck className="size-3 mr-1" />
                          Verify
                        </Button>
                      )}

                      {company.isSuspended ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAction(company, "RESTORE")}
                          className="h-7 px-2 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        >
                          Restore
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAction(company, "SUSPEND")}
                          className="h-7 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                        >
                          <ShieldAlert className="size-3 mr-1" />
                          Suspend
                        </Button>
                      )}
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
            Total Companies: <strong className="text-foreground">{totalCount}</strong> (Page {page} of {totalPages})
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

      {/* Action Modal */}
      {actionCompany && (
        <Dialog open={!!actionCompany} onOpenChange={() => setActionCompany(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                <span>
                  {actionType === "VERIFY"
                    ? "Verify Company Profile"
                    : actionType === "UNVERIFY"
                    ? "Revoke Company Verification"
                    : actionType === "SUSPEND"
                    ? "Suspend Company Profile"
                    : "Restore Company Profile"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {actionType === "VERIFY"
                  ? `Grant verified institutional status to "${actionCompany.name}".`
                  : actionType === "UNVERIFY"
                  ? `Remove verified status from "${actionCompany.name}".`
                  : actionType === "SUSPEND"
                  ? `Suspending "${actionCompany.name}" prevents members from posting opportunities associated with this organization.`
                  : `Restore active posting permissions for "${actionCompany.name}".`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="companyReason" className="text-xs">
                  Administrative Reason (Logged to Audit Trail)
                </Label>
                <Textarea
                  id="companyReason"
                  placeholder="Explain why this status transition is being authorized..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
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
                onClick={() => setActionCompany(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={actionType === "SUSPEND" ? "destructive" : "default"}
                disabled={submittingAction}
                onClick={handleExecuteAction}
              >
                {submittingAction && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                Confirm Transition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
