import { z } from "zod";

export const createAcademicRecordSchema = z.object({
  semester: z
    .string()
    .trim()
    .min(2, "Semester name is required (e.g., Fall 2024, Spring 2025)")
    .max(40, "Semester name cannot exceed 40 characters"),
  gpa: z
    .number()
    .min(0.0, "GPA cannot be below 0.00")
    .max(4.0, "GPA cannot exceed 4.00"),
  credits: z
    .number()
    .min(0.5, "Credits must be at least 0.5")
    .max(30.0, "Credits cannot exceed 30.0")
    .default(3.0),
  academicYear: z.string().trim().max(40).optional().nullable(),
  notes: z.string().trim().max(300).optional().nullable(),
});

export const updateAcademicRecordSchema = z.object({
  semester: z.string().trim().min(2).max(40).optional(),
  gpa: z.number().min(0.0).max(4.0).optional(),
  credits: z.number().min(0.5).max(30.0).optional(),
  academicYear: z.string().trim().max(40).optional().nullable(),
  notes: z.string().trim().max(300).optional().nullable(),
});

export type CreateAcademicRecordInput = z.infer<typeof createAcademicRecordSchema>;
export type UpdateAcademicRecordInput = z.infer<typeof updateAcademicRecordSchema>;

