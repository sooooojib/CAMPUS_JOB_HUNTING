"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, FileText, ShieldAlert, LogOut, Loader2 } from "lucide-react";
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

  // Prefer active live session, fallback to propUser or default
  const currentUser = {
    name: session?.user?.name || propUser?.name || "Verified Member",
    email: session?.user?.email || propUser?.email || "member@university.edu",
    avatarUrl: session?.user?.image || propUser?.avatarUrl,
    membershipType: (session?.user as any)?.membershipType || propUser?.membershipType || propUser?.role || "STUDENT",
    systemRole: (session?.user as any)?.systemRole || propUser?.systemRole || "MEMBER",
    isVerified: (session?.user as any)?.verificationStatus === "VERIFIED" || propUser?.isVerified || false,
    emailVerified: session?.user?.emailVerified ?? propUser?.emailVerified ?? false,
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

          <DropdownMenuItem className="p-0">
            <Link href="/onboarding" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs text-primary font-medium">
              <ShieldAlert className="size-3.5 text-primary" />
              <span>Institutional Onboarding</span>
            </Link>
          </DropdownMenuItem>

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
              <Settings className="size-3.5 text-muted-foreground" />
              <span>Account Settings</span>
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
