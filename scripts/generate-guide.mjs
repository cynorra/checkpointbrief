// Automated High-Quality Article Generator for Checkpoint Brief
// Tailored for gaming, GTA 6, AdSense compliance, and ZERO-CLICK AI OVERVIEW RESISTANCE.
//
// Usage:
//   node scripts/generate-guide.mjs                                  # Picks next topic from zero-click bank
//   node scripts/generate-guide.mjs --topic "GTA 6 Weapons & Combat"  # Custom topic
//   node scripts/generate-guide.mjs --tool gta6                      # Category filter (gta6|releases|deals|general)
//   node scripts/generate-guide.mjs --dry-run                        # Preview without saving to disk
//
// Resilience: if a topic fails validation on every attempt, the next topic in the bank is tried
// (up to MAX_TOPICS_PER_RUN). Topics that keep failing across runs are recorded in
// scripts/lib/failed-topics.json and skipped, so one bad topic can never block the daily run.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import https from "node:https";
import { loadEnv } from "vite";
import { ZERO_CLICK_TOPIC_BANK } from "./lib/topic-bank.mjs";
import { validateGuide } from "./lib/guide-quality.mjs";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
const GEMINI_API_KEY = env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing from .env file!");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash";
const MAX_ATTEMPTS_PER_TOPIC = 3;
const MAX_TOPICS_PER_RUN = 4;
const MAX_FAILS_BEFORE_SKIP = 2;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const customTopicIdx = args.indexOf("--topic");
const customTopic = customTopicIdx !== -1 ? args[customTopicIdx + 1] : null;
const toolFilterIdx = args.indexOf("--tool");
const toolFilter = toolFilterIdx !== -1 ? args[toolFilterIdx + 1] : null;

const GUIDES_DIR = join(process.cwd(), "src", "content", "guides");
const FAILED_FILE = join(process.cwd(), "scripts", "lib", "failed-topics.json");
const existingFiles = existsSync(GUIDES_DIR) ? readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".md")) : [];
const existingSlugs = new Set(existingFiles.map((f) => f.replace(/\.md$/, "")));

// Read existing guides for internal linking context
const existingGuidesSummary = existingFiles.map((file) => {
  const content = readFileSync(join(GUIDES_DIR, file), "utf8");
  const title = content.match(/^title:\s*["']?([^"'\r\n]+)["']?/m)?.[1] || "";
  const date = content.match(/^published:\s*(\S+)/m)?.[1] || "";
  const isDraft = /^draft:\s*true/m.test(content);
  const tool = content.match(/^tool:\s*(\S+)/m)?.[1] || "";
  return {
    slug: file.replace(/\.md$/, ""),
    title,
    date,
    isDraft,
    tool,
    href: `/guides/${file.replace(/\.md$/, "")}/`
  };
});

