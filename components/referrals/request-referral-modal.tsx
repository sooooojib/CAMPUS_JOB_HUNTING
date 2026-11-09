"use client";

import * as React from "react";
import { Send, AlertCircle, Building2, Briefcase, FileText, Link as LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
        <div className="flex flex-col items-start gap-1">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5 mb-2">
            <Send className="size-5.5 stroke-[2.2]" />
          </div>
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Request Referral from {recipientName}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Introduce yourself, mention the position, and provide context on why you would be a great fit.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Community Referral Etiquette */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5 text-xs text-foreground/90">
          <AlertCircle className="size-4 shrink-0 text-primary mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Referral Etiquette</p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Keep your note polite and specific. Referrals are voluntary recommendations provided by alumni and peers to support your application.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span>Target Company</span>
            </label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Brain Station 23, ShopUp, bKash"
              required
              className="text-xs rounded-xl h-10"
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
              placeholder="e.g. Software Engineer, Product Management Intern"
              required
              className="text-xs rounded-xl h-10"
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
              placeholder="Hi! I noticed an opening at your company that matches my software engineering background. I would love if you could review my portfolio and consider submitting an internal referral..."
              rows={4}
              required
              className="text-xs rounded-xl leading-relaxed"
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
              className="text-xs rounded-xl h-10"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl text-xs font-medium px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="rounded-xl text-xs font-semibold px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>{loading ? "Submitting..." : "Send Referral Request"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

