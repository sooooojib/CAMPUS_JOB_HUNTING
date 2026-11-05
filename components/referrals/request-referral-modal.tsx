"use client";

import * as React from "react";
import { Send, AlertCircle, Building2, Briefcase, FileText, Link as LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface RequestReferralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  recipientCompany?: string | null;
  defaultOpportunityId?: string | null;
  defaultRoleTitle?: string | null;
  onSuccess?: () => void;
}

export function RequestReferralModal({
  open,
  onOpenChange,
  recipientId,
  recipientName,
  recipientCompany,
  defaultOpportunityId,
  defaultRoleTitle,
  onSuccess,
}: RequestReferralModalProps) {
  const [companyName, setCompanyName] = React.useState(recipientCompany || "");
  const [roleTitle, setRoleTitle] = React.useState(defaultRoleTitle || "");
  const [opportunityId, setOpportunityId] = React.useState(defaultOpportunityId || "");
  const [message, setMessage] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (recipientCompany) setCompanyName(recipientCompany);
    if (defaultRoleTitle) setRoleTitle(defaultRoleTitle);
    if (defaultOpportunityId) setOpportunityId(defaultOpportunityId);
  }, [recipientCompany, defaultRoleTitle, defaultOpportunityId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!companyName.trim() || companyName.trim().length < 2) {
      toast.error("Please enter a valid company name (at least 2 characters).");
      return;
    }
    if (!roleTitle.trim() || roleTitle.trim().length < 2) {
      toast.error("Please enter the specific target role title (at least 2 characters).");
      return;
    }
    if (!message.trim() || message.trim().length < 20) {
      toast.error("Please write a polite message explaining your qualifications and target role (min 20 characters).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          companyName: companyName.trim(),
          roleTitle: roleTitle.trim(),
          opportunityId: opportunityId.trim() || undefined,
          message: message.trim(),
          resumeUrl: resumeUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit referral request.");
      }

      toast.success("Referral request submitted successfully!");
      onOpenChange(false);
      setMessage("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Send className="size-5 text-primary" />
            <span>Request Referral from {recipientName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Introduce yourself, mention the position, and provide context on why you would be a great fit.
          </DialogDescription>
        </DialogHeader>

        {/* Regulatory & Institutional Disclaimer */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Institutional Networking Disclaimer</p>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              Referrals facilitate trusted professional recommendations within the university ecosystem. Submitting a referral request does not guarantee an interview or employment.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span>Target Company</span>
            </label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Microsoft, Pathao, Bkash"
              required
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Briefcase className="size-3.5 text-primary" />
              <span>Role Title</span>
            </label>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager"
              required
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" />
              <span>Personal Note &amp; Qualifications (min 20 characters)</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I am an enrolled CSE senior with extensive React and Node.js experience. I'm eager to apply for this opening and would appreciate your advice or internal referral..."
              rows={4}
              required
              className="text-xs leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {message.length} / 2000 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LinkIcon className="size-3.5 text-primary" />
              <span>Resume or Portfolio Link (Optional)</span>
            </label>
            <Input
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/... or portfolio link"
              type="url"
              className="text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5 text-xs font-semibold"
            >
              <Send className="size-3.5" />
              <span>{loading ? "Submitting..." : "Send Referral Request"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
