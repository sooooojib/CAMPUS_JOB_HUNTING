import { Bell, Briefcase, Award, CheckCircle2, Check } from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Notifications",
  description: "Your university platform notifications, status updates, and alerts.",
};

const SAMPLE_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Application Status Updated",
    message: "Google Cloud talent recruitment moved your Distributed Systems Software Intern application to 'Under Review'.",
    timestamp: "25 minutes ago",
    type: "APPLICATION",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Alumni Referral Accepted",
    message: "Sarah Chen (Stripe) offered an internal referral for your SWE Intern submission.",
    timestamp: "2 hours ago",
    type: "REFERRAL",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Academic Enrollment Re-Verified",
    message: "University registrar successfully synchronized your academic records for the current semester.",
    timestamp: "Yesterday",
    type: "VERIFICATION",
    unread: false,
  },
  {
    id: "notif-4",
    title: "New Opportunity Match (92%)",
    message: "Google Cloud posted 'Distributed Systems Software Intern' matching your completed coursework.",
    timestamp: "2 days ago",
    type: "OPPORTUNITY",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <ListingTemplate
      title="Notifications &amp; Activity Alerts"
      subtitle="Stay updated on application progress, referral responses, and institutional announcements."
      primaryAction={
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Check className="size-3.5" />
          <span>Mark All as Read</span>
        </Button>
      }
      activeFiltersBar={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">All Alerts (4)</Badge>
          <Badge variant="secondary">Unread (2)</Badge>
          <Badge variant="outline">Applications (1)</Badge>
          <Badge variant="outline">Referrals (1)</Badge>
        </div>
      }
    >
      <div className="space-y-3">
        {SAMPLE_NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-colors flex items-start gap-4 ${
              n.unread
                ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                n.type === "APPLICATION"
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                  : n.type === "REFERRAL"
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {n.type === "APPLICATION" && <Briefcase className="size-4" />}
              {n.type === "REFERRAL" && <Award className="size-4" />}
              {n.type === "VERIFICATION" && <CheckCircle2 className="size-4" />}
              {n.type === "OPPORTUNITY" && <Bell className="size-4" />}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-foreground">{n.title}</h4>
                <span className="text-[11px] text-muted-foreground shrink-0">{n.timestamp}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
            </div>

            {n.unread && (
              <span className="size-2 rounded-full bg-primary shrink-0 self-center" />
            )}
          </div>
        ))}
      </div>
    </ListingTemplate>
  );
}
