"use client";

import * as React from "react";
import { Plus, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CalendarEventType } from "@/types";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
  initialDate?: string;
}

export function AddEventModal({
  isOpen,
  onClose,
  onEventCreated,
  initialDate,
}: AddEventModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [eventType, setEventType] = React.useState<CalendarEventType>("REMINDER");
  const [eventDate, setEventDate] = React.useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [eventTime, setEventTime] = React.useState("09:00");
  const [isAllDay, setIsAllDay] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialDate) {
      setEventDate(initialDate);
    }
  }, [initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Event title is required");
      return;
    }

    if (!eventDate) {
      setError("Event date is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate ISO string
      let fullDateStr = eventDate;
      if (!isAllDay && eventTime) {
        fullDateStr = `${eventDate}T${eventTime}:00`;
      } else {
        fullDateStr = `${eventDate}T09:00:00`;
      }

      const isoDate = new Date(fullDateStr).toISOString();

      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          eventType,
          startDate: isoDate,
          isAllDay,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || errorData.error || "Failed to create reminder"
        );
      }

      // Reset and close
      setTitle("");
      setDescription("");
      setEventType("REMINDER");
      onEventCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="size-4 text-primary" />
              <span>Add Career Reminder</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Schedule an interview prep session, application milestone, or follow-up note.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="event-title" className="text-xs font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="event-title"
                placeholder="e.g., Technical Interview Prep with Alumni"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="event-type" className="text-xs font-semibold">
                  Category
                </Label>
                <select
                  id="event-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as CalendarEventType)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="REMINDER">Personal Reminder</option>
                  <option value="INTERVIEW">Interview / Round</option>
                  <option value="APPLICATION_DEADLINE">Target Deadline</option>
                  <option value="CAREER_FAIR">Career Fair</option>
                  <option value="OTHER">Other Note</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="event-date" className="text-xs font-semibold">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="is-all-day"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="size-4 rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="is-all-day" className="text-xs font-medium cursor-pointer">
                All-day reminder (no specific time)
              </Label>
            </div>

            {!isAllDay && (
              <div className="space-y-1.5">
                <Label htmlFor="event-time" className="text-xs font-semibold">
                  Time
                </Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="event-desc" className="text-xs font-semibold">
                Notes & Context (Optional)
              </Label>
              <Textarea
                id="event-desc"
                placeholder="Review system design principles, prepare questions about company culture..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Create Event</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
