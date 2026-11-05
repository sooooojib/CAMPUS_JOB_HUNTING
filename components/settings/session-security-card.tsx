"use client";

import * as React from "react";
import { LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { performClientSignOut } from "@/lib/auth-logout";
import { authClient } from "@/lib/auth-client";

export function SessionSecurityCard() {
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await performClientSignOut();
    } catch (err) {
      console.error("Sign out error from settings:", err);
      window.location.href = "/login?signout=true";
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-sm font-bold text-foreground">Current Active Session</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Signed in as <strong className="text-foreground">{session?.user?.email || "Verified Member"}</strong>. Invalidate current credentials and terminate active device session.
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {isSigningOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          <span>{isSigningOut ? "Signing out..." : "Log Out of Session"}</span>
        </Button>
      </div>
    </div>
  );
}