function loadFailed() {
  try {
    return JSON.parse(readFileSync(FAILED_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveFailed(map) {
  if (dryRun) return;
  writeFileSync(FAILED_FILE, JSON.stringify(map, null, 2) + "\n", "utf8");
}

function getCandidateTopics() {
  if (customTopic) {
    const slug = customTopic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return [
      {
        topic: customTopic,
        slug,
        tool: toolFilter || "gta6",
        primaryKeyword: customTopic,
        formatType: "In-Depth Analysis & Guide",
        clickHook: "Provides high-value comparison and actionable steps beyond simple search snippets.",
        sources: [{ label: "Official Documentation / Press Releases", href: "https://www.rockstargames.com" }]
      }
    ];
  }

  const failed = loadFailed();
  const candidates = ZERO_CLICK_TOPIC_BANK.filter((t) => {
    if (existingSlugs.has(t.slug)) return false;
    if (toolFilter && t.tool !== toolFilter) return false;
    if ((failed[t.slug]?.count || 0) >= MAX_FAILS_BEFORE_SKIP) return false;
    return true;
  });

  if (candidates.length === 0) {
    throw new Error("No usable topics left in the zero-click topic bank (all written or repeatedly failing). Add topics to scripts/lib/topic-bank.mjs or clear scripts/lib/failed-topics.json.");
  }
  return candidates;
}

function getNextPublishDate() {
  const dates = existingGuidesSummary.filter((g) => !g.isDraft).map((g) => g.date).filter(Boolean).sort();
  const today = new Date().toISOString().slice(0, 10);
  if (!dates.length) return today;

  const latest = dates[dates.length - 1];
  if (latest < today) return today;

  const nextDate = new Date(`${latest}T12:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return nextDate.toISOString().slice(0, 10);
}

const FACT_CONTEXT = `- GTA 6 launches November 19, 2026 on PS5 & Xbox Series X|S, at midnight local time in every region (Rockstar Support, updated Nov 3, 2026). No PC version at launch.
- Digital pre-load opened Nov 10, 2026: PS5 at midnight local time in each time zone, Xbox Series X|S at 12 a.m. GMT (Rockstar Support). Physical copies reach retailers from Nov 12, 2026.
- Physical copies of GTA 6 do NOT include Blu-ray discs; they contain a digital download code in the box, usable as soon as it is received. No physical Ultimate Edition exists; the Ultimate Edition Upgrade is a digital add-on.
- Rockstar says the GTA 6 pre-load needs up to 212 GB of available space, depending on the device. Do not state any other GTA 6 file size as fact.
- Rely strictly on verified facts (Rockstar, Sony, Microsoft, Take-Two SEC filings, Epic Games).`;

function buildPrompts(topic, targetDate, feedback) {
  const relevantGuides = existingGuidesSummary
    .filter((g) => (g.tool === topic.tool || g.tool === "gta6") && g.date <= targetDate)
    .slice(-6);

  const internalLinksContext = relevantGuides.map((g) => `- "${g.title}": href="${g.href}"`).join("\n");

  const systemInstruction = `You are the lead gaming data analyst and hardware editor at Checkpoint Brief (https://checkpointbrief.com).

PRIMARY OBJECTIVE: BEAT ZERO-CLICK SEARCH & PREVENT SCALED/THIN CONTENT
AI Overviews steal traffic on simple questions by giving 1-sentence answers, and Google penalizes empty/templated "scaled content".
Your article MUST deliver rich, original, and deeply practical value:
1. Decision Matrices (e.g., Should you pay $20 more for Ultimate? Who specifically should buy it vs skip it).
2. Step-by-Step Actionable Technical Workflows (with exact console UI menu paths: Settings > ...).
3. Data Tables comparing benchmarks, platforms, bandwidth, or historical release dates.
4. "The Nuance Factor": Point out hidden caveats, asterisks, physical disc vs code-in-box traps, and prerequisite steps that casual players miss.

ANTI-THIN / ANTI-SCALED CONTENT MANDATES:
1. NO FILLER / ZERO FLUFF: Absolutely NO generic intro/outro fluff like "In the rapidly evolving world of gaming", "It remains to be seen", "Gaming is an art", or "In conclusion". Every sentence must convey a technical fact, actionable step, or concrete analysis.
2. BESPOKE HEADINGS ONLY: NEVER use generic template headers like "Overview", "Introduction", "Pros and Cons", or "Final Thoughts". Headings must be topic-specific and actionable (e.g., "Configuring Rest Mode for 7-Day Pre-Loads", "Why the 2.4GHz Wi-Fi Band Throttles Downloads").
3. ACCURACY & CONCRETE METRICS: Use real menu names, exact GB sizes, actual port speeds (Gbps, MB/s), and real error codes (e.g., CE-100005-6). If you are not certain of a specific figure, menu name or error code, describe it qualitatively or give an honest range instead of inventing it.
4. EDITORIAL VOICE: Objective, third-person technical authority. Zero first-person claims ("I tested", "we found"). No clickbait hype ("insane", "mind-blowing").

CONTEXT & ACCURACY:
${FACT_CONTEXT}

EDITORIAL QUALITY MANDATES:
1. NO CLICKBAIT: No "mind-blowing", "secret trick", "guaranteed", "you won't believe".
2. NO FIRST-PERSON FICTION: Do not write "I tested", "in my 10 years", "we discovered". Write with third-person journalistic authority.
3. NO INVENTED NUMBERS: No fake decimals like "87.3% of players". Use verified figures or honest round ranges.
4. OPENING SNIPPET (AEO TEASER):
   - The very first paragraph MUST start with **bold text** summarizing the core bottom-line answer in 40-50 words.
   - Immediately follow it with why the decision/nuance requires reading the full comparison matrix below.
5. MANDATORY COMPARISON TABLE & HEADINGS:
   - You MUST structure the article using at least 4 distinct '## Section Heading' markdown headers (e.g. ## Standard vs Ultimate Edition Comparison, ## What Each Edition Includes, ## Who Should Buy the Standard Edition, ## The Verdict: Is the Upgrade Worth It?).
6. STRICT ANTI-DUPLICATION & TEMPLATE DIVERSITY:
   - NEVER repeat or paraphrase any topic already written. Here are existing published titles to AVOID overlapping with:
   ${existingGuidesSummary.slice(-15).map((g) => `- "${g.title}"`).join("\n   ")}
   - NEVER use generic formula titles like "The Ultimate Guide to...", "Complete Guide to...", "Everything You Need to Know".
   - You MUST tailor the headings and structure specifically to this topic's Format Type ("${topic.formatType || "Actionable Guide"}"). Do NOT use cookie-cutter section headers.
7. INTERNAL LINKING:
   - Naturally integrate 1-2 relevant internal links to existing Checkpoint Brief pages from this list:
   ${internalLinksContext}
   - Reference site hubs where appropriate: [GTA 6 hub](/gta-6/), [GTA 6 countdown](/gta-6/countdown/), [Release date calendar](/release-dates/), [Free games tracker](/free-games/).
8. EXTERNAL CITATIONS:
   - Use direct Markdown links to official sources (Rockstar Games, PlayStation, Xbox, Epic Games). Only link to pages you are confident exist (support-site root pages are safer than guessed deep links).
9. WORD CHOICE: Never use the words "torrent", "cracked", "pirated", "keygen" or "warez" anywhere, even when warning readers. Say "unofficial downloads" or "unlicensed copies" instead. Never use the words "guaranteed" or "insane".

FORMAT REQUIRED:
Return ONLY valid raw Markdown with frontmatter:
---
title: "Crisp, keyword-focused title under 70 chars without year"
description: "High-CTR meta description between 80-160 chars explaining the exact decision or guide."
published: ${targetDate}
tool: ${topic.tool}
---
**Bold Teaser Answer paragraph...**

## First Main Section Header
Content...

## Second Main Section Header
<div class="table-wrap"><table>...</table></div>

## Third Main Section Header
Content...

## Official Sources and Verification
- **[Primary Authority]:** [Official Resource Title](https://...) – Context and verification details.
- **[Platform/Publisher Support]:** [Official Support or Store Listing](https://...) – Direct confirmation.
`;

  let userPrompt = `Write an in-depth, zero-click resistant guide for Checkpoint Brief:

Topic: "${topic.topic}"
Format Type: "${topic.formatType || "Comparison & Guide"}"
Strategic Hook: "${topic.clickHook || "Provide detailed actionable comparison"}"
Target Keyword: "${topic.primaryKeyword}"
Category (tool): "${topic.tool}"
Target Word Count: 800 - 1200 words (never below 700). Finish the article completely; do not stop mid-sentence.

Structure Requirements:
1. Opening bold AEO summary paragraph.
2. At least 3-4 separate sections starting with '## Section Name' (Markdown H2).
3. A complete comparison table wrapped in <div class="table-wrap"><table>...</table></div>.
4. Clear recommendations ("Who should pick what" / "Common pitfalls").
5. Concluding '## Official Sources and Verification' section linking to primary official sources (Rockstar, PlayStation, Xbox, Epic Games, Take-Two SEC).`;

  if (topic.sources?.length) {
    userPrompt += `\n\nPreferred source links for the sources section:\n${topic.sources.map((s) => `- ${s.label}: ${s.href}`).join("\n")}`;
  }

  if (feedback?.length) {
    userPrompt += `\n\nYOUR PREVIOUS DRAFT WAS REJECTED. Fix every one of these problems in the new draft:\n${feedback.map((f) => `- ${f}`).join("\n")}`;
  }

  return { systemInstruction, userPrompt };
}

function callGeminiAPI(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const options = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: `/v1beta/models/${MODEL}:generateContent`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        "x-goog-api-key": GEMINI_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode !== 200) {
            const apiErr = new Error(`Gemini API Error (${res.statusCode}): ${JSON.stringify(json.error || json)}`);
            apiErr.apiStatus = res.statusCode;
            return reject(apiErr);
          }
          const candidate = json.candidates?.[0];
          // Join every non-thinking text part (a single part is not guaranteed)
          const text = (candidate?.content?.parts || [])
            .filter((p) => !p.thought && typeof p.text === "string")
            .map((p) => p.text)
            .join("");
          if (!text) {
            return reject(new Error(`Empty response from Gemini API (finishReason: ${candidate?.finishReason || "unknown"})`));
          }
          resolve({ text, finishReason: candidate?.finishReason });
        } catch (e) {
          reject(new Error(`Failed to parse Gemini response: ${e.message}`));
        }
      });
    });

    req.setTimeout(120000, () => req.destroy(new Error("Gemini request timed out after 120s")));
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// Verify external links. A link is "broken" only on a definite 404/410 or a DNS failure;
// bot blocks (403/429), 5xx and timeouts are treated as unknown and the link is kept.
const SAFE_SOURCE_LINKS = [
  "https://www.playstation.com/en-us/support/",
  "https://www.rockstargames.com/",
  "https://support.xbox.com/",
  "https://blog.playstation.com/"
];

async function isBrokenUrl(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36" }
    });
    return res.status === 404 || res.status === 410;
  } catch (err) {
    const code = err?.cause?.code || err?.code;
    return code === "ENOTFOUND";
  }
}

async function findBrokenLinks(text) {
  const urls = [...new Set([...text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]))];
  const broken = [];
  for (const url of urls) {
    if (await isBrokenUrl(url)) broken.push(url);
  }
  return { urls, broken };
}

function stripLinks(text, brokenUrls) {
  let out = text;
  for (const url of brokenUrls) {
    const esc = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // "[https://x](https://x)" style labels disappear entirely, normal labels keep their text
    out = out.replace(new RegExp(`\\[https?://[^\\]]*\\]\\(${esc}\\)`, "g"), "");
    out = out.replace(new RegExp(`\\[([^\\]]+)\\]\\(${esc}\\)`, "g"), "$1");
  }
  return out;
}

// Second pass: an editor model checks the draft for invented specifics.
// Fails OPEN (returns ok) if the review call itself errors, so an API hiccup never blocks publishing.
async function editorialReview(fm, body) {
  const prompt = `You are the fact-checking editor of a gaming news site. Review the article below.

Known verified context:
${FACT_CONTEXT}

Flag ONLY clear, serious problems that would mislead a reader:
- A specific number, date, price, error code or menu path that is almost certainly invented or wrong.
- A rumor or speculation stated as confirmed fact (hedged wording such as "reportedly", "expected", "estimated" is acceptable and must NOT be flagged).
- A statement that directly contradicts the known verified context above.

Never flag any of the following:
- Style, tone, structure, wording or minor imprecision.
- Links, link targets, or the titles of other articles on the site.
- Anything consistent with the known verified context, including Rockstar's 212 GB pre-load figure and its Nov 10 pre-load, Nov 12 physical and midnight-local-time launch facts.
- General explanations of how consoles or services work.

For each problem give a severity: "high" only if the claim is clearly false or fabricated; otherwise "low". Low issues are ignored.

Return JSON only: {"issues":[{"claim":"short quote","reason":"why it is wrong","severity":"high"|"low"}]}.
Return {"issues":[]} when the article is acceptable.

TITLE: ${fm.title}

${body}`;

  try {
    const { text } = await callGeminiAPI({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 512 }
      }
    });
    const parsed = JSON.parse(text);
    const high = (Array.isArray(parsed.issues) ? parsed.issues : []).filter((i) => i && i.severity === "high");
    const issues = high.map((i) => `${i.claim}: ${i.reason}`);
    return { ok: issues.length === 0, issues };
  } catch (err) {
    console.warn(`[Editor Review] Skipped (non-blocking): ${err.message}`);
    return { ok: true, issues: [] };
  }
}

async function generateWithRetry(topic, targetDate, maxAttempts = MAX_ATTEMPTS_PER_TOPIC) {
  let feedback = [];
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[Gemini] Generating "${topic.slug}" (attempt ${attempt}/${maxAttempts})...`);
    try {
      const { systemInstruction, userPrompt } = buildPrompts(topic, targetDate, feedback);
      const { text: rawResponse, finishReason } = await callGeminiAPI({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 16000,
          // Cap hidden reasoning so it cannot eat the output budget and truncate the article
          thinkingConfig: { thinkingBudget: 1024 }
        }
      });

      if (finishReason && finishReason !== "STOP") {
        throw new Error(`Generation did not finish cleanly (finishReason: ${finishReason}); output is likely truncated.`);
      }

      const cleaned = rawResponse
        .replace(/^```markdown\s*/i, "")
        .replace(/^```md\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      const fmMatch = cleaned.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!fmMatch) {
        throw new Error("Generated content is missing frontmatter wrapper (---)!");
      }

      const fm = {};
      for (const line of fmMatch[1].split(/\r?\n/)) {
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
      }
      // Auto-trim description if model returned slightly above 165 chars
      if (fm.description && fm.description.length > 165) {
        fm.description = fm.description.slice(0, 160).replace(/\s+\S*$/, "") + ".";
      }
      // Auto-trim title if model returned slightly above 80 chars
      if (fm.title && fm.title.length > 80) {
        fm.title = fm.title.slice(0, 77).replace(/\s+\S*$/, "");
      }
      // Write trimmed values back: the saved file and Supabase use the content, not `fm`
      let finalContent = cleaned;
      for (const key of ["description", "title"]) {
        if (fm[key]) {
          finalContent = finalContent.replace(
            new RegExp(`^${key}:.*$`, "m"),
            () => `${key}: "${fm[key].replace(/"/g, '\\"')}"`
          );
        }
      }
      // Strip hallucinated internal guide links (they break the deploy link check)
      finalContent = finalContent.replace(
        /\[([^\]]+)\]\(\/guides\/([a-z0-9-]+)\/?\)/g,
        (m, text, slug) => (existingSlugs.has(slug) ? m : text)
      );
      let body = fmMatch[2].replace(/\r\n/g, "\n").trim();
      const validation = validateGuide(fm, body, { existingArticles: existingGuidesSummary });
      if (!validation.valid) {
        console.warn(`[Quality Reject] Guide failed validation:`);
        for (const err of validation.errors) console.warn(`  - ${err}`);
        console.warn(`[Rejected Body Snippet (first 300 chars)]:\n${body.slice(0, 300)}\n---`);
        feedback = validation.errors;
        lastError = new Error(`Validation failed: ${validation.errors.join(" | ")}`);
        continue;
      }

      if (validation.warnings.length > 0) {
        console.log(`[Quality Notices]:`);
        for (const warn of validation.warnings) console.log(`  * ${warn}`);
      }

      // Drop links that 404 (models guess deep URLs), then make sure real sources remain
      const { urls: externalUrls, broken } = await findBrokenLinks(finalContent);
      if (broken.length) {
        console.warn(`[Link Check] Removing ${broken.length} broken link(s):`);
        for (const b of broken) console.warn(`  - ${b}`);
        finalContent = stripLinks(finalContent, broken);
        body = stripLinks(body, broken);
      }
      if (externalUrls.length - broken.length < 1) {
        feedback = [`All external source links were invalid. Cite only real pages such as: ${SAFE_SOURCE_LINKS.join(", ")}`];
        lastError = new Error("No working external source links");
        console.warn(`[Link Check] No working external source links left; retrying.`);
        continue;
      }

      const review = await editorialReview(fm, body);
      if (!review.ok) {
        console.warn(`[Editor Reject] Fact-check review flagged problems:`);
        for (const issue of review.issues) console.warn(`  - ${issue}`);
        feedback = review.issues.map((i) => `Editor flagged: ${i} (remove it or replace it with a verifiable statement)`);
        lastError = new Error(`Editor review failed: ${review.issues.join(" | ")}`);
        continue;
      }

      console.log(`[Success] Guide passed all quality checks (${validation.wordCount} words).`);
      return { frontmatter: fm, body, fullContent: finalContent };
    } catch (err) {
      console.error(`[Attempt ${attempt} Failed]:`, err.message);
      // Quota exhausted: retrying or trying other topics cannot help. Stop the whole run.
      if (err.apiStatus === 429) {
        err.fatalQuota = true;
        throw err;
      }
      lastError = err;
      feedback = [err.message];
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 4000));
    }
  }
  throw lastError || new Error("Generation failed");
}

