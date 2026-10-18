import { test } from "node:test";
import assert from "node:assert/strict";
import { daysUntil, countdownParts, FACTS, TIMELINE, RUMORS, EDITIONS, LOCATIONS } from "../src/lib/data/gta6.js";
import { RELEASES, upcomingByMonth, inMonth } from "../src/lib/data/releases.js";
import { parseFreeGames } from "../src/lib/data/epic.js";
import { SOURCES } from "../src/lib/data/sources.js";

test("every GTA 6 fact, edition, place, event and rumor cites a known source", () => {
  for (const x of [...FACTS, ...EDITIONS, ...LOCATIONS, ...TIMELINE, ...RUMORS]) {
    assert.ok(SOURCES[x.source], `missing source ${x.source}`);
  }
});

test("countdown math", () => {
  const now = new Date(2026, 10, 18, 12, 0, 0); // Nov 18, noon local
  assert.equal(daysUntil("2026-11-19", now), 1);
  const p = countdownParts("2026-11-19", now);
  assert.deepEqual([p.days, p.hours, p.minutes, p.seconds, p.done], [0, 12, 0, 0, false]);
  assert.equal(countdownParts("2026-11-19", new Date(2026, 10, 19, 0, 0, 1)).done, true);
  assert.equal(daysUntil("2026-11-19", new Date(2026, 9, 18, 23, 59)), 32);
});

test("release calendar groups upcoming months and drops the past", () => {
  const g = upcomingByMonth(RELEASES, "2026-11-01");
  assert.equal(g[0].ym, "2026-11");
  assert.ok(g.every((m) => m.items.every((r) => r.date >= "2026-11-01")));
  assert.ok(g[0].items.some((r) => r.title === "Grand Theft Auto VI"));
  assert.equal(inMonth("2026-12").length, RELEASES.filter((r) => r.date.startsWith("2026-12")).length);
  for (const r of RELEASES) assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/);
});

test("epic feed parser keeps only 100%-off titles and splits now vs next", () => {
  const offer = (start, end, pct) => [{ promotionalOffers: [{ startDate: start, endDate: end, discountSetting: { discountType: "PERCENTAGE", discountPercentage: pct } }] }];
  const feed = {
    data: { Catalog: { searchStore: { elements: [
      { title: "Free Now", catalogNs: { mappings: [{ pageSlug: "free-now", pageType: "productHome" }] }, price: { totalPrice: { fmtPrice: { originalPrice: "$19.99" } } },
        promotions: { promotionalOffers: offer("2026-10-15T15:00:00.000Z", "2026-10-22T15:00:00.000Z", 0), upcomingPromotionalOffers: [] } },
      { title: "Half Off", productSlug: "half-off", promotions: { promotionalOffers: offer("2026-10-15T15:00:00.000Z", "2026-10-22T15:00:00.000Z", 50), upcomingPromotionalOffers: [] } },
      { title: "Next Week", offerMappings: [{ pageSlug: "next-week" }], promotions: { promotionalOffers: [], upcomingPromotionalOffers: offer("2026-10-22T15:00:00.000Z", "2026-10-29T15:00:00.000Z", 0) } },
      { title: "No Promo", promotions: null },
    ] } } },
  };
  const r = parseFreeGames(feed, new Date("2026-10-18T12:00:00Z"));
  assert.deepEqual(r.current.map((g) => g.title), ["Free Now"]);
  assert.equal(r.current[0].url, "https://store.epicgames.com/en-US/p/free-now");
  assert.equal(r.current[0].originalPrice, "$19.99");
  assert.deepEqual(r.upcoming.map((g) => g.title), ["Next Week"]);
  assert.throws(() => parseFreeGames({ data: {} }), /Unexpected/);
  // After the window closes, nothing is "current".
  assert.equal(parseFreeGames(feed, new Date("2026-10-23T00:00:00Z")).current.length, 0);
});
