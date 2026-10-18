// Epic Games Store free games, read at build time from the store's public
// promotions feed (the one its own free-games page uses). The site rebuilds
// daily and right after Epic's Thursday rotation, so the page stays current.
// If the feed fails or changes shape, the page shows a plain "check the
// store" message instead of stale or wrong games.

export const FEED_URL =
  "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US";

const STORE = "https://store.epicgames.com/en-US/p/";

function slugOf(el) {
  const fromMappings = (arr) => (Array.isArray(arr) ? arr.find((m) => m?.pageSlug)?.pageSlug : undefined);
  return fromMappings(el.catalogNs?.mappings) ?? fromMappings(el.offerMappings) ?? el.productSlug?.replace(/\/home$/, "") ?? null;
}

function freeWindow(groups) {
  // promotions.promotionalOffers = [{ promotionalOffers: [{ startDate, endDate, discountSetting }] }]
  for (const g of groups ?? []) {
    for (const o of g?.promotionalOffers ?? []) {
      if (o?.discountSetting?.discountPercentage === 0 && o.startDate && o.endDate) {
        return { start: o.startDate, end: o.endDate };
      }
    }
  }
  return null;
}

/**
 * Turn the raw feed into { current, upcoming }. Only titles that are (or will
 * be) 100% off count; regular discounts in the same feed are ignored.
 */
export function parseFreeGames(json, now = new Date()) {
  const elements = json?.data?.Catalog?.searchStore?.elements;
  if (!Array.isArray(elements)) throw new Error("Unexpected Epic feed shape");
  const current = [];
  const upcoming = [];
  for (const el of elements) {
    const slug = slugOf(el);
    const base = {
      title: el.title,
      url: slug ? STORE + slug : "https://store.epicgames.com/en-US/free-games",
      seller: el.seller?.name ?? null,
      originalPrice: el.price?.totalPrice?.fmtPrice?.originalPrice ?? null,
    };
    const now_ = freeWindow(el.promotions?.promotionalOffers);
    if (now_ && new Date(now_.start) <= now && now < new Date(now_.end)) {
      current.push({ ...base, ...now_ });
      continue;
    }
    const next = freeWindow(el.promotions?.upcomingPromotionalOffers);
    if (next && new Date(next.start) > now) upcoming.push({ ...base, ...next });
  }
  const byEnd = (a, b) => a.end.localeCompare(b.end) || a.title.localeCompare(b.title);
  return { current: current.sort(byEnd), upcoming: upcoming.sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title)) };
}

let cached;

/** Fetch and parse; returns null (never throws) so a feed outage can't break the build. Fetched once per build. */
export function fetchFreeGames(opts) {
  cached ??= load(opts);
  return cached;
}

async function load({ timeoutMs = 10000, now = new Date() } = {}) {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(timeoutMs), headers: { "User-Agent": "checkpointbrief.com build" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = parseFreeGames(await res.json(), now);
    return { ...parsed, fetchedAt: now.toISOString() };
  } catch (e) {
    console.warn(`[epic] free games feed unavailable: ${e.message}`);
    return null;
  }
}

export const fmtWhen = (iso) =>
  new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York", timeZoneName: "short" });
