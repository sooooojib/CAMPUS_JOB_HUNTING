"use client";

import * as React from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactionType } from "@/types";

export interface ReactionCounts {
  LIKE: number;
  INSIGHTFUL: number;
  SUPPORT: number;
  CELEBRATE: number;
}

interface ReactionButtonsProps {
  initialCounts?: Partial<ReactionCounts>;
  userReaction?: ReactionType | null;
  onReact?: (type: ReactionType) => void;
  className?: string;
}

export function ReactionButtons({
  initialCounts = {},
  userReaction = null,
  onReact,
  className,
}: ReactionButtonsProps) {
  const [active, setActive] = React.useState<ReactionType | null>(userReaction);
  const [counts, setCounts] = React.useState<ReactionCounts>({
    LIKE: initialCounts.LIKE || 0,
    INSIGHTFUL: initialCounts.INSIGHTFUL || 0,
    SUPPORT: initialCounts.SUPPORT || 0,
    CELEBRATE: initialCounts.CELEBRATE || 0,
  });

  function handleToggle(type: ReactionType) {
    if (active === type) {
      setActive(null);
      setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
    } else {
      if (active) {
        setCounts((prev) => ({ ...prev, [active]: Math.max(0, prev[active] - 1) }));
      }
      setActive(type);
      setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    }
    if (onReact) onReact(type);
  }

  const items: { type: ReactionType; icon: React.ElementType; label: string; activeColor: string }[] = [
    { type: "LIKE", icon: ThumbsUp, label: "Like", activeColor: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {items.map(({ type, icon: Icon, label, activeColor }) => {
        const isSelected = active === type;
        const count = counts[type];

        return (
          <Button
            key={type}
            variant={isSelected ? "secondary" : "ghost"}
            size="xs"
            onClick={() => handleToggle(type)}
            aria-pressed={isSelected}
            aria-label={`${label} (${count})`}
            className={cn(
              "h-7 gap-1 px-2 text-xs font-normal transition-all",
              isSelected && cn("font-semibold", activeColor)
            )}
          >
            <Icon className={cn("size-3.5", isSelected && "fill-current")} />
            <span>{label}</span>
            {count > 0 && (
              <span className="ml-0.5 text-[11px] font-mono opacity-80">
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

