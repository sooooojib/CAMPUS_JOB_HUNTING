"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, MapPin, DollarSign, Bookmark } from "lucide-react";
import { cn, humanizeTitle } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { DeadlineIndicator } from "./deadline-indicator";
import { MatchScoreIndicator } from "./match-score-indicator";
import { OpportunityClassification, OpportunityType } from "@/types";

export interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  location: string;
  workplaceType: "REMOTE" | "HYBRID" | "ON_SITE";
  type: OpportunityType;
  classification: OpportunityClassification;
  salaryRange?: string | null;
  deadline?: string | Date;
  matchScore?: number;
  skills?: string[];
  targetDepartments?: string[];
  openToAllDepartments?: boolean;
  minCgpa?: number | null;
  poster?: {
    id: string;
    name: string;
    image?: string | null;
    membershipType: string;
  };
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  className?: string;
}

export function JobCard({
  id,
  title,
  companyName,
  companyLogo,
  location,
  workplaceType,
  type,
  classification,
  salaryRange,
  deadline,
  matchScore,
  skills = [],
  targetDepartments = [],
  openToAllDepartments = true,
  minCgpa,
  poster,
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
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg flex flex-col justify-between",
        className
      )}
    >
      <CardContent className="p-0 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Company Avatar / Logo */}
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="size-12 shrink-0 rounded-2xl border border-border object-contain bg-background p-1.5 shadow-2xs"
              />
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary font-bold text-base shadow-2xs">
                {companyName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <Badge variant="outline" className="text-[11px] font-normal uppercase rounded-full px-2 py-0.5">
                  {type.replace("_", " ")}
                </Badge>
                {openToAllDepartments ? (
                  <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Open to All Majors
                  </span>
                ) : targetDepartments.length > 0 ? (
                  <span
                    className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 truncate max-w-[150px]"
                    title={targetDepartments.join(", ")}
                  >
                    {targetDepartments.length === 1 ? targetDepartments[0] : `${targetDepartments[0]} +${targetDepartments.length - 1}`}
                  </span>
                ) : null}
                {matchScore !== undefined && (
                  <MatchScoreIndicator score={matchScore} />
                )}
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                <Link href={`/opportunities/${id}`} className="focus:outline-none">
                  {humanizeTitle(title)}
                </Link>
              </h3>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-muted-foreground" />
                  {humanizeTitle(companyName)}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground" />
                  {location} ({workplaceLabel})
                </span>
                {salaryRange && (
                  <>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="size-3 text-emerald-600 dark:text-emerald-400" />
                      {salaryRange}
                    </span>
                  </>
                )}
                {minCgpa && (
                  <>
                    <span className="text-border">•</span>
                    <span className="font-mono text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      Min CGPA: {minCgpa.toFixed(2)}
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
              onClick={(e) => {
                e.preventDefault();
                onBookmarkToggle(id);
              }}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark job"}
              className={cn(
                "shrink-0 transition-colors rounded-full size-8",
                isBookmarked
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark
                className={cn("size-4", isBookmarked && "fill-primary text-primary")}
              />
            </Button>
          )}
        </div>

        {/* Skill tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/40"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] text-muted-foreground pl-1 font-mono">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer meta & action */}
      <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
        {deadline ? (
          <DeadlineIndicator deadline={deadline} />
        ) : (
          <span className="text-muted-foreground">Open Application</span>
        )}

        <div className="flex items-center gap-2">
          <Link
            href={`/opportunities/${id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "xs" }),
              "font-medium group-hover:border-primary group-hover:text-primary transition-colors rounded-full px-3 py-1"
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
}

