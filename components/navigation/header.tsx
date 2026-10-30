"use client";

import * as React from "react";
import { Search, Menu, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsPopover } from "./notifications-popover";
import { UserMenu } from "./user-menu";

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
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

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search opportunities, members, skills..."
            className="h-9 pl-9 pr-12 text-xs bg-muted/40 border-border/60 focus-visible:bg-background"
          />
          <kbd className="absolute right-2.5 top-2.5 hidden h-4 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Network status badge, notifications, theme, user menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
          <span>Verified University Network</span>
        </div>

        <NotificationsPopover />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

