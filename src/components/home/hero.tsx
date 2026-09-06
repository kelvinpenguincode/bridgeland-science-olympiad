import Link from "next/link";
import { ArrowRight, FlaskConical, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-[32rem] rounded-full bg-brand-orange/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-32 size-96 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Decorative orbital emblem */}
      <div
        className="pointer-events-none absolute top-1/2 right-[-6rem] hidden -translate-y-1/2 opacity-90 sm:right-[-3rem] lg:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="size-[26rem] animate-[spin_60s_linear_infinite]" fill="none">
          <circle cx="200" cy="200" r="6" fill="#F97316" />
          <ellipse cx="200" cy="200" rx="180" ry="70" stroke="#F97316" strokeOpacity="0.55" strokeWidth="1.5" />
          <ellipse
            cx="200"
            cy="200"
            rx="180"
            ry="70"
            stroke="#38BDF8"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            transform="rotate(60 200 200)"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="180"
            ry="70"
            stroke="#F8FAFC"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            transform="rotate(120 200 200)"
          />
          <circle cx="380" cy="200" r="5" fill="#38BDF8" />
          <circle cx="110" cy="83" r="4" fill="#F97316" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-orange-300 uppercase">
            <FlaskConical className="size-3.5" aria-hidden="true" />
            Bridgeland High School &middot; Cypress, TX
          </p>
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            BRIDGELAND
            <br />
            <span className="text-brand-orange">SCIENCE OLYMPIAD</span>
          </h1>
          <p className="mt-6 text-xl font-medium text-slate-300">Compete. Discover. Innovate.</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            23 events. One team of Bears. From Anatomy & Physiology to Wright Stuff, we build,
            study, and compete together all season long.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-brand-orange text-white hover:bg-brand-orange-dark"
              render={<Link href="/events" />}
            >
              Explore Events
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
              render={<Link href="/contact" />}
            >
              Join the Team
            </Button>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase">
                <FlaskConical className="size-3.5 text-brand-orange" />
                Events
              </dt>
              <dd className="mt-1 font-heading text-2xl font-bold text-white">23</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase">
                <Users className="size-3.5 text-brand-orange" />
                Members
              </dt>
              <dd className="mt-1 font-heading text-2xl font-bold text-white">40+</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase">
                <Trophy className="size-3.5 text-brand-orange" />
                Seasons
              </dt>
              <dd className="mt-1 font-heading text-2xl font-bold text-white">6</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
