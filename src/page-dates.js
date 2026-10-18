// The real content dates of every non-guide page. Pages show these dates and
// the sitemap's <lastmod> uses them. Change a date ONLY when the page's
// content changes. Data pages (/gta-6/, /release-dates/) also show the date
// their data was last checked. /free-games/ changes with each rebuild.

export const PAGE_DATES = {
  "/": { published: "2026-10-18" },
  "/gta-6/": { published: "2026-10-18" },
  "/gta-6/countdown/": { published: "2026-10-18" },
  "/release-dates/": { published: "2026-10-18" },
  "/free-games/": { published: "2026-10-18" },
  "/guides/": { published: "2026-10-18" },
  "/about/": { published: "2026-10-18" },
  "/author/eren-simsir/": { published: "2026-10-18" },
  "/contact/": { published: "2026-10-18" },
  "/how-we-verify/": { published: "2026-10-18" },
  "/editorial-policy/": { published: "2026-10-18" },
  "/privacy/": { published: "2026-10-18" },
  "/terms/": { published: "2026-10-18" },
  "/disclaimer/": { published: "2026-10-18" },
};

export function pageDates(path) {
  const d = PAGE_DATES[path];
  if (!d) throw new Error(`No date for ${path} in src/page-dates.js`);
  return { published: new Date(d.published), updated: d.updated ? new Date(d.updated) : undefined };
}

export function lastModified(path) {
  const d = PAGE_DATES[path];
  return d ? d.updated ?? d.published : undefined;
}
