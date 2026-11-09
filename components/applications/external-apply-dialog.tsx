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
import { ExternalLink, CheckCircle2, Globe, Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { humanizeTitle } from "@/lib/utils";

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

  const cleanTitle = humanizeTitle(opportunityTitle);

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
      toast.success(`Application for ${cleanTitle} at ${companyName} saved to your applications tracker.`);

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
            <Badge variant="outline" className="text-xs font-medium rounded-full px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 w-fit">
              <Globe className="size-3" />
              <span>External Opportunity</span>
            </Badge>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight">
            Apply at {companyName}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You will be redirected to {companyName}&apos;s official careers portal to submit your application directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
            <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Track your application:</strong> After applying on their site, save this below so it appears in your <span className="text-primary font-medium">My Applications</span> tracker with your own notes and updates.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Position</span>
              <p className="text-sm font-bold text-foreground">{cleanTitle}</p>
            </div>

            <Button
              onClick={handleOpenExternal}
              className="w-full gap-2 font-semibold shadow-xs rounded-xl h-10 cursor-pointer"
              size="default"
            >
              <span>Continue to {companyName} Careers</span>
              <ExternalLink className="size-4" />
            </Button>
          </div>

          {!recordedSuccess ? (
            <div className="rounded-2xl border border-border/80 p-3.5 space-y-3 bg-muted/20">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordActivity}
                  onChange={(e) => setRecordActivity(e.target.checked)}
                  className="size-4 text-primary rounded shrink-0 mt-0.5 accent-primary cursor-pointer"
                />
                <span className="text-xs text-foreground font-semibold leading-snug">
                  Save this in &ldquo;My Applications&rdquo; to track deadlines and interview status
                </span>
              </label>

              {recordActivity && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <Label htmlFor="ext-notes" className="text-[11px] font-semibold text-muted-foreground">
                    Personal Notes (Optional)
                  </Label>
                  <Textarea
                    id="ext-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Applied via requisition #10943, recruiter contacted on LinkedIn, waiting on initial screening..."
                    rows={2}
                    className="text-xs rounded-xl"
                  />
                  <Button
                    onClick={handleRecordApplication}
                    disabled={submitting}
                    size="sm"
                    className="w-full gap-1.5 text-xs font-semibold rounded-xl h-9 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    <span>Save to My Applications</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Application has been saved in your personal dashboard.</span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} size="sm" className="rounded-xl px-4 text-xs font-medium cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
