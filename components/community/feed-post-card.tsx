"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, Share2, Briefcase, Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReactionButtons, ReactionCounts } from "./reaction-buttons";
import { PostCategory, MembershipType } from "@/types";
import { cn, formatDate } from "@/lib/utils";

export interface FeedPostCardProps {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorMembership: MembershipType;
  title?: string;
  content: string;
  category: PostCategory;
  createdAt: string | Date;
  isPinned?: boolean;
  attachedOpportunity?: {
    id: string;
    title: string;
    company: string;
  };
  commentsCount?: number;
  initialReactions?: Partial<ReactionCounts>;
  onCommentClick?: (id: string) => void;
  className?: string;
}

export function FeedPostCard({
  id,
  authorId,
  authorName,
  authorAvatar,
  authorMembership,
  title,
  content,
  category,
  createdAt,
  isPinned = false,
  attachedOpportunity,
  commentsCount = 0,
  initialReactions = {},
  onCommentClick,
  className,
}: FeedPostCardProps) {
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const categoryLabels: Record<PostCategory, { label: string; variant: "default" | "secondary" | "outline" | "info" | "warning" }> = {
    GENERAL: { label: "General", variant: "secondary" },
    CAREER_ADVICE: { label: "Career Advice", variant: "info" },
    JOB_ANNOUNCEMENT: { label: "Opportunity Announcement", variant: "default" },
    REFERRAL_REQUEST: { label: "Referral Request", variant: "warning" },
    EVENT: { label: "Campus Event", variant: "secondary" },
    ACADEMIC: { label: "Academic", variant: "outline" },
  };

  const catMeta = categoryLabels[category] || { label: category, variant: "secondary" };

  return (
    <Card
      className={cn(
        "rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-xs",
        isPinned && "border-primary/40 bg-primary/5/30",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Pinned banner */}
        {isPinned && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Pin className="size-3.5 rotate-45" />
            <span>Pinned Announcement</span>
          </div>
        )}

        {/* Post Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${authorId}`} className="shrink-0">
              <Avatar className="size-10 border border-border">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/profile/${authorId}`}
                  className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                >
                  {authorName}
                </Link>
                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                  {authorMembership.replace("_", " ")}
                </Badge>
              </div>

              <span className="text-[11px] text-muted-foreground">
                {formatDate(createdAt)}
              </span>
            </div>
          </div>

          <Badge variant={catMeta.variant} className="text-[11px]">
            {catMeta.label}
          </Badge>
        </div>

        {/* Post Body */}
        <div className="mt-3.5 space-y-2">
          {title && (
            <h3 className="text-base font-bold text-foreground tracking-tight">
              {title}
            </h3>
          )}
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>

        {/* Attached Opportunity Pill */}
        {attachedOpportunity && (
          <Link
            href={`/opportunities/${attachedOpportunity.id}`}
            className="mt-3.5 flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5 text-xs transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Briefcase className="size-3.5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {attachedOpportunity.title}
                </span>
                <span className="text-muted-foreground ml-1.5 font-normal">
                  at {attachedOpportunity.company}
                </span>
              </div>
            </div>
            <span className="font-semibold text-primary">View Job →</span>
          </Link>
        )}

        {/* Interaction Bar */}
        <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
          <ReactionButtons initialCounts={initialReactions} />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onCommentClick && onCommentClick(id)}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="size-3.5" />
              <span>{commentsCount}</span>
              <span className="hidden sm:inline">Comments</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Share post"
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

