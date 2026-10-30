"use client";

import * as React from "react";
import { FileText, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ApplicationStatusBadge } from "./application-status-badge";
import { MatchScoreIndicator } from "./match-score-indicator";
import { ApplicationStatus } from "@/types";
import { cn } from "@/lib/utils";

export interface ApplicantSummaryCardProps {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  appliedRole: string;
  appliedDate: string | Date;
  status: ApplicationStatus;
  matchScore?: number;
  hasResume?: boolean;
  onViewCandidate?: (id: string) => void;
  className?: string;
}

export function ApplicantSummaryCard({
  id,
  candidateName,
  candidateAvatar,
  appliedRole,
  appliedDate,
  status,
  matchScore,
  hasResume = true,
  onViewCandidate,
  className,
}: ApplicantSummaryCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(appliedDate));

  const initials = candidateName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-xs",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarImage src={candidateAvatar} alt={candidateName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h4 className="text-sm font-bold text-foreground leading-tight">
                {candidateName}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Applied for <span className="font-medium text-foreground">{appliedRole}</span>
              </p>
            </div>
          </div>

          <ApplicationStatusBadge status={status} />
        </div>

        <div className="mt-3.5 flex items-center justify-between text-xs pt-3 border-t border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Applied {formattedDate}</span>
            {matchScore !== undefined && (
              <MatchScoreIndicator score={matchScore} showLabel={false} />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {hasResume && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground" title="Resume attached">
                <FileText className="size-3 text-primary" />
                <span>Resume</span>
              </span>
            )}
            {onViewCandidate && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onViewCandidate(id)}
                className="h-6 px-2 text-xs"
              >
                <Eye className="size-3 mr-1" />
                <span>Review</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

