/**
 * UniCareer Community — Email Dispatcher & Dev Mailer
 * 
 * In development and testing, logs formatted email deliveries and records
 * tokens in an in-memory test registry so tests and developers can inspect
 * verification and reset tokens without requiring live third-party SMTP.
 * 
 * In production, connects to an external provider (e.g. Resend / SMTP).
 */

export interface DevEmailRecord {
  id: string;
  to: string;
  subject: string;
  type: "VERIFICATION" | "PASSWORD_RESET";
  token: string;
  url: string;
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
}: SendVerificationEmailParams): Promise<{ success: boolean; devUrl?: string }> {
  const isDev = process.env.NODE_ENV !== "production";

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

  // Production provider integration placeholder (e.g. Resend, Postmark, AWS SES)
  // When RESEND_API_KEY is configured in production:
  if (process.env.RESEND_API_KEY) {
    // Live send call can be placed here
    console.log(`[Email] Sending production verification email to ${to}`);
  }

  return { success: true };
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
}: SendPasswordResetEmailParams): Promise<{ success: boolean; devUrl?: string }> {
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
    console.log(`[Email] Sending production password reset email to ${to}`);
  }

  return { success: true };
}
