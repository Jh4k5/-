import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (let i = 1; i <= 4; i++) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4500/en", { waitUntil: "networkidle" });
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  const detail = violations.flatMap(v => v.nodes.map(n =>
    (n.failureSummary.match(/contrast of ([\d.]+).*?foreground color: (#\w+), background color: (#\w+)/s) || []).slice(1).join(" on ")
  ));
  console.log(`run ${i}: ${violations.length} type(s)  ${detail.join(" | ") || ""}`);
  await ctx.close();
}
await browser.close();
