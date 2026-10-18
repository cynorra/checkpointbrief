// Renders public/og.png (1200x630), public/logo-512.png and public/apple-touch-icon.png
// from HTML using the site's own fonts. Run after changing the brand name:
//   CHROME_PATH=/path/to/chrome node scripts/make-images.mjs
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { SITE } from "../src/site.config.js";

const font = (p) => `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${p}`, import.meta.url)).toString("base64")}`;
const archivo = font("@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2");
const geist = font("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2");
const mono = font("@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2");

const css = `
@font-face{font-family:A;src:url(${archivo})}@font-face{font-family:G;src:url(${geist})}@font-face{font-family:M;src:url(${mono})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#17121f;color:#f4f0f7;font-family:G;position:relative;overflow:hidden}
.glow{position:absolute;inset:0;background:radial-gradient(60% 80% at 85% 10%,#ff3d8b40,transparent 60%),repeating-linear-gradient(0deg,#ffffff08 0 1px,transparent 1px 4px)}
.wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font-family:A;font-weight:800;font-size:34px}
h1{font-family:A;font-weight:800;font-size:76px;line-height:1.02;letter-spacing:-.02em;margin-top:64px;max-width:960px}
.line{margin-top:auto;font-family:M;font-size:26px;color:#b9aec6}.line b{color:#ff3d8b;font-weight:600}
.bar{position:absolute;left:80px;right:80px;bottom:56px;height:10px;display:flex;gap:6px}.bar i{flex:1;background:#ff3d8b;border-radius:2px}.bar i.o{background:#ffffff1f}`;
const flag = (s, pole = "#f4f0f7") => `<svg width="${s}" height="${s}" viewBox="0 0 32 32"><rect x="7" y="3" width="2.5" height="27" rx="1" fill="${pole}"/><path d="M9.5 4h16l-4 5.5 4 5.5h-16z" fill="#ff3d8b"/><rect x="4" y="27.5" width="9" height="2.5" rx="1" fill="${pole}"/></svg>`;

const og = `<style>${css}</style><div class="glow"></div><div class="wrap"><div class="brand">${flag(48)}${SITE.name}</div>
<h1>What's confirmed, what's coming and what's free.</h1>
<p class="line">GTA 6 · release dates · free games — <b>every fact sourced and dated</b></p></div>
<div class="bar">${"<i></i>".repeat(14)}${'<i class="o"></i>'.repeat(4)}</div>`;
const icon = (size) => `<style>*{margin:0}body{width:${size}px;height:${size}px;background:#1c1626;display:grid;place-items:center}</style>${flag(size * 0.66)}`;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
async function shot(html, w, h, out) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(`../public/${out}`, import.meta.url).pathname });
  await page.close();
}
await shot(og, 1200, 630, "og.png");
await shot(icon(512), 512, 512, "logo-512.png");
await shot(icon(180), 180, 180, "apple-touch-icon.png");
await browser.close();
console.log("Wrote public/og.png, public/logo-512.png, public/apple-touch-icon.png");
