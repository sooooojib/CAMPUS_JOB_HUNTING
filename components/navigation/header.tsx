"use client";

import * as React from "react";
import { Menu, GraduationCap } from "lucide-react";
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

        {/* Grounded institutional identity anchor */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground select-none">
          <GraduationCap className="size-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground tracking-tight">Jagannath University</span>
          <span className="text-border">/</span>
          <span>Campus Career Community</span>
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

