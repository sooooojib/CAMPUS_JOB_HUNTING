"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, MapPin, DollarSign, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { EmployerBadge } from "./employer-badge";
import { DeadlineIndicator } from "./deadline-indicator";
import { MatchScoreIndicator } from "./match-score-indicator";
import { OpportunityClassification, OpportunityType } from "@/types";

export interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string;
  workplaceType: "REMOTE" | "HYBRID" | "ON_SITE";
  type: OpportunityType;
  classification: OpportunityClassification;
  salaryRange?: string;
  deadline?: string | Date;
  matchScore?: number;
  skills?: string[];
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  className?: string;
}

export function JobCard({
  id,
  title,
  companyName,
  location,
  workplaceType,
  type,
  classification,
  salaryRange,
  deadline,
  matchScore,
  skills = [],
  isBookmarked = false,
  onBookmarkToggle,
  className,
}: JobCardProps) {
  const workplaceLabel =
    workplaceType === "REMOTE"
      ? "Remote"
      : workplaceType === "HYBRID"
      ? "Hybrid"
      : "On-site";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Company Avatar Badge */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted font-bold text-base text-foreground shadow-2xs">
              {companyName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <EmployerBadge classification={classification} />
                <Badge variant="outline" className="text-[11px] font-normal">
                  {type.replace("_", " ")}
                </Badge>
                {matchScore !== undefined && (
                  <MatchScoreIndicator score={matchScore} />
                )}
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                <Link href={`/opportunities/${id}`} className="focus:outline-none">
                  {title}
                </Link>
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-muted-foreground" />
                  {companyName}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground" />
                  {location} ({workplaceLabel})
                </span>
                {salaryRange && (
                  <>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <DollarSign className="size-3 text-muted-foreground" />
                      {salaryRange}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bookmark Trigger */}
          {onBookmarkToggle && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onBookmarkToggle(id)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark job"}
              className={cn(
                "shrink-0",
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark
                className={cn("size-4", isBookmarked && "fill-current")}
              />
            </Button>
          )}
        </div>

        {/* Skill tags */}
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] text-muted-foreground pl-1">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer meta & action */}
        <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
          {deadline ? (
            <DeadlineIndicator deadline={deadline} />
          ) : (
            <span className="text-muted-foreground">Open Application</span>
          )}

          <Link
            href={`/opportunities/${id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "xs" }),
              "font-medium group-hover:border-primary group-hover:text-primary transition-colors"
            )}
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

