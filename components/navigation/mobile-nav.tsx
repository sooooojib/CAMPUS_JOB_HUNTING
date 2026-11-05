"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Award, Users, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./sidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    membershipType?: string;
    systemRole?: string;
    isVerified?: boolean;
    emailVerified?: boolean;
  };
}

export function MobileNav({ isOpen, onClose, user }: MobileNavProps) {
  const pathname = usePathname();

  // Prevent background scrolling when mobile drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const bottomItems = [
    { title: "Feed", href: "/feed", icon: Home },
    { title: "Jobs", href: "/opportunities", icon: Briefcase },
    { title: "Referrals", href: "/referrals", icon: Award },
    { title: "Network", href: "/community", icon: Users },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative z-50 flex h-full w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
            <AppSidebar onNavigate={onClose} user={user} />
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar (Thumb Accessible) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border/80 bg-background/95 backdrop-blur-md px-2 md:hidden"
        aria-label="Mobile Navigation Bar"
      >
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <button
          onClick={onClose}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
          aria-label="Toggle full menu"
        >
          <Menu className="size-5 shrink-0" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
}