async function main() {
  const candidates = getCandidateTopics();
  const targetDate = getNextPublishDate();
  const failed = loadFailed();
  const tried = [];
  let result = null;
  let topic = null;

  for (const candidate of candidates.slice(0, MAX_TOPICS_PER_RUN)) {
    console.log(`\n==================================================`);
    console.log(`Zero-Click Resistant Guide: "${candidate.topic}"`);
    console.log(`Format Strategy: ${candidate.formatType || "Actionable Guide"}`);
    console.log(`Click Hook: ${candidate.clickHook || "Detailed matrix and walkthrough"}`);
    console.log(`Slug: ${candidate.slug}`);
    console.log(`Target Tool: ${candidate.tool}`);
    console.log(`Scheduled Date: ${targetDate}`);
    console.log(`==================================================\n`);

    try {
      result = await generateWithRetry(candidate, targetDate);
      topic = candidate;
      delete failed[candidate.slug];
      break;
    } catch (err) {
      tried.push(candidate.slug);
      if (err.fatalQuota) {
        saveFailed(failed);
        throw new Error(`Gemini quota exhausted (429). Stopped without recording topic failures. ${err.message.slice(0, 200)}`);
      }
      // API-side trouble (overload, network) says nothing about the topic: do not count it against it.
      const apiSide = Boolean(err.apiStatus) || /timed out|ECONN|ENOTFOUND|fetch failed|Empty response|did not finish cleanly/i.test(err.message);
      if (apiSide) {
        console.warn(`[Topic Skipped] "${candidate.slug}" hit an API/network error, not recorded as a topic failure.`);
        continue;
      }
      failed[candidate.slug] = {
        count: (failed[candidate.slug]?.count || 0) + 1,
        lastError: String(err.message).slice(0, 300),
        lastDate: new Date().toISOString().slice(0, 10)
      };
      console.warn(`[Topic Failed] "${candidate.slug}" could not be generated. Moving to the next topic.\n`);
      if (customTopic) break;
    }
  }

  saveFailed(failed);

  if (!result) {
    throw new Error(`All ${tried.length} attempted topics failed (${tried.join(", ")}). Nothing published.`);
  }

  const targetFile = join(GUIDES_DIR, `${topic.slug}.md`);

  if (dryRun) {
    console.log(`\n[DRY RUN] Guide preview for: ${targetFile}\n`);
    console.log(result.fullContent.slice(0, 800) + "\n...\n");
    console.log(`[DRY RUN] Complete. No files written.`);
    return;
  }

  writeFileSync(targetFile, result.fullContent + "\n", "utf8");
  console.log(`\nFile saved successfully to:\n  ${targetFile}`);

  // Automatically refresh release dates calendar alongside blog generation
  try {
    const { updateReleases } = await import("./update-releases.mjs");
    await updateReleases();
  } catch (err) {
    console.warn("[releases] Non-blocking update-releases error:", err.message);
  }

  if (args.includes("--publish")) {
    console.log(`\nPushing ${topic.slug} to Supabase...`);
    const { execSync } = await import("node:child_process");
    execSync(`node scripts/push-guides.mjs ${topic.slug}`, { stdio: "inherit" });
  } else {
    console.log(`\nNext steps:`);
    console.log(`1. Review the file: src/content/guides/${topic.slug}.md`);
    console.log(`2. Push to Supabase when ready: npm run push-guides`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
