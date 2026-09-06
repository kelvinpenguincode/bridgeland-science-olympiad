import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CalendarView } from "@/components/calendar/calendar-view";
import { listCalendarEvents } from "@/lib/data/calendar";

export const metadata: Metadata = {
  title: "Calendar | Bridgeland Science Olympiad",
  description: "Meetings, practices, deadlines, and competitions on the Bridgeland Science Olympiad calendar.",
};

export const revalidate = 30;

export default async function CalendarPage() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 4, 1);
  const events = await listCalendarEvents({ from, to });

  return (
    <>
      <PageHeader
        eyebrow="Stay Organized"
        title="Team Calendar"
        description="Every meeting, practice, deadline, and competition in one place. Switch views, filter by category, and add events straight to Google Calendar."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CalendarView events={events} />
      </div>
    </>
  );
}
