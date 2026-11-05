import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { NotificationsCenterView } from "@/components/notifications/notifications-center-view";

export const metadata = {
  title: "Notifications & Activity Alerts",
  description: "Stay updated on opportunity deadlines, application updates, referrals, and community interactions.",
};

export default function NotificationsPage() {
  return (
    <ListingTemplate
      title="Notifications & Activity Alerts"
      subtitle="Stay updated on application milestones, opportunity deadlines, referral requests, and institutional announcements."
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Loading activity alerts...</p>
          </div>
        }
      >
        <NotificationsCenterView />
      </Suspense>
    </ListingTemplate>
  );
}
