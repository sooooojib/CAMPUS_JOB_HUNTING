"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  Briefcase,
  Users,
  Award,
  FileText,
  Calendar,
  Sparkles,
  Share2,
  Settings,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "info" | "warning" | "destructive";
  roleRequired?: "ADMIN" | "STUDENT";
}

const mainNavItems: NavItem[] = [
  {
    title: "Community Feed",
    href: "/feed",
    icon: Home,
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    icon: Briefcase,
    badge: "New",
    badgeVariant: "info",
  },
  {
    title: "Member Network",
    href: "/community",
    icon: Users,
  },
  {
    title: "Alumni Referrals",
    href: "/referrals",
    icon: Award,
    badge: "High Trust",
    badgeVariant: "warning",
  },
  {
    title: "My Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    title: "Career Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "My Career Tools",
    href: "/career-tools",
    icon: Sparkles,
    badge: "Student",
    badgeVariant: "secondary",
  },
  {
    title: "My Contributions",
    href: "/contributions",
    icon: Share2,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: "Settings & Profile",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Admin Command",
    href: "/admin",
    icon: ShieldAlert,
    badge: "Staff",
    badgeVariant: "destructive",
    roleRequired: "ADMIN",
  },
];

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border/80 bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 font-bold tracking-tight text-sidebar-foreground"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight">UniCareer</span>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Community Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Main Platform
          </p>
          <nav className="space-y-1" aria-label="Main Navigation">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs font-bold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "outline"}
                      className="h-4 px-1.5 text-[9px] uppercase tracking-wider font-mono"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Governance & Management Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            System & Administration
          </p>
          <nav className="space-y-1" aria-label="System Navigation">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs font-bold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "outline"}
                      className="h-4 px-1.5 text-[9px] uppercase tracking-wider font-mono"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Institutional ID footer card */}
      <div className="border-t border-sidebar-border p-3.5">
        <Link
          href="/profile/me"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-lg p-2 text-xs transition-colors hover:bg-sidebar-accent"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
              SM
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground leading-tight">
                Sarah Miller
              </p>
              <p className="text-[10px] text-muted-foreground">
                CSE &apos;26 • Verified Student
              </p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </div>
    </aside>
  );
}
