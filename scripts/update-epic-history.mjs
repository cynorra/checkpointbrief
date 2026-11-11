// Appends Epic's currently-free games to src/lib/data/epic-history.json.
// Runs in CI before the build. Entries are keyed by title + start date, so
// running it many times a day never duplicates a row. Only games that are
// really free right now (start <= now < end) are recorded.
import { readFile, writeFile } from "node:fs/promises";
import { fetchFreeGames } from "../src/lib/data/epic.js";

const FILE = new URL("../src/lib/data/epic-history.json", import.meta.url);
const epic = await fetchFreeGames();
if (!epic) {
  console.warn("[epic-history] feed unavailable, history unchanged");
  process.exit(0);
}
const history = JSON.parse(await readFile(FILE, "utf8"));
const have = new Set(history.map((h) => `${h.title}|${h.start}`));
let added = 0;
for (const g of epic.current) {
  const key = `${g.title}|${g.start}`;
  if (have.has(key)) continue;
  history.push({ title: g.title, url: g.url, seller: g.seller, start: g.start, end: g.end, originalPrice: g.originalPrice && g.originalPrice !== "0" ? g.originalPrice : null });
  added++;
}
history.sort((a, b) => b.start.localeCompare(a.start) || a.title.localeCompare(b.title));
await writeFile(FILE, JSON.stringify(history, null, 2) + "\n");
console.log(`[epic-history] +${added}, total ${history.length}`);
