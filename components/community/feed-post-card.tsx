"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Bookmark,
  Briefcase,
  Pin,
  MoreVertical,
  Edit2,
  Trash2,
  Flag,
  Sparkles,
  HelpCircle,
  Award,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactionButtons, ReactionCounts } from "./reaction-buttons";
import { CommentThread } from "./comment-thread";
import { ReportDialog } from "./report-dialog";
import { PostType, MembershipType, ReactionType } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export interface FeedPostCardProps {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  authorMembership: string;
  authorDepartment?: string | null;
  authorHeadline?: string | null;
  authorVerificationStatus?: string;
  title?: string | null;
  content: string;
  postType: PostType | string;
  tags?: string[];
  createdAt: string | Date;
  isPinned?: boolean;
  attachedOpportunity?: {
    id: string;
    title: string;
    companyName: string;
    companyLogo?: string | null;
    type?: string;
    workplaceType?: string;
  } | null;
  commentsCount?: number;
  initialReactions?: Partial<ReactionCounts>;
  userReaction?: ReactionType | null;
  isBookmarked?: boolean;
  isAuthor?: boolean;
  onPostDeleted?: (id: string) => void;
  onPostUpdated?: (updated: any) => void;
  className?: string;
}

const POST_TYPE_META: Record<
  string,
  { label: string; icon: React.ElementType; badgeVariant: "default" | "secondary" | "outline" | "info" | "warning" }
> = {
  GENERAL_DISCUSSION: { label: "Discussion & Q&A", icon: MessageSquare, badgeVariant: "secondary" },
  JOB_ANNOUNCEMENT: { label: "Job & Internship", icon: Briefcase, badgeVariant: "default" },
  REFERRAL_REQUEST: { label: "Referral", icon: Award, badgeVariant: "warning" },
  ACHIEVEMENT: { label: "Achievement", icon: Sparkles, badgeVariant: "outline" },
};

