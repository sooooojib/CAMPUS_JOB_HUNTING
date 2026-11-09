/**
 * UniCareer Community — Email Dispatcher & Dev Mailer
 * 
 * Dispatches transactional emails (verification, password reset, notifications)
 * using Gmail SMTP (via Nodemailer) as the primary provider, with Resend API fallback,
 * and an in-memory dev store for inspection and automated unit testing.
 */

import nodemailer from "nodemailer";
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

/**
 * Returns a configured Nodemailer transporter if SMTP credentials are present in env.
 */
function getSmtpTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

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
  const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);

  // Persist verification link in database for direct retrieval and status tracking
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

  // Record in dev store for inspection
  devEmailStore.record({
    id: `verify_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to,
    subject: "Verify your UniCareer Community account",
    type: "VERIFICATION",
    token,
    url: verificationUrl,
    sentAt: new Date(),
  });

  if (isTest) {
    return { success: true, devUrl: verificationUrl };
  }

  // 1. Primary: SMTP Transporter (e.g. Gmail SMTP)
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const from = process.env.EMAIL_FROM || `"UniCareer Community" <${process.env.SMTP_USER}>`;
      const info = await transporter.sendMail({
        from,
        to,
        subject: "Verify your UniCareer Community account",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 18px; background-color: #ffffff; color: #0f172a;">
            <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
              <h1 style="color: #1e3a8a; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">UniCareer<span style="color: #2563eb;">.</span></h1>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0; font-weight: 500;">Campus Career Community &amp; Opportunity Network</p>
            </div>
            <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 12px;">Confirm your university email address</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
              Hello <strong>${name}</strong>,<br/>
              Welcome to UniCareer Community. Please click the button below to verify your email address and activate your account.
            </p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${verificationUrl}" style="background-color: #2563eb; color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                Verify Email Address
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 24px 0 0;">
              If the button above does not work, copy and paste this verification URL directly into your browser:<br/>
              <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0 16px;" />
            <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
              If you did not register for an account on UniCareer Community, you can safely disregard this email.
            </p>
          </div>
        `,
      });
      console.log(`[SMTP Dispatch] Verification email successfully delivered to ${to} (Message ID: ${info.messageId})`);
      return { success: true, devUrl: verificationUrl };
    } catch (smtpErr: any) {
      console.error("[SMTP Error] Failed delivering verification email via SMTP:", smtpErr.message);
    }
  }

  // 2. Secondary: Resend API if configured
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "UniCareer <onboarding@resend.dev>",
          to,
          subject: "Verify your UniCareer Community account",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <div style="margin-bottom: 20px;">
                <h1 style="color: #1e3a8a; font-size: 22px; font-weight: 800; margin: 0;">UniCareer<span style="color: #2563eb;">.</span></h1>
                <p style="color: #64748b; font-size: 12px; margin: 4px 0 0;">Campus Career Community & Opportunity Network</p>
              </div>
              <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 12px;">Confirm your university email address</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                Hello <strong>${name}</strong>,<br/>
                Please click the button below to verify your email address and activate your campus career community account.
              </p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="${verificationUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 24px 0 0;">
                If the button above does not work, copy and paste this URL into your browser:<br/>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        console.log(`[Email Dispatch] Verification email dispatched to ${to} via Resend.`);
        return { success: true, devUrl: verificationUrl };
      }
      const errData = await res.json().catch(() => ({}));
      console.error("[Resend Error] Failed delivering verification email via Resend:", errData);
    } catch (err: any) {
      console.error("[Email Error] Network failure delivering verification email:", err.message);
    }
  }

  console.log(`[Email Notice] Verification link for ${to}: ${verificationUrl}`);
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
  const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);

  devEmailStore.record({
    id: `reset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to,
    subject: "Reset your UniCareer Community password",
    type: "PASSWORD_RESET",
    token,
    url: resetUrl,
    sentAt: new Date(),
  });

  if (isTest) {
    return { success: true, devUrl: resetUrl };
  }

  // 1. Primary: SMTP Transporter (e.g. Gmail SMTP)
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const from = process.env.EMAIL_FROM || `"UniCareer Community" <${process.env.SMTP_USER}>`;
      const info = await transporter.sendMail({
        from,
        to,
        subject: "Reset your UniCareer Community password",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 18px; background-color: #ffffff; color: #0f172a;">
            <div style="margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
              <h1 style="color: #1e3a8a; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">UniCareer<span style="color: #2563eb;">.</span></h1>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0; font-weight: 500;">Campus Career Community &amp; Opportunity Network</p>
            </div>
            <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 12px;">Reset Your Password</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
              Hello <strong>${name}</strong>,<br/>
              We received a request to reset your password. Click the button below to choose a new password. This link is valid for 30 minutes.
            </p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 24px 0 0;">
              If the button above does not work, copy and paste this reset URL into your browser:<br/>
              <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0 16px;" />
            <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        `,
      });
      console.log(`[SMTP Dispatch] Password reset email delivered to ${to} (Message ID: ${info.messageId})`);
      return { success: true, devUrl: resetUrl };
    } catch (err: any) {
      console.error("[SMTP Error] Failed to send password reset via SMTP:", err.message);
    }
  }

  // 2. Secondary: Resend API if configured
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
  const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const fullActionUrl = actionUrl ? (actionUrl.startsWith("http") ? actionUrl : `${baseUrl}${actionUrl}`) : undefined;
  const finalName = recipientName || name || "Member";
  const finalSubject = subject || (title ? `[UniCareer ${category || "Update"}] ${title}` : "UniCareer Notification");

  devEmailStore.record({
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to,
    subject: finalSubject,
    type: "NOTIFICATION",
    content: message,
    url: fullActionUrl,
    sentAt: new Date(),
  });

  if (isTest) {
    return { success: true, devRecorded: true };
  }

  // 1. Primary: SMTP Transporter (e.g. Gmail SMTP)
  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const from = process.env.EMAIL_FROM || `"UniCareer Community" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from,
        to,
        subject: finalSubject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #1e3a8a; margin-top: 0;">${title}</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello ${finalName},</p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">${message}</p>
            ${
              fullActionUrl
                ? `<div style="margin: 25px 0;">
                    <a href="${fullActionUrl}" style="background-color: #1d4ed8; color: #ffffff; padding: 10px 22px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                      ${actionLabel || "View on UniCareer"}
                    </a>
                  </div>`
                : ""
            }
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #64748b; font-size: 12px;">You received this email according to your UniCareer Community notification preferences.</p>
          </div>
        `,
      });
      return { success: true };
    } catch (smtpErr: any) {
      console.error("[SMTP Error] Failed delivering notification email via SMTP:", smtpErr.message);
    }
  }

  // 2. Secondary: Resend API if configured
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
          subject: finalSubject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #1e3a8a; margin-top: 0;">${title}</h2>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello ${finalName},</p>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">${message}</p>
              ${
                fullActionUrl
                  ? `<div style="margin: 25px 0;">
                      <a href="${fullActionUrl}" style="background-color: #1d4ed8; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        ${actionLabel || "View on UniCareer"}
                      </a>
                    </div>`
                  : ""
              }
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #64748b; font-size: 12px;">You received this email according to your UniCareer Community notification preferences.</p>
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

  return { success: false, error: "EMAIL_PROVIDER_NOT_CONFIGURED" };
}
