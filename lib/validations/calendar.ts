import { z } from "zod";

export const CALENDAR_EVENT_TYPES = [
  "APPLICATION_DEADLINE",
  "SAVED_OPPORTUNITY_DEADLINE",
  "INTERVIEW",
  "CAREER_FAIR",
  "REMINDER",
  "OTHER",
] as const;

export const createCalendarEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Event title must be at least 2 characters")
    .max(120, "Event title cannot exceed 120 characters"),
  description: z.string().trim().max(500).optional().nullable(),
  eventType: z.enum(CALENDAR_EVENT_TYPES).default("REMINDER"),
  startDate: z.string().datetime({ message: "Start date must be a valid ISO date string" }),
  endDate: z.string().datetime().optional().nullable(),
  location: z.string().trim().max(150).optional().nullable(),
  isAllDay: z.boolean().default(false),
  relatedOpportunityId: z.string().optional().nullable(),
  relatedApplicationId: z.string().optional().nullable(),
});

export const updateCalendarEventSchema = createCalendarEventSchema.partial();

export const calendarQuerySchema = z
  .object({
    year: z.string().optional(),
    month: z.string().optional(),
  })
  .transform((data) => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    if (data.month && data.month.includes("-")) {
      const parts = data.month.split("-");
      const parsedYear = parseInt(parts[0], 10);
      const parsedMonth = parseInt(parts[1], 10);
      if (!isNaN(parsedYear)) year = parsedYear;
      if (!isNaN(parsedMonth)) month = parsedMonth;
    } else {
      if (data.year) {
        const parsedYear = parseInt(data.year, 10);
        if (!isNaN(parsedYear)) year = parsedYear;
      }
      if (data.month) {
        const parsedMonth = parseInt(data.month, 10);
        if (!isNaN(parsedMonth)) month = parsedMonth;
      }
    }

    return { year, month };
  });

export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
export type UpdateCalendarEventInput = z.infer<typeof updateCalendarEventSchema>;
export type CalendarQueryInput = z.infer<typeof calendarQuerySchema>;
