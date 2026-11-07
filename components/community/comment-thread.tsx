"use client";

import * as React from "react";
import {
  MessageSquare,
  CornerDownRight,
  MoreVertical,
  Edit2,
  Trash2,
  Flag,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ReportDialog } from "./report-dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export interface CommentItem {
  id: string;
  postId: string;
  parentId?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  author: {
    id: string;
    name: string;
    image?: string | null;
    membershipType: string;
    verificationStatus: string;
    department?: string | null;
    headline?: string | null;
  };
  isAuthor: boolean;
  replies?: CommentItem[];
}

interface CommentThreadProps {
  postId: string;
  initialComments?: CommentItem[];
  onCommentCountChange?: (newCount: number) => void;
  className?: string;
}

export function CommentThread({
  postId,
  initialComments = [],
  onCommentCountChange,
  className,
}: CommentThreadProps) {
  const [comments, setComments] = React.useState<CommentItem[]>(initialComments);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reply state
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState("");
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

  // Edit state
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = React.useState(false);

  // Report state
  const [reportTargetId, setReportTargetId] = React.useState<string | null>(null);

  // Fetch comments if initialComments was empty or refresh
  const fetchComments = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (res.ok && data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  React.useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments();
    } else {
      setComments(initialComments);
    }
  }, [initialComments, fetchComments]);

  async function handleAddTopComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      setComments((prev) => [...prev, data.data]);
      setNewComment("");
      toast.success("Comment posted");
      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddReply(parentId: string) {
    if (!replyContent.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post reply");

      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), data.data],
            };
          }
          return c;
        })
      );

      setReplyContent("");
      setReplyingToId(null);
      toast.success("Reply posted");
    } catch (err: any) {
      toast.error(err.message || "Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  }

  async function handleSaveEdit(commentId: string) {
    if (!editContent.trim() || isSubmittingEdit) return;

    setIsSubmittingEdit(true);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update comment");

      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return { ...c, content: editContent.trim() };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId ? { ...r, content: editContent.trim() } : r
              ),
            };
          }
          return c;
        })
      );

      setEditingCommentId(null);
      setEditContent("");
      toast.success("Comment updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update comment");
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  async function handleDeleteComment(commentId: string, isReply: boolean, parentId?: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete comment");

      if (isReply && parentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId && c.replies) {
              return {
                ...c,
                replies: c.replies.filter((r) => r.id !== commentId),
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }

      toast.success("Comment deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment");
    }
  }

  return (
    <div className={className}>
      {/* Top Comment Input */}
      <form onSubmit={handleAddTopComment} className="mb-5 space-y-2">
        <Textarea
          placeholder="Share your perspective, advice, or career insight..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={2000}
          className="min-h-[75px] resize-none text-xs leading-relaxed bg-background"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {newComment.length}/2000
          </span>
          <Button
            type="submit"
            size="xs"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3 mr-1 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </form>

      {/* Loading state */}
      {isLoading && comments.length === 0 && (
        <div className="flex items-center justify-center py-6 text-muted-foreground text-xs gap-2">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Loading discussion...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && comments.length === 0 && (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No comments yet. Start the conversation!
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-3.5">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2.5"
          >
            {/* Top comment row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage src={comment.author.image || undefined} alt={comment.author.name} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                    {comment.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">
                      {comment.author.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono uppercase">
                      {(comment.author?.membershipType || "MEMBER").replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <MoreVertical className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  {comment.isAuthor ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <Edit2 className="size-3.5 mr-1.5" />
                        Edit Comment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id, false)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-3.5 mr-1.5" />
                        Delete Comment
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setReportTargetId(comment.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Flag className="size-3.5 mr-1.5" />
                      Report Comment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Comment Body / Edit Form */}
            {editingCommentId === comment.id ? (
              <div className="space-y-2 pt-1">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={2000}
                  className="text-xs min-h-[60px] bg-background"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setEditingCommentId(null)}
                    disabled={isSubmittingEdit}
                  >
                    <X className="size-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    onClick={() => handleSaveEdit(comment.id)}
                    disabled={!editContent.trim() || isSubmittingEdit}
                  >
                    {isSubmittingEdit ? (
                      <Loader2 className="size-3 mr-1 animate-spin" />
                    ) : (
                      <Check className="size-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line pl-1">
                {comment.content}
              </p>
            )}

            {/* Reply toggle button */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (replyingToId === comment.id) {
                    setReplyingToId(null);
                    setReplyContent("");
                  } else {
                    setReplyingToId(comment.id);
                    setReplyContent("");
                  }
                }}
                className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground gap-1"
              >
                <CornerDownRight className="size-3" />
                <span>Reply</span>
              </Button>
            </div>

            {/* Inline reply box */}
            {replyingToId === comment.id && (
              <div className="pl-6 pt-2 space-y-2 border-l-2 border-primary/20">
                <Textarea
                  placeholder={`Reply to ${comment.author.name}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  maxLength={2000}
                  className="min-h-[60px] text-xs bg-background"
                />
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setReplyingToId(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyContent.trim() || isSubmittingReply}
                  >
                    {isSubmittingReply ? (
                      <Loader2 className="size-3 mr-1 animate-spin" />
                    ) : (
                      "Post Reply"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Nested replies list */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-6 space-y-2.5 border-l-2 border-border/80 pt-1">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-md bg-background/60 p-2.5 border border-border/40 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="size-5">
                          <AvatarImage src={reply.author.image || undefined} alt={reply.author.name} />
                          <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                            {reply.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-semibold text-foreground">
                            {reply.author.name}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            • {formatDate(reply.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Reply actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex size-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                          <MoreVertical className="size-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          {reply.isAuthor ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingCommentId(reply.id);
                                  setEditContent(reply.content);
                                }}
                              >
                                <Edit2 className="size-3 mr-1.5" />
                                Edit Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-3 mr-1.5" />
                                Delete Reply
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setReportTargetId(reply.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Flag className="size-3 mr-1.5" />
                              Report Reply
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {editingCommentId === reply.id ? (
                      <div className="space-y-1.5 pt-1">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          maxLength={2000}
                          className="text-xs min-h-[50px] bg-background"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => setEditingCommentId(null)}
                            disabled={isSubmittingEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            onClick={() => handleSaveEdit(reply.id)}
                            disabled={!editContent.trim() || isSubmittingEdit}
                          >
                            {isSubmittingEdit ? (
                              <Loader2 className="size-3 mr-1 animate-spin" />
                            ) : (
                              <Check className="size-3 mr-1" />
                            )}
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line pl-0.5">
                        {reply.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report dialog */}
      {reportTargetId && (
        <ReportDialog
          isOpen={!!reportTargetId}
          onClose={() => setReportTargetId(null)}
          targetType="COMMENT"
          targetId={reportTargetId}
        />
      )}
    </div>
  );
}
