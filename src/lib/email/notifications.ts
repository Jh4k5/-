/**
 * Lead-notification dispatcher (Phase 4 — Resend integration).
 *
 * Called by /api/leads AFTER a lead has been persisted. Contract:
 *
 *   • Never throws — an email failure must never lose a lead or turn a
 *     successful submission into an error response.
 *   • One notification per successful submission per recipient (Resend
 *     idempotency keys derived from the lead UUID make retries safe).
 *   • One retry on rate-limit / transient server / network errors.
 *   • Delivery status is recorded on the lead row via the
 *     `record_lead_notification` RPC when migration 0035 has been applied;
 *     until then (or if the call fails) it degrades to server logs only.
 *   • Logs carry the lead reference, status and an error class — never API
 *     keys and never more personal data than the reference itself.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { leadEmailConfig } from "./config";
import {
  applicantConfirmationEmail,
  ownerNotificationEmail,
  type NotifiableLead,
} from "./templates";
import { leadReference } from "@/lib/leads/reference";
import { getSiteUrl } from "@/lib/site-url";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 1_200;

export type LeadNotificationKind = "confirmation" | "owner_notice";
export type LeadNotificationStatus = "sent" | "failed" | "skipped";

type Outcome = { status: LeadNotificationStatus; error?: string };

/** Pragmatic shape check — the DB stores any string ≤160 chars. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Module-level probe result: stop calling the status RPC once we learn it
 *  is missing, so the cost is one failed probe per cold start, not per lead. */
let statusRpcUnavailable: boolean | null = null;

function isMissingFunctionError(error: { message?: string; code?: string }): boolean {
  return (
    error.code === "PGRST202" ||
    Boolean(error.message?.includes("record_lead_notification"))
  );
}

function classifyResendError(status: number): string {
  if (status === 401) return "auth_failed";
  if (status === 403) return "sending_not_allowed";
  if (status === 422) return "invalid_payload";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "resend_server_error";
  return `resend_error_${status}`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendViaResend(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  replyTo?: string;
}): Promise<Outcome> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": params.idempotencyKey,
        },
        body: JSON.stringify({
          from: params.from,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text,
          ...(params.replyTo ? { reply_to: params.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      });

      if (response.ok) return { status: "sent" };

      const errorClass = classifyResendError(response.status);
      // Retry only transient failures (provider rate limit / 5xx).
      if ((response.status === 429 || response.status >= 500) && attempt === 0) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return { status: "failed", error: errorClass };
    } catch {
      if (attempt === 0) {
        await sleep(RETRY_DELAY_MS);
        continue; // timeout / network hiccup — one retry
      }
      return { status: "failed", error: "network_error" };
    }
  }
  return { status: "failed", error: "unreachable" };
}

async function recordStatus(
  supabase: SupabaseClient,
  leadId: string,
  kind: LeadNotificationKind,
  outcome: Outcome,
): Promise<void> {
  if (statusRpcUnavailable) return;
  try {
    const { error } = await supabase.rpc("record_lead_notification", {
      p_lead_id: leadId,
      p_kind: kind,
      p_status: outcome.status,
      p_error: outcome.error ?? null,
    });
    if (error) {
      if (isMissingFunctionError(error)) {
        // Migration 0035 not applied yet — fall back to log-only mode.
        statusRpcUnavailable = true;
        return;
      }
      console.warn(`[lead-email] status rpc failed: ${error.code ?? error.message}`);
    }
  } catch {
    // Recording is best-effort; never let it surface to the request.
  }
}

/**
 * Sends the applicant confirmation (when a valid email was submitted) and
 * the owner notification for one freshly-saved lead. Best-effort by
 * design — always resolves.
 */
export async function dispatchLeadNotifications(
  supabase: SupabaseClient,
  lead: NotifiableLead,
): Promise<void> {
  const config = leadEmailConfig();
  const reference = leadReference(lead.id);

  if (!config.enabled || !config.apiKey) {
    // No API key yet (or recipient not configured): the lead stays saved,
    // both notifications are recorded as skipped. This is the expected
    // state until the owner activates Resend (see the readiness report).
    console.info(`[lead-email] ref=${reference} skipped — email not configured`);
    await Promise.allSettled([
      recordStatus(supabase, lead.id, "confirmation", {
        status: "skipped",
        error: config.apiKey ? "no_recipient_configured" : "no_api_key",
      }),
      recordStatus(supabase, lead.id, "owner_notice", {
        status: "skipped",
        error: config.apiKey ? "no_recipient_configured" : "no_api_key",
      }),
    ]);
    return;
  }

  const confirmationPromise =
    lead.email && EMAIL_RE.test(lead.email)
      ? sendViaResend({
          apiKey: config.apiKey,
          from: config.notificationFrom,
          to: lead.email.trim().toLowerCase(),
          idempotencyKey: `lead-${lead.id}-confirmation`,
          replyTo: config.notificationTo,
          ...applicantConfirmationEmail(lead, reference),
        })
      : Promise.resolve<Outcome>({
          status: "skipped",
          error: lead.email ? "invalid_applicant_email" : "no_applicant_email",
        });

  const ownerPromise = sendViaResend({
    apiKey: config.apiKey,
    from: config.notificationFrom,
    to: config.notificationTo,
    idempotencyKey: `lead-${lead.id}-owner-notice`,
    ...ownerNotificationEmail(lead, reference, `${getSiteUrl()}/admin/leads`),
  });

  const [confirmation, owner] = await Promise.all([confirmationPromise, ownerPromise]);

  for (const [kind, outcome] of [
    ["confirmation", confirmation],
    ["owner_notice", owner],
  ] as const) {
    if (outcome.status === "sent") {
      console.info(`[lead-email] ref=${reference} ${kind} sent`);
    } else if (outcome.status === "failed") {
      console.error(`[lead-email] ref=${reference} ${kind} failed (${outcome.error})`);
    } else {
      console.info(`[lead-email] ref=${reference} ${kind} skipped (${outcome.error})`);
    }
  }

  await Promise.allSettled([
    recordStatus(supabase, lead.id, "confirmation", confirmation),
    recordStatus(supabase, lead.id, "owner_notice", owner),
  ]);
}
