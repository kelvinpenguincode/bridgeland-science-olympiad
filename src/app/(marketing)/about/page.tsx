import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ABOUT_CARDS, SITE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description: SITE.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Who We Are" title="About Us" description={SITE.tagline} />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid gap-5 md:grid-cols-3">
          {ABOUT_CARDS.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-3xl" aria-hidden="true">
                {card.emoji}
              </p>
              <h2 className="mt-4 font-heading text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{card.body}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-6 border-y border-white/10 py-10 sm:grid-cols-4">
          {[
            { value: "0+", label: "Active Members" },
            { value: "23", label: "Competition Events" },
            { value: "0+", label: "Placements" },
            { value: "5+", label: "Years Active" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs tracking-wide text-white/50 uppercase">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center sm:px-10">
          <h2 className="font-heading text-2xl font-bold text-white">Curious about joining?</h2>
          <p className="mt-2 text-sm text-white/60">{SITE.joinLine}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/team" />} className="bg-brand-orange text-white hover:bg-brand-orange-dark">
              Meet the Team
            </Button>
            <Button
              variant="outline"
              render={<Link href="/contact" />}
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
