import type { APIRoute } from "astro";
import { SITE } from "../site.config.js";

// Authorized sellers file for AdSense. Empty until the publisher ID is set.
export const GET: APIRoute = () => {
  const id = SITE.adsensePublisherId.replace(/^ca-/, "");
  const body = id ? `google.com, ${id}, DIRECT, f08c47fec0942fa0\n` : "# Ads not enabled yet.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
