import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { CareerCalendarView } from "@/components/calendar/career-calendar-view";

export const metadata = {
  title: "Personal Career Calendar",
  description: "Track application deadlines, interview milestones, saved opportunity dates, and scheduled reminders.",
};

export default function CalendarPage() {
  return (
    <ListingTemplate
      title="Personal Career Calendar"
      subtitle="Keep track of target application deadlines, scheduled interviews, saved opportunity closures, and custom reminders."
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Loading career calendar...</p>
          </div>
        }
      >
        <CareerCalendarView />
      </Suspense>
    </ListingTemplate>
  );
}

