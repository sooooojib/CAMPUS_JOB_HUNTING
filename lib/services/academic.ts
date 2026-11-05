import { prisma } from "@/lib/prisma";
import { CreateAcademicRecordInput, UpdateAcademicRecordInput } from "@/lib/validations/academic";
import { isPlatformAdmin } from "@/lib/permissions";

/**
 * Calculates the exact cumulative CGPA according to the documented university rule:
 * Cumulative CGPA = Sum(Semester GPA * Semester Credits) / Sum(Semester Credits)
 * Rounded to 2 decimal places.
 */
export function calculateCumulativeCgpa(
  records: { gpa: number; credits: number }[]
): number | null {
  if (!records || records.length === 0) return null;

  let totalWeightedPoints = 0;
  let totalCredits = 0;

  for (const r of records) {
    if (typeof r.gpa === "number" && typeof r.credits === "number" && r.credits > 0) {
      totalWeightedPoints += r.gpa * r.credits;
      totalCredits += r.credits;
    }
  }

  if (totalCredits === 0) return null;

  const rawCgpa = totalWeightedPoints / totalCredits;
  return Math.round(rawCgpa * 100) / 100;
}

/**
 * Synchronizes the member's profile.currentCgpa with their latest semester records.
 */
export async function syncProfileCumulativeCgpa(userId: string): Promise<number | null> {
  const records = await prisma.academicRecord.findMany({
    where: { userId },
    select: { gpa: true, credits: true },
  });

  const cgpa = calculateCumulativeCgpa(records);

  await prisma.profile.updateMany({
    where: { userId },
    data: { currentCgpa: cgpa },
  });

  return cgpa;
}

/**
 * Adds a semester GPA record for a student.
 * Enforces uniqueness on (userId, semester) to prevent duplicate semester entries.
 * Automatically recalculates and syncs cumulative CGPA.
 */
export async function createAcademicRecord(
  userId: string,
  input: CreateAcademicRecordInput
) {
  const existing = await prisma.academicRecord.findUnique({
    where: {
      userId_semester: {
        userId,
        semester: input.semester.trim(),
      },
    },
  });

  if (existing) {
    throw new Error(`An academic record for '${input.semester}' already exists. Please edit the existing semester entry.`);
  }

  const record = await prisma.academicRecord.create({
    data: {
      userId,
      semester: input.semester.trim(),
      gpa: input.gpa,
      credits: input.credits,
      academicYear: input.academicYear?.trim() || null,
      notes: input.notes?.trim() || null,
      isVerified: false,
    },
  });

  await syncProfileCumulativeCgpa(userId);

  return record;
}

/**
 * Updates an existing semester academic record and recalculates cumulative CGPA.
 */
export async function updateAcademicRecord(
  userId: string,
  recordId: string,
  input: UpdateAcademicRecordInput
) {
  const record = await prisma.academicRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    throw new Error("Academic record not found.");
  }

  if (record.userId !== userId) {
    throw new Error("You are not authorized to update this academic record.");
  }

  const updated = await prisma.academicRecord.update({
    where: { id: recordId },
    data: {
      semester: input.semester?.trim(),
      gpa: input.gpa,
      credits: input.credits,
      academicYear: input.academicYear?.trim(),
      notes: input.notes?.trim(),
    },
  });

  await syncProfileCumulativeCgpa(userId);

  return updated;
}

/**
 * Deletes a semester academic record and recalculates cumulative CGPA.
 */
export async function deleteAcademicRecord(userId: string, recordId: string) {
  const record = await prisma.academicRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    throw new Error("Academic record not found.");
  }

  if (record.userId !== userId) {
    throw new Error("You are not authorized to delete this academic record.");
  }

  await prisma.academicRecord.delete({
    where: { id: recordId },
  });

  await syncProfileCumulativeCgpa(userId);

  return { success: true };
}

/**
 * Retrieves the full academic history and cumulative CGPA.
 * STRICT PRIVACY: Restricted strictly to the student themselves or platform ADMIN.
 */
export async function getUserAcademicProfile(
  viewerUserId: string,
  targetUserId: string
) {
  const viewer = await prisma.user.findUnique({
    where: { id: viewerUserId },
    select: { id: true, systemRole: true, membershipType: true },
  });

  const isOwner = viewerUserId === targetUserId;
  const isAdmin = isPlatformAdmin(viewer);

  if (!isOwner && !isAdmin) {
    throw new Error("ACCESS_DENIED: Academic records are strictly private and accessible only to the student and university administration.");
  }

  const [records, profile] = await Promise.all([
    prisma.academicRecord.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.profile.findUnique({
      where: { userId: targetUserId },
      select: { currentCgpa: true, department: true, academicYear: true, graduationYear: true },
    }),
  ]);

  const computedCgpa = calculateCumulativeCgpa(records);

  return {
    records,
    cumulativeCgpa: profile?.currentCgpa ?? computedCgpa,
    department: profile?.department,
    academicYear: profile?.academicYear,
    graduationYear: profile?.graduationYear,
  };
}

