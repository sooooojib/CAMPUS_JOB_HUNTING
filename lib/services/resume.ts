import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  RESUME_UPLOAD_LIMITS,
  inspectFileMagicBytes,
} from "@/lib/validations/application";
import { isPlatformAdmin } from "@/lib/permissions";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "resumes");

/**
 * Resolves the private secure storage directory on disk (outside of public web root).
 */
export function getResumeStorageDirectory(): string {
  if (!fs.existsSync(/*turbopackIgnore: true*/ STORAGE_ROOT)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ STORAGE_ROOT, { recursive: true });
  }
  return STORAGE_ROOT;
}

/**
 * Sanitizes original filenames for safe storage and presentation.
 */
export function sanitizeResumeFileName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 100);
}

/**
 * Securely saves an uploaded resume buffer after magic-bytes inspection and size validation.
 */
export async function saveUploadedResume({
  userId,
  buffer,
  originalFileName,
  clientMimeType,
}: {
  userId: string;
  buffer: Buffer;
  originalFileName: string;
  clientMimeType?: string;
}) {
  // 1. Validate file size (max 5MB)
  if (buffer.length > RESUME_UPLOAD_LIMITS.maxSizeBytes) {
    throw new Error("File exceeds the maximum permitted size of 5 MB.");
  }
  if (buffer.length === 0) {
    throw new Error("Cannot upload an empty file.");
  }

  // 2. Validate magic bytes (never trust client filename or client MIME type alone)
  const inspection = inspectFileMagicBytes(buffer);
  if (!inspection.isValid || !inspection.detectedMime || !inspection.detectedExt) {
    throw new Error(inspection.error || "Invalid file format. Only PDF and DOCX documents are accepted.");
  }

  // 3. Generate non-guessable cryptographic storage key
  const randomToken = crypto.randomBytes(16).toString("hex");
  const storageKey = `${userId}-${Date.now()}-${randomToken}${inspection.detectedExt}`;
  const storageDir = getResumeStorageDirectory();
  const filePath = path.join(storageDir, path.basename(storageKey));

  // 4. Write securely to private disk storage
  await fs.promises.writeFile(/*turbopackIgnore: true*/ filePath, buffer, { mode: 0o600 });

  // 5. Check if user already has resumes (if first, mark default)
  const existingCount = await prisma.resume.count({ where: { userId } });
  const isDefault = existingCount === 0;

  // 6. Record metadata in PostgreSQL
  const safeName = sanitizeResumeFileName(originalFileName);
  const resume = await prisma.resume.create({
    data: {
      userId,
      fileName: safeName,
      fileSize: buffer.length,
      mimeType: inspection.detectedMime,
      storageKey,
      isDefault,
    },
  });

  return resume;
}

/**
 * Retrieves all saved resumes in a user's private vault.
 */
export async function getUserResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });
}

/**
 * Asserts whether a given user possesses legitimate authorization to access a resume.
 * Authorization rules:
 * 1. Owner of the resume -> ALLOW
 * 2. Platform ADMIN -> ALLOW
 * 3. Authorized Employer representing a company where an application with this resume was submitted -> ALLOW
 * 4. All others -> THROW 403 Forbidden
 */
export async function assertCanAccessResume(
  resumeId: string,
  requestingUserId: string,
  requestingUserRole?: string
): Promise<{ resume: any; isOwner: boolean }> {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      applications: {
        include: {
          opportunity: {
            include: {
              company: {
                include: {
                  members: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!resume) {
    throw new Error("Resume not found.");
  }

  // Rule 1: Owner
  if (resume.userId === requestingUserId) {
    return { resume, isOwner: true };
  }

  // Rule 2: Platform Admin
  if (requestingUserRole === "ADMIN") {
    return { resume, isOwner: false };
  }

  // Rule 3: Authorized employer on an opportunity where this resume was submitted
  const hasEmployerAccess = resume.applications.some((app) => {
    const company = app.opportunity?.company;
    if (!company) return false;
    return company.members.some(
      (m) =>
        m.userId === requestingUserId &&
        (m.role === "OWNER" || m.role === "ADMIN" || m.canManageCompany || m.canPostOpportunities)
    );
  });

  if (hasEmployerAccess) {
    return { resume, isOwner: false };
  }

  throw new Error("Unauthorized: You do not have permission to view or download this private resume.");
}

/**
 * Retrieves the raw file buffer from disk after asserting access authorization.
 */
export async function getResumeFileBuffer(
  resumeId: string,
  requestingUserId: string,
  requestingUserRole?: string
): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
  const { resume } = await assertCanAccessResume(resumeId, requestingUserId, requestingUserRole);

  const storageDir = getResumeStorageDirectory();
  const filePath = path.join(storageDir, path.basename(resume.storageKey));

  if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
    throw new Error("Resume file payload is missing from secure storage vault.");
  }

  const buffer = await fs.promises.readFile(/*turbopackIgnore: true*/ filePath);
  return {
    buffer,
    fileName: resume.fileName,
    mimeType: resume.mimeType,
  };
}

/**
 * Deletes a resume from the database and secure disk storage.
 */
export async function deleteResume(resumeId: string, userId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!resume) {
    throw new Error("Resume not found.");
  }

  if (resume.userId !== userId) {
    throw new Error("Unauthorized: You can only delete your own resumes.");
  }

  // If attached to applications, we do not completely destroy the file on disk if employers need historical records,
  // but unlink the resume record from user's vault or delete if unattached.
  const storageDir = getResumeStorageDirectory();
  const filePath = path.join(storageDir, path.basename(resume.storageKey));

  await prisma.resume.delete({
    where: { id: resumeId },
  });

  // Only physically remove file if not referenced elsewhere
  if (resume._count.applications === 0 && fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
    try {
      await fs.promises.unlink(/*turbopackIgnore: true*/ filePath);
    } catch {
      // Ignore cleanup error if already removed
    }
  }

  return { success: true, message: "Resume deleted successfully." };
}

/**
 * Sets a specific resume as the user's default resume.
 */
export async function setDefaultResume(resumeId: string, userId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== userId) {
    throw new Error("Resume not found or unauthorized.");
  }

  await prisma.$transaction([
    prisma.resume.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.resume.update({
      where: { id: resumeId },
      data: { isDefault: true },
    }),
  ]);

  return { success: true };
}
