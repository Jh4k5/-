import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await (await browser.newContext({ viewport:{width:1440,height:900} })).newPage();
await page.goto("http://localhost:4500/en", { waitUntil: "networkidle" });
const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
for (const v of violations) for (const n of v.nodes) {
  console.log("---");
  console.log(n.target.join(" ").slice(0,110));
  console.log(n.failureSummary.replace(/\n/g, " | "));
}
await browser.close();
