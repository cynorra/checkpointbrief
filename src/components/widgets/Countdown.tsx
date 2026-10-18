import * as React from "react";
import { countdownParts } from "@/lib/data/gta6.js";
import { cn } from "@/lib/utils";

/**
 * Live countdown to local midnight on `date` (YYYY-MM-DD) in the viewer's
 * time zone. The server renders the build-time values so the HTML already
 * shows a real number; the browser takes over after hydration.
 */
export default function Countdown({ date, label, compact = false, initial }: { date: string; label: string; compact?: boolean; initial: { days: number; hours: number; minutes: number; seconds: number; done: boolean } }) {
  const [p, setP] = React.useState(initial);
  React.useEffect(() => {
    const tick = () => setP(countdownParts(date));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [date]);

  if (p.done) {
    return <p className="font-display text-brand text-3xl font-extrabold">{label} is out now.</p>;
  }
  const cells: [number, string][] = [
    [p.days, p.days === 1 ? "day" : "days"],
    [p.hours, "hours"],
    [p.minutes, "min"],
    [p.seconds, "sec"],
  ];
  return (
    <div>
      <p className="sr-only">
        {p.days} days and {p.hours} hours until {label}.
      </p>
      <div className={cn("grid grid-cols-4 gap-2 sm:gap-3", compact ? "max-w-sm" : "max-w-2xl")} aria-hidden="true">
        {cells.map(([n, u], i) => (
          <div key={u} className={cn("bg-card rounded-lg border text-center", compact ? "px-2 py-3" : "px-3 py-5", i === 0 && "border-brand/50")}>
            <span data-cell={u === "sec" ? "seconds" : u} className={cn("num block font-semibold tabular-nums", compact ? "text-3xl" : "text-4xl md:text-6xl", i === 0 && "text-brand")}>
              {String(n).padStart(i === 0 ? 1 : 2, "0")}
            </span>
            <span className="text-muted-foreground mt-1 block text-xs tracking-wider uppercase">{u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
