import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const PATHS = ["/ar","/en","/ru","/ar/universities","/ar/language-platform","/ar/faq","/ar/about","/ar/contact"];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const totals = new Map();
for (const p of PATHS) {
  await page.goto("http://localhost:4500" + p, { waitUntil: "networkidle" });
  // Entrance animations run up to ~1.5s after load. Auditing mid-fade grades
  // text at a partial opacity it never actually rests at, so wait for the
  // page to settle before measuring.
  await page.waitForTimeout(2500);
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  for (const v of violations) {
    const key = `${v.id} [${v.impact}]`;
    if (!totals.has(key)) totals.set(key, { help: v.help, nodes: [], pages: new Set() });
    const t = totals.get(key);
    t.pages.add(p);
    for (const n of v.nodes.slice(0, 3)) t.nodes.push(`${p}  ${n.target.join(" ")}`);
  }
  console.log(`${p.padEnd(26)} ${violations.length} violation type(s)`);
}
await browser.close();

console.log("\n=== AGGREGATE ===");
if (!totals.size) { console.log("No WCAG A/AA violations found."); process.exit(0); }
for (const [k, v] of [...totals].sort()) {
  console.log(`\n${k}  (${v.pages.size} pages)\n  ${v.help}`);
  for (const n of v.nodes.slice(0, 4)) console.log("    " + n);
}
process.exit(1);
