/**
 * Lead-email configuration (Phase 4 — Resend integration).
 *
 * All values arrive via environment variables so secrets and the owner's
 * personal address never live in the repository (it is public) or in the
 * client bundle:
 *
 *   RESEND_API_KEY          — restricted, sending-only Resend key
 *   LEAD_NOTIFICATION_TO    — owner address that receives new-lead alerts
 *   LEAD_NOTIFICATION_FROM  — verified sender, e.g. notify@your-domain.com
 *
 * Until RESEND_API_KEY is configured the dispatcher skips sending entirely
 * (leads are still saved — email must never be allowed to lose a lead) and
 * every attempt is recorded as "skipped".
 *
 * Configure in `.env.local` for development and in Vercel → Project →
 * Settings → Environment Variables for production.
 */

/**
 * Resend's shared test sender. It can only deliver to the Resend account
 * owner's own address, which makes it safe as a default: owner
 * notifications to the owner's inbox work during activation testing, while
 * applicant confirmations to arbitrary addresses require a verified
 * sending domain (see docs/COMMERCIAL-READINESS-REPORT.md).
 */
const DEFAULT_NOTIFICATION_FROM = "onboarding@resend.dev";

export type LeadEmailConfig = {
  apiKey: string | null;
  notificationTo: string;
  notificationFrom: string;
  /** False when no API key is configured — dispatch becomes a safe no-op. */
  enabled: boolean;
};

export function leadEmailConfig(): LeadEmailConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null;
  const notificationTo = process.env.LEAD_NOTIFICATION_TO?.trim() || "";
  const notificationFrom =
    process.env.LEAD_NOTIFICATION_FROM?.trim() || DEFAULT_NOTIFICATION_FROM;

  return {
    apiKey,
    notificationTo,
    notificationFrom,
    enabled: Boolean(apiKey && notificationTo && notificationFrom),
  };
}
