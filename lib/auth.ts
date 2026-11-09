import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

function getBaseURL(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://jnujobhunting.vercel.app";
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: process.env.AUTH_SECRET || "dev-insecure-secret-key-32-chars-minimum-needed",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: async (request?: Request) => {
    const origins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "https://*.vercel.app",
      "https://jnujobhunting.vercel.app",
    ];

    if (process.env.NEXT_PUBLIC_APP_URL) {
      origins.push(process.env.NEXT_PUBLIC_APP_URL);
    }
    if (process.env.BETTER_AUTH_URL) {
      origins.push(process.env.BETTER_AUTH_URL);
    }
    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    if (request?.headers) {
      const origin = request.headers.get("origin");
      if (origin) {
        origins.push(origin);
      }
      const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const proto = request.headers.get("x-forwarded-proto") || "https";
      if (host) {
        origins.push(`${proto}://${host}`);
        origins.push(`https://${host}`);
        origins.push(`http://${host}`);
      }
    }

    return Array.from(new Set(origins.filter(Boolean) as string[]));
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Strict: No login allowed until email verification link is clicked
    autoSignIn: false, // Ensure fresh signups do not auto-login before clicking link
    resetPasswordTokenExpiresIn: 1800, // 30 minutes expiration
    sendResetPassword: async ({ user, url, token }) => {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
        token,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true, // Automatically dispatches verification link if an unverified user tries to sign in
    sendVerificationEmail: async ({ user, url, token }) => {
      let verificationUrl = url;
      try {
        const parsed = new URL(url);
        if (!parsed.searchParams.get("callbackURL")) {
          parsed.searchParams.set("callbackURL", "/verify-email?verified=true");
          verificationUrl = parsed.toString();
        }
      } catch {
        // Fallback to raw url if URL parse fails
      }

      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
        token,
      });
    },
    autoSignInAfterVerification: true,
    afterEmailVerification: async (user: any) => {
      try {
        if (!user?.id) return;

        // 1. Keep user verification status as PENDING awaiting administrator review
        await prisma.user.update({
          where: { id: user.id },
          data: { verificationStatus: "PENDING" },
        });

        // 2. Ensure a formal MembershipRequest is active in the Admin Approval queue
        const existingReq = await prisma.membershipRequest.findFirst({
          where: { userId: user.id },
        });

        if (!existingReq) {
          await prisma.membershipRequest.create({
            data: {
              userId: user.id,
              membershipType: user.membershipType || "STUDENT",
              status: "PENDING",
              connectionNote: "Account email verified. Submitted to Admin Approval Panel for institutional review.",
            },
          });
        } else if (existingReq.status !== "APPROVED") {
          await prisma.membershipRequest.update({
            where: { id: existingReq.id },
            data: { status: "PENDING" },
          });
        }

        console.log(`[Better Auth Hook] User ${user.email} email verified. Queued into Admin Approval Panel.`);
      } catch (hookErr: any) {
        console.error("[Better Auth Hook] Failed syncing user to admin queue:", hookErr?.message || hookErr);
      }
    },
  },
  user: {
    additionalFields: {
      membershipType: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: true,
      },
      systemRole: {
        type: "string",
        required: false,
        defaultValue: "MEMBER",
        input: false, // Prevents client-side privilege escalation to ADMIN
      },
      accountStatus: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        input: false,
      },
      verificationStatus: {
        type: "string",
        required: false,
        defaultValue: "PENDING",
        input: false,
      },
      canPostOpportunities: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      canReviewApplicants: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      verifiedAt: {
        type: "date",
        required: false,
        input: false,
      },
      verifiedBy: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days session lifetime
    updateAge: 60 * 60 * 24, // Refresh after 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cookie cache
    },
  },
  rateLimit: {
    enabled: false, // Prevents 429 lockouts during multi-account testing and rapid user switching
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "better-auth",
    trustedProxyHeaders: true,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
