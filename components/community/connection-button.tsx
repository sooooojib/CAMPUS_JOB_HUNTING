"use client";

import * as React from "react";
import { UserPlus, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConnectionState = "NOT_CONNECTED" | "PENDING" | "CONNECTED";

interface ConnectionButtonProps {
  initialState?: ConnectionState;
  userId: string;
  onConnect?: (userId: string) => Promise<void> | void;
  className?: string;
}

export function ConnectionButton({
  initialState = "NOT_CONNECTED",
  userId,
  onConnect,
  className,
}: ConnectionButtonProps) {
  const [state, setState] = React.useState<ConnectionState>(initialState);
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    if (state !== "NOT_CONNECTED") return;
    setLoading(true);
    try {
      if (onConnect) await onConnect(userId);
      setState("PENDING");
    } finally {
      setLoading(false);
    }
  }

  if (state === "CONNECTED") {
    return (
      <Button
        variant="secondary"
        size="xs"
        disabled
        className={cn("gap-1 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10", className)}
      >
        <Check className="size-3" />
        <span>Connected</span>
      </Button>
    );
  }

  if (state === "PENDING") {
    return (
      <Button
        variant="outline"
        size="xs"
        disabled
        className={cn("gap-1 font-medium text-muted-foreground", className)}
      >
        <Clock className="size-3" />
        <span>Pending</span>
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="xs"
      onClick={handleClick}
      disabled={loading}
      className={cn("gap-1 font-medium", className)}
    >
      <UserPlus className="size-3" />
      <span>{loading ? "Connecting..." : "Connect"}</span>
    </Button>
  );
}

