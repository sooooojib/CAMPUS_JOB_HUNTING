import { z } from "zod";

export const CONNECTION_STATUSES = ["PENDING", "ACCEPTED", "REJECTED"] as const;
export const connectionStatusEnum = z.enum(CONNECTION_STATUSES);

export const sendConnectionSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
});

export const respondConnectionSchema = z.object({
  action: z.enum(["ACCEPT", "REJECT"]),
});

export const connectionQuerySchema = z.object({
  status: connectionStatusEnum.optional(),
  type: z.enum(["SENT", "RECEIVED", "ALL"]).default("ALL"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});

export type SendConnectionInput = z.infer<typeof sendConnectionSchema>;
export type RespondConnectionInput = z.infer<typeof respondConnectionSchema>;
export type ConnectionQueryInput = z.infer<typeof connectionQuerySchema>;

