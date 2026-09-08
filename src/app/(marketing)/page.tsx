import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Hero } from "@/components/home/hero";
import {
  LatestAnnouncementCard,
  NextCompetitionCard,
  NextMeetingCard,
  PlacementStatusCard,
} from "@/components/home/info-cards";
import { UpcomingTimeline } from "@/components/home/upcoming-timeline";
import { AnnouncementCard } from "@/components/shared/announcement-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { getNextMeeting } from "@/lib/data/meetings";
import { getNextCompetition } from "@/lib/data/competitions";
import { getLatestAnnouncement, listAnnouncements } from "@/lib/data/announcements";
import { listPublicPlacementTests } from "@/lib/data/placement";
import { listUpcomingCalendarEvents } from "@/lib/data/calendar";
import { listEvents } from "@/lib/data/events";
import { listResults } from "@/lib/data/results";
import { createClient } from "@/lib/supabase/server";
import { HOME_ABOUT_CARDS, HOME_HIGHLIGHTS, SITE } from "@/lib/content/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const [
    nextMeeting,
    nextCompetition,
    latestAnnouncement,
    placementTests,
    upcomingCalendarEvents,
    announcements,
    events,
    results,
    memberCountResult,
  ] = await Promise.all([
    getNextMeeting(),
    getNextCompetition(),
    getLatestAnnouncement(),
    listPublicPlacementTests(),
    listUpcomingCalendarEvents(5),
    listAnnouncements(4),
    listEvents(),
    listResults(),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const releasedCount = placementTests.filter((t) => t.results_released).length;
  const medalCount = results.filter((r) => r.medal && r.medal !== "none").length;

  return (
    <>
      <Hero
        memberCount={memberCountResult.count ?? 0}
        eventCount={events.length}
        placementCount={medalCount}
      />

      <section className="border-y border-white/10 bg-black/40 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NextMeetingCard meeting={nextMeeting} />
            <NextCompetitionCard competition={nextCompetition} />
            <LatestAnnouncementCard announcement={latestAnnouncement} />
            <PlacementStatusCard releasedCount={releasedCount} totalCount={placementTests.length} />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">Why Bridgeland SciOly</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">Built for Curious Minds</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {HOME_ABOUT_CARDS.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <p className="text-3xl" aria-hidden="true">
                  {card.emoji}
                </p>
                <h3 className="mt-4 font-heading text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" render={<Link href="/about" />}>
              Learn more about us
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">Track Record</p>
          <h2 className="mt-3 text-center font-heading text-3xl font-bold text-white sm:text-4xl">Recent Highlights</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {HOME_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-medium tracking-wide text-brand-orange uppercase">{item.eyebrow}</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" render={<Link href="/accomplishments" />}>
              View All Accomplishments
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">What&apos;s Next</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white">Upcoming on the Team Calendar</h2>
          <div className="mt-8">
            <UpcomingTimeline items={upcomingCalendarEvents} />
          </div>
        </div>
      </section>

      <section id="announcements" className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">Stay in the Loop</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white">Latest Announcements</h2>
          <div className="mt-8 space-y-3">
            {announcements.length === 0 ? (
              <EmptyState icon={Megaphone} title="No announcements yet" description="Officers and admins can post from the admin panel." />
            ) : (
              announcements.map((a) => <AnnouncementCard key={a.id} announcement={a} />)
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-linear-to-b from-orange-950/40 to-black py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Ready to Join the Team?</h2>
          <p className="mt-4 text-base text-white/65">{SITE.joinLine}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-brand-orange text-white hover:bg-brand-orange-dark" render={<Link href="/contact" />}>
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white/10"
              render={<Link href="/accomplishments" />}
            >
              See Our Wins
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
