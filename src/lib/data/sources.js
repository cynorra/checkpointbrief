// Every external source the site cites, in one place, with the date it was
// last checked. Pages cite by key so a moved URL is fixed once.

export const SOURCES = {
  rockstarVI: { label: "Rockstar Games: Grand Theft Auto VI official page", href: "https://www.rockstargames.com/VI", checked: "2026-10-18" },
  notebookcheckPrice: { label: "Notebookcheck: GTA 6 price officially confirmed ahead of pre-orders", href: "https://www.notebookcheck.net/GTA-6-price-officially-confirmed-ahead-of-pre-orders.1327919.0.html", checked: "2026-10-18" },
  wikiVI: { label: "Wikipedia: Grand Theft Auto VI", href: "https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI", checked: "2026-10-18" },
  gamesradarVI: { label: "GamesRadar+: GTA 6, everything we know (updated October 15, 2026)", href: "https://www.gamesradar.com/gta-6-guide/", checked: "2026-10-18" },
  famitsuNelson: { label: "iXBT Games: Rockstar comments on the GTA VI release date (Rob Nelson, Famitsu interview)", href: "https://ixbt.games/en/news/2026/10/14/rockstar-oficialno-prokommentirovala-datu-vyxoda-gta-vi.html", checked: "2026-10-18" },
  takeTwoPC: { label: "God is a Geek: Take-Two CEO says PC gamers are not GTA 6's core consumer", href: "https://godisageek.com/2026/05/gta-6-skips-pc-at-launch-consoles-come-first/", checked: "2026-10-18" },
  vgcReleases: { label: "Video Games Chronicle: upcoming game release dates schedule", href: "https://www.videogameschronicle.com/guide/upcoming-game-release-dates-schedule/", checked: "2026-10-18" },
  rockstarPreorderPR: { label: "Business Wire: Rockstar Games announces pre-orders for Grand Theft Auto VI (June 24, 2026)", href: "https://www.businesswire.com/news/home/20260624539426/en/Rockstar-Games-Announces-Pre-Orders-for-Grand-Theft-Auto-VI", checked: "2026-10-18" },
  pcgamerEditions: { label: "PC Gamer: GTA 6 pre-order editions explained", href: "https://pcgamer.com/games/grand-theft-auto/gta-6-pre-order-editions-standard-ultimate/", checked: "2026-10-18" },
  pushSquareDisc: { label: "Push Square: GTA 6 physical edition doesn't come with discs, it's a code in the box", href: "https://www.pushsquare.com/news/2026/06/gta-6-physical-edition-doesnt-come-with-discs-its-a-code-in-the-box", checked: "2026-10-18" },
  notebookcheckPS5: { label: "Notebookcheck: Rockstar shares new details about GTA 6's PS5 version", href: "https://www.notebookcheck.net/Rockstar-shares-new-details-about-GTA-6-s-PS5-version-but-one-major-question-remains-unanswered.1327924.0.html", checked: "2026-10-18" },
  dexertoRating: { label: "Dexerto: GTA 6 age ratings", href: "https://www.dexerto.com/gta/gta-6-age-ratings-suggest-no-gambling-to-go-with-drugs-and-decapitations-3416139/", checked: "2026-10-18" },
  gtaintelPreload: { label: "GTA Intel: GTA 6 preload, file size and unlock times, what's confirmed", href: "https://gtaintel.com/news/gta-6-preload-file-size-launch-times", checked: "2026-10-18" },
  gtabaseOnline: { label: "GTABase: When is GTA 6 Online coming out?", href: "https://www.gtabase.com/articles/gta-6/when-is-gta-6-online-coming-out", checked: "2026-10-18" },
  sonyM2: { label: "PlayStation Support: How to install an M.2 SSD in a PS5", href: "https://www.playstation.com/en-us/support/hardware/ps5-install-m2-ssd/", checked: "2026-10-18" },
  windowsCentralStorage: { label: "Windows Central: How to expand Xbox Series X|S storage", href: "https://www.windowscentral.com/xbox-series-x-s-storage-guide", checked: "2026-10-18" },
  epicStore: { label: "Epic Games Store: free games", href: "https://store.epicgames.com/en-US/free-games", checked: "2026-10-18" },
};

export const src = (key) => {
  const s = SOURCES[key];
  if (!s) throw new Error(`Unknown source "${key}"`);
  return s;
};
