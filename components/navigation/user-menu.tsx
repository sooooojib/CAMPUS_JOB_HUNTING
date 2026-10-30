"use client";

import * as React from "react";
import Link from "next/link";
import { User, Settings, FileText, ShieldAlert, LogOut } from "lucide-react";
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

interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    isVerified: boolean;
  };
}

export function UserMenu({
  user = {
    name: "Sarah Miller",
    email: "sarah.miller@university.edu",
    role: "STUDENT",
    isVerified: true,
  },
}: UserMenuProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        aria-label="User navigation menu"
      >
        <Avatar className="size-8 border border-border">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground leading-none">
                {user.name}
              </p>
              <Badge variant="success" className="h-4 px-1 text-[9px]">
                Verified
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-none truncate">
              {user.email}
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
            <Link href="/applications" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs">
              <FileText className="size-3.5 text-muted-foreground" />
              <span>Applications</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Link href="/settings" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs">
              <Settings className="size-3.5 text-muted-foreground" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Link href="/admin" className="flex items-center w-full px-2 py-1.5 gap-2 text-xs text-primary font-semibold">
              <ShieldAlert className="size-3.5" />
              <span>Admin Center</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0" variant="destructive">
          <Link
            href="/login"
            className="flex items-center w-full px-2 py-1.5 gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
