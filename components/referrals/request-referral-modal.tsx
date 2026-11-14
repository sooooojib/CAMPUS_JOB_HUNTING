"use client";

import * as React from "react";
import {
  Send,
  Mail,
  AlertCircle,
  Building2,
  Briefcase,
  FileText,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RequestReferralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  recipientCompany?: string | null;
  recipientEmail?: string | null;
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
  recipientEmail,
  defaultOpportunityId,
  defaultRoleTitle,
  onSuccess,
}: RequestReferralModalProps) {
  const [activeTab, setActiveTab] = React.useState<"EMAIL" | "IN_APP">(
    recipientEmail ? "EMAIL" : "IN_APP"
  );
  const [companyName, setCompanyName] = React.useState(recipientCompany || "");
  const [roleTitle, setRoleTitle] = React.useState(defaultRoleTitle || "");
  const [opportunityId, setOpportunityId] = React.useState(defaultOpportunityId || "");
  const [message, setMessage] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [alsoLogRecord, setAlsoLogRecord] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (recipientCompany) setCompanyName(recipientCompany);
    if (defaultRoleTitle) setRoleTitle(defaultRoleTitle);
    if (defaultOpportunityId) setOpportunityId(defaultOpportunityId);
    if (recipientEmail) {
      setActiveTab("EMAIL");
    } else {
      setActiveTab("IN_APP");
    }
  }, [recipientCompany, defaultRoleTitle, defaultOpportunityId, recipientEmail]);

  // Construct email subject and body for the Direct Email ("Mail Me") workflow
  const emailSubject = `[UniCareer Referral Request] Application for ${roleTitle.trim() || "Target Role"} at ${companyName.trim() || "Target Company"}`;

  const emailBody = `Dear ${recipientName},

I hope you are doing well. I am reaching out to you via UniCareer Community regarding potential career opportunities at ${companyName.trim() || "your company"}.

I am interested in the ${roleTitle.trim() || "target position"} role and would appreciate if you could review my qualifications for an internal referral or candidate consideration.

Brief Background & Qualifications:
${message.trim() || "(Add your summary and key qualifications here)"}

${resumeUrl.trim() ? `Resume / Portfolio: ${resumeUrl.trim()}` : "My resume is attached to this email."}

Thank you very much for your time and guidance!

Best regards,
UniCareer Community Member`;

  const mailtoUrl = recipientEmail
    ? `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    : "";

  // Copy email content for webmail users (Gmail, Yahoo, Outlook.com)
  async function handleCopyEmailText() {
    if (!recipientEmail) return;
    const fullText = `To: ${recipientEmail}\nSubject: ${emailSubject}\n\n${emailBody}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success("Referral email template copied to clipboard! Ready to paste into webmail.");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  }

  // Handle Direct Email launch (with optional background tracking in DB)
  async function handleLaunchMailto() {
    if (!recipientEmail) {
      toast.error("Recipient email address is not available.");
      return;
    }

    if (!companyName.trim()) {
      toast.error("Please specify the target company name.");
      return;
    }

    if (!roleTitle.trim()) {
      toast.error("Please specify the target role title.");
      return;
    }

    // Launch email client
    window.location.href = mailtoUrl;

    // If student opted to also record it in UniCareer, submit to API
    if (alsoLogRecord) {
      try {
        await fetch("/api/referrals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId,
            companyName: companyName.trim(),
            roleTitle: roleTitle.trim(),
            opportunityId: opportunityId.trim() || undefined,
            message: message.trim() || `Referral request initiated via direct email to ${recipientEmail}.`,
            resumeUrl: resumeUrl.trim() || undefined,
          }),
        });
        toast.info("Logged in your UniCareer Sent Referrals queue for status tracking.");
      } catch {
        // Non-blocking log failure
      }
    }

    toast.success("Opening your default email client...");
    onOpenChange(false);
    onSuccess?.();
  }

  // Handle In-App submission to UniCareer database & notification system
  async function handleSubmitInApp(e: React.FormEvent) {
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

      toast.success("In-app referral request submitted successfully!");
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-start gap-1">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5 mb-1">
            {activeTab === "EMAIL" ? (
              <Mail className="size-5.5 stroke-[2.2]" />
            ) : (
              <Send className="size-5.5 stroke-[2.2]" />
            )}
          </div>
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
              <span>Request Referral from {recipientName}</span>
              {recipientEmail && (
                <Badge variant="outline" className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                  Email Available
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Choose how you would like to reach out: send directly to their personal/work email or submit an in-app dossier.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Workflow Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-muted/80 rounded-xl gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("EMAIL")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === "EMAIL"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="size-3.5" />
            <span>Direct Email (Mail Me)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("IN_APP")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === "IN_APP"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="size-3.5" />
            <span>In-App Tracked Dossier</span>
          </button>
        </div>

        {/* Tab 1: Direct Email Workflow */}
        {activeTab === "EMAIL" && (
          <div className="space-y-4 pt-1">
            {recipientEmail ? (
              <>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-start gap-2.5 text-xs text-foreground/90">
                  <ShieldCheck className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Direct Email Mode
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Sends your referral inquiry straight to <strong>{recipientEmail}</strong>. You can launch your mail client or copy the formatted text for webmail.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary" />
                      <span>Company Name</span>
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google, bKash, Brain Station 23"
                      className="text-xs rounded-xl h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-primary" />
                      <span>Target Role Title</span>
                    </label>
                    <Input
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Software Engineer, Product Intern"
                      className="text-xs rounded-xl h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="size-3.5 text-primary" />
                    <span>Key Qualifications / Elevator Pitch</span>
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly highlight your major projects, GPA, or relevant achievements..."
                    rows={3}
                    className="text-xs rounded-xl leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <LinkIcon className="size-3.5 text-primary" />
                    <span>Resume or Portfolio Link (Optional)</span>
                  </label>
                  <Input
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or portfolio URL"
                    type="url"
                    className="text-xs rounded-xl h-9"
                  />
                </div>

                {/* Email Preview Card */}
                <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                      Email Preview
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmailText}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-foreground/90 bg-background/80 p-2.5 rounded-lg border border-border/50">
                    <div>
                      <span className="text-muted-foreground">To:</span> {recipientEmail}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subject:</span> {emailSubject}
                    </div>
                  </div>
                </div>

                {/* Tracking Option */}
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={alsoLogRecord}
                    onChange={(e) => setAlsoLogRecord(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-3.5"
                  />
                  <span>Also log this request in my UniCareer Sent Referrals (for status tracking)</span>
                </label>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="rounded-xl text-xs font-medium px-4 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyEmailText}
                      className="rounded-xl text-xs font-medium gap-1.5 cursor-pointer"
                    >
                      <Copy className="size-3.5" />
                      <span>{copied ? "Copied" : "Copy Email"}</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleLaunchMailto}
                      className="rounded-xl text-xs font-semibold px-4 gap-1.5 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                      <Mail className="size-3.5" />
                      <span>Open in Email App</span>
                    </Button>
                  </div>
                </DialogFooter>
              </>
            ) : (
              <div className="space-y-4 py-2">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3 text-xs text-foreground/90">
                  <AlertCircle className="size-5 shrink-0 text-amber-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-700 dark:text-amber-400">
                      Personal Email is Private
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {recipientName} has chosen to keep their personal email address private. You can submit an in-app referral request directly — an instant notification will be delivered to their UniCareer dashboard safely.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => setActiveTab("IN_APP")}
                  className="w-full rounded-xl text-xs font-semibold gap-2 cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Switch to In-App Tracked Dossier</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: In-App Tracked Referral */}
        {activeTab === "IN_APP" && (
          <form onSubmit={handleSubmitInApp} className="space-y-3.5 pt-1">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5 text-xs text-foreground/90">
              <AlertCircle className="size-4 shrink-0 text-primary mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">In-App Referral System</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Submitting will create a tracked dossier in {recipientName}&apos;s Received Referrals queue and notify them immediately.
                </p>
              </div>
            </div>

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
        )}
      </DialogContent>
    </Dialog>
  );
}
