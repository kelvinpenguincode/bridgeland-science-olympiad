import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ResourcesExplorer } from "@/components/resources/resources-explorer";
import { listResources, listResourceYears } from "@/lib/data/resources";
import { listEvents } from "@/lib/data/events";

export const metadata: Metadata = {
  title: "Resources | Bridgeland Science Olympiad",
  description: "Study guides, notes, practice tests, and reference sheets for every Science Olympiad event.",
};

export const revalidate = 60;

export default async function ResourcesPage() {
  const [resources, events, years] = await Promise.all([listResources(), listEvents(), listResourceYears()]);

  return (
    <>
      <PageHeader
        eyebrow="Resource Library"
        title="Resources"
        description="Study guides, notes, practice tests, and reference sheets shared by officers and event captains. Official Science Olympiad rules manuals are linked, never hosted, out of respect for copyright."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ResourcesExplorer resources={resources} events={events} years={years} />
      </div>
    </>
  );
}
