import { Award, FlaskConical, Target, Users } from "lucide-react";
import { Hero } from "@/components/home/hero";
import {
  LatestAnnouncementCard,
  NextCompetitionCard,
  NextMeetingCard,
  PlacementStatusCard,
} from "@/components/home/info-cards";
import { SectionHeading } from "@/components/home/section-heading";
import { UpcomingTimeline } from "@/components/home/upcoming-timeline";
import { RecentResults } from "@/components/home/recent-results";
import { CtaSection } from "@/components/home/cta-section";
import { EventCard } from "@/components/shared/event-card";
import { AnnouncementCard } from "@/components/shared/announcement-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getNextMeeting } from "@/lib/data/meetings";
import { getNextCompetition } from "@/lib/data/competitions";
import { getLatestAnnouncement, listAnnouncements } from "@/lib/data/announcements";
import { listPublicPlacementTests } from "@/lib/data/placement";
import { listUpcomingCalendarEvents } from "@/lib/data/calendar";
import { listResults } from "@/lib/data/results";
import { listEvents } from "@/lib/data/events";
import { Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    nextMeeting,
    nextCompetition,
    latestAnnouncement,
    placementTests,
    upcomingCalendarEvents,
    results,
    events,
    announcements,
  ] = await Promise.all([
    getNextMeeting(),
    getNextCompetition(),
    getLatestAnnouncement(),
    listPublicPlacementTests(),
    listUpcomingCalendarEvents(5),
    listResults(),
    listEvents(),
    listAnnouncements(4),
  ]);

  const releasedCount = placementTests.filter((t) => t.results_released).length;
  const featuredEvents = events.slice(0, 6);

  return (
    <>
      <Hero />

      {/* Quick-glance info cards */}
      <section className="border-b border-border bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NextMeetingCard meeting={nextMeeting} />
            <NextCompetitionCard competition={nextCompetition} />
            <LatestAnnouncementCard announcement={latestAnnouncement} />
            <PlacementStatusCard releasedCount={releasedCount} totalCount={placementTests.length} />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">
              About the Team
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              STEM competition, Bridgeland style
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Bridgeland Science Olympiad is a student-led, teacher-sponsored competitive STEM
              organization at Bridgeland High School in Cypress, TX. Every season, our Bears study,
              build, and test across all 23 Division C events — from biology and chemistry to
              engineering and codebreaking — and travel to invitationals, regionals, and (we hope!)
              state.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              We&apos;re open to any Bridgeland student curious about science and engineering —
              no experience required. Officers, event captains, and coaches help every member find
              the right event and build real competition skills.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 self-start">
            {[
              { icon: FlaskConical, label: "Division C Events", value: "23" },
              { icon: Users, label: "Active Members", value: "40+" },
              { icon: Award, label: "Medals Last Season", value: "12+" },
              { icon: Target, label: "Tournaments a Year", value: "3–4" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-white p-5">
                <stat.icon className="size-5 text-brand-orange" aria-hidden="true" />
                <p className="mt-3 font-heading text-2xl font-bold text-brand-navy">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming timeline */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's Next"
            title="Upcoming on the Team Calendar"
            description="Meetings, practices, deadlines, and competitions — all in one place."
            viewAllHref="/calendar"
            viewAllLabel="Open full calendar"
          />
          <div className="mt-8">
            <UpcomingTimeline items={upcomingCalendarEvents} />
          </div>
        </div>
      </section>

      {/* Recent results */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Achievements"
            title="Recent Results"
            description="A snapshot of our latest medals and podium finishes."
            viewAllHref="/results"
            viewAllLabel="Full results & history"
          />
          <div className="mt-8">
            <RecentResults results={results} />
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Division C &middot; 2027"
            title="Featured Science Olympiad Events"
            description="A sample of the 23 events our Bears compete in this season."
            viewAllHref="/events"
            viewAllLabel="Browse all 23 events"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest announcements */}
      <section id="announcements" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Stay in the Loop" title="Latest Announcements" />
          <div className="mt-8 space-y-3">
            {announcements.length === 0 ? (
              <EmptyState icon={Megaphone} title="No announcements yet" />
            ) : (
              announcements.map((a) => <AnnouncementCard key={a.id} announcement={a} />)
            )}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
