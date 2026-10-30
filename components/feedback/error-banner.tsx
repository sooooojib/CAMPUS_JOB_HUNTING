"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({
  title = "An error occurred",
  message,
  onRetry,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive dark:border-destructive/30 dark:bg-destructive/15",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="text-sm font-semibold leading-tight text-foreground">
            {title}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="xs"
          onClick={onRetry}
          className="shrink-0 border-destructive/30 hover:bg-destructive/15 text-destructive"
        >
          <RotateCcw className="size-3 mr-1.5" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
}

