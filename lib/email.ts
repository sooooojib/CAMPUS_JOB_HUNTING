/**
 * UniCareer Community — Email Dispatcher & Dev Mailer
 * 
 * In development and testing, logs formatted email deliveries and records
 * tokens and notifications in an in-memory test registry so tests and developers
 * can inspect verification, reset tokens, and notifications without requiring
 * live third-party SMTP.
 * 
 * In production, connects to an external provider (e.g. Resend, Postmark, AWS SES).
 * Handles failed deliveries gracefully without exposing credentials.
 */

import { prisma } from "@/lib/prisma";

export interface DevEmailRecord {
  id: string;
  to: string;
  subject: string;
  type: "VERIFICATION" | "PASSWORD_RESET" | "NOTIFICATION";
  token?: string;
  url?: string;
  content?: string;
  sentAt: Date;
}

// In-memory test registry for local development and automated testing
class DevEmailStore {
  private emails: DevEmailRecord[] = [];

  record(email: DevEmailRecord) {
    this.emails.unshift(email);
    // Keep max 50 records in memory
    if (this.emails.length > 50) {
      this.emails.pop();
    }
  }

  getLatestFor(to: string): DevEmailRecord | undefined {
    return this.emails.find((e) => e.to.toLowerCase() === to.toLowerCase());
  }

  getLatestToken(to: string, type: "VERIFICATION" | "PASSWORD_RESET"): string | undefined {
    return this.emails.find(
      (e) => e.to.toLowerCase() === to.toLowerCase() && e.type === type
    )?.token;
  }

  getAll(): DevEmailRecord[] {
    return [...this.emails];
  }

  clear() {
    this.emails = [];
  }
}

export const devEmailStore = new DevEmailStore();

export interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
  token: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
  token,
}: SendVerificationEmailParams): Promise<{ success: boolean; devUrl?: string; error?: string }> {
  const isDev = process.env.NODE_ENV !== "production";

  // Persist verification link in database for direct retrieval and instant activation
  try {
    await prisma.verification.upsert({
      where: { id: `verify_${to.toLowerCase()}` },
      update: {
        value: verificationUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      create: {
        id: `verify_${to.toLowerCase()}`,
        identifier: to.toLowerCase(),
        value: verificationUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  } catch (err: any) {
    console.warn("[Email Store] Could not record verification record in DB:", err.message);
  }

  if (isDev) {
    devEmailStore.record({
      id: `verify_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to,
      subject: "Verify your UniCareer Community account",
      type: "VERIFICATION",
      token,
      url: verificationUrl,
      sentAt: new Date(),
    });

    console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│ 📧 [DEV EMAIL DISPATCH] UniCareer Account Email Verification           │
├────────────────────────────────────────────────────────────────────────┤
│ To:      ${to.padEnd(61)} │
│ Name:    ${name.padEnd(61)} │
│ Token:   ${token.substring(0, 32)}...                                │
│ Action:  Click link below to verify your university email:             │
│ Link:    ${verificationUrl.padEnd(61)} │
└────────────────────────────────────────────────────────────────────────┘
    `);

    return { success: true, devUrl: verificationUrl };
  }

  // Production provider integration (e.g. Resend, Postmark, AWS SES)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "UniCareer <noreply@unicareer.edu>",
          to,
          subject: "Verify your UniCareer Community account",
          html: `<p>Hello ${name},</p><p>Please verify your university email by clicking <a href="${verificationUrl}">here</a>.</p>`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("[Email Error] Failed to send verification email via provider:", errData);
        return { success: false, error: "EMAIL_DELIVERY_FAILED" };
      }

      return { success: true };
    } catch (err: any) {
      console.error("[Email Error] Network failure delivering verification email:", err.message);
      return { success: false, error: "EMAIL_PROVIDER_UNREACHABLE" };
    }
  }

  console.log(`[Production Email Info] External SMTP not configured. Stored direct verification link for ${to}: ${verificationUrl}`);
  return { success: true, devUrl: verificationUrl };
}

export interface SendPasswordResetEmailParams {
  to: string;
  name?: string;
  resetUrl: string;
  token: string;
}

export async function sendPasswordResetEmail({
  to,
  name = "Member",
  resetUrl,
  token,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; devUrl?: string; error?: string }> {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    devEmailStore.record({
      id: `reset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to,
      subject: "Reset your UniCareer Community password",
      type: "PASSWORD_RESET",
      token,
      url: resetUrl,
      sentAt: new Date(),
    });

    console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│ 🔐 [DEV EMAIL DISPATCH] UniCareer Password Reset Request               │
├────────────────────────────────────────────────────────────────────────┤
│ To:      ${to.padEnd(61)} │
│ Name:    ${name.padEnd(61)} │
│ Token:   ${token.padEnd(61)} │
│ Expires: 30 minutes from issuance                                     │
│ Link:    ${resetUrl.padEnd(61)} │
└────────────────────────────────────────────────────────────────────────┘
    `);

    return { success: true, devUrl: resetUrl };
  }

  // Production provider
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "UniCareer <noreply@unicareer.edu>",
          to,
          subject: "Reset your UniCareer Community password",
          html: `<p>Hello ${name},</p><p>Reset your password by clicking <a href="${resetUrl}">here</a>.</p>`,
        }),
      });

      if (!res.ok) {
        return { success: false, error: "EMAIL_DELIVERY_FAILED" };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "EMAIL_PROVIDER_UNREACHABLE" };
    }
  }

  return { success: true };
}

