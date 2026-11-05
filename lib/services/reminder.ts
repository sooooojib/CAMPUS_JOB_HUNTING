import { prisma } from "@/lib/prisma";
import { createNotification } from "./notification";

export interface ScheduledReminderSummary {
  opportunitiesScanned: number;
  remindersTriggered: number;
  skippedDuplicates: number;
  errors: number;
}

/**
 * Scans active opportunities closing within the next 72 hours and dispatches
 * non-duplicate deadline notifications to members who bookmarked or applied.
 *
 * Uses `DeadlineReminderLog` composite constraint to guarantee that repeated reminders
 * are never sent for the same event and reminder stage.
 */
export async function processScheduledDeadlineReminders(options: {
  lookaheadHours?: number;
} = {}): Promise<ScheduledReminderSummary> {
  const { lookaheadHours = 72 } = options;

  const now = new Date();
  const cutoff = new Date(now.getTime() + lookaheadHours * 60 * 60 * 1000);

  // 1. Find approved opportunities closing between now and the cutoff
  const closingOpportunities = await prisma.opportunity.findMany({
    where: {
      status: "APPROVED",
      deadline: {
        gt: now,
        lte: cutoff,
      },
    },
    select: {
      id: true,
      title: true,
      companyName: true,
      deadline: true,
    },
  });

  let remindersTriggered = 0;
  let skippedDuplicates = 0;
  let errors = 0;

  for (const opp of closingOpportunities) {
    const hoursRemaining = Math.max(
      1,
      Math.round((opp.deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
    );
    const reminderType = hoursRemaining <= 24 ? "DEADLINE_24_HOURS" : "DEADLINE_72_HOURS";

    // 2. Identify interested members: members who bookmarked or submitted applications
    const [bookmarks, applications] = await Promise.all([
      prisma.opportunityBookmark.findMany({
        where: { opportunityId: opp.id },
        select: { userId: true },
      }),
      prisma.application.findMany({
        where: {
          opportunityId: opp.id,
          status: { notIn: ["WITHDRAWN", "REJECTED"] },
        },
        select: { applicantId: true },
      }),
    ]);

    const targetUserIds = new Set<string>();
    bookmarks.forEach((b) => targetUserIds.add(b.userId));
    applications.forEach((a) => targetUserIds.add(a.applicantId));

    for (const userId of targetUserIds) {
      try {
        // 3. Check duplicate log
        const existingLog = await prisma.deadlineReminderLog.findUnique({
          where: {
            userId_opportunityId_reminderType_channel: {
              userId,
              opportunityId: opp.id,
              reminderType,
              channel: "IN_APP",
            },
          },
        });

        if (existingLog) {
          skippedDuplicates++;
          continue;
        }

        // 4. Log reminder to prevent duplicates before dispatch
        await prisma.deadlineReminderLog.create({
          data: {
            userId,
            opportunityId: opp.id,
            reminderType,
            channel: "IN_APP",
          },
        });

        // 5. Trigger notification
        const deadlineDateStr = opp.deadline.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        await createNotification({
          recipientId: userId,
          type: "OPPORTUNITY_DEADLINE_APPROACHING",
          title: `Deadline Closing: ${opp.title}`,
          message: `The application deadline for ${opp.title} at ${opp.companyName} closes in ~${hoursRemaining} hours (${deadlineDateStr}).`,
          relatedEntityType: "OPPORTUNITY",
          relatedEntityId: opp.id,
          actionUrl: `/opportunities/${opp.id}`,
        });

        remindersTriggered++;
      } catch (err) {
        errors++;
        console.error(`[Reminder Service] Failed processing reminder for user ${userId}:`, err);
      }
    }
  }

  return {
    opportunitiesScanned: closingOpportunities.length,
    remindersTriggered,
    skippedDuplicates,
    errors,
  };
}

