"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Download,
  Calendar,
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  Eye,
  History,
  Loader2,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ApplicationStatus } from "@/lib/validations/application";

interface ApplicantItem {
  id: string;
  opportunityId: string;
  applicantId: string;
  method: string;
  status: ApplicationStatus;
  coverLetter?: string | null;
  employerNotes?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  applicant: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    membershipType: string;
    verificationStatus: string;
    profile?: {
      headline?: string | null;
      bio?: string | null;
      department?: string | null;
      academicYear?: string | null;
      graduationYear?: number | null;
      degree?: string | null;
      skills: string[];
      studentId?: string | null;
    } | null;
  };
  resume?: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
  } | null;
  statusHistory: Array<{
    id: string;
    status: ApplicationStatus;
    note?: string | null;
    createdAt: string;
    changedBy?: { id: string; name: string } | null;
  }>;
}

const STATUS_TABS = [
  { key: "ALL", label: "All Candidates" },
  { key: "SUBMITTED", label: "New Submitted" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "SELECTED", label: "Selected" },
  { key: "REJECTED", label: "Declined" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

const TRANSITION_STATUS_OPTIONS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: "UNDER_REVIEW", label: "Mark as Under Review" },
  { value: "SHORTLISTED", label: "Shortlist Candidate" },
  { value: "INTERVIEW", label: "Advance to Interview" },
  { value: "SELECTED", label: "Select / Extend Offer" },
  { value: "REJECTED", label: "Decline Candidate" },
];

