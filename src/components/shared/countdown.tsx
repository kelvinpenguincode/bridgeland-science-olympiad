"use client";

import { useEffect, useState } from "react";

function getParts(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

/** Live-ticking countdown to a target ISO date/time. */
export function Countdown({ target, className }: { target: string; className?: string }) {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState(() => getParts(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (parts.done) {
    return <p className={className}>Happening now!</p>;
  }

  const units = [
    { label: "Days", value: parts.days },
    { label: "Hrs", value: parts.hours },
    { label: "Min", value: parts.minutes },
    { label: "Sec", value: parts.seconds },
  ];

  return (
    <div className={className} role="timer" aria-live="off">
      <div className="flex gap-3">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <span className="font-heading text-2xl font-bold tabular-nums text-brand-navy">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              {u.label}
            </span>
          </div>
        ))}
      </div>
      <span className="sr-only">
        {parts.days} days {parts.hours} hours {parts.minutes} minutes {parts.seconds} seconds remaining
      </span>
    </div>
  );
}
