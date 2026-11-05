"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Briefcase,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCheck,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { NotificationItem } from "@/types";

interface NotificationsCenterViewProps {
  initialNotifications?: NotificationItem[];
  initialUnreadCount?: number;
}

type FilterCategory = "ALL" | "UNREAD" | "OPPORTUNITY" | "APPLICATION" | "COMMUNITY" | "REFERRAL";

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

function getNotificationColor(type: string) {
  if (type.startsWith("APPLICATION_")) {
    return "bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300";
  }
  if (type.startsWith("REFERRAL_") || type.startsWith("CONNECTION_")) {
    return "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300";
  }
  if (type.startsWith("MEMBERSHIP_")) {
    return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300";
  }
  if (type.startsWith("REMINDER_")) {
    return "bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300";
  }
  return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
}

function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "";
  }
}

export function NotificationsCenterView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = React.useState<FilterCategory>("ALL");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMarkingAll, setIsMarkingAll] = React.useState(false);
  const [actionInProgress, setActionInProgress] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(async (selectedFilter: FilterCategory) => {
    setIsLoading(true);
    try {
      let url = "/api/notifications?pageSize=50";
      if (selectedFilter === "UNREAD") {
        url += "&unreadOnly=true";
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let items: NotificationItem[] = data.notifications || [];

        // In-memory filter for specific categories
        if (selectedFilter === "OPPORTUNITY") {
          items = items.filter((n) => n.type.startsWith("OPPORTUNITY_"));
        } else if (selectedFilter === "APPLICATION") {
          items = items.filter((n) => n.type.startsWith("APPLICATION_"));
        } else if (selectedFilter === "COMMUNITY") {
          items = items.filter(
            (n) =>
              n.type.startsWith("COMMENT_") ||
              n.type.startsWith("POST_") ||
              n.type.startsWith("CONNECTION_")
          );
        } else if (selectedFilter === "REFERRAL") {
          items = items.filter((n) => n.type.startsWith("REFERRAL_"));
        }

        setNotifications(items);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications(filter);
  }, [filter, fetchNotifications]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActionInProgress(id);

    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      const res = await fetch(`/api/notifications/${id}`, { method: "PUT" });
      if (!res.ok) {
        // Revert on error
        fetchNotifications(filter);
      }
    } catch {
      fetchNotifications(filter);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      const res = await fetch("/api/notifications?action=markAllRead", {
        method: "POST",
      });
      if (!res.ok) {
        fetchNotifications(filter);
      }
    } catch {
      fetchNotifications(filter);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionInProgress(id);

    try {
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.isRead) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }

      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (!res.ok) {
        fetchNotifications(filter);
      }
    } catch {
      fetchNotifications(filter);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleItemClick = (notif: NotificationItem) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header and filter buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ALL")}
            className="text-xs h-8"
          >
            All Alerts
          </Button>
          <Button
            variant={filter === "UNREAD" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("UNREAD")}
            className="text-xs h-8 gap-1.5"
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <Badge
                variant={filter === "UNREAD" ? "secondary" : "default"}
                className="text-[10px] h-4 px-1 py-0 min-w-4"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={filter === "APPLICATION" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("APPLICATION")}
            className="text-xs h-8"
          >
            Applications
          </Button>
          <Button
            variant={filter === "OPPORTUNITY" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("OPPORTUNITY")}
            className="text-xs h-8"
          >
            Opportunities
          </Button>
          <Button
            variant={filter === "COMMUNITY" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("COMMUNITY")}
            className="text-xs h-8"
          >
            Community
          </Button>
          <Button
            variant={filter === "REFERRAL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("REFERRAL")}
            className="text-xs h-8"
          >
            Referrals
          </Button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="gap-1.5 text-xs h-8"
            >
              {isMarkingAll ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCheck className="size-3.5 text-primary" />
              )}
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main notification list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="text-sm">Fetching notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-3">
              <Bell className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No notifications found</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              {filter === "UNREAD"
                ? "You have read all your activity updates and reminders."
                : "Activity updates regarding job postings, applications, referral responses, and community interactions will appear here."}
            </p>
            {filter !== "ALL" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("ALL")}
                className="mt-4 text-xs"
              >
                Clear Filter
              </Button>
            )}
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getNotificationIcon(n.type, n.relatedEntityType);
            const colorClass = getNotificationColor(n.type);

            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`group relative p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 cursor-pointer hover:shadow-xs ${
                  !n.isRead
                    ? "border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-xs"
                    : "border-border bg-card hover:border-border/90 hover:bg-muted/30"
                }`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg mt-0.5 ${colorClass}`}
                >
                  <Icon className="size-5" />
                </div>

                <div className="space-y-1 flex-1 min-w-0 pr-8 sm:pr-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm ${
                          !n.isRead ? "font-bold text-foreground" : "font-medium text-foreground/90"
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <Badge variant="default" className="text-[10px] h-4.5 px-1.5 py-0 font-bold">
                          New
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                      {formatTimestamp(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>

                  {n.actionUrl && (
                    <div className="pt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        <span>View Details</span>
                        <ExternalLink className="size-3" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 self-center shrink-0">
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="Mark as read"
                      disabled={actionInProgress === n.id}
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                    >
                      <Check className="size-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Dismiss notification"
                    disabled={actionInProgress === n.id}
                    onClick={(e) => handleDelete(n.id, e)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
