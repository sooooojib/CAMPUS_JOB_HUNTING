import * as React from "react";
import { ShieldCheck, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OpportunityClassification } from "@/types";

interface EmployerBadgeProps {
  classification: OpportunityClassification;
  className?: string;
}

export function EmployerBadge({ classification, className }: EmployerBadgeProps) {
  if (classification === "OFFICIAL_EMPLOYER") {
    return (
      <Badge
        variant="info"
        className={className}
        title="Official Employer Posting: Submitted by an authorized hiring manager or recruiter"
      >
        <ShieldCheck className="size-3 mr-1 text-blue-600 dark:text-blue-400" />
        <span>Official Employer</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="warning"
      className={className}
      title="Community Shared: Posted as a referral or opportunity lead by a verified member"
    >
      <Share2 className="size-3 mr-1 text-amber-600 dark:text-amber-400" />
      <span>Community Shared</span>
    </Badge>
  );
}

