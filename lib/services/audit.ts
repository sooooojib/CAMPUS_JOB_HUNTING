import { prisma } from "@/lib/prisma";
import type { AdminAuditAction, AuditTargetType, AdminAuditLogItem } from "@/types";

export interface LogAdminActionParams {
  adminId: string;
  action: AdminAuditAction;
  targetType: AuditTargetType;
  targetId: string;
  targetLabel?: string | null;
  reason?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
}

/**
 * Records an immutable administrative action log entry.
 * Guarantees accountability for verification, suspension, moderation, and settings updates.
 */
export async function logAdminAction(params: LogAdminActionParams) {
  try {
    const {
      adminId,
      action,
      targetType,
      targetId,
      targetLabel,
      reason,
      details,
      ipAddress,
    } = params;

    const logEntry = await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        targetLabel: targetLabel || null,
        reason: reason?.trim() || null,
        details: details ? (details as any) : undefined,
        ipAddress: ipAddress || null,
      },
    });

    return logEntry;
  } catch (error) {
    // Log failure to stdout but prevent crashing caller transaction
    console.error("[Audit Service] Failed to write admin audit log:", error);
    return null;
  }
}

/**
 * Retrieves paginated administrative audit logs with optional action/targetType filtering.
 */
export async function getAdminAuditLogs(options: {
  action?: string;
  targetType?: string;
  adminId?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{
  logs: AdminAuditLogItem[];
  totalCount: number;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const { action, targetType, adminId, page = 1, pageSize = 20 } = options;
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (action) {
    where.action = action;
  }

  if (targetType) {
    where.targetType = targetType;
  }

  if (adminId) {
    where.adminId = adminId;
  }

  const [totalCount, records] = await Promise.all([
    prisma.adminAuditLog.count({ where }),
    prisma.adminAuditLog.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const logs: AdminAuditLogItem[] = records.map((r) => ({
    id: r.id,
    adminId: r.adminId,
    adminName: r.admin.name,
    adminEmail: r.admin.email,
    action: r.action as AdminAuditAction,
    targetType: r.targetType as AuditTargetType,
    targetId: r.targetId,
    targetLabel: r.targetLabel,
    reason: r.reason,
    details: (r.details as Record<string, any>) || null,
    ipAddress: r.ipAddress,
    createdAt: r.createdAt.toISOString(),
  }));

  return {
    logs,
    totalCount,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

