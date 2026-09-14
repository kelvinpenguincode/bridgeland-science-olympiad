import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { RESOURCE_TYPE_LABELS, RESOURCE_VISIBILITY_LABELS } from "@/types/domain";
import { listResources } from "@/lib/data/resources";
import { listAllEventsForAdmin } from "@/lib/data/events";
import { EditResourceButton, NewResourceButton } from "./resource-dialogs";
import { deleteResourceAction } from "./actions";

export const metadata: Metadata = { title: "Manage Resources | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const [resources, events] = await Promise.all([listResources(), listAllEventsForAdmin()]);
  const eventOptions = events.map((e) => ({ id: e.id, name: e.name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Resources</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage the shared resource library. Link to official sources — never upload copyrighted rules manuals.</p>
        </div>
        <NewResourceButton events={eventOptions} />
      </div>

      <DataTable
        columns={[
          {
            key: "title",
            header: "Title",
            render: (r) => (
              <Link href={r.url ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand-navy hover:text-brand-orange">
                {r.title}
                <ExternalLink className="size-3" />
              </Link>
            ),
          },
          { key: "event", header: "Event", render: (r) => r.event?.name ?? "General" },
          { key: "type", header: "Type", render: (r) => RESOURCE_TYPE_LABELS[r.type] },
          {
            key: "visibility",
            header: "Visibility",
            render: (r) => <Badge variant="outline">{RESOURCE_VISIBILITY_LABELS[r.visibility]}</Badge>,
          },
          { key: "year", header: "Year", render: (r) => r.year },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-1">
                <EditResourceButton resource={r} events={eventOptions} />
                <DeleteButton action={deleteResourceAction} id={r.id} description={`"${r.title}" will be permanently removed.`} />
              </div>
            ),
          },
        ]}
        data={resources}
        getRowKey={(r) => r.id}
        emptyTitle="No resources yet"
      />
    </div>
  );
}
