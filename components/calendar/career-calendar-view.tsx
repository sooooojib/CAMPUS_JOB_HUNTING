"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Briefcase,
  ExternalLink,
  Trash2,
  Loader2,
  MapPin,
  Building2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEventModal } from "./add-event-modal";
import type { CalendarEventItem, CalendarEventType } from "@/types";

interface MonthDateMeta {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function getDaysInMonthGrid(year: number, monthIndex: number): MonthDateMeta[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(year, monthIndex, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon ...
  const lastDay = new Date(year, monthIndex + 1, 0);
  const totalDays = lastDay.getDate();

  const grid: MonthDateMeta[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevDate = new Date(year, monthIndex - 1, d);
    const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    grid.push({
      date: prevDate,
      dateString: dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const currDate = new Date(year, monthIndex, d);
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    grid.push({
      date: currDate,
      dateString: dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days (fill to 35 or 42 cells)
  const remainingCells = 42 - grid.length >= 7 ? 35 - grid.length : 42 - grid.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextDate = new Date(year, monthIndex + 1, d);
    const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 2).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    grid.push({
      date: nextDate,
      dateString: dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  return grid;
}

function getEventBadgeStyle(type: CalendarEventType) {
  switch (type) {
    case "APPLICATION_DEADLINE":
      return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    case "INTERVIEW":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
    case "SAVED_OPPORTUNITY_DEADLINE":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "CAREER_FAIR":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900";
    case "REMINDER":
    case "OTHER":
    default:
      return "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900";
  }
}

function getEventBadgeLabel(type: CalendarEventType) {
  switch (type) {
    case "APPLICATION_DEADLINE":
      return "Deadline";
    case "INTERVIEW":
      return "Interview";
    case "SAVED_OPPORTUNITY_DEADLINE":
      return "Saved Target";
    case "CAREER_FAIR":
      return "Career Fair";
    case "REMINDER":
      return "Reminder";
    default:
      return "Note";
  }
}

export function CareerCalendarView() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState<CalendarEventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEventItem | null>(null);
  const [selectedCellDate, setSelectedCellDate] = React.useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthString = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const fetchEvents = React.useCallback(async (mStr: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/calendar?month=${mStr}`);
      if (res.ok) {
        const result = await res.json();
        // Support both result.data and result.events
        setEvents(result.data || result.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEvents(monthString);
  }, [monthString, fetchEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleOpenAddForDate = (dateStr: string) => {
    setSelectedCellDate(dateStr);
    setIsAddModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const daysGrid = React.useMemo(() => getDaysInMonthGrid(year, month), [year, month]);

  // Group events by YYYY-MM-DD
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEventItem[]>();
    for (const ev of events) {
      try {
        const dateKey = new Date(ev.startDate).toISOString().split("T")[0];
        const list = map.get(dateKey) || [];
        list.push(ev);
        map.set(dateKey, list);
      } catch {
        // Skip invalid date
      }
    }
    return map;
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5 shadow-2xs">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="size-8"
              title="Previous Month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 px-2.5 text-xs font-semibold"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="size-8"
              title="Next Month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <h2 className="text-lg font-bold text-foreground min-w-[170px]">
            {monthLabel}
          </h2>
          {isLoading && <Loader2 className="size-4 animate-spin text-primary" />}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Legend overview */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-muted-foreground mr-2">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Applications</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Interviews</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Saved Deadlines</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-purple-500" />
              <span>Reminders</span>
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setSelectedCellDate(undefined);
              setIsAddModalOpen(true);
            }}
            className="gap-1.5 text-xs h-8"
          >
            <Plus className="size-3.5" />
            <span>Add Reminder</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/30 text-center py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
          {daysGrid.map((cell, idx) => {
            const cellEvents = eventsByDate.get(cell.dateString) || [];

            return (
              <div
                key={cell.dateString + idx}
                onClick={() => handleOpenAddForDate(cell.dateString)}
                className={`min-h-[96px] sm:min-h-[110px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                  cell.isCurrentMonth
                    ? "bg-card hover:bg-muted/30"
                    : "bg-muted/10 text-muted-foreground/40 hover:bg-muted/20"
                } ${cell.isToday ? "ring-2 ring-inset ring-primary/40 bg-primary/5" : ""}`}
              >
                {/* Day Number and Add Button */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center size-6 rounded-full text-xs font-semibold ${
                      cell.isToday
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : cell.isCurrentMonth
                        ? "text-foreground group-hover:text-primary"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  <span className="opacity-0 group-hover:opacity-100 text-muted-foreground text-[10px] pr-1 transition-opacity hidden sm:inline">
                    + Add
                  </span>
                </div>

                {/* Event Pills inside Day Cell */}
                <div className="space-y-1 overflow-hidden flex-1">
                  {cellEvents.slice(0, 3).map((ev) => {
                    const badgeClass = getEventBadgeStyle(ev.eventType);

                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate font-medium cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${badgeClass}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    );
                  })}

                  {cellEvents.length > 3 && (
                    <div className="text-[9px] font-semibold text-muted-foreground px-1">
                      +{cellEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selectedEvent && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${getEventBadgeStyle(selectedEvent.eventType)}`}
                  >
                    {getEventBadgeLabel(selectedEvent.eventType)}
                  </Badge>
                  {!selectedEvent.isSystemGenerated && (
                    <span className="text-[10px] text-muted-foreground">Personal Reminder</span>
                  )}
                </div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {new Date(selectedEvent.startDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {!selectedEvent.isAllDay && (
                    <> • {new Date(selectedEvent.startDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 py-4 text-xs">
                {selectedEvent.companyName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <span>Company: <strong className="text-foreground">{selectedEvent.companyName}</strong></span>
                  </div>
                )}

                {selectedEvent.statusBadge && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="size-4 text-primary shrink-0" />
                    <span>Status: <strong className="text-foreground">{selectedEvent.statusBadge}</strong></span>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description}
                  </div>
                )}

                {selectedEvent.actionUrl && (
                  <div className="pt-2">
                    <Link
                      href={selectedEvent.actionUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Open Associated Opportunity / Application</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
                {!selectedEvent.isSystemGenerated ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="gap-1.5 text-xs"
                  >
                    {isDeleting ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                    <span>Delete Reminder</span>
                  </Button>
                ) : (
                  <span className="text-[11px] text-muted-foreground italic">
                    Automated calendar event
                  </span>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Custom Event Modal */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialDate={selectedCellDate}
        onEventCreated={() => fetchEvents(monthString)}
      />
    </div>
  );
}
