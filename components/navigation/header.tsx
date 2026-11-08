"use client";

import * as React from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsPopover } from "./notifications-popover";
import { UserMenu } from "./user-menu";

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

export function AppHeader({ onToggleSidebar, user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        )}
      </div>

      {/* Right: Network status badge, notifications, theme, user menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
          <span>Verified University Network</span>
        </div>

        <NotificationsPopover />
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

