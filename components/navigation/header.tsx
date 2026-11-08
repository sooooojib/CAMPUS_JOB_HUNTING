"use client";

import * as React from "react";
import { Menu } from "lucide-react";
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

      {/* Right: Notifications, theme, user menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationsPopover />
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

