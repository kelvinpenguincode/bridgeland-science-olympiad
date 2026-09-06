import type { Metadata } from "next";
import Link from "next/link";
import { Beaker, GraduationCap, Handshake, Rocket, Target, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | Bridgeland Science Olympiad",
  description: "Learn about Bridgeland Science Olympiad's mission, structure, and what it's like to compete.",
};

const VALUES = [
  {
    icon: Beaker,
    title: "Hands-On Science",
    description: "From building a hovercraft to running a chemistry lab, members learn by doing — not just studying for a test.",
  },
  {
    icon: Trophy,
    title: "Competitive Spirit",
    description: "We train seriously for invitationals, regionals, and state, and we celebrate every medal our Bears bring home.",
  },
  {
    icon: Handshake,
    title: "Mentorship",
    description: "Officers and event captains coach newer members one-on-one, turning first-time competitors into event experts.",
  },
  {
    icon: GraduationCap,
    title: "Open to Everyone",
    description: "No prior science or engineering experience required — just curiosity and a willingness to learn.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title="About Bridgeland Science Olympiad"
        description="A student-led, teacher-sponsored STEM competition team at Bridgeland High School in Cypress, Texas."
      />

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">Our Mission</p>
            <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              Compete. Discover. Innovate.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Science Olympiad is a national STEM competition spanning 23 events across life science,
              earth &amp; space science, physical science &amp; chemistry, technology &amp; engineering,
              and inquiry &amp; nature of science. Teams of students study, build devices, and take exams
              head-to-head against schools across the region and state.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Bridgeland Science Olympiad brings that competition to the Bears. We&apos;re run entirely by
              student officers and event captains, supported by our faculty coaches, with one goal:
              give every Bridgeland student who&apos;s curious about STEM a place to build real skills and
              compete at a high level.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: "Founded", value: "2023" },
              { icon: Rocket, label: "Division", value: "C (9–12)" },
              { icon: Beaker, label: "Events", value: "23" },
              { icon: Trophy, label: "Region", value: "Region 5, TX" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-white p-5">
                <stat.icon className="size-5 text-brand-orange" aria-hidden="true" />
                <p className="mt-3 font-heading text-xl font-bold text-brand-navy">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">What We Value</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
                  <v.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold text-brand-navy">{v.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">How the Team Is Organized</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              <strong className="font-semibold text-brand-navy">Officers</strong> run day-to-day team
              operations — recruitment, meetings, communications, and logistics for tournaments.
            </p>
            <p>
              <strong className="font-semibold text-brand-navy">Event Captains</strong> are experienced
              competitors who lead practices, curate resources, and mentor teammates for one or two
              specific events.
            </p>
            <p>
              <strong className="font-semibold text-brand-navy">Coaches &amp; Sponsors</strong> are
              Bridgeland faculty who supervise the team, approve travel, and support officers with
              guidance and resources.
            </p>
            <p>
              New members go through <strong className="font-semibold text-brand-navy">placement
              testing</strong> each season to help identify which events best fit their strengths —
              then get assigned to a competition team (e.g. Varsity A, Varsity B, JV A) alongside a
              partner for most events.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-brand-navy px-6 py-10 text-center text-white sm:px-10">
          <h2 className="font-heading text-2xl font-bold">Curious about joining?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Meet the team, browse events, or reach out with questions.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/team" />} className="bg-brand-orange text-white hover:bg-brand-orange-dark">
              Meet the Team
            </Button>
            <Button variant="outline" render={<Link href="/contact" />} className="border-white/30 bg-transparent text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
