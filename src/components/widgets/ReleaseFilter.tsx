import * as React from "react";
import { Segmented } from "@/components/motion/segmented";

type Item = { date: string; title: string; platforms: string[]; note?: string; big?: boolean; href?: string; day: string };
type Group = { ym: string; label: string; items: Item[] };

const FILTERS = [
  { value: "all", label: "All" },
  { value: "PS5", label: "PS5" },
  { value: "Xbox Series X|S", label: "Xbox" },
  { value: "PC", label: "PC" },
  { value: "Switch 2", label: "Switch 2" },
];

/** The release calendar with a platform filter. Server-rendered with "All". */
export default function ReleaseFilter({ groups }: { groups: Group[] }) {
  const [f, setF] = React.useState("all");
  const shown = groups
    .map((g) => ({ ...g, items: g.items.filter((r) => f === "all" || r.platforms.includes(f)) }))
    .filter((g) => g.items.length > 0);
  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <span id="rf-label" className="text-sm font-medium">Platform</span>
        <Segmented value={f} onChange={setF} labelledBy="rf-label" options={FILTERS} />
      </div>
      {shown.map((g) => (
        <section key={g.ym} aria-labelledby={`m-${g.ym}`}>
          <h2 id={`m-${g.ym}`} className="font-display text-2xl font-extrabold">{g.label}</h2>
          <ul className="mt-4 divide-y rounded-xl border bg-card">
            {g.items.map((r) => (
              <li key={r.date + r.title} data-release className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-center">
                <time dateTime={r.date} className="num text-muted-foreground text-sm">{r.day}</time>
                <span className="min-w-0">
                  {r.href ? <a href={r.href} className="font-semibold">{r.title}</a> : <span className="font-semibold">{r.title}</span>}
                  {r.big && <span className="bg-brand-soft text-brand ml-2 rounded px-1.5 py-0.5 text-xs font-semibold">Big release</span>}
                  {r.note && <span className="text-muted-foreground block text-xs">{r.note}</span>}
                </span>
                <span className="text-muted-foreground col-start-2 text-xs sm:col-start-3 sm:text-right">{r.platforms.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {shown.length === 0 && <p className="text-muted-foreground">No dated releases for this platform in the calendar yet.</p>}
    </div>
  );
}
