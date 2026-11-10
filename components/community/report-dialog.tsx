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
        <div className="flex flex-col items-start gap-1">
          <div className="size-11 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center ring-8 ring-destructive/5 mb-2">
            <Flag className="size-5.5 stroke-[2.2]" />
          </div>
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Report {targetType === "POST" ? "Post" : "Comment"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Help keep our university network safe and constructive. Our moderation team reviews every report.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="report-reason" className="text-xs font-semibold text-foreground">
              Reason for Reporting <span className="text-destructive">*</span>
            </Label>
            <Select
              value={reason}
              onValueChange={(val) => setReason(val as ReportReason)}
            >
              <SelectTrigger id="report-reason" className="w-full h-10 rounded-xl text-xs">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-xs text-foreground">{r.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground pt-0.5">
              {REPORT_REASONS.find((r) => r.value === reason)?.description}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-desc" className="text-xs font-semibold text-foreground">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="report-desc"
              placeholder="Provide context to help moderators understand the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              className="resize-none text-xs min-h-[90px] rounded-xl"
            />
            <div className="text-right text-[10px] text-muted-foreground">
              {description.length}/1000
            </div>
          </div>

          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              Reports remain confidential. False reports or repeated spam claims violate community standards.
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs font-medium px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting || !reason}
              className="rounded-xl text-xs font-semibold px-4 shadow-xs gap-1.5 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>Submit Report</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
