"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Share2, ExternalLink, Edit3, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OpportunityDetailActionsProps {
  opportunityId: string;
  initialBookmarked: boolean;
  canEdit: boolean;
  applicationMethod: "INTERNAL" | "EXTERNAL";
  externalUrl?: string | null;
}

export function OpportunityDetailActions({
  opportunityId,
  initialBookmarked,
  canEdit,
  applicationMethod,
  externalUrl,
}: OpportunityDetailActionsProps) {
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);
  const [loading, setLoading] = React.useState(false);

  const toggleBookmark = async () => {
    setLoading(true);
    const nextState = !bookmarked;
    setBookmarked(nextState);

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/bookmark`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        if (data.data.bookmarked) {
          toast.success("Opportunity saved to your bookmarks");
        } else {
          toast.info("Removed from your bookmarks");
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setBookmarked(!nextState);
      toast.error(err.message || "Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  const shareOpportunity = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Opportunity link copied to clipboard");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
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
  applicationMethod,
  externalUrl,
  deadline,
  isExpired,
}: {
  applicationMethod: "INTERNAL" | "EXTERNAL";
  externalUrl?: string | null;
  deadline: Date;
  isExpired: boolean;
}) {
  if (isExpired) {
    return (
      <Button disabled className="w-full text-xs font-semibold">
        Application Deadline Passed
      </Button>
    );
  }

  if (applicationMethod === "EXTERNAL" && externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "default", size: "default" }),
          "w-full gap-2 font-semibold shadow-xs"
        )}
      >
        <span>Apply on Company Portal</span>
        <ExternalLink className="size-4" />
      </a>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Button
        disabled
        className="w-full font-semibold bg-primary/20 text-primary border border-primary/30"
      >
        Direct Institutional Application
      </Button>
      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Internal candidate resume uploads open in the upcoming application cycle. Bookmark this opportunity to track submission readiness.
      </p>
    </div>
  );
}
