import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MeetingCard } from "@/components/shared/meeting-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getMeetingAttachments, getMeetingEvents, getNextMeeting, listPastMeetings } from "@/lib/data/meetings";

export const metadata: Metadata = {
  title: "Meetings | Bridgeland Science Olympiad",
  description: "Next general meeting details and the full meeting archive.",
};

export const revalidate = 30;

export default async function MeetingsPage() {
  const [nextMeeting, pastMeetings] = await Promise.all([getNextMeeting(), listPastMeetings(20)]);

  const [nextMeetingEvents, pastMeetingsData] = await Promise.all([
    nextMeeting ? getMeetingEvents(nextMeeting.id) : Promise.resolve([]),
    Promise.all(
      pastMeetings.map(async (m) => ({
        meeting: m,
        events: await getMeetingEvents(m.id),
        attachments: await getMeetingAttachments(m.id),
      }))
    ),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Team Meetings"
        title="Meetings"
        description="Weekly general meetings keep the team on track — see what's happening next and browse notes, slides, and agendas from past meetings."
      />
      <div className="mx-auto max-w-4xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-brand-orange-dark uppercase">
            Next Meeting
          </h2>
          {nextMeeting ? (
            <MeetingCard
              meeting={nextMeeting}
              events={(nextMeetingEvents as { id: string; name: string; slug: string; icon: string }[]).map((e) => ({
                id: e.id,
                name: e.name,
              }))}
              highlight
            />
          ) : (
            <EmptyState icon={CalendarClock} title="No upcoming meeting scheduled" description="Check back soon for the next meeting date." />
          )}
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Meeting Archive
          </h2>
          {pastMeetingsData.length === 0 ? (
            <EmptyState title="No past meetings yet" />
          ) : (
            <div className="space-y-4">
              {pastMeetingsData.map(({ meeting, events, attachments }) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  events={(events as { id: string; name: string; slug: string; icon: string }[]).map((e) => ({
                    id: e.id,
                    name: e.name,
                  }))}
                  attachments={attachments}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
