"use client";

import * as React from "react";
import {
  Bell,
  Mail,
  Briefcase,
  FileText,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { NotificationPreferencesItem } from "@/types";

export function NotificationPreferencesCard() {
  const [prefs, setPrefs] = React.useState<NotificationPreferencesItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/notifications/preferences");
        if (res.ok) {
          const data = await res.json();
          setPrefs(data.preferences);
        } else {
          setError("Failed to load notification preferences.");
        }
      } catch {
        setError("Network error loading notification preferences.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, []);

  const handleToggle = (key: keyof NotificationPreferencesItem) => {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      [key]: !prefs[key],
    });
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs) return;

    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunitiesInApp: prefs.opportunitiesInApp,
          opportunitiesEmail: prefs.opportunitiesEmail,
          applicationsInApp: prefs.applicationsInApp,
          applicationsEmail: prefs.applicationsEmail,
          communityInApp: prefs.communityInApp,
          communityEmail: prefs.communityEmail,
          membershipInApp: prefs.membershipInApp,
          membershipEmail: prefs.membershipEmail,
          remindersInApp: prefs.remindersInApp,
          remindersEmail: prefs.remindersEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update notification preferences");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Loading notification preferences...</span>
      </div>
    );
  }

  if (!prefs) {
    return (
      <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-xs text-destructive flex items-center gap-2">
        <AlertCircle className="size-4 shrink-0" />
        <span>{error || "Unable to display notification preferences."}</span>
      </div>
    );
  }

  const categories = [
    {
      title: "Opportunities & Matches",
      desc: "New postings matching skills, closing deadlines, and official institutional jobs.",
      icon: Briefcase,
      inAppKey: "opportunitiesInApp" as const,
      emailKey: "opportunitiesEmail" as const,
    },
    {
      title: "Applications & Status",
      desc: "Updates when hiring teams review, shortlist, or schedule interview rounds.",
      icon: FileText,
      inAppKey: "applicationsInApp" as const,
      emailKey: "applicationsEmail" as const,
    },
    {
      title: "Community & Networking",
      desc: "Comments, replies, referral requests, and accepted connection invitations.",
      icon: MessageSquare,
      inAppKey: "communityInApp" as const,
      emailKey: "communityEmail" as const,
    },
    {
      title: "Membership & Verification",
      desc: "University registrar reviews, profile badge status, and role updates.",
      icon: ShieldCheck,
      inAppKey: "membershipInApp" as const,
      emailKey: "membershipEmail" as const,
    },
    {
      title: "Reminders & Deadlines",
      desc: "Upcoming application deadlines (72h notice) and custom career schedule notes.",
      icon: Calendar,
      inAppKey: "remindersInApp" as const,
      emailKey: "remindersEmail" as const,
    },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="size-4 shrink-0" />
          <span>Notification preferences successfully saved!</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 bg-muted/40 p-3 text-xs font-bold text-muted-foreground border-b border-border">
          <div className="col-span-8 sm:col-span-8">Category</div>
          <div className="col-span-2 sm:col-span-2 text-center flex items-center justify-center gap-1">
            <Bell className="size-3.5" />
            <span className="hidden sm:inline">In-App</span>
          </div>
          <div className="col-span-2 sm:col-span-2 text-center flex items-center justify-center gap-1">
            <Mail className="size-3.5" />
            <span className="hidden sm:inline">Email</span>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="grid grid-cols-12 p-3.5 sm:p-4 items-center gap-2 hover:bg-muted/20 transition-colors"
              >
                <div className="col-span-8 sm:col-span-8 space-y-0.5 pr-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {cat.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-6 hidden sm:block">
                    {cat.desc}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-2 flex justify-center">
                  <input
                    type="checkbox"
                    id={`inapp-${cat.inAppKey}`}
                    checked={prefs[cat.inAppKey]}
                    onChange={() => handleToggle(cat.inAppKey)}
                    className="size-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor={`inapp-${cat.inAppKey}`} className="sr-only">
                    {cat.title} In-App
                  </Label>
                </div>

                <div className="col-span-2 sm:col-span-2 flex justify-center">
                  <input
                    type="checkbox"
                    id={`email-${cat.emailKey}`}
                    checked={prefs[cat.emailKey]}
                    onChange={() => handleToggle(cat.emailKey)}
                    className="size-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor={`email-${cat.emailKey}`} className="sr-only">
                    {cat.title} Email
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-muted-foreground">
          Critical security &amp; account recovery notices will always be delivered to your verified institutional email.
        </p>

        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          className="text-xs gap-1.5 h-8 shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="size-3.5" />
              <span>Save Preferences</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

