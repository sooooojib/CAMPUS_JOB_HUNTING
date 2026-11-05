"use client";

import * as React from "react";
import { Flag, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ReportReason } from "@/types";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "POST" | "COMMENT";
  targetId: string;
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: "INAPPROPRIATE", label: "Inappropriate Content", description: "Profanity, offensive remarks, or explicit content" },
  { value: "HARASSMENT", label: "Harassment or Bullying", description: "Targeted insults, intimidation, or hateful language" },
  { value: "SPAM", label: "Spam or Advertising", description: "Irrelevant self-promotion, fake listings, or repetitive content" },
  { value: "MISINFORMATION", label: "Misinformation or Fraud", description: "False academic or employment claims, fake opportunities" },
  { value: "OTHER", label: "Other Policy Violation", description: "Violates university community guidelines" },
];

export function ReportDialog({
  isOpen,
  onClose,
  targetType,
  targetId,
}: ReportDialogProps) {
  const [reason, setReason] = React.useState<ReportReason>("INAPPROPRIATE");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint =
        targetType === "POST"
          ? `/api/posts/${targetId}/report`
          : `/api/comments/${targetId}/report`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report.");
      }

      toast.success(data.message || "Report submitted successfully.");
      setDescription("");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Flag className="size-5" />
            <DialogTitle>Report {targetType === "POST" ? "Post" : "Comment"}</DialogTitle>
          </div>
          <DialogDescription>
            Help maintain a respectful, professional university community. Reports are privately reviewed by administrators.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="report-reason" className="text-xs font-semibold">
              Reason for Reporting <span className="text-destructive">*</span>
            </Label>
            <Select
              value={reason}
              onValueChange={(val) => setReason(val as ReportReason)}
            >
              <SelectTrigger id="report-reason" className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-xs">{r.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {REPORT_REASONS.find((r) => r.value === reason)?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-desc" className="text-xs font-semibold">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="report-desc"
              placeholder="Provide context to help moderators understand the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              className="resize-none text-xs min-h-[90px]"
            />
            <div className="text-right text-[11px] text-muted-foreground">
              {description.length}/1000
            </div>
          </div>

          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 flex items-start gap-2 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>
              False or malicious reporting is a violation of community guidelines.
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
