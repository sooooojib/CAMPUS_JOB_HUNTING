import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchScoreIndicatorProps {
  score: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
}

export function MatchScoreIndicator({
  score,
  showLabel = true,
  className,
}: MatchScoreIndicatorProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  let colorClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
  if (normalized >= 80) {
    colorClasses = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
  } else if (normalized < 60) {
    colorClasses = "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        colorClasses,
        className
      )}
      title={`${normalized}% qualifications match based on your student profile skills & CGPA`}
    >
      <Sparkles className="size-3" />
      <span>{normalized}%</span>
      {showLabel && <span className="font-normal text-[11px] opacity-85">Match</span>}
    </div>
  );
}