export interface SendNotificationEmailParams {
  to: string;
  name?: string;
  recipientName?: string;
  subject?: string;
  title: string;
  message: string;
  category?: "OPPORTUNITY" | "APPLICATION" | "COMMUNITY" | "MEMBERSHIP" | "REMINDER";
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Dispatches a formatted notification email based on university templates.
 * Enforces strict error handling and credential protection.
 */
export async function sendNotificationEmail({
  to,
  name,
  recipientName,
  subject,
  title,
  message,
  category = "REMINDER",
  actionUrl,
  actionLabel,
}: SendNotificationEmailParams): Promise<{ success: boolean; error?: string; devRecorded?: boolean }> {
  const isDev = process.env.NODE_ENV !== "production";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const fullActionUrl = actionUrl ? (actionUrl.startsWith("http") ? actionUrl : `${baseUrl}${actionUrl}`) : undefined;
  const finalName = recipientName || name || "Member";
  const finalSubject = subject || (title ? `[UniCareer ${category || "Update"}] ${title}` : "UniCareer Notification");

  if (isDev) {
    devEmailStore.record({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to,
      subject: finalSubject,
      type: "NOTIFICATION",
      content: message,
      url: fullActionUrl,
      sentAt: new Date(),
    });

    const displayCategory = category || "NOTIFICATION";
    const displayTitle = (title || subject || "Notification").substring(0, 60);
    const displayMessage = (message || "").substring(0, 60);
    const displayTo = (to || "").substring(0, 60);

    console.log(`
┌────────────────────────────────────────────────────────────────────────┐
│ 🔔 [DEV EMAIL NOTIFICATION] UniCareer ${displayCategory.padEnd(26)} │
├────────────────────────────────────────────────────────────────────────┤
│ To:      ${displayTo.padEnd(61)} │
│ Subject: ${displayTitle.padEnd(61)} │
│ Message: ${displayMessage.padEnd(61)} │
│ Link:    ${(fullActionUrl || "N/A").substring(0, 60).padEnd(61)} │
└────────────────────────────────────────────────────────────────────────┘
    `);

    return { success: true, devRecorded: true };
  }

  // Production email provider dispatch
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "UniCareer Community <notifications@unicareer.edu>",
          to,
          subject: subject || `[UniCareer] ${title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
              <h2 style="color: #1e3a8a; margin-top: 0;">${title}</h2>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello ${name},</p>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">${message}</p>
              ${
                fullActionUrl
                  ? `<div style="margin: 25px 0;">
                      <a href="${fullActionUrl}" style="background-color: #1d4ed8; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        View on UniCareer
                      </a>
                    </div>`
                  : ""
              }
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #64748b; font-size: 12px;">You received this email according to your UniCareer Community notification preferences. You can update your preferences anytime in your account settings.</p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("[Email Error] Failed delivering notification email:", errData);
        return { success: false, error: "EMAIL_DELIVERY_FAILED" };
      }

      return { success: true };
    } catch (err: any) {
      console.error("[Email Error] Provider unreachable:", err.message);
      return { success: false, error: "EMAIL_PROVIDER_UNREACHABLE" };
    }
  }

  // If in production without configured provider, return failure
  return { success: false, error: "EMAIL_PROVIDER_NOT_CONFIGURED" };
}
