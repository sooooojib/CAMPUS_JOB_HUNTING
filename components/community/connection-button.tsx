"use client";

import * as React from "react";
import { UserPlus, Clock, Check, UserMinus, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ConnectionState =
  | "SELF"
  | "NONE"
  | "NOT_CONNECTED"
  | "PENDING"
  | "PENDING_SENT"
  | "PENDING_RECEIVED"
  | "CONNECTED";

interface ConnectionButtonProps {
  userId: string;
  initialState?: ConnectionState;
  connectionId?: string;
  size?: "xs" | "sm" | "default";
  variant?: "default" | "outline" | "secondary";
  className?: string;
  onStateChange?: (newState: ConnectionState) => void;
}

export function ConnectionButton({
  userId,
  initialState = "NONE",
  connectionId: initialConnectionId,
  size = "xs",
  className,
  onStateChange,
}: ConnectionButtonProps) {
  const [state, setState] = React.useState<ConnectionState>(initialState);
  const [connId, setConnId] = React.useState<string | undefined>(initialConnectionId);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);

  React.useEffect(() => {
    setState(initialState);
    if (initialConnectionId) setConnId(initialConnectionId);
  }, [initialState, initialConnectionId]);

  if (state === "SELF") {
    return null;
  }

  // Handle Send Request
  async function handleSend() {
    setLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to send connection request.");
      }
      setState("PENDING_SENT");
      if (data.data?.id) setConnId(data.data.id);
      onStateChange?.("PENDING_SENT");
      toast.success("Connection request sent!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle Accept Request
  async function handleAccept() {
    if (!connId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/connections/${connId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ACCEPT" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to accept connection.");
      }
      setState("CONNECTED");
      onStateChange?.("CONNECTED");
      toast.success("Connection accepted!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle Reject Request
  async function handleReject() {
    if (!connId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/connections/${connId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to reject connection.");
      }
      setState("NONE");
      onStateChange?.("NONE");
      toast.info("Connection request declined.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle Cancel Outgoing Request
  async function handleCancel() {
    if (!connId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/connections/${connId}?action=cancel`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to cancel request.");
      }
      setState("NONE");
      onStateChange?.("NONE");
      toast.info("Connection request cancelled.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle Remove Connection
  async function handleRemove() {
    if (!connId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/connections/${connId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to remove connection.");
      }
      setState("NONE");
      setShowConfirmRemove(false);
      onStateChange?.("NONE");
      toast.info("Connection removed.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (state === "CONNECTED") {
    if (showConfirmRemove) {
      return (
        <div className="flex items-center gap-1.5">
          <Button
            variant="destructive"
            size={size}
            onClick={handleRemove}
            disabled={loading}
            className="text-xs font-semibold"
          >
            <UserMinus className="size-3 mr-1" />
            <span>Confirm Remove</span>
          </Button>
          <Button
            variant="ghost"
            size={size}
            onClick={() => setShowConfirmRemove(false)}
            disabled={loading}
          >
            <X className="size-3" />
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="secondary"
        size={size}
        onClick={() => setShowConfirmRemove(true)}
        title="Click to remove connection"
        className={cn(
          "gap-1 font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-emerald-500/20 transition-all",
          className
        )}
      >
        <Check className="size-3" />
        <span>Connected</span>
      </Button>
    );
  }

  if (state === "PENDING_SENT" || state === "PENDING") {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleCancel}
        disabled={loading}
        title="Click to cancel outgoing request"
        className={cn(
          "gap-1 font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all",
          className
        )}
      >
        <Clock className="size-3 animate-pulse text-amber-500" />
        <span>{loading ? "Cancelling..." : "Pending"}</span>
      </Button>
    );
  }

  if (state === "PENDING_RECEIVED") {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          variant="default"
          size={size}
          onClick={handleAccept}
          disabled={loading}
          className="gap-1 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <CheckCircle2 className="size-3" />
          <span>{loading ? "..." : "Accept"}</span>
        </Button>
        <Button
          variant="outline"
          size={size}
          onClick={handleReject}
          disabled={loading}
          className="text-xs"
        >
          <X className="size-3" />
        </Button>
      </div>
    );
  }

  // NONE
  return (
    <Button
      variant="default"
      size={size}
      onClick={handleSend}
      disabled={loading}
      className={cn("gap-1 font-semibold", className)}
    >
      <UserPlus className="size-3" />
      <span>{loading ? "Connecting..." : "Connect"}</span>
    </Button>
  );
}
