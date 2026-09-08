"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content/site";

const SLIDES = [
  "from-black via-zinc-900 to-orange-950",
  "from-black via-neutral-900 to-zinc-800",
  "from-zinc-950 via-black to-orange-900/40",
  "from-black via-stone-950 to-amber-950/50",
];

export function Hero({
  memberCount,
  eventCount,
  placementCount,
}: {
  memberCount: number;
  eventCount: number;
  placementCount: number;
}) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  const stats = [
    { value: `${memberCount}+`, label: "Active Members" },
    { value: `${eventCount}`, label: "Competition Events" },
    { value: `${placementCount}+`, label: "Placements" },
    { value: "5+", label: "Years Active" },
  ];

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-black">
      {SLIDES.map((bg, i) => (
        <div
          key={bg}
          className={`absolute inset-0 bg-linear-to-br ${bg} transition-opacity duration-1000 ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-medium tracking-[0.28em] text-white/70 uppercase">{SITE.school}</p>
        <h1 className="mt-4 font-heading text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          Science Olympiad
        </h1>
        <p className="mt-5 text-sm font-medium text-brand-orange sm:text-base">🏆 {SITE.heroBadge}</p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{SITE.tagline}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="bg-brand-orange text-white hover:bg-brand-orange-dark" render={<Link href="/about" />}>
            Learn More
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/25 bg-white/5 text-white hover:bg-white/10"
            render={<Link href="/contact" />}
          >
            Contact Us
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs tracking-wide text-white/50 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Hero slides">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-label={`Slide ${i + 1}`}
            aria-selected={i === slide}
            onClick={() => setSlide(i)}
            className={`size-2.5 rounded-full transition-colors ${i === slide ? "bg-brand-orange" : "bg-white/35"}`}
          />
        ))}
      </div>
    </section>
  );
}
