// Site sections. `key` is the value of `tool` in guide frontmatter and in the
// Supabase articles table (the column name is shared with the other sites).

export const TOPICS = [
  { key: "gta6", name: "GTA 6 hub", topic: "GTA 6", href: "/gta-6/", label: "GTA 6 guide", hubName: "GTA 6 hub", ctaKicker: "Every confirmed fact", blurb: "Confirmed facts, editions, map and timeline, each linked to its source." },
  { key: "releases", name: "Release date calendar", topic: "Release dates", href: "/release-dates/", label: "Release dates", hubName: "Release date calendar", ctaKicker: "What's coming out", blurb: "Upcoming games with exact dates, by month and platform." },
  { key: "deals", name: "Free games tracker", topic: "Free games", href: "/free-games/", label: "Free games", hubName: "Free games tracker", ctaKicker: "Free this week", blurb: "What's free on the Epic Games Store now and next week." },
  { key: "general", name: "All guides", topic: "Guides", href: "/guides/", label: "Guide", hubName: null, ctaKicker: null, blurb: "How-tos for consoles, storage, pre-loads and more." },
];

export const TOPIC_KEYS = TOPICS.map((t) => t.key);
export const TOPIC_BY_KEY = Object.fromEntries(TOPICS.map((t) => [t.key, t]));
