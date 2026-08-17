import { createHmac } from "node:crypto";
import nodemailer from "nodemailer";

export type BookingEmailKind = "quote-issued";
export type BookingEmail = { kind: BookingEmailKind; customerId: string; customerEmail: string; customerName: string; reason?: string; quoteId?: string };
export type DeliveryResult = { mode: "simulation" | "gmail"; delivered: boolean; detail: string; secureLink: string };

type EmailConfig = { user?: string; appPassword?: string; testRecipient?: string; baseUrl: string; linkSecret?: string };

function configuration(): EmailConfig {
  return {
    user: process.env.GMAIL_USER,
    appPassword: process.env.GMAIL_APP_PASSWORD,
    testRecipient: process.env.GMAIL_TEST_RECIPIENT,
    baseUrl: process.env.BOOKING_BASE_URL || "http://localhost:3000",
    linkSecret: process.env.BOOKING_LINK_SECRET,
  };
}

function secureCustomerLink(config: EmailConfig, email: BookingEmail) {
  const path = "quote";
  if (!config.linkSecret) return `${config.baseUrl}/tattoo/booking-demo?view=${path}&demo=1`;
  const expires = Math.floor(Date.now() / 1000) + 30 * 86400;
  const payload = `${email.customerId}.${email.quoteId ?? "decision"}.${expires}`;
  const token = createHmac("sha256", config.linkSecret).update(payload).digest("base64url");
  return `${config.baseUrl}/tattoo/booking/${path}?customer=${encodeURIComponent(email.customerId)}&quote=${encodeURIComponent(email.quoteId ?? "")}&expires=${expires}&token=${token}`;
}

function message(email: BookingEmail, link: string) {
  return { subject: "Your Fletcher Tattoos quote is ready", text: `Hi ${email.customerName},\n\nYour quote is ready to review. Use this customer-specific secure link: ${link}` };
}

export function gmailEmailConfigured() {
  const config = configuration();
  return Boolean(config.user && config.appPassword && config.linkSecret && config.baseUrl);
}

export async function deliverBookingEmail(email: BookingEmail): Promise<DeliveryResult> {
  if (typeof window !== "undefined") throw new Error("Booking email delivery is server-only.");
  const config = configuration();
  const secureLink = secureCustomerLink(config, email);
  if (!config.user || !config.appPassword || !config.linkSecret) return { mode: "simulation", delivered: false, detail: "Gmail SMTP is not configured; retained in the local simulated outbox.", secureLink };
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user: config.user, pass: config.appPassword } });
  const content = message(email, secureLink);
  const result = await transport.sendMail({ from: `Fletcher Tattoos <${config.user}>`, to: config.testRecipient || email.customerEmail, subject: content.subject, text: content.text });
  return { mode: "gmail", delivered: true, detail: result.messageId, secureLink };
}
