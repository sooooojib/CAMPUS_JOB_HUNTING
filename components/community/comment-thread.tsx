"use client";

import * as React from "react";
import { MessageSquare, ThumbsUp, CornerDownRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

export interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string | Date;
  likesCount?: number;
  replies?: CommentItem[];
}

interface CommentThreadProps {
  comments: CommentItem[];
  onAddComment?: (content: string, parentId?: string) => void;
  className?: string;
}

export function CommentThread({
  comments,
  onAddComment,
  className,
}: CommentThreadProps) {
  const [newComment, setNewComment] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");

  function handlePost() {
    if (!newComment.trim()) return;
    if (onAddComment) onAddComment(newComment);
    setNewComment("");
  }

  function handlePostReply(parentId: string) {
    if (!replyText.trim()) return;
    if (onAddComment) onAddComment(replyText, parentId);
    setReplyText("");
    setReplyingTo(null);
  }

  return (
    <div className={className}>
      {/* Top Comment Input */}
      <div className="mb-6 space-y-2">
        <Textarea
          placeholder="Share constructive feedback or career insights..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handlePost}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-border/60 bg-muted/20 p-3.5 space-y-3">
            <div className="flex items-start gap-2.5">
              <Avatar className="size-8">
                <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {comment.authorName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-foreground/90 leading-relaxed">
                  {comment.content}
                </p>

                {/* Comment Actions */}
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <ThumbsUp className="size-3" />
                    <span>{comment.likesCount || 0}</span>
                  </button>
                  <button
                    onClick={() =>
                      setReplyingTo(replyingTo === comment.id ? null : comment.id)
                    }
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <MessageSquare className="size-3" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Reply Box */}
            {replyingTo === comment.id && (
              <div className="pl-6 pt-2 space-y-2 border-l-2 border-primary/20">
                <Textarea
                  placeholder={`Reply to ${comment.authorName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[60px] text-xs"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => handlePostReply(comment.id)}
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}

            {/* Render Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-6 space-y-2.5 border-l-2 border-border/80 mt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-2">
                    <CornerDownRight className="size-3 text-muted-foreground mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {reply.authorName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/90 mt-0.5">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

