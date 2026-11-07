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
  };
  resumeId?: string | null;
  resumeFileName?: string | null;
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
  { key: "SUBMITTED", label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "SELECTED", label: "Selected" },
  { key: "REJECTED", label: "Declined" },
  { key: "WITHDRAWN", label: "Withdrawn" },
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
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setMode("AUTOMATIC")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applied roles or companies..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ) : undefined
      }
      activeFiltersBar={
        mode === "AUTOMATIC" ? (
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => {
              const count = counts[tab.key] ?? 0;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : undefined
      }
    >
      {mode === "MANUAL" ? (
        <ManualApplicationsView />
      ) : loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
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
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[320px]">Opportunity &amp; Company</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Submitted Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => {
                const latestHistory = app.statusHistory[0];
                const canWithdraw =
                  app.status !== "WITHDRAWN" &&
                  app.status !== "SELECTED" &&
                  app.status !== "REJECTED";

                return (
                  <TableRow key={app.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/opportunities/${app.opportunityId}`}
                          className="font-bold text-foreground hover:text-primary hover:underline text-sm leading-snug flex items-center gap-1.5"
                        >
                          <span>{app.opportunity.title}</span>
                          <ExternalLink className="size-3 text-muted-foreground" />
                        </Link>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="font-semibold text-foreground/80 flex items-center gap-1">
                            <Building2 className="size-3 text-muted-foreground" />
                            {app.opportunity.companyName}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{app.opportunity.type}</span>
                          {app.method === "EXTERNAL" && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                              External Portal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <span>{new Date(app.opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      {app.resume ? (
                        <a
                          href={`/api/resumes/${app.resume.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-xs bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 transition-colors"
                        >
                          <FileText className="size-3.5" />
                          <span className="max-w-[120px] truncate">{app.resume.fileName}</span>
                          <Download className="size-3 text-primary/70" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          {app.method === "EXTERNAL" ? "Submitted via External Portal" : "None"}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <ApplicationStatusBadge status={app.status as any} />
                        {latestHistory?.note && (
                          <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[180px]">
                            {latestHistory.note}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                          className="h-8 px-2.5 text-xs gap-1 text-foreground/80 hover:text-foreground"
                        >
                          <Eye className="size-3.5" />
                          <span>Details</span>
                        </Button>

                        {canWithdraw && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAppToWithdraw(app);
                              setWithdrawReason("");
                            }}
                            className="h-8 px-2.5 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="size-3.5" />
                            <span>Withdraw</span>
                          </Button>
                        )}
                      </div>
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
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" />
              <span>Withdraw Application?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to withdraw your application for{" "}
              <strong>{appToWithdraw?.opportunity.title}</strong> at{" "}
              <strong>{appToWithdraw?.opportunity.companyName}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-medium text-foreground">
              Reason for withdrawal (Optional)
            </label>
            <Textarea
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="e.g. Accepted another offer, schedule conflict, or no longer available..."
              rows={3}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppToWithdraw(null)}
              disabled={withdrawing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleWithdrawConfirm}
              disabled={withdrawing}
              className="gap-1.5"
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
