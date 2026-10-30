"use client";

import * as React from "react";
import { Send, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostCategory } from "@/types";
import { cn } from "@/lib/utils";

interface CreatePostBoxProps {
  currentUser?: {
    name: string;
    avatarUrl?: string;
  };
  onSubmitPost?: (content: string, category: PostCategory) => Promise<void> | void;
  className?: string;
}

export function CreatePostBox({
  currentUser = { name: "Current Member" },
  onSubmitPost,
  className,
}: CreatePostBoxProps) {
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<PostCategory>("GENERAL");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const categories: { key: PostCategory; label: string }[] = [
    { key: "GENERAL", label: "General" },
    { key: "CAREER_ADVICE", label: "Career Advice" },
    { key: "JOB_ANNOUNCEMENT", label: "Opportunity Announcement" },
    { key: "REFERRAL_REQUEST", label: "Referral Request" },
  ];

  async function handleSubmit() {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (onSubmitPost) {
        await onSubmitPost(content, category);
      }
      setContent("");
      setIsExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className={cn("rounded-xl border border-border/80 bg-card p-4 shadow-xs", className)}>
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <Avatar className="size-10 border border-border shrink-0">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share career advice, announcements, or ask for peer referrals..."
              value={content}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "w-full resize-none transition-all text-sm leading-relaxed",
                isExpanded ? "min-h-[100px]" : "min-h-[44px]"
              )}
            />

            {isExpanded && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/60">
                {/* Category selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
                    <Tag className="size-3" />
                    <span>Topic:</span>
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                        category === cat.key
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                    className="gap-1 font-semibold"
                  >
                    <Send className="size-3" />
                    <span>{isSubmitting ? "Posting..." : "Publish Post"}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

