/**
 * UniCareer Community — Global Application Configuration
 * Centralizes environment references, route constants, and platform defaults.
 */

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "UniCareer Community",
  description: "Private university-connected career, mentorship, and opportunity networking platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: "0.1.0",
  environment: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",

  // Security & Token Limits
  security: {
    bcryptRounds: 12,
    signedUrlExpirySeconds: 900, // 15 minutes
    maxResumeUploadSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedResumeMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ],
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: 15,
    maxPageSize: 50,
  },

  // Navigation Links
  links: {
    home: "/",
    login: "/login",
    register: "/register",
    opportunities: "/opportunities",
    community: "/community",
    directory: "/directory",
    careerTools: "/career-tools",
    admin: "/admin",
  },
} as const;

