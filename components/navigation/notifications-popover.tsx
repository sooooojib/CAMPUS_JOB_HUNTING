"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Briefcase, Award, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "Application Status Updated",
    message: "Google has moved your SWE Intern application to 'Under Review'.",
    time: "20m ago",
    icon: Briefcase,
    read: false,
  },
  {
    id: "n-2",
    title: "Alumni Referral Accepted",
    message: "Sarah Chen (Stripe) offered an internal referral for your role.",
    time: "2h ago",
    icon: Award,
    read: false,
  },
  {
    id: "n-3",
    title: "Membership Verified",
    message: "University registrar verified your academic enrollment.",
    time: "1d ago",
    icon: CheckCircle2,
    read: true,
  },
];

export function NotificationsPopover() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
          <DropdownMenuLabel className="p-0 font-bold text-xs uppercase tracking-wider text-foreground">
            Notifications
          </DropdownMenuLabel>
          <span className="text-[11px] font-semibold text-primary">
            {unreadCount} Unread
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {mockNotifications.map((n) => {
            const Icon = n.icon;
            return (
              <DropdownMenuItem
                key={n.id}
                className="flex items-start gap-3 p-3.5 focus:bg-muted/60 cursor-pointer"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary mt-0.5">
                  <Icon className="size-3.5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 text-center">
          <Link
            href="/notifications"
            className="block text-xs font-semibold text-primary hover:underline py-1"
          >
            View All Notifications →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