export function FeedPostCard({
  id,
  authorId,
  authorName,
  authorAvatar,
  authorMembership,
  authorDepartment,
  authorHeadline,
  authorVerificationStatus,
  title,
  content,
  postType,
  tags = [],
  createdAt,
  isPinned = false,
  attachedOpportunity,
  commentsCount: initialCommentsCount = 0,
  initialReactions = {},
  userReaction = null,
  isBookmarked: initialBookmarked = false,
  isAuthor = false,
  onPostDeleted,
  onPostUpdated,
  className,
}: FeedPostCardProps) {
  const [commentsCount, setCommentsCount] = React.useState(initialCommentsCount);
  const [showComments, setShowComments] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(initialBookmarked);
  const [isTogglingBookmark, setIsTogglingBookmark] = React.useState(false);

  // Edit post state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(title || "");
  const [editContent, setEditContent] = React.useState(content);
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);

  // Report dialog
  const [isReportOpen, setIsReportOpen] = React.useState(false);

  const initials = authorName
    ? authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const typeMeta = (postType && POST_TYPE_META[postType]) || {
    label: (postType || "").replace("_", " "),
    icon: MessageSquare,
    badgeVariant: "secondary",
  };
  const TypeIcon = typeMeta.icon;

  async function handleToggleReaction(type: ReactionType) {
    try {
      const res = await fetch(`/api/posts/${id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle reaction");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to react");
    }
  }

  async function handleToggleBookmark() {
    if (isTogglingBookmark) return;
    setIsTogglingBookmark(true);
    const prev = isBookmarked;
    setIsBookmarked(!prev);

    try {
      const res = await fetch(`/api/posts/${id}/bookmark`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setIsBookmarked(prev);
        throw new Error(data.error || "Failed to update bookmark");
      }
      toast.success(data.data.bookmarked ? "Post saved to your bookmarks" : "Post removed from bookmarks");
    } catch (err: any) {
      setIsBookmarked(prev);
      toast.error(err.message || "Failed to update bookmark");
    } finally {
      setIsTogglingBookmark(false);
    }
  }

  async function handleSaveEdit() {
    if (editContent.trim().length < 10) {
      toast.error("Content must be at least 10 characters.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim() || undefined,
          content: editContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      toast.success("Post updated");
      setIsEditing(false);
      if (onPostUpdated) {
        onPostUpdated(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update post");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      toast.success("Post deleted");
      if (onPostDeleted) {
        onPostDeleted(id);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    }
  }

  return (
    <Card
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-5 sm:p-6 transition-all hover:border-primary/40 hover:shadow-md",
        isPinned && "border-primary/40 bg-primary/5/30",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Pinned banner */}
        {isPinned && (
          <div className="mb-3.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Pin className="size-3.5 rotate-45" />
            <span>Pinned University Announcement</span>
          </div>
        )}

        {/* Post Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Link href={`/profile/${authorId}`} className="shrink-0">
              <Avatar className="size-11 border-2 border-background shadow-xs rounded-2xl">
                <AvatarImage src={authorAvatar || undefined} alt={authorName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${authorId}`}
                  className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors"
                >
                  {authorName}
                </Link>
                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider py-0 px-2 rounded-full">
                  {(authorMembership || "MEMBER").replace("_", " ")}
                </Badge>
                {authorVerificationStatus === "VERIFIED" && (
                  <Badge variant="secondary" className="text-[10px] py-0 px-2 text-emerald-600 dark:text-emerald-400 font-medium rounded-full">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-0.5">
                {authorDepartment && <span>{authorDepartment}</span>}
                {authorDepartment && <span>•</span>}
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant={typeMeta.badgeVariant} className="text-[11px] gap-1 rounded-full px-2.5 py-0.5">
              <TypeIcon className="size-3" />
              <span>{typeMeta.label}</span>
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                {isAuthor ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="size-3.5 mr-1.5" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                      <Trash2 className="size-3.5 mr-1.5" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => setIsReportOpen(true)} className="text-destructive focus:text-destructive">
                    <Flag className="size-3.5 mr-1.5" />
                    Report Post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post Body / In-place Edit Form */}
        {isEditing ? (
          <div className="mt-3.5 space-y-2.5">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Post Title (optional)"
              className="text-xs font-semibold bg-background"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={5000}
              className="text-xs min-h-[100px] bg-background"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setIsEditing(false)}
                disabled={isSavingEdit}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="xs"
                onClick={handleSaveEdit}
                disabled={editContent.trim().length < 10 || isSavingEdit}
              >
                {isSavingEdit ? (
                  <Loader2 className="size-3 mr-1 animate-spin" />
                ) : (
                  <Check className="size-3 mr-1" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3.5 space-y-2">
            {title && (
              <h3 className="text-base font-bold text-foreground tracking-tight">
                {title}
              </h3>
            )}
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[11px] py-0.5 px-2.5 font-mono text-muted-foreground hover:text-foreground rounded-full border-border/60 bg-muted/40"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Attached Opportunity Card */}
        {attachedOpportunity && (
          <Link
            href={`/opportunities/${attachedOpportunity.id}`}
            className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-3 text-xs transition-colors hover:bg-muted/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Briefcase className="size-4" />
              </div>
              <div>
                <span className="font-bold text-foreground text-sm">
                  {attachedOpportunity.title}
                </span>
                <span className="text-muted-foreground ml-2 font-normal">
                  at {attachedOpportunity.companyName}
                </span>
              </div>
            </div>
            <span className="font-semibold text-primary text-xs shrink-0">View Job →</span>
          </Link>
        )}

        {/* Interaction Bar */}
        <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
          {/* Reaction Buttons */}
          <ReactionButtons
            initialCounts={initialReactions}
            userReaction={userReaction}
            onReact={handleToggleReaction}
          />

          {/* Comment, Bookmark */}
          <div className="flex items-center gap-1.5">
            <Button
              variant={showComments ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setShowComments(!showComments)}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-full px-3 py-1"
            >
              <MessageSquare className="size-3.5" />
              <span>{commentsCount}</span>
              <span className="hidden sm:inline">Comments</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleToggleBookmark}
              disabled={isTogglingBookmark}
              aria-label={isBookmarked ? "Remove bookmark" : "Save post"}
              className={cn(
                "text-muted-foreground hover:text-foreground rounded-full size-8",
                isBookmarked && "text-amber-500 fill-amber-500"
              )}
            >
              <Bookmark className={cn("size-3.5", isBookmarked && "fill-current")} />
            </Button>
          </div>
        </div>

        {/* Inline Thread of Comments */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/80">
            <CommentThread
              postId={id}
              onCommentCountChange={(newCount) => setCommentsCount(newCount)}
            />
          </div>
        )}

        {/* Report Dialog */}
        <ReportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          targetType="POST"
          targetId={id}
        />
      </CardContent>
    </Card>
  );
}
