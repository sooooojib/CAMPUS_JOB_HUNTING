"use client";

import * as React from "react";
import {
  Send,
  Briefcase,
  HelpCircle,
  Sparkles,
  Award,
  MessageSquare,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PostType } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CreatePostBoxProps {
  currentUser?: {
    name: string;
    avatarUrl?: string | null;
    membershipType?: string | null;
  };
  onPostCreated?: (newPost: any) => void;
  className?: string;
}

const POST_TYPE_OPTIONS: {
  type: PostType;
  label: string;
  icon: React.ElementType;
  badgeClass: string;
}[] = [
    {
      type: "GENERAL_DISCUSSION",
      label: "Discussion & Questions",
      icon: MessageSquare,
      badgeClass: "hover:bg-muted",
    },
    {
      type: "REFERRAL_REQUEST",
      label: "Referral",
      icon: Award,
      badgeClass: "hover:bg-amber-500/10 hover:text-amber-600",
    },
    {
      type: "ACHIEVEMENT",
      label: "Achievement",
      icon: Sparkles,
      badgeClass: "hover:bg-rose-500/10 hover:text-rose-600",
    },
  ];

export function CreatePostBox({
  currentUser = { name: "Member" },
  onPostCreated,
  className,
}: CreatePostBoxProps) {
  const [content, setContent] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [postType, setPostType] = React.useState<PostType>("GENERAL_DISCUSSION");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 10) {
      toast.error("Post content must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
          postType,
          tags: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      toast.success("Post published to community feed!");
      setContent("");
      setTitle("");
      setIsExpanded(false);

      if (onPostCreated) {
        onPostCreated(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  }

  const initials = currentUser.name
    ? currentUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U";

  return (
    <Card className={cn("rounded-3xl border border-border/60 bg-card p-5 shadow-xs transition-all", className)}>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex items-start gap-3.5">
            <Avatar className="size-11 border-2 border-background shadow-xs shrink-0 rounded-2xl">
              <AvatarImage src={currentUser.avatarUrl || undefined} alt={currentUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2.5">
              {/* Optional Title when expanded */}
              {isExpanded && (
                <Input
                  placeholder="Headline or Question (optional, e.g. 'Software Engineering Interview Prep Tips')"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={150}
                  className="text-xs sm:text-sm font-semibold bg-background rounded-2xl border-border/60 h-10"
                />
              )}

              {/* Textarea */}
              <Textarea
                placeholder="Share a career question, interview advice, referral request, or campus achievement..."
                value={content}
                onFocus={() => setIsExpanded(true)}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                className={cn(
                  "w-full resize-none transition-all text-xs sm:text-sm leading-relaxed bg-background rounded-2xl border-border/60 p-3.5",
                  isExpanded ? "min-h-[120px]" : "min-h-[48px]"
                )}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-3 pt-2 border-t border-border/60">
              {/* Topic Selector */}
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                  Select Post Type:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {POST_TYPE_OPTIONS.map(({ type, label, icon: Icon }) => {
                    const isSelected = postType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPostType(type)}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                            : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="size-3" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">
                  {content.length}/5000 characters (min. 10)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent("");
                      setTitle("");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    size="xs"
                    disabled={content.trim().length < 10 || isSubmitting}
                    className="gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-3" />
                        <span>Post to Community</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
