import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EventsExplorer } from "@/components/events/events-explorer";
import { listEvents } from "@/lib/data/events";

export const metadata: Metadata = {
  title: "Events | Bridgeland Science Olympiad",
  description: "All 23 Division C Science Olympiad events Bridgeland competes in this season.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await listEvents();

  return (
    <>
      <PageHeader
        eyebrow="Division C · 2027 Season"
        title="Science Olympiad Events"
        description="Browse all 23 events our Bears compete in — from life science to codebreaking. Search or filter by category, then open an event page for rosters, resources, and results."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EventsExplorer events={events} />
      </div>
    </>
  );
}
