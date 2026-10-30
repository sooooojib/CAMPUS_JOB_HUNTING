import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  switch (status) {
    case "SUBMITTED":
      return (
        <Badge variant="info" className={className}>
          Submitted
        </Badge>
      );
    case "UNDER_REVIEW":
      return (
        <Badge variant="warning" className={className}>
          Under Review
        </Badge>
      );
    case "SHORTLISTED":
      return (
        <Badge variant="info" className={className}>
          Shortlisted
        </Badge>
      );
    case "INTERVIEWING":
      return (
        <Badge variant="warning" className={className}>
          Interviewing
        </Badge>
      );
    case "OFFERED":
      return (
        <Badge variant="success" className={className}>
          Offer Extended
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive" className={className}>
          Declined
        </Badge>
      );
    case "WITHDRAWN":
      return (
        <Badge variant="outline" className={className}>
          Withdrawn
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          {status}
        </Badge>
      );
  }
}

