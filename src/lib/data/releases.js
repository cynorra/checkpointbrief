// Upcoming releases with exact dates. Compiled from the source in
// sources.js (vgcReleases) and checked on the date there; dates move, so
// pages show the check date and link the source. Add, move or remove
// entries here; past dates drop off the calendar automatically.

export const CHECKED = "2026-10-18";

const P = { PC: "PC", PS5: "PS5", XS: "Xbox Series X|S", NS: "Switch", NS2: "Switch 2" };

export const RELEASES = [
  { date: "2026-10-21", title: "Stupid Never Dies", platforms: [P.PC, P.PS5] },
  { date: "2026-10-22", title: "Fatal Fury: City of the Wolves", platforms: [P.NS2], note: "Switch 2 version" },
  { date: "2026-10-22", title: "Final Fantasy Resonance", platforms: [P.PC, P.PS5, P.XS, P.NS, P.NS2] },
  { date: "2026-10-22", title: "Nintendo Switch Sports Resort", platforms: [P.NS2] },
  { date: "2026-10-23", title: "Call of Duty: Modern Warfare 4", platforms: [P.PC, P.PS5, P.XS, P.NS2], big: true },
  { date: "2026-10-23", title: "One Piece: Grand Gourmet", platforms: [P.PC, P.NS, P.NS2] },
  { date: "2026-10-27", title: "Minecraft", platforms: [P.NS2], note: "Switch 2 version" },
  { date: "2026-10-29", title: "Hello Kitty Party Land", platforms: [P.NS, P.NS2] },
  { date: "2026-10-29", title: "Phantom Blade Zero", platforms: [P.PS5, P.PC], big: true },
  { date: "2026-10-29", title: "The Wolf Among Us Remastered", platforms: [P.PC, P.PS5, P.XS, P.NS, P.NS2] },
  { date: "2026-11-05", title: "The Legend of Zelda: Ocarina of Time", platforms: [P.NS2], note: "Switch 2 release" },
  { date: "2026-11-05", title: "Edge of Memories", platforms: [P.PS5, P.XS, P.PC] },
  { date: "2026-11-05", title: "Marvel's Guardians of the Galaxy Encore Edition", platforms: [P.NS2] },
  { date: "2026-11-06", title: "Stellar Blade", platforms: [P.NS2], note: "Switch 2 version" },
  { date: "2026-11-12", title: "Metaphor: ReFantazio", platforms: [P.NS2], note: "Switch 2 version" },
  { date: "2026-11-12", title: "Pikmin 4: Nintendo Switch 2 Edition + Dandori Academy", platforms: [P.NS2] },
  { date: "2026-11-12", title: "Sonic Pico Park", platforms: [P.PC, P.PS5, P.XS, P.NS2, P.NS] },
  { date: "2026-11-19", title: "Grand Theft Auto VI", platforms: [P.PS5, P.XS], big: true, href: "/gta-6/" },
  { date: "2026-12-01", title: "Hela", platforms: [P.PC, P.PS5, P.XS, P.NS2] },
  { date: "2026-12-02", title: "The Ascent Ultimate Edition", platforms: [P.NS2] },
  { date: "2026-12-03", title: "Aeterna Lucis", platforms: [P.PC, P.PS5, P.XS, P.NS] },
  { date: "2026-12-03", title: "Dragon Quest Monsters: The Withered World", platforms: [P.PC, P.PS5, P.XS, P.NS, P.NS2] },
  { date: "2026-12-03", title: "Rayman Legends Retold", platforms: [P.PS5, P.XS, P.PC, P.NS2] },
  { date: "2026-12-03", title: "Warhammer 40,000: Dawn of War IV", platforms: [P.PC] },
  { date: "2026-12-03", title: "Xenoblade Chronicles 3 – Switch 2 Edition", platforms: [P.NS2] },
  { date: "2026-12-04", title: "Monster Hunter Wilds", platforms: [P.NS2], note: "Switch 2 version" },
  { date: "2026-12-10", title: "Attack on Titan 3", platforms: [P.PS5, P.XS, P.NS2, P.PC] },
  { date: "2026-12-10", title: "Professor Layton and the New World of Steam", platforms: [P.PS5, P.NS, P.PC, P.NS2] },
  { date: "2026-12-10", title: "Stage Tour", platforms: [P.PS5, P.XS, P.NS2, P.PC] },
  { date: "2026-12-11", title: "Path of Exile 2", platforms: [P.PC, P.PS5, P.XS], note: "Full release" },
];

export const PLATFORM_LIST = Object.values(P);

const fmtMonth = (ym) => new Date(`${ym}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
export const fmtDay = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** Releases on or after `today` (YYYY-MM-DD), grouped by month, in date order. */
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
