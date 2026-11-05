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
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { performClientSignOut } from "@/lib/auth-logout";

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

export function AppSidebar({ className, onNavigate, user: propUser }: AppSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { data: session } = authClient.useSession();

  const currentUser = {
    name: session?.user?.name || propUser?.name || "Verified Member",
    email: session?.user?.email || propUser?.email || "member@university.edu",
    avatarUrl: session?.user?.image || propUser?.avatarUrl,
    role: (session?.user as any)?.membershipType || propUser?.membershipType || "MEMBER",
    isVerified: (session?.user as any)?.verificationStatus === "VERIFIED" || propUser?.isVerified || false,
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "UC";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      if (onNavigate) onNavigate();
      await performClientSignOut();
    } catch (err) {
      console.error("Sign out error from sidebar:", err);
      window.location.href = "/login?signout=true";
    } finally {
      setIsSigningOut(false);
    }
  };

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

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                {isSigningOut ? (
                  <Loader2 className="size-4 shrink-0 animate-spin" />
                ) : (
                  <LogOut className="size-4 shrink-0 text-destructive" />
                )}
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* User Institutional ID footer card */}
      <div className="border-t border-sidebar-border p-3.5 space-y-2">
        <Link
          href="/profile/me"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-lg p-2 text-xs transition-colors hover:bg-sidebar-accent"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
              {initials}
            </div>
            <div className="truncate">
              <p className="font-bold text-sidebar-foreground leading-tight truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {currentUser.role.replace("_", " ")} {currentUser.isVerified ? "• Verified" : ""}
              </p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
