"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Share2, Edit3, ExternalLink, Send, Users, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ApplyModal } from "@/components/applications/apply-modal";
import { ExternalApplyDialog } from "@/components/applications/external-apply-dialog";

export function OpportunityDetailActions({
  opportunityId,
  initialBookmarked = false,
  canEdit = false,
  canManageApplicants = false,
}: {
  opportunityId: string;
  initialBookmarked?: boolean;
  canEdit?: boolean;
  canManageApplicants?: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/bookmark`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setBookmarked(data.bookmarked);
        toast.success(
          data.bookmarked
            ? "Saved to your Bookmarks collection."
            : "Opportunity removed from bookmarks."
        );
      }
    } catch {
      toast.error("Could not update bookmark status.");
    } finally {
      setLoading(false);
    }
  };

  const shareOpportunity = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Opportunity URL copied to clipboard.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canManageApplicants && (
        <Link
          href={`/opportunities/${opportunityId}/applicants`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "gap-1.5 text-xs font-semibold shadow-xs"
          )}
        >
          <Users className="size-3.5" />
          <span>Manage Applicants</span>
        </Link>
      )}

      {canEdit && (
        <Link
          href={`/opportunities/post?editId=${opportunityId}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5 text-xs"
          )}
        >
          <Edit3 className="size-3.5" />
          <span>Edit Opening</span>
        </Link>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={toggleBookmark}
        disabled={loading}
        className={cn(
          "gap-1.5 text-xs transition-colors",
          bookmarked ? "text-primary border-primary/50 bg-primary/5" : ""
        )}
      >
        <Bookmark className={cn("size-3.5", bookmarked && "fill-primary text-primary")} />
        <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareOpportunity}
        className="gap-1.5 text-xs"
      >
        <Share2 className="size-3.5" />
        <span>Share</span>
      </Button>
    </div>
  );
}

export function OpportunityApplyButton({
  opportunityId,
  opportunityTitle,
  companyName,
  applicationMethod,
  externalUrl,
  deadline,
  isExpired,
  minCgpa,
}: {
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  applicationMethod: "INTERNAL" | "EXTERNAL";
  externalUrl?: string | null;
  deadline: Date;
  isExpired: boolean;
  minCgpa?: number | null;
}) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [externalModalOpen, setExternalModalOpen] = useState(false);

  if (isExpired) {
    return (
      <Button disabled className="w-full text-xs font-semibold">
        Application Deadline Passed
      </Button>
    );
  }

  if (applicationMethod === "EXTERNAL") {
    return (
      <>
        <Button
          onClick={() => setExternalModalOpen(true)}
          className="w-full gap-2 font-semibold shadow-xs"
          size="default"
        >
          <span>Apply on Company Portal</span>
          <ExternalLink className="size-4" />
        </Button>

        {externalModalOpen && (
          <ExternalApplyDialog
            isOpen={externalModalOpen}
            onClose={() => setExternalModalOpen(false)}
            opportunityId={opportunityId}
            opportunityTitle={opportunityTitle}
            companyName={companyName}
            externalUrl={externalUrl || "#"}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setInternalModalOpen(true)}
        className="w-full font-semibold gap-2 shadow-xs"
        size="default"
      >
        <Send className="size-4" />
        <span>Apply Now</span>
      </Button>

      {internalModalOpen && (
        <ApplyModal
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
          opportunityId={opportunityId}
          opportunityTitle={opportunityTitle}
          companyName={companyName}
          deadline={deadline}
          minCgpa={minCgpa}
        />
      )}
    </>
  );
}
