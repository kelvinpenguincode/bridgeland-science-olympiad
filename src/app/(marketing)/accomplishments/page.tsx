import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { INVITATIONALS, STATE_RESULTS } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Accomplishments",
  description: "Bridgeland Science Olympiad's state, regional, and invitational track record.",
};

function MedalRow({ medals }: { medals: readonly string[] }) {
  if (medals.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {medals.map((medal) => (
        <span key={medal} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
          {medal}
        </span>
      ))}
    </div>
  );
}

export default function AccomplishmentsPage() {
  return (
    <>
      <PageHeader eyebrow="Our Track Record" title="Accomplishments" />

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">Rising Through the Ranks</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">Texas State Competition</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Our steady climb at the Texas Science Olympiad State Tournament showcases our team&apos;s
            dedication and growth year after year.
          </p>
          <div className="mt-8 space-y-5">
            {STATE_RESULTS.map((row) => (
              <article key={row.year} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-brand-orange">{row.year}</p>
                <h3 className="mt-1 font-heading text-2xl font-bold text-white">{row.title}</h3>
                <p className="text-xs tracking-wide text-white/45 uppercase">{row.field}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{row.body}</p>
                <MedalRow medals={row.medals} />
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">Dominating Locally</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">Regional &amp; District</h2>
          <article className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium text-brand-orange">🏅 5-Year Streak · Since 2022</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-white">1st Place — Regional &amp; District</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Since 2022, Bridgeland has won 1st place at both the Regional and District Science Olympiad
              tournaments every single year — a five-year streak of dominance that continues to grow. Our
              team consistently sweeps individual events, earning the top spot across all areas of
              competition.
            </p>
          </article>
        </section>

        <section>
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">Beyond Texas</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">Invitational Highlights</h2>
          <div className="mt-8 space-y-5">
            {INVITATIONALS.map((row) => (
              <article key={row.eyebrow} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-medium tracking-wide text-brand-orange uppercase">{row.eyebrow}</p>
                <h3 className="mt-2 font-heading text-xl font-bold text-white">{row.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{row.body}</p>
                <MedalRow medals={row.medals} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