export function EmployerApplicantManager({
  opportunityId,
  opportunityTitle,
  companyName,
}: {
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
}) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Status Update Modal state
  const [targetApp, setTargetApp] = useState<ApplicantItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("UNDER_REVIEW");
  const [transitionNote, setTransitionNote] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Candidate Details Modal state
  const [viewingApp, setViewingApp] = useState<ApplicantItem | null>(null);

  const fetchApplicants = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/opportunities/${opportunityId}/applicants?status=${status}`
      );
      const json = await res.json();
      if (json.success) {
        setApplicants(json.data);
        if (json.counts) setCounts(json.counts);
      } else {
        throw new Error(json.error || "Failed to load candidate applications.");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not retrieve candidate data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(activeTab);
  }, [opportunityId, activeTab]);

  const handleOpenStatusModal = (app: ApplicantItem) => {
    setTargetApp(app);
    setSelectedStatus(app.status === "SUBMITTED" ? "UNDER_REVIEW" : app.status);
    setTransitionNote("");
    setInternalNotes(app.employerNotes || "");
  };

  const handleUpdateStatus = async () => {
    if (!targetApp) return;
    setSubmittingStatus(true);
    try {
      const res = await fetch(
        `/api/opportunities/${opportunityId}/applicants/${targetApp.id}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: selectedStatus,
            note: transitionNote.trim() || undefined,
            employerNotes: internalNotes.trim() || undefined,
          }),
        }
      );

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to update candidate status.");
      }

      toast.success(`Candidate status updated to ${selectedStatus}.`);

      setTargetApp(null);
      fetchApplicants(activeTab);
    } catch (err: any) {
      toast.error(err.message || "Could not update status.");
    } finally {
      setSubmittingStatus(false);
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = app.applicant.name.toLowerCase().includes(q);
    const emailMatch = app.applicant.email.toLowerCase().includes(q);
    const deptMatch =
      app.applicant.profile?.department?.toLowerCase().includes(q) || false;
    const skillsMatch =
      app.applicant.profile?.skills?.some((s) => s.toLowerCase().includes(q)) ||
      false;
    return nameMatch || emailMatch || deptMatch || skillsMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Navigation & Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/opportunities/${opportunityId}`}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Opening</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Badge variant="outline" className="text-[10px] font-mono">
              Employer Applicant Management
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {opportunityTitle}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            <Building2 className="size-3.5" />
            <span>{companyName}</span>
            <span>•</span>
            <span className="font-semibold text-foreground/80">
              {counts.ALL ?? applicants.length} Total Applicants
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, dept, skill..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
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

      {/* Candidate Listings */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <Loader2 className="size-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading candidate dossiers...</p>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-muted/10">
          <Users className="size-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-base font-bold text-foreground">No candidates in this stage</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === "ALL"
              ? "No candidate applications have been submitted for this opportunity yet."
              : `There are currently no applicants with status "${activeTab}".`}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[280px]">Candidate</TableHead>
                <TableHead>Academic Profile</TableHead>
                <TableHead>Skills &amp; Cover</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/30">
                  {/* Candidate Identity */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {app.applicant.name}
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                          {app.applicant.membershipType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{app.applicant.email}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span>Applied {new Date(app.submittedAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </TableCell>

                  {/* Academic Profile */}
                  <TableCell className="text-xs">
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <GraduationCap className="size-3.5 text-primary" />
                        <span>{app.applicant.profile?.department || "General Campus"}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground space-x-1.5">
                        {app.applicant.profile?.academicYear && (
                          <span>{app.applicant.profile.academicYear}</span>
                        )}
                        {app.applicant.profile?.graduationYear && (
                          <span>• Class of {app.applicant.profile.graduationYear}</span>
                        )}
                        {app.applicant.profile?.studentId && (
                          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                            ID: {app.applicant.profile.studentId}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Skills & Cover Letter excerpt */}
                  <TableCell className="text-xs max-w-xs">
                    <div className="space-y-1.5">
                      {app.applicant.profile?.skills && app.applicant.profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {app.applicant.profile.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded-md text-foreground/80"
                            >
                              {skill}
                            </span>
                          ))}
                          {app.applicant.profile.skills.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{app.applicant.profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {app.coverLetter && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                          &ldquo;{app.coverLetter}&rdquo;
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Resume Download */}
                  <TableCell className="text-xs">
                    {app.resume ? (
                      <a
                        href={`/api/resumes/${app.resume.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium text-xs bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 transition-colors"
                      >
                        <FileText className="size-3.5" />
                        <span className="max-w-[110px] truncate">{app.resume.fileName}</span>
                        <Download className="size-3 text-primary/70" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">No resume file</span>
                    )}
                  </TableCell>

                  {/* Current Status */}
                  <TableCell>
                    <div className="space-y-1">
                      <ApplicationStatusBadge status={app.status as any} />
                      {app.reviewedAt && (
                        <span className="text-[10px] font-mono text-muted-foreground block">
                          Reviewed {new Date(app.reviewedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingApp(app)}
                        className="h-8 px-2 text-xs gap-1"
                        title="View Candidate Dossier"
                      >
                        <Eye className="size-3.5" />
                        <span className="hidden sm:inline">Dossier</span>
                      </Button>

                      {app.status !== "WITHDRAWN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenStatusModal(app)}
                          className="h-8 px-2.5 text-xs font-semibold"
                        >
                          Update Status
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Status Update Modal */}
      {targetApp && (
        <Dialog open={!!targetApp} onOpenChange={(open) => !open && setTargetApp(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  Recruiter Action
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-semibold text-foreground">{targetApp.applicant.name}</span>
              </div>
              <DialogTitle className="text-lg font-bold">Update Application Stage</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Transition candidate status and record permanent review notes for the candidate audit history.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Select New Stage</Label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  className="w-full text-xs rounded-xl border border-border bg-card p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {TRANSITION_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="transition-note" className="text-xs font-semibold">
                  Transition Feedback Note{" "}
                  <span className="text-muted-foreground font-normal">(visible to candidate)</span>
                </Label>
                <Textarea
                  id="transition-note"
                  value={transitionNote}
                  onChange={(e) => setTransitionNote(e.target.value)}
                  placeholder="e.g. Profile shortlisted for technical round with Lead Systems Architect on Nov 10..."
                  rows={2}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="internal-notes" className="text-xs font-semibold">
                  Private Internal Notes{" "}
                  <span className="text-muted-foreground font-normal">(hiring team only)</span>
                </Label>
                <Textarea
                  id="internal-notes"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Strong data structures score, follow up on thesis presentation..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTargetApp(null)}
                disabled={submittingStatus}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleUpdateStatus}
                disabled={submittingStatus}
                className="gap-1.5"
              >
                {submittingStatus && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save Stage Update</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Candidate Dossier View Modal */}
      {viewingApp && (
        <Dialog open={!!viewingApp} onOpenChange={(open) => !open && setViewingApp(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <ApplicationStatusBadge status={viewingApp.status as any} />
                <span className="text-xs text-muted-foreground">•</span>
                <Badge variant="outline" className="text-xs font-mono">
                  {viewingApp.applicant.membershipType}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {viewingApp.applicant.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {viewingApp.applicant.email} • Applied on{" "}
                {new Date(viewingApp.submittedAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Academic Overview */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Department</span>
                  <span className="font-semibold text-foreground">
                    {viewingApp.applicant.profile?.department || "Unspecified"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Graduation</span>
                  <span className="font-semibold text-foreground">
                    {viewingApp.applicant.profile?.graduationYear
                      ? `Class of ${viewingApp.applicant.profile.graduationYear}`
                      : "Unspecified"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Student ID (Verified)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {viewingApp.applicant.profile?.studentId || "N/A"}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {viewingApp.applicant.profile?.skills && viewingApp.applicant.profile.skills.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                    Verified Skill Portfolio
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingApp.applicant.profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submitted Resume */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                  Attached Resume File
                </h4>
                {viewingApp.resume ? (
                  <div className="rounded-xl border border-border bg-card p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{viewingApp.resume.fileName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {(viewingApp.resume.fileSize / 1024).toFixed(1)} KB • Validated
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/api/resumes/${viewingApp.resume.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "default", size: "sm" })}
                    >
                      <Download className="size-3.5 mr-1.5" />
                      <span>Download Resume</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No resume attached.</p>
                )}
              </div>

              {/* Cover Letter */}
              {viewingApp.coverLetter && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                    Cover Letter
                  </h4>
                  <div className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {viewingApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              {viewingApp.employerNotes && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                    Internal Recruiter Notes
                  </h4>
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-foreground/90 whitespace-pre-wrap">
                    {viewingApp.employerNotes}
                  </div>
                </div>
              )}

              {/* Status History Audit Trail */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
                  <History className="size-3.5 text-muted-foreground" />
                  <span>Status History Log</span>
                </h4>
                <div className="rounded-xl border border-border bg-card divide-y divide-border/60">
                  {viewingApp.statusHistory.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <ApplicationStatusBadge status={item.status as any} />
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setViewingApp(null)} size="sm">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
