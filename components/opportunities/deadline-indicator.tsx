"use client";

import * as React from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeadlineIndicatorProps {
  deadline: Date | string;
  className?: string;
}

export function DeadlineIndicator({ deadline, className }: DeadlineIndicatorProps) {
  const [diffDays, setDiffDays] = React.useState<number | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }, 0);

    return () => clearTimeout(timer);
  }, [deadline]);

  const deadlineDate = React.useMemo(() => new Date(deadline), [deadline]);
  const formattedDate = React.useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(deadlineDate);
  }, [deadlineDate]);

  if (diffDays !== null && diffDays <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive",
          className
        )}
      >
        <AlertCircle className="size-3" />
        <span>Closed ({formattedDate})</span>
      </span>
    );
  }

  if (diffDays !== null && diffDays > 0 && diffDays <= 3) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>{diffDays === 1 ? "1 day left" : `${diffDays} days left`}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground",
        className
      )}
    >
      <Calendar className="size-3 text-muted-foreground" />
      <span>Apply by {formattedDate}</span>
    </span>
  );
}
