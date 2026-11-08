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
  User,
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
    title: "My Contributions",
    href: "/contributions",
    icon: Share2,
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
    canPostOpportunities?: boolean;
  };
}

export function AppSidebar({ className, onNavigate, user: propUser }: AppSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { data: session } = authClient.useSession();

  const currentUser = {
    name: propUser?.name || session?.user?.name || "Verified Member",
    email: propUser?.email || session?.user?.email || "member@university.edu",
    avatarUrl: propUser?.avatarUrl || (session?.user?.image ?? undefined),
    membershipType: propUser?.membershipType || (session?.user as any)?.membershipType || "STUDENT",
    systemRole: propUser?.systemRole || (session?.user as any)?.systemRole || "MEMBER",
    isVerified: propUser?.isVerified ?? ((session?.user as any)?.verificationStatus === "VERIFIED" || false),
    canPostOpportunities: propUser?.canPostOpportunities ?? ((session?.user as any)?.canPostOpportunities ?? false),
  };

  const isAdmin = currentUser.systemRole === "ADMIN" || currentUser.membershipType === "ADMIN";
  const isStudent = currentUser.membershipType === "STUDENT";
  const isAlumni = currentUser.membershipType === "ALUMNI";

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "UC";

  const visibleNavItems: NavItem[] = React.useMemo(() => {
    const items: NavItem[] = [
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
    ];

    // Strictly for Admin and Alumni: show Manage Postings (students cannot post)
    if (!isStudent && (isAdmin || isAlumni)) {
      items.push({
        title: "Manage Postings",
        href: "/opportunities/my",
        icon: Briefcase,
        badge: isAdmin ? "Admin" : undefined,
        badgeVariant: "warning",
      });
    }

    // Member Network (for everyone)
    items.push({
      title: "Member Network",
      href: "/community",
      icon: Users,
    });

    // Applications, Career Calendar, and Contributions: for Students & Alumni only (not for Admin)
    if (!isAdmin) {
      items.push({
        title: "My Applications",
        href: "/applications",
        icon: FileText,
      });

      items.push({
        title: "Career Calendar",
        href: "/calendar",
        icon: Calendar,
      });

      items.push({
        title: "My Contributions",
        href: "/contributions",
        icon: Share2,
      });
    }

    return items;
  }, [isAdmin, isStudent, isAlumni, currentUser.canPostOpportunities]);

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
        "flex h-full w-64 flex-col border-r border-border/60 bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground transition-all",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border/60 px-5">
        <Link
          href="/feed"
          onClick={onNavigate}
          className="flex items-center gap-3 font-bold tracking-tight text-sidebar-foreground group"
        >
          <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-sm shadow-primary/25 transition-transform group-hover:scale-105">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold leading-tight text-foreground tracking-tight">
              UniCareer
            </span>
            <span className="text-[10px] font-bold tracking-wider text-primary uppercase">
              Campus Community
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2.5">
            Main Platform
          </p>
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {visibleNavItems.map((item) => {
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
                    "group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-bold"
                      : "text-sidebar-foreground/75 hover:bg-muted/70 hover:text-sidebar-foreground hover:translate-x-0.5"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex size-7 items-center justify-center rounded-xl transition-colors",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground group-hover:bg-background group-hover:text-foreground"
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" />
                    </div>
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "outline"}
                      className={cn(
                        "h-4 px-1.5 text-[9px] uppercase tracking-wider font-mono rounded-full",
                        isActive && "bg-primary-foreground/20 text-primary-foreground border-transparent"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System & Administration - STRICTLY VISIBLE ONLY TO PLATFORM ADMINS */}
        {isAdmin && (
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-destructive/90 font-mono mb-2.5">
              System &amp; Administration
            </p>
            <nav className="space-y-1.5" aria-label="Administrative Navigation">
              <Link
                href="/admin"
                onClick={onNavigate}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                  pathname.startsWith("/admin")
                    ? "bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20 font-bold"
                    : "text-sidebar-foreground/75 hover:bg-destructive/10 hover:text-destructive hover:translate-x-0.5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-xl transition-colors",
                      pathname.startsWith("/admin")
                        ? "bg-destructive-foreground/20 text-destructive-foreground"
                        : "bg-destructive/10 text-destructive group-hover:bg-destructive/20"
                    )}
                  >
                    <ShieldAlert className="size-3.5 shrink-0" />
                  </div>
                  <span>Admin Command</span>
                </div>
                <Badge variant="destructive" className="h-4 px-1.5 text-[9px] uppercase tracking-wider font-mono rounded-full">
                  Staff
                </Badge>
              </Link>
            </nav>
          </div>
        )}

        {/* Account & Preferences - ALWAYS SHOWN FOR ALL USERS */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2.5">
            Account &amp; Preferences
          </p>
          <nav className="space-y-1.5" aria-label="Account Navigation">
            <Link
              href="/settings"
              onClick={onNavigate}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                pathname.startsWith("/settings") || pathname === "/profile"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-bold"
                  : "text-sidebar-foreground/75 hover:bg-muted/70 hover:text-sidebar-foreground hover:translate-x-0.5"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-xl transition-colors",
                    pathname.startsWith("/settings") || pathname === "/profile"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground group-hover:bg-background group-hover:text-foreground"
                  )}
                >
                  <User className="size-3.5 shrink-0" />
                </div>
                <span>Profile</span>
              </div>
            </Link>

            {!isAdmin && (
              <Link
                href="/onboarding"
                onClick={onNavigate}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                  pathname.startsWith("/onboarding")
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-bold"
                    : "text-sidebar-foreground/75 hover:bg-muted/70 hover:text-sidebar-foreground hover:translate-x-0.5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-xl transition-colors",
                      pathname.startsWith("/onboarding")
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground group-hover:bg-background group-hover:text-foreground"
                    )}
                  >
                    <GraduationCap className="size-3.5 shrink-0" />
                  </div>
                  <span>Academic Verification</span>
                </div>
              </Link>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="group flex items-center justify-between w-full rounded-2xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:bg-destructive/20 transition-colors">
                  {isSigningOut ? (
                    <Loader2 className="size-3.5 shrink-0 animate-spin" />
                  ) : (
                    <LogOut className="size-3.5 shrink-0 text-destructive" />
                  )}
                </div>
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* User Institutional ID footer card - Elevated human-friendly floating card */}
      <div className="border-t border-sidebar-border/60 p-3 space-y-2">
        <Link
          href="/profile/me"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-2xl p-2.5 text-xs bg-card border border-border/70 shadow-xs hover:border-primary/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-blue-500/15 text-primary font-bold text-xs border border-primary/25 shadow-2xs">
              {initials}
            </div>
            <div className="truncate">
              <p className="font-bold text-sidebar-foreground leading-tight truncate group-hover:text-primary transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-medium mt-0.5">
                {(currentUser.membershipType || "MEMBER").replace("_", " ")} {currentUser.isVerified ? "• Verified" : ""}
              </p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
