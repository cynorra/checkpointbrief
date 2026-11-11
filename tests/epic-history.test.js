import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("epic history rows are well formed and unique", () => {
  const h = JSON.parse(readFileSync(new URL("../src/lib/data/epic-history.json", import.meta.url), "utf8"));
  const seen = new Set();
  for (const r of h) {
    assert.ok(r.title && r.start && r.end, "title/start/end required");
    assert.ok(new Date(r.end) > new Date(r.start), `${r.title}: end after start`);
    const k = `${r.title}|${r.start}`;
    assert.ok(!seen.has(k), `duplicate ${k}`);
    seen.add(k);
  }
});
