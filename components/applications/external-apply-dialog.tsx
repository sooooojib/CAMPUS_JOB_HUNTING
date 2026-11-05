"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExternalApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  externalUrl: string;
  onRecorded?: () => void;
}

export function ExternalApplyDialog({
  isOpen,
  onClose,
  opportunityId,
  opportunityTitle,
  companyName,
  externalUrl,
  onRecorded,
}: ExternalApplyDialogProps) {
  const [recordActivity, setRecordActivity] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recordedSuccess, setRecordedSuccess] = useState(false);

  const handleOpenExternal = () => {
    window.open(externalUrl, "_blank", "noopener,noreferrer");
  };

  const handleRecordApplication = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          method: "EXTERNAL",
          externalNotes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to record external application.");
      }

      setRecordedSuccess(true);
      toast.success(`Your application to ${companyName} has been logged in your My Applications dashboard.`);

      if (onRecorded) {
        onRecorded();
      }
    } catch (err: any) {
      toast.error(err.message || "Could not log external application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono uppercase">
              External Portal Redirect
            </Badge>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight">
            Apply on {companyName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            This position requires submitting your candidate dossier directly through {companyName}&apos;s corporate careers portal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Notice:</strong> UniCareer does not automatically track or receive updates for external applications unless logged manually.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Position</span>
              <p className="text-sm font-bold text-foreground">{opportunityTitle}</p>
            </div>

            <Button
              onClick={handleOpenExternal}
              className="w-full gap-2 font-semibold shadow-xs"
              size="default"
            >
              <span>Proceed to {companyName} Portal</span>
              <ExternalLink className="size-4" />
            </Button>
          </div>

          {!recordedSuccess ? (
            <div className="rounded-xl border border-border/70 p-3.5 space-y-3 bg-muted/20">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordActivity}
                  onChange={(e) => setRecordActivity(e.target.checked)}
                  className="size-4 text-primary rounded shrink-0 mt-0.5"
                />
                <span className="text-xs text-foreground font-medium leading-snug">
                  Record this in &ldquo;My Applications&rdquo; after you complete submission on the company site
                </span>
              </label>

              {recordActivity && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <Label htmlFor="ext-notes" className="text-[11px] text-muted-foreground">
                    Private Notes (Optional)
                  </Label>
                  <Textarea
                    id="ext-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Applied via Workday requisition #10943, recruiter contacted via LinkedIn..."
                    rows={2}
                    className="text-xs"
                  />
                  <Button
                    onClick={handleRecordApplication}
                    disabled={submitting}
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                  >
                    {submitting && <Loader2 className="size-3.5 animate-spin" />}
                    <span>Confirm &amp; Log Application</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Application has been recorded in your dashboard.</span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
