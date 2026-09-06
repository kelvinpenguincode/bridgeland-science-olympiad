import type { Metadata } from "next";
import { ResourcesExplorer } from "@/components/resources/resources-explorer";
import { listResources, listResourceYears } from "@/lib/data/resources";
import { listEvents } from "@/lib/data/events";

export const metadata: Metadata = { title: "My Resources | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function DashboardResourcesPage() {
  const [resources, events, years] = await Promise.all([listResources(), listEvents(), listResourceYears()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Resources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Includes members-only material in addition to everything on the public resource library.
        </p>
      </div>
      <ResourcesExplorer resources={resources} events={events} years={years} />
    </div>
  );
}
