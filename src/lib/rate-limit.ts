/**
 * Small in-memory fixed-window throttle shared by the public API routes.
 *
 * Limits (per process):
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
 * Multi-instance deployments should back this with a shared store (the map is
 * per-process by design here).
 */

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
