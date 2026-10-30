"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[UniCareer Runtime Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="size-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        An unexpected error occurred while processing this request. Our engineering logs have captured this incident.
      </p>

      {error.digest && (
        <code className="mt-3 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground font-mono">
          Digest: {error.digest}
        </code>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="default"
          onClick={() => reset()}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          <span>Try Again</span>
        </Button>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline" })}
        >
          <Home className="size-4 mr-2" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

