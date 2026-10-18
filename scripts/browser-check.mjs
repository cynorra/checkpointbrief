// Smoke test against a running preview (npm run build && npm run preview):
// screenshots in both themes and two widths, overflow and console-error checks,
// and a few real interactions with the countdown and the release filter.
//   CHROME_PATH=/path/to/chrome OUT=/tmp/shots node scripts/browser-check.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const B = process.env.BASE ?? "http://localhost:4321";
const OUT = process.env.OUT ?? "./.shots";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const errors = [];

for (const [w, h, tag] of [[1280, 900, "desk"], [390, 844, "phone"]]) {
  for (const scheme of ["light", "dark"]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    p.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${tag}/${scheme}: ${m.text().slice(0, 200)}`));
    p.on("pageerror", (e) => errors.push(e.message));
    for (const path of ["/", "/gta-6/", "/gta-6/countdown/", "/release-dates/", "/free-games/", "/guides/", "/how-we-verify/", "/about/", ...(process.env.GUIDE ? [process.env.GUIDE] : [])]) {
      await p.goto(B + path, { waitUntil: "networkidle" });
      await p.waitForTimeout(400);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (overflow) errors.push(`overflow ${tag} ${scheme} ${path}`);
      const name = (path === "/" ? "home" : path.replace(/\//g, "_")) + `-${tag}-${scheme}.png`;
      await p.screenshot({ path: `${OUT}/${name}`, fullPage: tag === "desk" && (path === "/" || path === "/gta-6/") });
    }
    await p.close();
  }
}

const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("pageerror", (e) => errors.push(e.message));

// Countdown ticks on the client.
await p.goto(B + "/gta-6/countdown/", { waitUntil: "networkidle" });
const sec = async () => p.locator("[data-cell=seconds]").first().textContent();
const s1 = await sec();
await p.waitForTimeout(2200);
const s2 = await sec();
const ticks = s1 !== s2;

// Platform filter narrows the calendar.
await p.goto(B + "/release-dates/", { waitUntil: "networkidle" });
const rows = async () => p.locator("[data-release]").count();
const all = await rows();
await p.getByRole("radio", { name: "Switch 2" }).click();
const sw = await rows();

const home = await (await fetch(B + "/")).text();
const free = await (await fetch(B + "/free-games/")).text();
console.log({ ticks, s1, s2, all, switch2: sw, homeHasCountdown: home.includes("data-cell"), freeHasList: /Free now/.test(free) });
if (!ticks) errors.push("countdown does not tick");
if (!(sw > 0 && sw < all)) errors.push(`filter: all=${all} switch2=${sw}`);
console.log(errors.length ? errors : "no errors");
await b.close();
