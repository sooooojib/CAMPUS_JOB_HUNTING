import { prisma } from "@/lib/prisma";
import { CalendarEventItem, CalendarEventType } from "@/types";
import {
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from "@/lib/validations/calendar";

/**
 * Retrieves all relevant career events for a member for a given month view:
 * 1. User-created calendar events and career reminders
 * 2. Application deadlines for applied opportunities
 * 3. Interview dates and interview milestones
 * 4. Application deadlines for saved / bookmarked opportunities
 */
export async function getUserCareerCalendar(
  userId: string,
  year: number,
  month: number // 1 - 12
): Promise<{
  year: number;
  month: number;
  events: CalendarEventItem[];
}> {
  // Calendar grid range with a 7-day buffer on both sides for complete weekly cells
  const startDate = new Date(year, month - 1, 1);
  startDate.setDate(startDate.getDate() - 7);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(year, month, 0);
  endDate.setDate(endDate.getDate() + 7);
  endDate.setHours(23, 59, 59, 999);

  const [customEvents, appliedOpportunities, manualApplications, bookmarkedOpportunities] = await Promise.all([
    // 1. Custom calendar events
    prisma.careerCalendarEvent.findMany({
      where: {
        userId,
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { startDate: "asc" },
    }),

    // 2. Applications submitted by user
    prisma.application.findMany({
      where: {
        applicantId: userId,
        status: { notIn: ["WITHDRAWN", "REJECTED"] },
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            companyName: true,
            deadline: true,
          },
        },
      },
    }),

    // 3. Manual external applications tracked by user
    prisma.manualApplication.findMany({
      where: {
        userId,
      },
    }),

    // 4. Saved / Bookmarked opportunities
    prisma.opportunityBookmark.findMany({
      where: {
        userId,
        opportunity: {
          status: "APPROVED",
        },
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            companyName: true,
            deadline: true,
          },
        },
      },
    }),
  ]);

  const events: CalendarEventItem[] = [];

  // Map custom events
  for (const ce of customEvents) {
    events.push({
      id: ce.id,
      title: ce.title,
      description: ce.description,
      eventType: ce.eventType as CalendarEventType,
      startDate: ce.startDate.toISOString(),
      endDate: ce.endDate ? ce.endDate.toISOString() : null,
      location: ce.location,
      isAllDay: ce.isAllDay,
      relatedOpportunityId: ce.relatedOpportunityId,
      relatedApplicationId: ce.relatedApplicationId,
      isSystemGenerated: false,
      actionUrl: ce.relatedOpportunityId
        ? `/opportunities/${ce.relatedOpportunityId}`
        : undefined,
    });
  }

  // Map Applied Opportunity Deadlines & Submission Events
  const appliedOppIds = new Set<string>();
  for (const app of appliedOpportunities) {
    appliedOppIds.add(app.opportunityId);
    const deadline = app.opportunity.deadline;
    const appliedDate = app.submittedAt;

    // Auto-show application submission on the calendar
    if (appliedDate >= startDate && appliedDate <= endDate) {
      events.push({
        id: `app_submitted_${app.id}`,
        title: `Applied: ${app.opportunity.title}`,
        description: `Direct application submitted for ${app.opportunity.title} at ${app.opportunity.companyName}.`,
        eventType: "APPLICATION_DEADLINE",
        startDate: appliedDate.toISOString(),
        endDate: null,
        isAllDay: true,
        relatedOpportunityId: app.opportunity.id,
        relatedApplicationId: app.id,
        isSystemGenerated: true,
        companyName: app.opportunity.companyName,
        actionUrl: `/applications`,
        statusBadge: `Applied: ${(app.status || "PENDING").replace("_", " ")}`,
      });
    }

    // Opportunity deadline event
    if (deadline >= startDate && deadline <= endDate) {
      events.push({
        id: `app_deadline_${app.id}`,
        title: `Deadline: ${app.opportunity.title}`,
        description: `Application deadline for your submitted application at ${app.opportunity.companyName}.`,
        eventType: "APPLICATION_DEADLINE",
        startDate: deadline.toISOString(),
        endDate: null,
        isAllDay: true,
        relatedOpportunityId: app.opportunity.id,
        relatedApplicationId: app.id,
        isSystemGenerated: true,
        companyName: app.opportunity.companyName,
        actionUrl: `/applications`,
        statusBadge: `Deadline`,
      });
    }

    // If application is in interview stage
    if (app.status === "INTERVIEW") {
      events.push({
        id: `app_interview_${app.id}`,
        title: `Interview Round: ${app.opportunity.title}`,
        description: `Candidate interview phase active for ${app.opportunity.companyName}. Review recruiter communications and application details.`,
        eventType: "INTERVIEW",
        startDate: app.updatedAt.toISOString(),
        endDate: null,
        isAllDay: false,
        relatedOpportunityId: app.opportunity.id,
        relatedApplicationId: app.id,
        isSystemGenerated: true,
        companyName: app.opportunity.companyName,
        actionUrl: `/applications`,
        statusBadge: "Interview Scheduled",
      });
    }
  }

  // Map Manual Applications
  for (const manual of manualApplications) {
    const appliedDate = manual.appliedDate || manual.createdAt;

    if (appliedDate >= startDate && appliedDate <= endDate) {
      events.push({
        id: `manual_app_${manual.id}`,
        title: `Tracked: ${manual.roleTitle}`,
        description: `Manual application logged for ${manual.roleTitle} at ${manual.companyName}.`,
        eventType: "APPLICATION_DEADLINE",
        startDate: appliedDate.toISOString(),
        endDate: null,
        isAllDay: true,
        relatedOpportunityId: undefined,
        relatedApplicationId: manual.id,
        isSystemGenerated: true,
        companyName: manual.companyName,
        actionUrl: `/applications`,
        statusBadge: `Manual: ${(manual.status || "APPLIED").replace("_", " ")}`,
      });
    }

    if (manual.status === "INTERVIEWING") {
      events.push({
        id: `manual_interview_${manual.id}`,
        title: `Interview: ${manual.roleTitle}`,
        description: `Interview stage active for ${manual.roleTitle} at ${manual.companyName}.`,
        eventType: "INTERVIEW",
        startDate: manual.updatedAt.toISOString(),
        endDate: null,
        isAllDay: false,
        relatedOpportunityId: undefined,
        relatedApplicationId: manual.id,
        isSystemGenerated: true,
        companyName: manual.companyName,
        actionUrl: `/applications`,
        statusBadge: "Interview Stage",
      });
    }
  }

  // Map Saved Opportunity Deadlines (excluding already applied)
  for (const bm of bookmarkedOpportunities) {
    if (appliedOppIds.has(bm.opportunityId)) continue; // Don't duplicate if already applied

    const deadline = bm.opportunity.deadline;
    if (deadline >= startDate && deadline <= endDate) {
      events.push({
        id: `saved_deadline_${bm.opportunity.id}`,
        title: `Deadline: ${bm.opportunity.title}`,
        description: `Application deadline for saved opportunity at ${bm.opportunity.companyName}.`,
        eventType: "SAVED_OPPORTUNITY_DEADLINE",
        startDate: deadline.toISOString(),
        endDate: null,
        isAllDay: true,
        relatedOpportunityId: bm.opportunity.id,
        isSystemGenerated: true,
        companyName: bm.opportunity.companyName,
        actionUrl: `/opportunities/${bm.opportunity.id}`,
        statusBadge: "Saved Opportunity",
      });
    }
  }

  // Sort chronologically
  events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return {
    year,
    month,
    events,
  };
}

