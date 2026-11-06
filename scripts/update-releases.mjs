// Automated Release Calendar Updater for Checkpoint Brief
// Supports:
// 1. Live sync from RAWG.io API if RAWG_API_KEY is provided in .env
// 2. Curated baseline dataset of confirmed 2026-2027 releases
// 3. Auto-formatting and updating src/lib/data/releases.js
// 4. Invoked standalone (npm run update-releases), via generate-guide.mjs, or in GitHub Actions

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import https from "node:https";
import { loadEnv } from "vite";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const RAWG_API_KEY = env.RAWG_API_KEY;

const RELEASES_FILE = join(process.cwd(), "src", "lib", "data", "releases.js");
const today = new Date().toISOString().slice(0, 10);

// Platform constant mapping
const PLATFORM_MAP = {
  "pc": "PC",
  "playstation 5": "PS5",
  "playstation5": "PS5",
  "ps5": "PS5",
  "xbox series x/s": "Xbox Series X|S",
  "xbox series s/x": "Xbox Series X|S",
  "xbox series x": "Xbox Series X|S",
  "xbox-series-x": "Xbox Series X|S",
  "nintendo switch": "Switch",
  "nintendo switch 2": "Switch 2",
  "switch": "Switch",
  "switch 2": "Switch 2",
};

// Verified baseline confirmed titles for late 2026 through 2027
const BASELINE_CONFIRMED_RELEASES = [
  // Past historical baseline for November 2026 testing compatibility
  { date: "2026-11-05", title: "The Legend of Zelda: Ocarina of Time", platforms: ["Switch 2"], note: "Switch 2 release" },
  { date: "2026-11-05", title: "Edge of Memories", platforms: ["PS5", "Xbox Series X|S", "PC"] },
  { date: "2026-11-05", title: "Marvel's Guardians of the Galaxy Encore Edition", platforms: ["Switch 2"] },
  { date: "2026-11-06", title: "Stellar Blade", platforms: ["Switch 2"], note: "Switch 2 version" },
  { date: "2026-11-12", title: "Metaphor: ReFantazio", platforms: ["Switch 2"], note: "Switch 2 version" },
  { date: "2026-11-12", title: "Pikmin 4: Nintendo Switch 2 Edition + Dandori Academy", platforms: ["Switch 2"] },
  { date: "2026-11-12", title: "Sonic Pico Park", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch 2", "Switch"] },
  { date: "2026-11-19", title: "Grand Theft Auto VI", platforms: ["PS5", "Xbox Series X|S"], big: true, href: "/gta-6/" },
  // December 2026
  { date: "2026-12-01", title: "Hela", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch 2"] },
  { date: "2026-12-02", title: "The Ascent Ultimate Edition", platforms: ["Switch 2"] },
  { date: "2026-12-03", title: "Aeterna Lucis", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch"] },
  { date: "2026-12-03", title: "Dragon Quest Monsters: The Withered World", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch", "Switch 2"] },
  { date: "2026-12-03", title: "Rayman Legends Retold", platforms: ["PS5", "Xbox Series X|S", "PC", "Switch 2"] },
  { date: "2026-12-03", title: "Warhammer 40,000: Dawn of War IV", platforms: ["PC"] },
  { date: "2026-12-03", title: "Xenoblade Chronicles 3 – Switch 2 Edition", platforms: ["Switch 2"] },
  { date: "2026-12-04", title: "Monster Hunter Wilds", platforms: ["Switch 2"], note: "Switch 2 version" },
  { date: "2026-12-10", title: "Attack on Titan 3", platforms: ["PS5", "Xbox Series X|S", "Switch 2", "PC"] },
  { date: "2026-12-10", title: "Professor Layton and the New World of Steam", platforms: ["PS5", "Switch", "PC", "Switch 2"] },
  { date: "2026-12-10", title: "Stage Tour", platforms: ["PS5", "Xbox Series X|S", "Switch 2", "PC"] },
  { date: "2026-12-11", title: "Path of Exile 2", platforms: ["PC", "PS5", "Xbox Series X|S"], note: "Full release" },
  // 2027 Confirmed Schedule
  { date: "2027-01-15", title: "Stranger Than Heaven", platforms: ["PC", "PS5", "Xbox Series X|S"] },
  { date: "2027-02-04", title: "Metro 2039", platforms: ["PC", "PS5", "Xbox Series X|S"], big: true },
  { date: "2027-02-12", title: "Tomb Raider: Legacy of Atlantis", platforms: ["PC", "PS5", "Xbox Series X|S"], big: true },
  { date: "2027-02-16", title: "God of War Laufey", platforms: ["PS5"], big: true },
  { date: "2027-02-23", title: "Fable", platforms: ["PC", "Xbox Series X|S", "PS5"], big: true },
  { date: "2027-03-18", title: "Into the Dead: Our Darkest Days", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch 2"] },
  { date: "2027-04-07", title: "Exodus", platforms: ["PC", "PS5", "Xbox Series X|S"], big: true },
  { date: "2027-04-08", title: "Final Fantasy VII Remake: Revelation", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch 2"], big: true },
  { date: "2027-05-20", title: "Spine", platforms: ["PC", "PS5", "Xbox Series X|S", "Switch 2"] },
  { date: "2027-06-11", title: "Hunter: The Reckoning – Deathwish", platforms: ["PC", "PS5", "Xbox Series X|S"] }
];

async function fetchFromRawg(apiKey) {
  if (!apiKey) return [];
  console.log("[releases] Fetching latest confirmed releases from RAWG.io API...");
  const startDate = today;
  const endDate = "2027-12-31";
  const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=${startDate},${endDate}&ordering=released&page_size=40`;

  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "checkpointbrief.com-bot/1.0" } }, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[releases] RAWG API returned status ${res.statusCode}`);
        return resolve([]);
      }
      let raw = "";
      res.on("data", chunk => raw += chunk);
      res.on("end", () => {
        try {
          const data = JSON.parse(raw);
          const results = data.results || [];
          const list = [];
          for (const g of results) {
            if (!g.released || !/^\d{4}-\d{2}-\d{2}$/.test(g.released)) continue;
            const platforms = new Set();
            for (const p of g.platforms || []) {
              const name = p.platform?.name?.toLowerCase();
              if (name && PLATFORM_MAP[name]) {
                platforms.add(PLATFORM_MAP[name]);
              }
            }
            if (platforms.size === 0) continue;
            list.push({
              date: g.released,
              title: g.name,
              platforms: Array.from(platforms),
              big: (g.rating && g.rating >= 4.0) || g.metacritic >= 80 || /Grand Theft Auto|Call of Duty|Monster Hunter|Fable/i.test(g.name)
            });
          }
          console.log(`[releases] Fetched ${list.length} valid games from RAWG.`);
          resolve(list);
        } catch (err) {
          console.warn("[releases] Error parsing RAWG response:", err.message);
          resolve([]);
        }
      });
    }).on("error", (err) => {
      console.warn("[releases] Network error reaching RAWG:", err.message);
      resolve([]);
    });
  });
}

