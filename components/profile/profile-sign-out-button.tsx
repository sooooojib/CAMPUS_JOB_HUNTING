"use client";

import * as React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { performClientSignOut } from "@/lib/auth-logout";

export function ProfileSignOutButton() {
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await performClientSignOut();
    } catch (err) {
      console.error("Sign out error from profile:", err);
      window.location.href = "/login?signout=true";
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive cursor-pointer text-xs"
    >
      {isSigningOut ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
    </Button>
  );
}
