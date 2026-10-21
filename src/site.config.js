// One place for everything that names the site. Change the brand or domain
// here and every page, meta tag and schema block follows.

export const SITE = {
  name: "Checkpoint Brief",
  domain: "checkpointbrief.com",
  url: "https://checkpointbrief.com",
  tagline: "GTA 6, release dates and free games, checked and dated",
  description:
    "Verified GTA 6 facts, a dated game release calendar and this week's free games, with every claim linked to its source and every page dated.",
  language: "en-US",
  locale: "en_US",
  foundingYear: 2026,

  // A real inbox on the domain (Cloudflare Email Routing works).
  email: "hello@checkpointbrief.com",

  // Optional form backend URL; empty shows the email address only.
  contactFormEndpoint: "",

  // Filled in when the site is added to the approved AdSense account.
  adsensePublisherId: "",

  verification: {
    google: "",
    bing: "",
    yandex: "",
  },

  // IndexNow key, served at /indexnow-key.txt. Keep stable.
  indexNowKey: "5c1e9f4a7b2d40e8a3f6c9b1d2e7a480",
};

export const AUTHOR = {
  name: "Eren Şimşir",
  slug: "eren-simsir",
  role: "Founder and editor",
  photo: "/images/eren-simsir.jpg",
  linkedin: "https://www.linkedin.com/in/ernsmsr",
  github: "https://github.com/cynorra",
  shortBio:
    "Software engineer and lifelong player. I build the trackers on this site and write the guides, and I link every fact to where it came from.",
};

export const NAV = [
  { href: "/guides/", label: "Guides" },
  { href: "/gta-6/", label: "GTA 6" },
  { href: "/release-dates/", label: "Release dates" },
  { href: "/free-games/", label: "Free games" },
  { href: "/about/", label: "About" },
];

export const FOOTER_LINKS = [
  { href: "/about/", label: "About" },
  { href: `/author/${AUTHOR.slug}/`, label: "Author" },
  { href: "/how-we-verify/", label: "How we verify" },
  { href: "/editorial-policy/", label: "Editorial policy" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy policy" },
  { href: "/terms/", label: "Terms of use" },
  { href: "/disclaimer/", label: "Disclaimer" },
];
