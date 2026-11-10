/**
 * Small in-memory fixed-window throttle shared by the public API routes.
 *
 * Limits:
 *   - `/api/leads`   : 5 submissions per IP per 10 minutes
 *   - `/api/track`   : 60 events per IP per minute
 *
 * IP keying: the FIRST `x-forwarded-for` entry is client-writable, so it must
 * not be trusted as the rate-limit key. We prefer `x-real-ip` (set by the
 * trusted edge proxy) and otherwise the LAST `x-forwarded-for` entry — the one
 * appended by the nearest proxy — which cannot be pre-positioned by the client
 * behind a single appending proxy.
 *
 * Stale keys are pruned (not wiped) once the map grows past `maxKeys`, so one
 * attacker cycling fake IPs cannot reset the counters of legitimate visitors.
 *
 * The map is per-process by design — on serverless, instance rotation dilutes
 * it. `sharedLimited()` below adds the authoritative cross-instance check
 * backed by a Supabase RPC (migration 0036), using the same trustworthy keying
 * and failing OPEN so a database hiccup can never block the form.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export function clientIpFromHeaders(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return "unknown";
}

export function createRateLimiter({
  windowMs,
  max,
  maxKeys = 5000,
}: {
  windowMs: number;
  max: number;
  maxKeys?: number;
}) {
  const hits = new Map<string, number[]>();

  return {
    /** Records a hit for `ip` and returns true when the limit is exceeded. */
    limited(ip: string): boolean {
      const now = Date.now();
      const recent = (hits.get(ip) ?? []).filter((time) => now - time < windowMs);
      recent.push(now);
      hits.set(ip, recent);

      if (hits.size > maxKeys) {
        for (const [key, times] of hits) {
          if (times.every((time) => now - time >= windowMs)) hits.delete(key);
        }
      }

      return recent.length > max;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Shared (cross-instance) limiter — Supabase-backed, free tier        */
/* ------------------------------------------------------------------ */

/**
 * Authoritative rate-limit check shared across serverless instances via a
 * `consume_rate_limit(p_bucket, p_limit, p_window_seconds)` RPC (migration
 * 0036: one atomic upsert per (bucket, window) + periodic pruning).
 *
 * Semantics:
 *   - Returns true when the caller is OVER the limit.
 *   - Fails OPEN (returns false) when the RPC is missing (migration not
 *     applied yet), slow, or erroring — the in-memory limiter still guards
 *     each instance, and availability of the form beats strictness.
 *   - Probes at most once per cold start when the function is missing.
 */

const SHARED_TIMEOUT_MS = 2_500;
let sharedRpcUnavailable = false;

function looksLikeMissingRpc(error: { message?: string; code?: string }): boolean {
  return (
    error.code === "PGRST202" ||
    Boolean(error.message?.includes("consume_rate_limit"))
  );
}

export async function sharedLimited(
  supabase: SupabaseClient,
  bucket: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  if (sharedRpcUnavailable) return false;

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    // Guarded so a late rejection can never surface as unhandled.
    // (PostgrestFilterBuilder is a thenable without .catch — Promise.resolve
    //  materializes it into a real promise first.)
    const rpc = Promise.resolve(
      supabase.rpc("consume_rate_limit", {
        p_bucket: bucket,
        p_limit: max,
        p_window_seconds: windowSeconds,
      }),
    ).catch(() => null);

    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), SHARED_TIMEOUT_MS);
    });

    const result = await Promise.race([rpc, timeout]);

    if (result === null) {
      return false; // timeout / transport failure — fail open
    }

    const { data, error } = result;
    if (error) {
      if (looksLikeMissingRpc(error)) {
        sharedRpcUnavailable = true; // migration 0036 not applied — stop probing
        return false;
      }
      console.warn(`[rate-limit] shared check failed: ${error.code ?? error.message}`);
      return false;
    }

    return data === true;
  } catch {
    return false; // fail open
  } finally {
    if (timer) clearTimeout(timer);
  }
}
