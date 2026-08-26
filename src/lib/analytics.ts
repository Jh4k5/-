import type { AnalyticsEventName } from "./analytics-events";

type DeviceType = "mobile" | "tablet" | "desktop";
type ReferrerSource = "direct" | "organic" | "social" | "whatsapp" | "other";

function deviceType(): DeviceType {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function referrerSource(): ReferrerSource {
  const ref = document.referrer;
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return "direct";
    if (/(^|\.)(google|bing|yandex|duckduckgo|baidu)\./.test(host)) return "organic";
    if (/(^|\.)(facebook|instagram|tiktok|twitter|x\.com|youtube|linkedin|t\.co)\./.test(host)) {
      return "social";
    }
    if (/(^|\.)(wa\.me|whatsapp)\./.test(host)) return "whatsapp";
    return "other";
  } catch {
    return "other";
  }
}

function sessionId(): string {
  const key = "jtc_session_id";
  try {
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Fire-and-forget event tracking. Never throws, never blocks UI interaction. */
export function track(eventName: AnalyticsEventName, locale?: string) {
  if (typeof window === "undefined") return;

  try {
    const payload = JSON.stringify({
      event_name: eventName,
      page_path: window.location.pathname,
      locale: locale ?? null,
      device_type: deviceType(),
      referrer_source: referrerSource(),
      session_id: sessionId(),
    });

    const sent =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));

    if (!sent) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // analytics must never break the page
  }
}
