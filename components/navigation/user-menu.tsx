"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, FileText, ShieldAlert, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { performClientSignOut } from "@/lib/auth-logout";

interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    membershipType?: string;
    systemRole?: string;
    isVerified?: boolean;
    emailVerified?: boolean;
    canPostOpportunities?: boolean;
  };
}

export function UserMenu({
  user: propUser,
}: UserMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { data: session } = authClient.useSession();

  // Prefer live database propUser, fallback to session or default
  const currentUser = {
    name: propUser?.name || session?.user?.name || "Verified Member",
    email: propUser?.email || session?.user?.email || "member@university.edu",
    avatarUrl: propUser?.avatarUrl || (session?.user?.image ?? undefined),
    membershipType: propUser?.membershipType || (session?.user as any)?.membershipType || propUser?.role || "STUDENT",
    systemRole: propUser?.systemRole || (session?.user as any)?.systemRole || "MEMBER",
    isVerified: propUser?.isVerified ?? ((session?.user as any)?.verificationStatus === "VERIFIED" || false),
    emailVerified: propUser?.emailVerified ?? (session?.user?.emailVerified ?? false),
  };

  const isAdmin = currentUser.systemRole === "ADMIN";
  const isEmployer = currentUser.membershipType === "EMPLOYER" || currentUser.membershipType === "EXTERNAL_CONNECTION";

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
      await performClientSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/login?signout=true";
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        aria-label="User navigation menu"
      >
        <Avatar className="size-8 border border-border">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground leading-none truncate max-w-[120px]">
                {currentUser.name}
              </p>
              {currentUser.isVerified ? (
                <Badge variant="success" className="h-4 px-1 text-[9px]">
                  Verified
                </Badge>
              ) : currentUser.emailVerified ? (
                <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                  Email Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="h-4 px-1 text-[9px] text-amber-600 border-amber-500/30">
                  Unverified
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-none truncate">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Link href="/profile/me" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs">
              <User className="size-3.5 text-muted-foreground" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>

          {!currentUser.isVerified ? (
            <DropdownMenuItem className="p-0">
              <Link href="/onboarding" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>Complete Onboarding</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="p-0">
              <Link href="/profile/me" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Credentials</span>
              </Link>
            </DropdownMenuItem>
          )}

          {isEmployer ? (
            <DropdownMenuItem className="p-0">
              <Link href="/opportunities/my" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs">
                <FileText className="size-3.5 text-muted-foreground" />
                <span>Manage Postings</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="p-0">
              <Link href="/applications" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs">
                <FileText className="size-3.5 text-muted-foreground" />
                <span>Applications</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0">
            <Link href="/settings" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs">
              <User className="size-3.5 text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem className="p-0">
              <Link href="/admin" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs text-primary font-semibold">
                <ShieldAlert className="size-3.5" />
                <span>Admin Center</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isSigningOut}
          onSelect={async (e) => {
            e.preventDefault();
            await handleSignOut();
          }}
          className="flex items-center gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer px-2 py-1.5"
        >
          {isSigningOut ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <LogOut className="size-3.5" />
          )}
          <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
