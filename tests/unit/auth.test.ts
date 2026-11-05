import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { devEmailStore } from "@/lib/email";

describe("Stage 4: Authentication Engine & Account Security Unit Tests", () => {
  const testEmail = `unit_test_${Date.now()}@university.edu`;
  const rawPassword = "SecurePass123!@#";
  let createdUserId: string | null = null;

  // Keep email history across the sequential pipeline
  beforeEach(() => {
    // No-op to preserve tokens across sequential steps
  });

  afterAll(async () => {
    // Clean up created test user
    if (createdUserId) {
      await prisma.user.deleteMany({ where: { id: createdUserId } });
    }
    await prisma.user.deleteMany({
      where: { email: { startsWith: "unit_test_" } },
    });
  });

  it("1. registers a new user with secure password hashing (no plaintext passwords)", async () => {
    const result = await auth.api.signUpEmail({
      body: {
        email: testEmail,
        password: rawPassword,
        name: "Arthur Dent",
        membershipType: "STUDENT",
      },
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail.toLowerCase());
    expect(result.user.name).toBe("Arthur Dent");
    createdUserId = result.user.id;

    // Direct database audit to verify password was NOT stored plaintext
    const account = await prisma.account.findFirst({
      where: { userId: result.user.id },
    });

    expect(account).toBeDefined();
    expect(account?.providerId).toBe("credential");
    expect(account?.password).not.toBe(rawPassword);
    expect(account?.password).toBeDefined();
    expect(account!.password!.length).toBeGreaterThan(60); // Scrypt/Bcrypt hashed signature
  });

  it("2. enforces separation of membershipType and systemRole", async () => {
    const userInDb = await prisma.user.findUnique({
      where: { id: createdUserId! },
    });

    expect(userInDb).toBeDefined();
    expect(userInDb?.membershipType).toBe("STUDENT");
    expect(userInDb?.systemRole).toBe("MEMBER"); // Platform admin role remains separate and unescalated
    expect(userInDb?.accountStatus).toBe("ACTIVE");
    expect(userInDb?.verificationStatus).toBe("PENDING");
  });

  it("3. rejects duplicate email registration", async () => {
    try {
      await auth.api.signUpEmail({
        body: {
          email: testEmail,
          password: "AnotherPassword456!",
          name: "Duplicate User",
          membershipType: "ALUMNI",
        },
      });
      expect.unreachable("Duplicate registration should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.status === 422 || error.status === 400 || error.code === "USER_ALREADY_EXISTS" || error.message?.includes("already exists")).toBe(true);
    }
  });

  it("4. rejects login attempts with invalid credentials", async () => {
    try {
      await auth.api.signInEmail({
        body: {
          email: testEmail,
          password: "WrongPassword123!",
        },
      });
      expect.unreachable("Login with incorrect password should fail");
    } catch (error: any) {
      expect(error).toBeDefined();
      const isAuthError =
        error.status === "UNAUTHORIZED" ||
        error.statusCode === 401 ||
        error.body?.code === "INVALID_EMAIL_OR_PASSWORD" ||
        error.message?.toLowerCase().includes("invalid");
      expect(isAuthError).toBe(true);
    }
  });

  it("5. successfully authenticates valid credentials and establishes a session", async () => {
    const signInResult = await auth.api.signInEmail({
      body: {
        email: testEmail,
        password: rawPassword,
      },
    });

    expect(signInResult).toBeDefined();
    expect(signInResult.user.id).toBe(createdUserId);
    expect(signInResult.token).toBeDefined();

    // Verify session exists in database
    const sessionInDb = await prisma.session.findUnique({
      where: { token: signInResult.token },
    });

    expect(sessionInDb).toBeDefined();
    expect(sessionInDb?.userId).toBe(createdUserId);
    expect(sessionInDb?.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("6. generates and records email verification tokens", async () => {
    const record = devEmailStore.getLatestFor(testEmail);
    expect(record).toBeDefined();
    expect(record?.type).toBe("VERIFICATION");
    expect(record?.token).toBeDefined();
    expect(record?.url).toContain("verify-email");
  });

  it("7. successfully redeems email verification token and updates emailVerified status", async () => {
    const record = devEmailStore.getLatestFor(testEmail);
    expect(record).toBeDefined();

    const verifyResult: any = await auth.api.verifyEmail({
      query: {
        token: record!.token!,
      },
    });

    expect(verifyResult?.status).toBe(true);

    const userAfterVerification = await prisma.user.findUnique({
      where: { id: createdUserId! },
    });

    expect(userAfterVerification?.emailVerified).toBe(true);
  });

  it("8. executes full password reset flow with cryptographic tokens", async () => {
    // 1. Request reset
    await auth.api.requestPasswordReset({
      body: {
        email: testEmail,
        redirectTo: "http://localhost:3000/reset-password",
      },
    });

    const resetRecord = devEmailStore.getLatestToken(testEmail, "PASSWORD_RESET");
    expect(resetRecord).toBeDefined();

    // 2. Reset password
    const newPassword = "BrandNewSecurePassword789!";
    const resetResult = await auth.api.resetPassword({
      body: {
        token: resetRecord!,
        newPassword,
      },
    });

    expect(resetResult.status).toBe(true);

    // 3. Old password should fail
    try {
      await auth.api.signInEmail({
        body: {
          email: testEmail,
          password: rawPassword,
        },
      });
      expect.unreachable("Old password should no longer authenticate");
    } catch (e: any) {
      expect(e).toBeDefined();
    }

    // 4. New password should authenticate
    const newSignIn = await auth.api.signInEmail({
      body: {
        email: testEmail,
        password: newPassword,
      },
    });

    expect(newSignIn.user.id).toBe(createdUserId);
  });
});
