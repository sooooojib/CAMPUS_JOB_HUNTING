"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { ApplicationStatusBadge } from "@/components/opportunities/application-status-badge";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  deadline: Date | string;
  minCgpa?: number | null;
  onApplicationSuccess?: () => void;
}

export function ApplyModal({
  isOpen,
  onClose,
  opportunityId,
  opportunityTitle,
  companyName,
  deadline,
  minCgpa,
  onApplicationSuccess,
}: ApplyModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Eligibility state
  const [eligibility, setEligibility] = useState<{
    canApply: boolean;
    alreadyApplied: boolean;
    isDeadlinePassed: boolean;
    isOpportunityClosed: boolean;
    warnings: string[];
    existingApplication?: any;
  } | null>(null);

  // Resume state
  const [resumes, setResumes] = useState<
    Array<{
      id: string;
      fileName: string;
      fileSize: number;
      isDefault: boolean;
      createdAt: string;
    }>
  >([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  // Load eligibility & resumes when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setStep("form");
    setUploadFile(null);
    setUploadingNew(false);

    const loadData = async () => {
      setLoading(true);
      try {
        const [eligRes, resumeRes] = await Promise.all([
          fetch(`/api/opportunities/${opportunityId}/eligibility`),
          fetch("/api/resumes"),
        ]);

        const eligData = await eligRes.json();
        const resumeData = await resumeRes.json();

        if (eligData.success) {
          setEligibility(eligData.data);
        }

        if (resumeData.success && Array.isArray(resumeData.data)) {
          setResumes(resumeData.data);
          const defaultResume = resumeData.data.find((r: any) => r.isDefault);
          if (defaultResume) {
            setSelectedResumeId(defaultResume.id);
          } else if (resumeData.data.length > 0) {
            setSelectedResumeId(resumeData.data[0].id);
          } else {
            setUploadingNew(true);
          }
        }
      } catch (err) {
        console.error("Failed to load application prerequisites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, opportunityId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File exceeds the maximum permitted size of 5 MB.");
        return;
      }
      setUploadFile(file);
    }
  };

  const handleProceedToConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingNew && !uploadFile && !selectedResumeId) {
      toast.error("Please select or upload a resume to proceed with your application.");
      return;
    }

    setStep("confirm");
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      let finalResumeId = selectedResumeId;

      // If user uploaded a new resume, upload it first
      if (uploadingNew && uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);

        const uploadRes = await fetch("/api/resumes", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.error || "Failed to upload resume.");
        }
        finalResumeId = uploadData.data.id;
      }

      // Submit the application
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          resumeId: finalResumeId || undefined,
          coverLetter: coverLetter.trim() || undefined,
          method: "INTERNAL",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Application submission failed.");
      }

      toast.success(`Your application to ${companyName} has been received and registered.`);

      setStep("success");
      if (onApplicationSuccess) {
        onApplicationSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Could not complete application.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono uppercase">
              Direct University Application
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-medium text-foreground/80">{companyName}</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            {opportunityTitle}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Submit your verified university credential package and resume directly to corporate recruiters.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Checking institutional eligibility &amp; resume vault...</p>
          </div>
        ) : eligibility?.alreadyApplied ? (
          /* Already Applied State */
          <div className="py-6 space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  You have already applied for this opening
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your application was registered on{" "}
                  {new Date(eligibility.existingApplication?.submittedAt).toLocaleDateString()}. Duplicate applications are prevented at the database level.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Current Status:</span>
                  <ApplicationStatusBadge status={eligibility.existingApplication?.status || "SUBMITTED"} />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose} size="sm">
                Close
              </Button>
              <Link href="/applications" className="inline-flex items-center">
                <Button size="sm" className="gap-1.5">
                  <span>Track in My Applications</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </DialogFooter>
          </div>
        ) : eligibility?.isDeadlinePassed ? (
          /* Deadline Passed State */
          <div className="py-6 space-y-4">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
              <Clock className="size-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Application Deadline Passed
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The deadline for this opportunity was {new Date(deadline).toLocaleDateString()}. Per university career guidelines, applications cannot be submitted after the closing time.
                </p>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose} size="sm">
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : step === "success" ? (
          /* Success State */
          <div className="py-8 text-center space-y-4">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="size-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-foreground">Application Successfully Sent!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your dossier has been delivered to the hiring team at {companyName}. You can monitor status transitions and review updates in your applicant dashboard.
              </p>
            </div>
            <DialogFooter className="pt-6 border-t border-border flex justify-center sm:justify-center gap-3">
              <Button variant="outline" onClick={onClose} size="sm">
                Done
              </Button>
              <Link href="/applications">
                <Button size="sm" className="gap-1.5">
                  <span>View My Applications</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </DialogFooter>
          </div>
        ) : step === "confirm" ? (
          /* Confirmation Step */
          <div className="space-y-5 py-2">
            <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                Submission Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Target Role</span>
                  <span className="font-semibold text-foreground">{opportunityTitle}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Employer</span>
                  <span className="font-semibold text-foreground">{companyName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Attached Resume</span>
                  <span className="font-semibold text-foreground">
                    {uploadingNew && uploadFile
                      ? uploadFile.name
                      : resumes.find((r) => r.id === selectedResumeId)?.fileName || "None"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Submission Method</span>
                  <span className="font-semibold text-foreground">Direct Platform Routing</span>
                </div>
              </div>

              {coverLetter && (
                <div className="pt-2 border-t border-border/60">
                  <span className="text-muted-foreground text-xs block mb-1">Cover Note</span>
                  <p className="text-xs text-foreground/90 italic bg-card p-2.5 rounded-lg border border-border/40 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    &ldquo;{coverLetter}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 flex items-start gap-2.5 text-xs text-muted-foreground">
              <ShieldAlert className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                By submitting, your verified student credentials and private resume will be accessible to authorized recruitment representatives of {companyName}.
              </span>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                disabled={submitting}
                size="sm"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={submitting}
                size="sm"
                className="gap-2"
              >
                {submitting && <Loader2 className="size-3.5 animate-spin" />}
                <span>Confirm &amp; Submit Application</span>
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Main Application Form */
          <form onSubmit={handleProceedToConfirm} className="space-y-5 py-2">
            {/* Advisory Warnings (CGPA or Department advisory) */}
            {eligibility?.warnings && eligibility.warnings.length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>Academic Advisory Notice</span>
                </div>
                <ul className="text-xs text-amber-700/90 dark:text-amber-300/90 space-y-1 list-disc list-inside">
                  {eligibility.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resume Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Resume from Vault <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setUploadingNew(!uploadingNew)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  {uploadingNew ? "Select existing resume" : "+ Upload new file"}
                </button>
              </div>

              {!uploadingNew && resumes.length > 0 ? (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <label
                      key={resume.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedResumeId === resume.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="resume"
                          value={resume.id}
                          checked={selectedResumeId === resume.id}
                          onChange={() => setSelectedResumeId(resume.id)}
                          className="size-4 text-primary"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <FileText className="size-3.5 text-primary" />
                            <span>{resume.fileName}</span>
                            {resume.isDefault && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                                Default
                              </Badge>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {(resume.fileSize / 1024).toFixed(1)} KB • Uploaded{" "}
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                /* Upload New File Area */
                <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center space-y-2 bg-muted/20">
                  <UploadCloud className="size-8 mx-auto text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">
                      {uploadFile ? uploadFile.name : "Select a PDF or DOCX resume to upload"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Maximum file size: 5 MB. Documents are stored in an encrypted private vault.
                    </p>
                  </div>
                  <div className="pt-2">
                    <input
                      type="file"
                      id="resume-file-input"
                      accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-file-input"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors shadow-xs"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Cover Letter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cover-letter" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover Letter / Introduction <span className="text-muted-foreground/60 lowercase">(optional)</span>
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {coverLetter.length} / 5000
                </span>
              </div>
              <Textarea
                id="cover-letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Highlight your key achievements, relevant academic projects, or thesis work that makes you an outstanding fit for this role..."
                rows={4}
                maxLength={5000}
                className="text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <span>Review Application</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
