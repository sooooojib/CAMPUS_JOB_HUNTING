import { z } from "zod";

export const projectItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Project title must be at least 2 characters"),
  description: z.string().min(5, "Project description must be at least 5 characters"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  techStack: z.array(z.string()).default([]),
});

export const experienceItemSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(2, "Company/Organization name is required"),
  role: z.string().min(2, "Role/Title is required"),
  period: z.string().min(2, "Time period is required (e.g. 2023 - Present)"),
  description: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  image: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  headline: z.string().max(160, "Headline cannot exceed 160 characters").optional(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  department: z.string().max(100).optional(),
  studentId: z.string().max(50).optional(),
  academicYear: z.string().max(50).optional(),
  graduationYear: z.number().int().min(1950).max(2050).optional().nullable(),
  degree: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  designation: z.string().max(100).optional(),
  skills: z.array(z.string().min(1).max(50)).optional(),
  interests: z.array(z.string().min(1).max(50)).optional(),
  projects: z.array(projectItemSchema).optional(),
  experience: z.array(experienceItemSchema).optional(),
  linkedinUrl: z.string().url("Must be a valid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid GitHub URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
  showEmail: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const onboardingStudentSchema = z.object({
  studentId: z.string().min(3, "University Student ID is required for verification"),
  department: z.string().min(2, "Department is required"),
  academicYear: z.string().min(2, "Academic year / standing is required"),
  degree: z.string().min(2, "Degree program is required"),
  graduationYear: z.number().int().min(2020).max(2035, "Enter a valid graduation year"),
  workEmail: z.string().email("Valid university email is required").optional().or(z.literal("")),
  headline: z.string().max(160).optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).default([]),
  proofDetails: z.string().max(500).optional(),
});

export const onboardingAlumniSchema = z.object({
  studentId: z.string().optional(),
  department: z.string().min(2, "Graduating department is required"),
  graduationYear: z.number().int().min(1960).max(2026, "Enter a valid graduation year"),
  degree: z.string().min(2, "Degree obtained is required"),
  company: z.string().optional(),
  designation: z.string().optional(),
  headline: z.string().max(160).optional(),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).default([]),
  proofDetails: z.string().min(5, "Please provide thesis topic, registration batch, or advisor name for alumni verification"),
});

export const onboardingFacultySchema = z.object({
  department: z.string().min(2, "Academic department is required"),
  designation: z.string().min(2, "Position/Title (e.g. Assistant Professor, Chair) is required"),
  workEmail: z.string().email("Official university faculty/staff email is required"),
  headline: z.string().max(160).optional(),
  bio: z.string().max(1000).optional(),
  proofDetails: z.string().min(5, "Official faculty portal URL or institutional directory listing is required"),
});

export const onboardingEmployerSchema = z.object({
  company: z.string().min(2, "Company/Organization name is required"),
  designation: z.string().min(2, "Work designation / recruiting title is required"),
  workEmail: z.string().email("Official corporate domain email is required"),
  connectionNote: z.string().min(15, "Please explain your institutional connection or campus hiring partnership purpose"),
  proofDetails: z.string().min(5, "Provide company careers page or recruiter verification details"),
  headline: z.string().max(160).optional(),
});

export const onboardingPayloadSchema = z.object({
  membershipType: z.enum([
    "STUDENT",
    "ALUMNI",
    "FACULTY",
    "STAFF",
    "EMPLOYER",
    "EXTERNAL_CONNECTION",
  ]),
  studentData: onboardingStudentSchema.optional(),
  alumniData: onboardingAlumniSchema.optional(),
  facultyData: onboardingFacultySchema.optional(),
  employerData: onboardingEmployerSchema.optional(),
});

export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>;

export const memberDirectoryQuerySchema = z.object({
  q: z.string().trim().optional(),
  department: z.string().trim().optional(),
  membershipType: z
    .enum([
      "STUDENT",
      "ALUMNI",
      "FACULTY",
      "STAFF",
      "EMPLOYER",
      "EXTERNAL_CONNECTION",
    ])
    .optional(),
  company: z.string().trim().optional(),
  skill: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
});

export type MemberDirectoryQueryInput = z.infer<typeof memberDirectoryQuerySchema>;

