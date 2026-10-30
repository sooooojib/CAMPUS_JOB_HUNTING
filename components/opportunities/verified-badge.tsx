import * as React from "react";
import { CheckCircle2, Clock, XCircle, AlertOctagon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerificationStatus } from "@/types";

interface VerifiedBadgeProps {
  status: VerificationStatus;
  className?: string;
  showText?: boolean;
}

export function VerifiedBadge({
  status,
  className,
  showText = true,
}: VerifiedBadgeProps) {
  switch (status) {
    case "VERIFIED":
      return (
        <Badge
          variant="success"
          className={className}
          title="Verified University Affiliate"
        >
          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
          {showText && <span className="ml-1">Verified Member</span>}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="warning"
          className={className}
          title="Verification Pending Review"
        >
          <Clock className="size-3 text-amber-600 dark:text-amber-400" />
          {showText && <span className="ml-1">Pending Verification</span>}
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="destructive"
          className={className}
          title="Verification Rejected"
        >
          <XCircle className="size-3" />
          {showText && <span className="ml-1">Verification Rejected</span>}
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge
          variant="destructive"
          className={className}
          title="Account Suspended"
        >
          <AlertOctagon className="size-3" />
          {showText && <span className="ml-1">Suspended</span>}
        </Badge>
      );
    default:
      return null;
  }
}

