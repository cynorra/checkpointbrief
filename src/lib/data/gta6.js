// Grand Theft Auto VI: only confirmed facts, each tied to a source in
// sources.js. Rumors live in RUMORS, clearly separated, and pages must label
// them. When a fact changes, change it here and bump UPDATED.

export const UPDATED = new Date().toISOString().slice(0, 10);

/** Console launch day. Unlock times by region had not been published when checked. */
export const RELEASE_DATE = "2026-11-19";
export const PRELOAD_DATE = "2026-11-12";
export const PREORDER_DATE = "2026-06-25";

export const PLATFORMS = ["PlayStation 5", "Xbox Series X|S"];

export const FACTS = [
  { label: "Release date", value: "November 19, 2026", source: "rockstarVI" },
  { label: "Platforms", value: "PlayStation 5, Xbox Series X|S", source: "rockstarVI" },
  { label: "PC version", value: "Not announced", source: "gamesradarVI" },
  { label: "Standard Edition", value: "$79.99", source: "notebookcheckPrice" },
  { label: "Ultimate Edition", value: "$99.99", source: "notebookcheckPrice" },
  { label: "Pre-orders opened", value: "June 25, 2026", source: "rockstarPreorderPR" },
  { label: "Physical copies and pre-load", value: "November 12, 2026 (physical copies hold a download code, no disc)", source: "rockstarPreorderPR" },
  { label: "Setting", value: "The state of Leonida, including Vice City", source: "rockstarVI" },
  { label: "Protagonists", value: "Jason Duval and Lucia Caminos", source: "wikiVI" },
  { label: "Developer and publisher", value: "Rockstar Games (Take-Two Interactive)", source: "wikiVI" },
];

export const EDITIONS = [
  {
    name: "Standard Edition",
    price: "$79.99",
    includes: ["The full game"],
    source: "notebookcheckPrice",
  },
  {
    name: "Ultimate Edition",
    price: "$99.99",
    includes: ["The full game", "Premium vehicles, weapons, apparel and extra activities and businesses in Vice City (digital only)"],
    source: "pcgamerEditions",
  },
];

export const PREORDER_BONUSES = [
  { item: "Vintage Vice City Pack", detail: "Outfits for Jason and Lucia, a '55 Vapid Stanier with a garage, and a weapon pattern. For pre-orders and purchases before November 20, 2026, on either edition", source: "rockstarPreorderPR" },
  { item: "One month of GTA+", detail: "For digital pre-orders; redeemable right away", source: "rockstarPreorderPR" },
];

/** Places Rockstar has named, with the real-world area each is modeled on where widely reported. */
export const LOCATIONS = [
  { name: "Vice City", inspiredBy: "Miami", source: "wikiVI" },
  { name: "Leonida Keys", inspiredBy: "Florida Keys", source: "wikiVI" },
  { name: "Grassrivers", inspiredBy: "the Everglades", source: "wikiVI" },
  { name: "Port Gellhorn", inspiredBy: null, source: "wikiVI" },
  { name: "Ambrosia", inspiredBy: null, source: "wikiVI" },
  { name: "Mount Kalaga National Park", inspiredBy: null, source: "wikiVI" },
];

export const TIMELINE = [
  { date: "2022-02-04", event: "Rockstar confirms the next Grand Theft Auto is \"well underway\".", source: "wikiVI" },
  { date: "2023-12-05", event: "Trailer 1 is released ahead of schedule after a low-quality copy leaks. It reveals the title, Vice City and a 2025 window.", source: "wikiVI", approx: true },
  { date: "2025-05-06", event: "Trailer 2 is released with 70 screenshots and character and location profiles.", source: "wikiVI" },
  { date: "2025-05-02", event: "First delay: the game moves from fall 2025 to May 26, 2026.", source: "wikiVI", approx: true },
  { date: "2025-11-06", event: "Second delay: the game moves to November 19, 2026, for additional polish.", source: "wikiVI", approx: true },
  { date: "2026-06-18", event: "Cover art and special editions are unveiled.", source: "wikiVI" },
  { date: "2026-06-25", event: "Pre-orders open.", source: "wikiVI" },
  { date: "2026-08-27", event: "An extended gameplay look premieres.", source: "wikiVI" },
  { date: "2026-10-15", event: "The launch trailer is released.", source: "rockstarVI" },
  { date: "2026-11-12", event: "Physical copies (download codes, no disc) and pre-loading.", source: "wikiVI" },
  { date: "2026-11-19", event: "Launch on PlayStation 5 and Xbox Series X|S.", source: "rockstarVI" },
].sort((a, b) => a.date.localeCompare(b.date));

/** Reported but not confirmed by Rockstar. Pages must label these as unconfirmed. */
export const RUMORS = [
  { claim: "A PC version will follow in 2027.", status: "Unconfirmed. Take-Two has said PC players are not the launch audience; no PC date has been announced.", source: "takeTwoPC" },
  { claim: "GTA Online for GTA 6 will be available at launch.", status: "Unconfirmed. Rockstar has not said when online play arrives.", source: "gamesradarVI" },
];

/** Whole days from `now` until local midnight on `dateStr` (YYYY-MM-DD). */
export function daysUntil(dateStr, now = new Date()) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

/** Days, hours, minutes and seconds left until local midnight on dateStr. */
export function countdownParts(dateStr, now = new Date()) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const ms = new Date(y, m - 1, d) - now;
  if (ms <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(ms / 1000);
  return { done: false, days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}
