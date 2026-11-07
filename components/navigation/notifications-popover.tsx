"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NotificationItem } from "@/types";

function getNotificationIcon(type: string, entityType?: string | null) {
  if (type.startsWith("APPLICATION_")) return Briefcase;
  if (type.startsWith("OPPORTUNITY_")) return Briefcase;
  if (type.startsWith("REFERRAL_")) return Award;
  if (type.startsWith("CONNECTION_")) return Sparkles;
  if (type.startsWith("COMMENT_") || type.startsWith("POST_")) return MessageSquare;
  if (type.startsWith("MEMBERSHIP_")) return CheckCircle2;
  if (type.startsWith("REMINDER_") || entityType === "CALENDAR_EVENT") return Calendar;
  return Bell;
}

function formatRelativeTime(dateString: string): string {
  try {
    const diffSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function NotificationsPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Gracefully handle unauthenticated/network error
    }
  }, []);

  const fetchRecentNotifications = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications?pageSize=5");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || data.data || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUnreadCount();
    // Poll unread count periodically
    const timer = setInterval(fetchUnreadCount, 45000);
    return () => clearInterval(timer);
  }, [fetchUnreadCount]);

  React.useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen, fetchRecentNotifications]);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      try {
        await fetch(`/api/notifications/${notif.id}`, { method: "PUT" });
      } catch {
        // Continue navigation regardless
      }
    }

    setIsOpen(false);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    } else {
      router.push("/notifications");
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-84 sm:w-96 p-0 shadow-lg">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/20">
          <DropdownMenuLabel className="p-0 font-bold text-xs uppercase tracking-wider text-foreground">
            Activity Alerts
          </DropdownMenuLabel>
          <span className="text-[11px] font-semibold text-primary">
            {unreadCount} Unread
          </span>
        </div>

        <div className="max-h-84 overflow-y-auto divide-y divide-border/40">
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              <Bell className="size-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="font-semibold text-foreground">All caught up!</p>
              <p className="mt-1 text-[11px]">No notifications right now.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = getNotificationIcon(n.type, n.relatedEntityType);
              return (
                <DropdownMenuItem
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex items-start gap-3 p-3.5 focus:bg-muted/60 cursor-pointer ${
                    !n.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md mt-0.5 ${
                      !n.isRead
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          !n.isRead ? "font-bold text-foreground" : "font-medium text-foreground/80"
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="size-2 rounded-full bg-primary shrink-0 self-center" />
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 text-center bg-muted/10">
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline py-1"
          >
            <span>View All Notifications</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
