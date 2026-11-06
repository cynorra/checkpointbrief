// Upcoming releases with exact dates. Compiled from the source in
// sources.js (vgcReleases) and checked on the date there; dates move, so
// pages show the check date and link the source. Add, move or remove
// entries here; past dates drop off the calendar automatically.
// Auto-maintained by scripts/update-releases.mjs.

export const CHECKED = "2026-11-06";

const P = { PC: "PC", PS5: "PS5", XS: "Xbox Series X|S", NS: "Switch", NS2: "Switch 2" };

export const RELEASES = [
  {
    "date": "2026-11-05",
    "title": "Edge of Memories",
    "platforms": ["PS5", "Xbox Series X|S", "PC" ]
  },
  {
    "date": "2026-11-05",
    "title": "Marvel's Guardians of the Galaxy Encore Edition",
    "platforms": ["Switch 2" ]
  },
  {
    "date": "2026-11-05",
    "title": "The Legend of Zelda: Ocarina of Time",
    "platforms": ["Switch 2" ],
    "note": "Switch 2 release"
  },
  {
    "date": "2026-11-06",
    "title": "Stellar Blade",
    "platforms": ["Switch 2" ],
    "note": "Switch 2 version"
  },
  {
    "date": "2026-11-12",
    "title": "Metaphor: ReFantazio",
    "platforms": ["Switch 2" ],
    "note": "Switch 2 version"
  },
  {
    "date": "2026-11-12",
    "title": "Pikmin 4: Nintendo Switch 2 Edition + Dandori Academy",
    "platforms": ["Switch 2" ]
  },
  {
    "date": "2026-11-12",
    "title": "Sonic Pico Park",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch 2", "Switch" ]
  },
  {
    "date": "2026-11-19",
    "title": "Grand Theft Auto VI",
    "platforms": ["PS5", "Xbox Series X|S" ],
    "big": true,
    "href": "/gta-6/"
  },
  {
    "date": "2026-12-01",
    "title": "Hela",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch 2" ]
  },
  {
    "date": "2026-12-02",
    "title": "The Ascent Ultimate Edition",
    "platforms": ["Switch 2" ]
  },
  {
    "date": "2026-12-03",
    "title": "Aeterna Lucis",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch" ]
  },
  {
    "date": "2026-12-03",
    "title": "Dragon Quest Monsters: The Withered World",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch", "Switch 2" ]
  },
  {
    "date": "2026-12-03",
    "title": "Rayman Legends Retold",
    "platforms": ["PS5", "Xbox Series X|S", "PC", "Switch 2" ]
  },
  {
    "date": "2026-12-03",
    "title": "Warhammer 40,000: Dawn of War IV",
    "platforms": ["PC" ]
  },
  {
    "date": "2026-12-03",
    "title": "Xenoblade Chronicles 3 – Switch 2 Edition",
    "platforms": ["Switch 2" ]
  },
  {
    "date": "2026-12-04",
    "title": "Monster Hunter Wilds",
    "platforms": ["Switch 2" ],
    "note": "Switch 2 version"
  },
  {
    "date": "2026-12-10",
    "title": "Attack on Titan 3",
    "platforms": ["PS5", "Xbox Series X|S", "Switch 2", "PC" ]
  },
  {
    "date": "2026-12-10",
    "title": "Professor Layton and the New World of Steam",
    "platforms": ["PS5", "Switch", "PC", "Switch 2" ]
  },
  {
    "date": "2026-12-10",
    "title": "Stage Tour",
    "platforms": ["PS5", "Xbox Series X|S", "Switch 2", "PC" ]
  },
  {
    "date": "2026-12-11",
    "title": "Path of Exile 2",
    "platforms": ["PC", "PS5", "Xbox Series X|S" ],
    "note": "Full release"
  },
  {
    "date": "2027-01-15",
    "title": "Stranger Than Heaven",
    "platforms": ["PC", "PS5", "Xbox Series X|S" ]
  },
  {
    "date": "2027-02-04",
    "title": "Metro 2039",
    "platforms": ["PC", "PS5", "Xbox Series X|S" ],
    "big": true
  },
  {
    "date": "2027-02-12",
    "title": "Tomb Raider: Legacy of Atlantis",
    "platforms": ["PC", "PS5", "Xbox Series X|S" ],
    "big": true
  },
  {
    "date": "2027-02-16",
    "title": "God of War Laufey",
    "platforms": ["PS5" ],
    "big": true
  },
  {
    "date": "2027-02-23",
    "title": "Fable",
    "platforms": ["PC", "Xbox Series X|S", "PS5" ],
    "big": true
  },
  {
    "date": "2027-03-18",
    "title": "Into the Dead: Our Darkest Days",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch 2" ]
  },
  {
    "date": "2027-04-07",
    "title": "Exodus",
    "platforms": ["PC", "PS5", "Xbox Series X|S" ],
    "big": true
  },
  {
    "date": "2027-04-08",
    "title": "Final Fantasy VII Remake: Revelation",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch 2" ],
    "big": true
  },
  {
    "date": "2027-05-20",
    "title": "Spine",
    "platforms": ["PC", "PS5", "Xbox Series X|S", "Switch 2" ]
  },
  {
    "date": "2027-06-11",
    "title": "Hunter: The Reckoning – Deathwish",
    "platforms": ["PC", "PS5", "Xbox Series X|S" ]
  }
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
