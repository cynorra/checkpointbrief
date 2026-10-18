import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/site.config.js";
import { lastModified } from "./src/page-dates.js";
import { guideLastmods } from "./src/lib/articles-source.js";
import { CHECKED as RELEASES_CHECKED } from "./src/lib/data/releases.js";
import { UPDATED as GTA_UPDATED } from "./src/lib/data/gta6.js";

// Real content dates for <lastmod>, from Supabase or the local Markdown guides.
// Bing and Google both use lastmod to decide what to recrawl, so it must change
// only when a page's content changes.
const GUIDE_DATES = Object.fromEntries(
  Object.entries(await guideLastmods()).map(([slug, d]) => [`/guides/${slug}/`, d]),
);
const toIso = (d) => (d ? `${d}T00:00:00+00:00` : undefined);
const later = (a, b) => (a > b ? a : b);
// Data pages: the free games list changes on every build; the calendar and the
// GTA 6 hub change when their data was last checked.
const BUILD_DAY = new Date().toISOString().slice(0, 10);
const DATA_DATES = {
  "/free-games/": BUILD_DAY,
  "/release-dates/": later(lastModified("/release-dates/"), RELEASES_CHECKED),
  "/gta-6/": later(lastModified("/gta-6/"), GTA_UPDATED),
};

export default defineConfig({
  site: SITE.url,
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "auto" },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !/\/(404|thanks)\/?$/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const date = GUIDE_DATES[path] ?? DATA_DATES[path] ?? lastModified(path);
        if (!date) throw new Error(`Missing lastmod for ${path}: add it to src/page-dates.js`);
        // changefreq and priority are ignored by Google and Bing, so they are left out.
        return { url: item.url, lastmod: toIso(date) };
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
