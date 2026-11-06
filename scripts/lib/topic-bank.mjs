// Topic bank and rotating content formats for Checkpoint Brief.
// Ensures articles NEVER duplicate published content and ROTATE structural formats.

export const CONTENT_FORMATS = [
  {
    type: "Comparison & Decision Matrix",
    description: "Side-by-side comparison of editions, platforms, or hardware with clear buyer recommendations",
    structureRequirements: [
      "Decision breakdown (Who should buy Option A vs Option B)",
      "Detailed specifications / features comparison table in <div class=\"table-wrap\">",
      "Cost-per-feature or value analysis"
    ]
  },
  {
    type: "Actionable Step-by-Step Technical Guide",
    description: "Concrete troubleshooting, optimization, or setup steps for console and PC gamers",
    structureRequirements: [
      "Exact numbered steps (Step 1, Step 2, etc.) with exact console UI settings names",
      "Prerequisite requirements table (Storage needed, cable types, format type)",
      "Troubleshooting common error codes or failure points"
    ]
  },
  {
    type: "Historical Data & Cadence Analysis",
    description: "Analyzing past studio behavior, release gaps, and industry benchmarks to forecast realistic expectations",
    structureRequirements: [
      "Historical timeline table with exact dates and gap calculations in days",
      "Technical obstacles explaining past delays vs current engine architecture",
      "Statistical launch window estimate backed by financial investor calls"
    ]
  },
  {
    type: "Launch Day Countdown & Preparation Checklist",
    description: "High-urgency audit checklist for players preparing for major releases or updates",
    structureRequirements: [
      "Chronological milestone schedule (Pre-load date, unlock times, day-one patch size)",
      "Readiness audit checklist (Account linking, 2FA, free SSD space)",
      "Immediate day-one pitfalls to avoid"
    ]
  },
  {
    type: "Hardware Architecture Deep Dive",
    description: "Hardware-level breakdown (APU, PSSR upscaling, SSD bandwidth, ray tracing)",
    structureRequirements: [
      "Hardware benchmark or architecture comparison table",
      "Explanation of CPU vs GPU bottlenecks for open-world simulation",
      "Optimal display and console settings recommendations"
    ]
  }
];

export const ZERO_CLICK_TOPIC_BANK = [
  // --- GTA 6 Decision, Comparison & Technical Deep Dives ---

  // --- Hardware, Storage & Optimization Guides ---
  {
    topic: "How to Clear 150GB+ on PS5 for GTA 6 Without Losing Save Data or Games",
    slug: "how-to-free-up-ps5-storage-for-gta-6",
    tool: "general",
    primaryKeyword: "how to clear PS5 storage for GTA 6",
    formatType: "Actionable Step-by-Step Technical Guide",
    clickHook: "Detailed walkthrough on moving PS4 back catalog to cheap external USB drives, identifying bloated video capture files, and cloud backup checks.",
    sources: [
      { label: "PlayStation Support: Managing PS5 Console Storage", href: "https://www.playstation.com/support/hardware/ps5-manage-storage/" }
    ]
  },
  {
    topic: "PS5 Pro PSSR vs Native 4K: How GTA 6 Will Use AI Upscaling",
    slug: "ps5-pro-pssr-gta-6-ai-upscaling-explained",
    tool: "general",
    primaryKeyword: "PS5 Pro PSSR GTA 6 graphics",
    formatType: "Hardware Architecture Deep Dive",
    clickHook: "Explains why CPU limits make 60 FPS difficult for dense simulations, and how PSSR frees GPU overhead for ray-traced reflections.",
    sources: [
      { label: "Sony Interactive Entertainment PS5 Pro Tech Briefing", href: "https://blog.playstation.com" }
    ]
  },
  {
    topic: "Best M.2 NVMe SSDs for PS5 in 2026: Speed, Heatsinks and Value",
    slug: "best-ps5-ssd-nvme-2026-buyers-guide",
    tool: "general",
    primaryKeyword: "best PS5 SSD 2026",
    formatType: "Comparison & Decision Matrix",
    clickHook: "Benchmarks read speeds against Sony's 5,500 MB/s requirement and compares integrated heatsink clearance.",
    sources: [
      { label: "PlayStation Support: M.2 SSD Installation", href: "https://www.playstation.com/support/hardware/ps5-install-m2-ssd/" }
    ]
  },

  // --- Epic Games & Deals Tactical Guides ---
  {
    topic: "How to Play Epic Games Store Free Titles on Steam Deck (Heroic Setup Guide)",
    slug: "how-to-install-epic-games-steam-deck-heroic-guide",
    tool: "deals",
    primaryKeyword: "install Epic Games on Steam Deck Heroic",
    formatType: "Actionable Step-by-Step Technical Guide",
    clickHook: "Detailed Linux Desktop mode install, Heroic Games Launcher configuration, Proton GE selection, and adding games to Steam Gaming Mode.",
    sources: [
      { label: "Heroic Games Launcher Official Docs", href: "https://heroicgameslauncher.com" },
      { label: "Valve Steam Deck Proton Documentation", href: "https://store.steampowered.com/steamdeck" }
    ]
  },
  {
    topic: "Epic Games Store Cloud Saves vs Steam: How Cross-Progression Actually Works",
    slug: "epic-games-cloud-saves-vs-steam-cross-progression",
    tool: "deals",
    primaryKeyword: "Epic Games cloud saves vs Steam",
    formatType: "Comparison & Decision Matrix",
    clickHook: "Solves save file mismatch issues, explains how to manually locate %LOCALAPPDATA% save folders, and backup practices.",
    sources: [
      { label: "Epic Games Store Cloud Save Support", href: "https://www.epicgames.com/help" },
      { label: "PCGamingWiki Save Data Database", href: "https://www.pcgamingwiki.com" }
    ]
  },

  // --- Game Releases & Calendar Decision Guides ---
  {
    topic: "Q4 2026 Gaming Blockbusters: Schedule, Delays and What to Pre-Order",
    slug: "q4-2026-upcoming-game-releases-schedule",
    tool: "releases",
    primaryKeyword: "Q4 2026 game release calendar",
    formatType: "Launch Day Countdown & Preparation Checklist",
    clickHook: "Comprehensive chronological map of every major confirmed title competing around GTA 6's November launch window.",
    sources: [
      { label: "Video Games Chronicle Release Schedule", href: "https://www.videogameschronicle.com" }
    ]
  }
];
