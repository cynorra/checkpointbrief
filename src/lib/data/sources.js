// Every external source the site cites, in one place, with the date it was
// last checked. Pages cite by key so a moved URL is fixed once.

const CURRENT_CHECKED = new Date().toISOString().slice(0, 10);

export const SOURCES = {
  rockstarVI: { label: "Rockstar Games: Grand Theft Auto VI official page", href: "https://www.rockstargames.com/VI", checked: CURRENT_CHECKED },
  notebookcheckPrice: { label: "Notebookcheck: GTA 6 price officially confirmed ahead of pre-orders", href: "https://www.notebookcheck.net/GTA-6-price-officially-confirmed-ahead-of-pre-orders.1327919.0.html", checked: CURRENT_CHECKED },
  wikiVI: { label: "Wikipedia: Grand Theft Auto VI", href: "https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI", checked: CURRENT_CHECKED },
  gamesradarVI: { label: "GamesRadar+: GTA 6, everything we know", href: "https://www.gamesradar.com/gta-6-guide/", checked: CURRENT_CHECKED },
  famitsuNelson: { label: "iXBT Games: Rockstar comments on the GTA VI release date (Rob Nelson, Famitsu interview)", href: "https://ixbt.games/en/news/2026/10/14/rockstar-oficialno-prokommentirovala-datu-vyxoda-gta-vi.html", checked: CURRENT_CHECKED },
  takeTwoPC: { label: "God is a Geek: Take-Two CEO says PC gamers are not GTA 6's core consumer", href: "https://godisageek.com/2026/05/gta-6-skips-pc-at-launch-consoles-come-first/", checked: CURRENT_CHECKED },
  vgcReleases: { label: "Video Games Chronicle: upcoming game release dates schedule", href: "https://www.videogameschronicle.com/guide/upcoming-game-release-dates-schedule/", checked: CURRENT_CHECKED },
  rockstarPreorderPR: { label: "Business Wire: Rockstar Games announces pre-orders for Grand Theft Auto VI (June 24, 2026)", href: "https://www.businesswire.com/news/home/20260624539426/en/Rockstar-Games-Announces-Pre-Orders-for-Grand-Theft-Auto-VI", checked: CURRENT_CHECKED },
  pcgamerEditions: { label: "PC Gamer: GTA 6 pre-order editions explained", href: "https://pcgamer.com/games/grand-theft-auto/gta-6-pre-order-editions-standard-ultimate/", checked: CURRENT_CHECKED },
  pushSquareDisc: { label: "Push Square: GTA 6 physical edition doesn't come with discs, it's a code in the box", href: "https://www.pushsquare.com/news/2026/06/gta-6-physical-edition-doesnt-come-with-discs-its-a-code-in-the-box", checked: CURRENT_CHECKED },
  notebookcheckPS5: { label: "Notebookcheck: Rockstar shares new details about GTA 6's PS5 version", href: "https://www.notebookcheck.net/Rockstar-shares-new-details-about-GTA-6-s-PS5-version-but-one-major-question-remains-unanswered.1327924.0.html", checked: CURRENT_CHECKED },
  dexertoRating: { label: "Dexerto: GTA 6 age ratings", href: "https://www.dexerto.com/gta/gta-6-age-ratings-suggest-no-gambling-to-go-with-drugs-and-decapitations-3416139/", checked: CURRENT_CHECKED },
  gtaintelPreload: { label: "GTA Intel: GTA 6 preload, file size and unlock times, what's confirmed", href: "https://gtaintel.com/news/gta-6-preload-file-size-launch-times", checked: CURRENT_CHECKED },
  gtabaseOnline: { label: "GTABase: When is GTA 6 Online coming out?", href: "https://www.gtabase.com/articles/gta-6/when-is-gta-6-online-coming-out", checked: CURRENT_CHECKED },
  sonyM2: { label: "PlayStation Support: How to install an M.2 SSD in a PS5", href: "https://www.playstation.com/en-us/support/hardware/ps5-install-m2-ssd/", checked: CURRENT_CHECKED },
  windowsCentralStorage: { label: "Windows Central: How to expand Xbox Series X|S storage", href: "https://www.windowscentral.com/xbox-series-x-s-storage-guide", checked: CURRENT_CHECKED },
  epicStore: { label: "Epic Games Store: free games", href: "https://store.epicgames.com/en-US/free-games", checked: CURRENT_CHECKED },
};

export const src = (key) => {
  const s = SOURCES[key];
  if (!s) throw new Error(`Unknown source "${key}"`);
  return s;
};
