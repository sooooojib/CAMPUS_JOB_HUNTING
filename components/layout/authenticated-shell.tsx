"use client";

import * as React from "react";
import { AppSidebar } from "@/components/navigation/sidebar";
import { AppHeader } from "@/components/navigation/header";
import { MobileNav } from "@/components/navigation/mobile-nav";

interface AuthenticatedShellProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    membershipType?: string;
    systemRole?: string;
    isVerified?: boolean;
    emailVerified?: boolean;
    canPostOpportunities?: boolean;
    canReviewApplicants?: boolean;
  };
}

export function AuthenticatedShell({ children, user }: AuthenticatedShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar (hidden on mobile, visible from md up) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <React.Suspense
          fallback={
            <div className="flex h-full w-64 flex-col border-r border-border/80 bg-sidebar" />
          }
        >
          <AppSidebar user={user} />
        </React.Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        <AppHeader onToggleSidebar={() => setMobileNavOpen(true)} user={user} />
        <main className="flex-1 pb-20 md:pb-10 min-w-0">{children}</main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <React.Suspense fallback={null}>
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          user={user}
        />
      </React.Suspense>
    </div>
  );
}
