import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase/server";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { clientIpFromHeaders, createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EVENT_NAMES = new Set<string>(Object.values(ANALYTICS_EVENTS));
const LOCALES = new Set(["ar", "en", "ru"]);
const DEVICES = new Set(["mobile", "tablet", "desktop"]);
const REFERRERS = new Set(["direct", "organic", "social", "whatsapp", "other"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Analytics is not a form: much looser throttle than /api/leads. */
const limiter = createRateLimiter({ windowMs: 60 * 1000, max: 60 });

function text(value: unknown, max = 200): string | null {
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

  const ip = clientIpFromHeaders(request);

  if (limiter.limited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const eventName = text(payload.event_name, 40);
  const pagePath = text(payload.page_path, 200);
  if (!eventName || !EVENT_NAMES.has(eventName) || !pagePath) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const locale = text(payload.locale, 2);
  const deviceType = text(payload.device_type, 10);
  const referrerSource = text(payload.referrer_source, 10);
  const sessionId = text(payload.session_id, 36);

  const record = {
    event_name: eventName,
    page_path: pagePath,
    locale: locale && LOCALES.has(locale) ? locale : null,
    device_type: deviceType && DEVICES.has(deviceType) ? deviceType : null,
    referrer_source: referrerSource && REFERRERS.has(referrerSource) ? referrerSource : null,
    session_id: sessionId && UUID_RE.test(sessionId) ? sessionId : null,
  };

  const supabase = createPublicSupabase();
  const { error } = await supabase.from("analytics_events").insert(record);

  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