/**
 * Creates a personal career calendar event or reminder.
 */
export async function createCalendarEvent(
  userId: string,
  input: CreateCalendarEventInput
): Promise<CalendarEventItem> {
  const created = await prisma.careerCalendarEvent.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      eventType: input.eventType,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      location: input.location,
      isAllDay: input.isAllDay,
      relatedOpportunityId: input.relatedOpportunityId,
      relatedApplicationId: input.relatedApplicationId,
    },
  });

  return {
    id: created.id,
    title: created.title,
    description: created.description,
    eventType: created.eventType as CalendarEventType,
    startDate: created.startDate.toISOString(),
    endDate: created.endDate ? created.endDate.toISOString() : null,
    location: created.location,
    isAllDay: created.isAllDay,
    relatedOpportunityId: created.relatedOpportunityId,
    relatedApplicationId: created.relatedApplicationId,
    isSystemGenerated: false,
    actionUrl: created.relatedOpportunityId
      ? `/opportunities/${created.relatedOpportunityId}`
      : undefined,
  };
}

/**
 * Updates a personal career calendar event, verifying ownership.
 */
export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  input: UpdateCalendarEventInput
): Promise<CalendarEventItem> {
  const existing = await prisma.careerCalendarEvent.findUnique({
    where: { id: eventId },
  });

  if (!existing) {
    throw new Error("Calendar event not found.");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN: You do not have permission to modify this calendar event.");
  }

  const updated = await prisma.careerCalendarEvent.update({
    where: { id: eventId },
    data: {
      title: input.title,
      description: input.description,
      eventType: input.eventType,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate !== undefined ? (input.endDate ? new Date(input.endDate) : null) : undefined,
      location: input.location,
      isAllDay: input.isAllDay,
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    eventType: updated.eventType as CalendarEventType,
    startDate: updated.startDate.toISOString(),
    endDate: updated.endDate ? updated.endDate.toISOString() : null,
    location: updated.location,
    isAllDay: updated.isAllDay,
    relatedOpportunityId: updated.relatedOpportunityId,
    relatedApplicationId: updated.relatedApplicationId,
    isSystemGenerated: false,
    actionUrl: updated.relatedOpportunityId
      ? `/opportunities/${updated.relatedOpportunityId}`
      : undefined,
  };
}

/**
 * Deletes a personal career calendar event, verifying ownership.
 */
export async function deleteCalendarEvent(
  userId: string,
  eventId: string
): Promise<{ success: boolean; id: string }> {
  const existing = await prisma.careerCalendarEvent.findUnique({
    where: { id: eventId },
  });

  if (!existing) {
    throw new Error("Calendar event not found.");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN: You do not have permission to delete this calendar event.");
  }

  await prisma.careerCalendarEvent.delete({
    where: { id: eventId },
  });

  return { success: true, id: eventId };
}
