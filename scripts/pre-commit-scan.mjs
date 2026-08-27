#!/usr/bin/env node
/**
 * Pre-commit guard. Scans only what is actually staged, so it stays fast and
 * never fails on pre-existing debt elsewhere in the tree.
 *
 * Two classes of problem block a commit:
 *  1. Secrets — a leaked key cannot be un-leaked once it is pushed.
 *  2. Unaudited raw HTML injection — every legitimate case is already funnelled
 *     through JsonLd.tsx or sanitizeRichText, so a new one is a regression.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync, statSync } from "node:fs";

const ALLOWED_DANGER = new Set([
  "src/components/seo/JsonLd.tsx",
  "src/app/[locale]/blog/[slug]/page.tsx",
  // This scanner names the pattern it looks for, so it matches itself.
  "scripts/pre-commit-scan.mjs",
]);

const SECRET_PATTERNS = [
  [/\bsk-[A-Za-z0-9]{20,}\b/, "OpenAI-style secret key"],
  [/\bsk_live_[A-Za-z0-9]{10,}\b/, "Stripe live secret key"],
  [/\bghp_[A-Za-z0-9]{30,}\b/, "GitHub personal access token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key id"],
  [/\beyJhbGciOi[A-Za-z0-9_-]{20,}/, "JWT (possible Supabase service key)"],
  [/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["'`][^"'`\s]{20,}/, "hardcoded Supabase service role key"],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key block"],
];

const staged = execSync("git diff --cached --name-only --diff-filter=ACM", {
  encoding: "utf8",
})
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean)
  .filter((f) => /\.(ts|tsx|js|jsx|mjs|cjs|json|css|env.*|ya?ml|sql)$/.test(f))
  .filter((f) => existsSync(f) && statSync(f).isFile());

const problems = [];

for (const file of staged) {
  const text = readFileSync(file, "utf8");

  for (const [pattern, label] of SECRET_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const line = text.slice(0, match.index).split("\n").length;
      problems.push(`${file}:${line}  possible ${label}`);
    }
  }

  if (text.includes("dangerouslySetInnerHTML") && !ALLOWED_DANGER.has(file)) {
    const line = text.slice(0, text.indexOf("dangerouslySetInnerHTML")).split("\n").length;
    problems.push(
      `${file}:${line}  dangerouslySetInnerHTML outside the audited files — ` +
        `render through <JsonLd> or sanitizeRichText() instead`,
    );
  }
}

if (problems.length) {
  console.error("\nCommit blocked:\n");
  for (const p of problems) console.error("  " + p);
  console.error("\nFix these, or re-run with --no-verify if it is a false positive.\n");
  process.exit(1);
}

console.log(`pre-commit scan clean (${staged.length} staged file(s))`);
