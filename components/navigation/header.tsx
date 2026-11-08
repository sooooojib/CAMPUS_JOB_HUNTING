"use client";

import * as React from "react";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsPopover } from "./notifications-popover";

interface AppHeaderProps {
  onToggleSidebar?: () => void;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    isVerified?: boolean;
    emailVerified?: boolean;
  };
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 sm:px-6 backdrop-blur-md transition-all">
      {/* Left: Mobile hamburger & subtle institutional community anchor */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden size-9 rounded-2xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Human-friendly Campus Network Pulse */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-muted/40 border border-border/50 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-foreground/85">Jagannath University Campus Community</span>
        </div>
      </div>

      {/* Right: Notifications & Quick actions (Profile icon removed from top bar per user request) */}
      <div className="flex items-center gap-2">
        <NotificationsPopover />
        <ThemeToggle />
      </div>
    </header>
  );
}

