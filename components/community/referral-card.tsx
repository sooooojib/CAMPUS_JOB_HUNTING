"use client";

import * as React from "react";
import { Building2, Award, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ReferralCardProps {
  id: string;
  candidateName: string;
  targetCompany: string;
  targetRole: string;
  pitch: string;
  department: string;
  graduationYear?: number;
  status: "OPEN" | "IN_REVIEW" | "FULFILLED" | "CLOSED";
  onOfferReferral?: (id: string) => void;
  className?: string;
}

export function ReferralCard({
  id,
  candidateName,
  targetCompany,
  targetRole,
  pitch,
  department,
  graduationYear,
  status,
  onOfferReferral,
  className,
}: ReferralCardProps) {
  const statusMeta: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "success" | "warning" }> = {
    OPEN: { label: "Seeking Advocate", variant: "warning" },
    IN_REVIEW: { label: "In Review", variant: "default" },
    FULFILLED: { label: "Referred", variant: "success" },
    CLOSED: { label: "Closed", variant: "outline" },
  };

  const meta = statusMeta[status] || { label: status, variant: "outline" };

  return (
    <Card
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-xs",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {candidateName}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({department}{graduationYear ? ` '${graduationYear.toString().slice(-2)}` : ""})
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                Targeting <span className="font-semibold text-foreground">{targetRole}</span> at
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <Building2 className="size-3 text-primary" />
                  {targetCompany}
                </span>
              </p>
            </div>
          </div>

          <Badge variant={meta.variant} className="text-[11px]">
            {meta.label}
          </Badge>
        </div>

        {/* Elevator Pitch Excerpt */}
        <div className="mt-3.5 rounded-lg bg-muted/40 p-3 text-xs text-foreground/90 leading-relaxed italic border border-border/40">
          &ldquo;{pitch}&rdquo;
        </div>

        {/* Action footer */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Alumni at {targetCompany} can advocate
          </span>

          {status === "OPEN" && onOfferReferral && (
            <Button
              variant="default"
              size="xs"
              onClick={() => onOfferReferral(id)}
              className="gap-1 font-medium"
            >
              <span>Offer Referral</span>
              <ArrowUpRight className="size-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

