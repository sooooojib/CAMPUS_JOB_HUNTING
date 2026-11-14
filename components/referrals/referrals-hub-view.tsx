"use client";

import * as React from "react";
import Link from "next/link";
import {
  Send,
  Inbox,
  AlertCircle,
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  ShieldAlert,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ReferralStatus } from "@/types";

interface ReferralItem {
  id: string;
  requesterId: string;
  requester: {
    id: string;
    name: string;
    email?: string | null;
    image: string | null;
    membershipType: string;
    profile?: {
      headline?: string | null;
      department?: string | null;
      graduationYear?: number | null;
    } | null;
  };
  recipientId: string;
  recipient: {
    id: string;
    name: string;
    email?: string | null;
    image: string | null;
    membershipType: string;
    profile?: {
      headline?: string | null;
      company?: string | null;
      designation?: string | null;
    } | null;
  };
  companyName: string;
  companyId?: string | null;
  roleTitle: string;
  opportunityId?: string | null;
  opportunity?: {
    id: string;
    title: string;
    opportunityType: string;
  } | null;
  message: string;
  resumeUrl?: string | null;
  status: ReferralStatus;
  responseNote?: string | null;
  respondedAt?: string | null;
  createdAt: string;
}

export function ReferralsHubView() {
  const [activeTab, setActiveTab] = React.useState<"RECEIVED" | "SENT">("RECEIVED");
  const [referrals, setReferrals] = React.useState<ReferralItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Response dialog state (for recipient to Accept/Decline/Complete)
  const [selectedReferral, setSelectedReferral] = React.useState<ReferralItem | null>(null);
  const [responseAction, setResponseAction] = React.useState<"ACCEPTED" | "DECLINED" | "COMPLETED" | null>(null);
  const [responseNote, setResponseNote] = React.useState("");
  const [submittingResponse, setSubmittingResponse] = React.useState(false);

  const fetchReferrals = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/referrals?role=${activeTab}&pageSize=30`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load referrals.");
      }
      setReferrals(data.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load referrals.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Handle Response submit
  async function handleResponseSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReferral || !responseAction) return;

    setSubmittingResponse(true);
    try {
      const res = await fetch(`/api/referrals/${selectedReferral.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: responseAction,
          responseNote: responseNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update referral.");
      }

      toast.success(
        responseAction === "ACCEPTED"
          ? "Referral request accepted!"
          : responseAction === "COMPLETED"
          ? "Referral marked as completed!"
          : "Referral request declined."
      );
      setSelectedReferral(null);
      setResponseAction(null);
      setResponseNote("");
      fetchReferrals();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmittingResponse(false);
    }
  }

  // Handle Cancel outgoing request
  async function handleCancelReferral(referralId: string) {
    if (!confirm("Are you sure you want to cancel this referral request?")) return;

    try {
      const res = await fetch(`/api/referrals/${referralId}?action=cancel`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to cancel referral request.");
      }
      toast.info("Referral request cancelled.");
      fetchReferrals();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function renderStatusBadge(status: ReferralStatus) {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
            <Clock className="size-3 animate-pulse" />
            <span>Awaiting Review</span>
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="gap-1 border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10">
            <CheckCircle2 className="size-3" />
            <span>Accepted / In Progress</span>
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            <CheckCircle2 className="size-3" />
            <span>Referral Submitted</span>
          </Badge>
        );
      case "DECLINED":
        return (
          <Badge variant="outline" className="gap-1 border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10">
            <XCircle className="size-3" />
            <span>Declined</span>
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="gap-1 text-muted-foreground">
            <span>Cancelled</span>
          </Badge>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Regulatory & Institutional Disclaimer Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">Institutional Networking Disclaimer</p>
          <p className="leading-relaxed text-amber-800 dark:text-amber-300">
            UniCareer Community referral requests facilitate trusted professional recommendations between university-connected members. Submitting or receiving a referral does not guarantee an interview, employment offer, or institutional endorsement.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "RECEIVED" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("RECEIVED")}
            className="text-xs font-semibold gap-1.5"
          >
            <Inbox className="size-3.5" />
            <span>Incoming Requests</span>
          </Button>
          <Button
            variant={activeTab === "SENT" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("SENT")}
            className="text-xs font-semibold gap-1.5"
          >
            <Send className="size-3.5" />
            <span>Sent Requests</span>
          </Button>
        </div>

        <Link
          href="/community"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>Find Members to Request a Referral</span>
          <ExternalLink className="size-3" />
        </Link>
      </div>

      {/* Feed List or Skeletons */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 rounded-xl border border-border bg-card animate-pulse space-y-3">
              <div className="h-5 bg-muted rounded-md w-1/3" />
              <div className="h-4 bg-muted rounded-md w-1/4" />
              <div className="h-12 bg-muted rounded-md w-full" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchReferrals()}>
            Retry
          </Button>
        </div>
      ) : referrals.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            {activeTab === "RECEIVED" ? <Inbox className="size-6" /> : <Send className="size-6" />}
          </div>
          <h3 className="text-base font-bold text-foreground">
            {activeTab === "RECEIVED"
              ? "No incoming referral requests"
              : "You haven't requested any referrals yet"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === "RECEIVED"
              ? "When fellow university students or alumni request internal recommendations for roles at your company, they will appear here."
              : "Search the member directory for alumni or recruiters at companies you are interested in and send a tailored referral request."}
          </p>
          {activeTab === "SENT" && (
            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
            >
              <span>Explore Member Directory</span>
              <ExternalLink className="size-3" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((item) => {
            const isIncoming = activeTab === "RECEIVED";
            const peer = isIncoming ? item.requester : item.recipient;
            const peerProfile = isIncoming ? item.requester.profile : item.recipient.profile;

            return (
              <Card
                key={item.id}
                className="rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 space-y-4"
              >
                <CardContent className="p-0 space-y-4">
                  {/* Top Bar: Target Role & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-foreground">
                          {item.roleTitle}
                        </span>
                        <span className="text-muted-foreground">at</span>
                        <span className="text-base font-semibold text-primary">
                          {item.companyName}
                        </span>
                        {item.opportunity && (
                          <Link
                            href={`/opportunities/${item.opportunity.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                          >
                            <Briefcase className="size-3" />
                            <span>Linked Job Posting</span>
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <User className="size-3.5" />
                        <span>
                          {isIncoming ? "Requested by " : "Requested to "}
                          <Link
                            href={`/profile/${peer.id}`}
                            className="font-semibold text-foreground hover:text-primary underline-offset-2 hover:underline"
                          >
                            {peer.name}
                          </Link>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div>{renderStatusBadge(item.status)}</div>
                  </div>

                  {/* Message Dossier */}
                  <div className="rounded-lg bg-muted/40 p-3.5 border border-border/60 space-y-2">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-primary" />
                      <span>Referral Note:</span>
                    </p>
                    <p className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                      {item.message}
                    </p>
                    {item.resumeUrl && (
                      <div className="pt-2">
                        <a
                          href={item.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <FileText className="size-3.5" />
                          <span>View Candidate Resume / Portfolio Link</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Recipient Response Note if present */}
                  {item.responseNote && (
                    <div className="rounded-lg bg-primary/5 p-3.5 border border-primary/20 space-y-1 text-xs">
                      <p className="font-semibold text-primary">
                        Response from {item.recipient.name}
                        {item.respondedAt && (
                          <span className="font-normal text-muted-foreground ml-2">
                            ({new Date(item.respondedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                          </span>
                        )}:
                      </p>
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                        {item.responseNote}
                      </p>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-muted-foreground">
                      Referral ID: <span className="font-mono">{item.id.slice(0, 10)}...</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Direct Mail Candidate for Alumnus */}
                      {isIncoming && item.requester.email && (
                        <a
                          href={`mailto:${item.requester.email}?subject=${encodeURIComponent(
                            `[UniCareer Referral] Regarding your request for ${item.roleTitle} at ${item.companyName}`
                          )}&body=${encodeURIComponent(
                            `Hi ${item.requester.name},\n\nI received your referral inquiry for the ${item.roleTitle} role at ${item.companyName} on UniCareer.\n\n`
                          )}`}
                          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Mail className="size-3 text-primary" />
                          <span>Mail Candidate</span>
                        </a>
                      )}

                      {/* Direct Mail Alumnus for Student on Accepted */}
                      {!isIncoming && item.status === "ACCEPTED" && item.recipient.email && (
                        <a
                          href={`mailto:${item.recipient.email}?subject=${encodeURIComponent(
                            `[UniCareer Referral Follow-up] ${item.roleTitle} at ${item.companyName}`
                          )}&body=${encodeURIComponent(
                            `Hi ${item.recipient.name},\n\nThank you for accepting my referral request for the ${item.roleTitle} position at ${item.companyName}!\n\n`
                          )}`}
                          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-medium text-primary transition-colors"
                        >
                          <Mail className="size-3" />
                          <span>Mail Alumnus</span>
                        </a>
                      )}

                      {/* Incoming Pending Actions */}
                      {isIncoming && item.status === "PENDING" && (
                        <>
                          <Button
                            variant="default"
                            size="xs"
                            onClick={() => {
                              setSelectedReferral(item);
                              setResponseAction("ACCEPTED");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                          >
                            <CheckCircle2 className="size-3 mr-1" />
                            <span>Accept Request</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              setSelectedReferral(item);
                              setResponseAction("DECLINED");
                            }}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                          >
                            <XCircle className="size-3 mr-1" />
                            <span>Decline</span>
                          </Button>
                        </>
                      )}

                      {/* Incoming Accepted -> Mark Completed */}
                      {isIncoming && item.status === "ACCEPTED" && (
                        <Button
                          variant="default"
                          size="xs"
                          onClick={() => {
                            setSelectedReferral(item);
                            setResponseAction("COMPLETED");
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                        >
                          <CheckCircle2 className="size-3 mr-1" />
                          <span>Mark as Completed in HR Portal</span>
                        </Button>
                      )}

                      {/* Outgoing Pending -> Cancel */}
                      {!isIncoming && item.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleCancelReferral(item.id)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          <span>Cancel Request</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Response Action Modal */}
      {selectedReferral && responseAction && (
        <Dialog open={Boolean(selectedReferral)} onOpenChange={() => setSelectedReferral(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {responseAction === "ACCEPTED"
                  ? "Accept Referral Request"
                  : responseAction === "COMPLETED"
                  ? "Complete Referral Submission"
                  : "Decline Referral Request"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {responseAction === "ACCEPTED"
                  ? `Confirm that you plan to review or submit a referral for ${selectedReferral.requester.name} at ${selectedReferral.companyName}.`
                  : responseAction === "COMPLETED"
                  ? `Notify ${selectedReferral.requester.name} that their application has been formally referred in your internal company portal.`
                  : `Politely decline the referral request from ${selectedReferral.requester.name}.`}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleResponseSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Feedback or Instructions Note (Optional)
                </label>
                <Textarea
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  placeholder={
                    responseAction === "ACCEPTED"
                      ? "e.g. Thanks for reaching out! I've downloaded your resume and will submit it to our engineering recruiter tomorrow."
                      : responseAction === "COMPLETED"
                      ? "e.g. Done! Your referral has been logged under req #8492. Watch your inbox for a confirmation from our talent team."
                      : "e.g. Hi, our team is currently pausing hiring for this role, but feel free to check back next quarter."
                  }
                  rows={3}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedReferral(null)}
                  disabled={submittingResponse}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submittingResponse}
                  className={`text-xs font-semibold ${
                    responseAction === "DECLINED"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {submittingResponse ? "Submitting..." : "Confirm Response"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

