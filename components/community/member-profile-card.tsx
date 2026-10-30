import * as React from "react";
import Link from "next/link";
import { GraduationCap, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConnectionButton, ConnectionState } from "./connection-button";
import { MembershipType } from "@/types";
import { cn } from "@/lib/utils";

export interface MemberProfileCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  headline?: string;
  membershipType: MembershipType;
  department?: string;
  graduationYear?: number;
  skills?: string[];
  isAvailableForMentorship?: boolean;
  connectionState?: ConnectionState;
  className?: string;
}

export function MemberProfileCard({
  id,
  name,
  avatarUrl,
  headline,
  membershipType,
  department,
  graduationYear,
  skills = [],
  isAvailableForMentorship = false,
  connectionState = "NOT_CONNECTED",
  className,
}: MemberProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border-2 border-background shadow-xs">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/profile/${id}`}
                  className="text-base font-bold text-foreground hover:text-primary transition-colors"
                >
                  {name}
                </Link>
                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                  {membershipType.replace("_", " ")}
                </Badge>
              </div>

              {headline && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {headline}
                </p>
              )}
            </div>
          </div>

          <ConnectionButton userId={id} initialState={connectionState} />
        </div>

        {/* Academic / Affiliation info */}
        {(department || graduationYear) && (
          <div className="mt-3.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="size-3.5 text-primary shrink-0" />
            <span>
              {department}
              {graduationYear ? ` (Class of ${graduationYear})` : ""}
            </span>
          </div>
        )}

        {/* Mentorship badge */}
        {isAvailableForMentorship && (
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Award className="size-3" />
              <span>Available for Mentorship</span>
            </span>
          </div>
        )}

        {/* Skills preview */}
        {skills.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] text-muted-foreground pl-0.5">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

