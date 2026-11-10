/**
 * Human-friendly lead references (Phase 4 — email notifications).
 *
 * A lead's reference is derived deterministically from its UUID — the first
 * eight hex characters, uppercased, prefixed with `BTC-`:
 *
 *   0a3f17c2-5b6e-…  →  BTC-0A3F17C2
 *
 * This needs no extra database column, is stable for the lifetime of the
 * lead, and can be recomputed anywhere (API response, applicant email,
 * owner email, admin table) from this single source of truth.
 *
 * Collision space: 16^8 ≈ 4.3 billion references — at the scale of a
 * consultancy inbox a collision is practically impossible, and the full
 * UUID remains the real primary key.
 */
export const LEAD_REFERENCE_PATTERN = /^BTC-[0-9A-F]{8}$/;

export function leadReference(leadId: string): string {
  return `BTC-${leadId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** True when `value` looks like a lead reference (used by the admin UI). */
export function isLeadReference(value: string): boolean {
  return LEAD_REFERENCE_PATTERN.test(value);
}
