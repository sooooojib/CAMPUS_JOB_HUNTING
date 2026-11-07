"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface OpportunityComment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
    membershipType: string;
    verificationStatus: string;
  };
}

interface OpportunityCommentsProps {
  opportunityId: string;
  currentUserId?: string;
}

export function OpportunityComments({ opportunityId }: OpportunityCommentsProps) {
  const [comments, setComments] = useState<OpportunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/opportunities/${opportunityId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Failed to load opportunity comments:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [opportunityId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UC";
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <span>Opportunity Discussion &amp; Inquiries</span>
        </h3>
        <Badge variant="outline" className="text-xs font-mono">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </Badge>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question about this opportunity, eligibility, or application process..."
          className="min-h-[80px] text-xs resize-y bg-background"
          maxLength={1000}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
            className="gap-1.5 text-xs font-medium"
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            <span>Post Comment</span>
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="pt-2">
        {isLoading ? (
          <div className="py-6 flex items-center justify-center text-xs text-muted-foreground gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span>Loading discussion...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
            No questions or comments yet. Be the first to start the discussion!
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-border/40">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6 border border-border/60">
                      <AvatarImage src={comment.author.image || undefined} />
                      <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                        {getInitials(comment.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground">
                      {comment.author.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase font-mono py-0 px-1">
                      {comment.author.membershipType}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 pl-8 leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

