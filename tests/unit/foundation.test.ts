import { describe, it, expect } from "vitest";
import { emailSchema, passwordSchema } from "@/validations/common.schema";
import { cn, formatCurrency } from "@/lib/utils";
import { appConfig } from "@/lib/config";

describe("Stage 1 Foundation & Architecture Unit Tests", () => {
  it("validates appConfig defaults", () => {
    expect(appConfig.name).toBe("UniCareer Community");
    expect(appConfig.security.maxResumeUploadSizeBytes).toBe(5 * 1024 * 1024);
    expect(appConfig.security.signedUrlExpirySeconds).toBe(900);
  });

  it("merges classes correctly with cn utility", () => {
    const result = cn("text-sm", true && "font-bold", false && "hidden", "p-4");
    expect(result).toBe("text-sm font-bold p-4");
  });

  it("formats currency correctly", () => {
    const formatted = formatCurrency(5000, "USD");
    expect(formatted).toContain("5,000");
  });

  it("validates email schema", () => {
    expect(emailSchema.safeParse("student@university.edu").success).toBe(true);
    expect(emailSchema.safeParse("invalid-email").success).toBe(false);
  });

  it("enforces strong password schema", () => {
    expect(passwordSchema.safeParse("SecurePass123!").success).toBe(true);
    expect(passwordSchema.safeParse("weak").success).toBe(false);
    expect(passwordSchema.safeParse("nouppercase123").success).toBe(false);
  });
});

