import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, AUTHOR } from "../site.config.js";
import { TOPICS } from "../lib/topics.js";
import { FACTS, RELEASE_DATE, UPDATED } from "../lib/data/gta6.js";

// A plain-text map of the site for AI assistants and answer engines (llmstxt.org).
export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, SITE.url).href;
  const guides = (await getCollection("guides", (g) => !g.data.draft)).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );
  const body = `# ${SITE.name}

> ${SITE.description} Written by ${AUTHOR.name}. Independent; not affiliated with any publisher.

## Sections

${TOPICS.map((t) => `- [${t.name}](${u(t.href)}): ${t.blurb}`).join("\n")}
- [GTA 6 countdown](${u("/gta-6/countdown/")}): days, hours and minutes until ${RELEASE_DATE}.

## GTA 6 confirmed facts (checked ${UPDATED})

${FACTS.map((f: any) => `- ${f.label}: ${f.value}`).join("\n")}

## Guides

${guides.map((g) => `- [${g.data.title}](${u(`/guides/${g.id}/`)}): ${g.data.description}`).join("\n")}

## About

- [How we verify](${u("/how-we-verify/")}): what counts as confirmed and where each fact comes from.
- [Editorial policy](${u("/editorial-policy/")})
- [About](${u("/about/")}) · [Author](${u(`/author/${AUTHOR.slug}/`)}) · [Contact](${u("/contact/")})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