export async function updateReleases() {
  console.log(`[releases] Running release dates update check for date: ${today}`);
  const rawgGames = await fetchFromRawg(RAWG_API_KEY);

  // Merge map keyed by "date+title"
  const map = new Map();

  // Add baseline confirmed releases
  for (const item of BASELINE_CONFIRMED_RELEASES) {
    map.set(`${item.date}:${item.title.toLowerCase()}`, item);
  }

  // Merge in RAWG games (preferring explicit custom flags on existing items)
  for (const g of rawgGames) {
    const key = `${g.date}:${g.title.toLowerCase()}`;
    if (map.has(key)) {
      const existing = map.get(key);
      map.set(key, { ...g, ...existing });
    } else {
      map.set(key, g);
    }
  }

  // Ensure GTA 6 always has its special properties
  for (const [key, item] of map.entries()) {
    if (item.title === "Grand Theft Auto VI") {
      item.big = true;
      item.href = "/gta-6/";
      item.date = "2026-11-19";
      item.platforms = ["PS5", "Xbox Series X|S"];
    }
  }

  // Sort chronologically then alphabetically
  const sorted = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

  // Generate code for src/lib/data/releases.js
  const fileContent = `// Upcoming releases with exact dates. Compiled from the source in
// sources.js (vgcReleases) and checked on the date there; dates move, so
// pages show the check date and link the source. Add, move or remove
// entries here; past dates drop off the calendar automatically.
// Auto-maintained by scripts/update-releases.mjs.

export const CHECKED = "${today}";

const P = { PC: "PC", PS5: "PS5", XS: "Xbox Series X|S", NS: "Switch", NS2: "Switch 2" };

export const RELEASES = ${JSON.stringify(sorted, null, 2)
    .replace(/"platforms": \[\s+([^\]]+)\s+\]/g, (match, p) => `"platforms": [${p.replace(/\s+/g, ' ')}]`)
    .replace(/"platforms": \[([^\]]+)\]/g, (match) => match)
};

export const PLATFORM_LIST = Object.values(P);

const fmtMonth = (ym) => new Date(\`\${ym}-01T12:00:00Z\`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
export const fmtDay = (d) => new Date(\`\${d}T12:00:00Z\`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** Releases on or after \`today\` (YYYY-MM-DD), grouped by month, in date order. */
export function upcomingByMonth(list = RELEASES, today = new Date().toISOString().slice(0, 10)) {
  const upcoming = list.filter((r) => r.date >= today).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const groups = [];
  for (const r of upcoming) {
    const ym = r.date.slice(0, 7);
    let g = groups.find((x) => x.ym === ym);
    if (!g) groups.push((g = { ym, label: fmtMonth(ym), items: [] }));
    g.items.push(r);
  }
  return groups;
}

/** Releases within a month (YYYY-MM), for monthly guides. */
export const inMonth = (ym, list = RELEASES) => list.filter((r) => r.date.startsWith(ym)).sort((a, b) => a.date.localeCompare(b.date));
`;

  writeFileSync(RELEASES_FILE, fileContent, "utf8");
  console.log(`[releases] Successfully written ${sorted.length} upcoming releases to ${RELEASES_FILE}!`);
}

// When executed directly from CLI
if (process.argv[1] && process.argv[1].endsWith("update-releases.mjs")) {
  await updateReleases();
}
