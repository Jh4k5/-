import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase/server";
import { clientIpFromHeaders, createRateLimiter, sharedLimited } from "@/lib/rate-limit";
import { dispatchLeadNotifications } from "@/lib/email/notifications";
import type { NotifiableLead } from "@/lib/email/templates";
import { leadReference } from "@/lib/leads/reference";
import type { LeadSource } from "@/lib/types";

export const runtime = "nodejs";

const QUALIFICATIONS = new Set(["high_school", "bachelor", "master", "phd"]);
const LEVELS = new Set(["none", "beginner", "hsk1_2", "hsk3_4", "hsk5_6"]);
const CONTACTS = new Set(["whatsapp", "email", "phone"]);
const LANGUAGES = new Set(["ar", "en", "ru"]);
const SOURCES = new Set(["contact_form", "eligibility_check"]);

/** Per-IP submission throttle: 5 per 10 minutes.
 *  First line of defence is in-process (fast); the authoritative check is
 *  the shared Supabase-backed limiter, which also holds across serverless
 *  instances once migration 0036 is applied. */
const WINDOW_SECONDS = 10 * 60;
const MAX_PER_WINDOW = 5;
const limiter = createRateLimiter({ windowMs: WINDOW_SECONDS * 1000, max: MAX_PER_WINDOW });

function text(value: unknown, max = 400): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // honeypot field — real visitors never fill this in
  if (text(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIpFromHeaders(request);
  const supabase = createPublicSupabase();

  if (limiter.limited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  if (await sharedLimited(supabase, `leads:${ip}`, MAX_PER_WINDOW, WINDOW_SECONDS)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const full_name = text(payload.full_name, 120);
  const country = text(payload.country, 80);
  const phone = text(payload.phone, 40);
  const qualification = text(payload.current_qualification, 20);

  if (!full_name || !country || !phone || !qualification || !QUALIFICATIONS.has(qualification)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const level = text(payload.chinese_level, 20);
  const contact = text(payload.preferred_contact, 20);
  const language = text(payload.language, 2);
  const source = text(payload.source, 20);

  const startYearRaw = Number.parseInt(String(payload.desired_start_year ?? ""), 10);
  const startYear =
    Number.isFinite(startYearRaw) && startYearRaw >= 2024 && startYearRaw <= 2035
      ? startYearRaw
      : null;

  // The id is generated here (not by the database) because RLS grants the
  // anon role no SELECT on `leads` — an insert+returning would come back
  // empty. Knowing the id lets us derive the applicant-facing reference
  // and dispatch notifications without reading the row back.
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record = {
    id,
    full_name,
    country,
    current_qualification: qualification,
    desired_major: text(payload.desired_major, 120),
    chinese_level: level && LEVELS.has(level) ? level : null,
    preferred_contact: contact && CONTACTS.has(contact) ? contact : "whatsapp",
    phone,
    email: text(payload.email, 160),
    message: text(payload.message, 2000),
    language: language && LANGUAGES.has(language) ? language : "ar",
    status: "new",
    source: source && SOURCES.has(source) ? source : "contact_form",
    wants_scholarship: typeof payload.wants_scholarship === "boolean" ? payload.wants_scholarship : null,
    desired_start_year: startYear,
  };

  const { error } = await supabase.from("leads").insert(record);

  if (error) {
    console.error("lead insert failed", error.message);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  // Phase 4: lead persisted → dispatch both transactional emails
  // (applicant confirmation + owner notification). Strictly best-effort:
  // an email failure must never lose an otherwise successful lead.
  const notifiable: NotifiableLead = {
    ...record,
    source: record.source as LeadSource,
    created_at: now,
  };

  try {
    await dispatchLeadNotifications(supabase, notifiable);
  } catch (dispatchError) {
    console.error(
      "[lead-email] dispatcher crashed (lead is saved)",
      dispatchError instanceof Error ? dispatchError.message : dispatchError,
    );
  }

  return NextResponse.json({ ok: true, reference: leadReference(id) }, { status: 201 });
}
