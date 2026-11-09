"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  Download,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  XCircle,
  Trash2,
  History,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { ApplicationStatusBadge } from "@/components/opportunities/application-status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { EmptyState } from "@/components/feedback/empty-state";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ManualApplicationsView } from "@/components/applications/manual-applications-view";
import { humanizeTitle } from "@/lib/utils";

interface ApplicationItem {
  id: string;
  opportunityId: string;
  opportunity: {
    id: string;
    title: string;
    companyName: string;
    companyLogo?: string | null;
    type: string;
    location: string;
    workplaceType: string;
    deadline: string;
    status: string;
    externalUrl?: string | null;
  };
  resumeId?: string | null;
  resume?: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  } | null;
  coverLetter?: string | null;
  method: "INTERNAL" | "EXTERNAL";
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "INTERVIEW"
    | "SELECTED"
    | "REJECTED"
    | "WITHDRAWN";
  submittedAt: string;
  updatedAt: string;
  statusHistory: Array<{
    id: string;
    status: string;
    note?: string | null;
    createdAt: string;
  }>;
}

const STATUS_TABS = [
  { key: "ALL", label: "All Applications" },
];

export function MyApplicationsView() {
  const [mode, setMode] = useState<"AUTOMATIC" | "MANUAL">("AUTOMATIC");
  const [activeTab, setActiveTab] = useState("ALL");
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Details Modal state
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  // Withdraw state
  const [appToWithdraw, setAppToWithdraw] = useState<ApplicationItem | null>(null);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchApplications = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?status=${status}`);
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
        if (json.counts) {
          setCounts(json.counts);
        }
      } else {
        throw new Error(json.error || "Failed to load applications.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to retrieve applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(activeTab);
  }, [activeTab]);

  const handleWithdrawConfirm = async () => {
    if (!appToWithdraw) return;
    setWithdrawing(true);
    try {
      const res = await fetch(`/api/applications/${appToWithdraw.id}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: withdrawReason.trim() || undefined }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to withdraw application.");
      }

      toast.success(`Your application to ${appToWithdraw.opportunity.companyName} has been retracted.`);

      setAppToWithdraw(null);
      setWithdrawReason("");
      fetchApplications(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Could not withdraw application.");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleRemove = async (appId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to remove your application record for ${companyName}?`)) return;
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        // Fallback to withdraw API
        const withdrawRes = await fetch(`/api/applications/${appId}/withdraw`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "Removed from dashboard by member" }),
        });
        const withdrawJson = await withdrawRes.json();
        if (!withdrawRes.ok || !withdrawJson.success) {
          throw new Error(json.error || withdrawJson.error || "Failed to remove application.");
        }
      }
      toast.success(`Application for ${companyName} removed.`);
      fetchApplications(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Could not remove application.");
    }
  };

  // Filter applications by search query in title or company
  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.opportunity.title.toLowerCase().includes(q) ||
      app.opportunity.companyName.toLowerCase().includes(q)
    );
  });

  return (
    <ListingTemplate
      title="My Applications"
      subtitle="Track your applications across internal platform postings and external career portals."
      primaryAction={
        <div className="flex items-center gap-1.5 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
          <button
            type="button"
            onClick={() => setMode("AUTOMATIC")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === "AUTOMATIC"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Automatic (Platform Direct)
          </button>
          <button
            type="button"
            onClick={() => setMode("MANUAL")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === "MANUAL"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manual (External Tracker)
          </button>
        </div>
      }
      searchFilterBar={
        mode === "AUTOMATIC" ? (
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applied roles or companies..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-border/60 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
            />
          </div>
        ) : undefined
      }
      activeFiltersBar={
        mode === "AUTOMATIC" ? (
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <span>All Applications</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {counts.ALL ?? applications.length}
              </span>
            </div>
          </div>
        ) : undefined
      }
    >
      {mode === "MANUAL" ? (
        <ManualApplicationsView />
      ) : loading ? (
        <div className="rounded-3xl border border-border/60 bg-card p-12 text-center space-y-3">
          <Loader2 className="size-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading your submitted applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            activeTab === "ALL"
              ? "You haven't submitted any job or internship applications yet. Explore active campus opportunities to begin applying."
              : `No applications found with status "${activeTab}".`
          }
          action={
            <Link
              href="/opportunities"
              className={buttonVariants({ size: "sm" })}
            >
              Browse Open Opportunities
            </Link>
          }
        />
      ) : (
        <div className="rounded-3xl border border-border/60 bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/60">
                <TableHead className="py-3.5 px-5 font-semibold text-xs text-muted-foreground">Opportunity &amp; Company</TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-xs text-muted-foreground">Applied Date</TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-xs text-muted-foreground">Deadline</TableHead>
                <TableHead className="py-3.5 px-5 text-right font-semibold text-xs text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => {
                const targetUrl = app.opportunity.externalUrl || `/opportunities/${app.opportunityId}`;
                return (
                  <TableRow key={app.id} className="hover:bg-muted/20 transition-colors border-b border-border/40 last:border-b-0">
                    <TableCell className="py-4 px-5 align-middle">
                      <div className="space-y-1.5">
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-foreground hover:text-primary hover:underline text-sm leading-snug inline-flex items-center gap-1.5"
                        >
                          <span>{app.opportunity.title}</span>
                          <ExternalLink className="size-3 text-muted-foreground shrink-0" />
                        </a>
                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground/80 flex items-center gap-1">
                            <Building2 className="size-3 text-muted-foreground shrink-0" />
                            {app.opportunity.companyName}
                          </span>
                          <span className="text-border">•</span>
                          <span className="font-mono text-[11px]">{app.opportunity.type}</span>
                          {Boolean(app.opportunity.externalUrl || app.method === "EXTERNAL") && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono rounded-full">
                              External Portal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <span>{new Date(app.opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-5 align-middle text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(app.id, app.opportunity.companyName)}
                        className="h-8 px-3 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <ApplicationStatusBadge status={selectedApp.status as any} />
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-semibold text-foreground">{selectedApp.opportunity.companyName}</span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {selectedApp.opportunity.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted on {new Date(selectedApp.submittedAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Position Overview Card */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Role Type</span>
                  <span className="font-semibold text-foreground">{selectedApp.opportunity.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Workplace</span>
                  <span className="font-semibold text-foreground">{selectedApp.opportunity.workplaceType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Location</span>
                  <span className="font-semibold text-foreground">{selectedApp.opportunity.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Deadline</span>
                  <span className="font-semibold text-foreground">
                    {new Date(selectedApp.opportunity.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Submitted Resume Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                  Submitted Resume Dossier
                </h4>
                {selectedApp.resume ? (
                  <div className="rounded-xl border border-border bg-card p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{selectedApp.resume.fileName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {(selectedApp.resume.fileSize / 1024).toFixed(1)} KB • Validated PDF/DOCX
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/api/resumes/${selectedApp.resume.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      <Download className="size-3.5 mr-1.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {selectedApp.method === "EXTERNAL"
                      ? "Applied on external corporate website."
                      : "No resume attached."}
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                    Cover Letter
                  </h4>
                  <div className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Status Change Audit Trail */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
                  <History className="size-3.5 text-muted-foreground" />
                  <span>Application Status History</span>
                </h4>
                <div className="rounded-xl border border-border bg-card divide-y divide-border/60">
                  {selectedApp.statusHistory.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 flex items-start justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <ApplicationStatusBadge status={item.status as any} />
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-xs text-foreground/90 leading-relaxed pt-1">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedApp(null)} size="sm">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Withdraw Confirmation Dialog */}
      <Dialog open={!!appToWithdraw} onOpenChange={(open) => !open && setAppToWithdraw(null)}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-start gap-1">
            <div className="size-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center ring-8 ring-destructive/5 mb-2">
              <AlertCircle className="size-5.5 stroke-[2.2]" />
            </div>
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Withdraw Application
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to withdraw your application for{" "}
                <strong className="text-foreground">{humanizeTitle(appToWithdraw?.opportunity.title)}</strong> at{" "}
                <strong className="text-foreground">{humanizeTitle(appToWithdraw?.opportunity.companyName)}</strong>? The employer will be notified.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-1.5 py-2">
            <label className="text-xs font-semibold text-foreground">
              Reason for withdrawal (Optional)
            </label>
            <Textarea
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="e.g. Accepted another offer, schedule conflict, or no longer available..."
              rows={3}
              className="text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppToWithdraw(null)}
              disabled={withdrawing}
              className="rounded-xl text-xs font-medium px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleWithdrawConfirm}
              disabled={withdrawing}
              className="rounded-xl text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              {withdrawing && <Loader2 className="size-3.5 animate-spin" />}
              <span>Confirm Withdrawal</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ListingTemplate>
  );
}
