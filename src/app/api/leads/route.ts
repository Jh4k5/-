import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const QUALIFICATIONS = new Set(["high_school", "bachelor", "master"]);
const LEVELS = new Set(["none", "beginner", "hsk1_2", "hsk3_4", "hsk5_6"]);
const CONTACTS = new Set(["whatsapp", "email", "phone"]);
const LANGUAGES = new Set(["ar", "en", "ru"]);

/** Very small in-memory throttle: 5 submissions per IP per 10 minutes. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

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

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
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

  const record = {
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
  };

  const supabase = createPublicSupabase();
  const { error } = await supabase.from("leads").insert(record);

  if (error) {
    console.error("lead insert failed", error.message);
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
