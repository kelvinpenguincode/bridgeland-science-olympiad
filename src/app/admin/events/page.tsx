import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { CategoryBadge } from "@/components/shared/event-badge";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { DeleteButton } from "@/components/admin/delete-button";
import { listAllEventsForAdmin } from "@/lib/data/events";
import { EditEventButton, NewEventButton } from "./event-dialogs";
import { deleteEventAction } from "./actions";

export const metadata: Metadata = { title: "Manage Events | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await listAllEventsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Science Olympiad Events</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage the {events.length} events on this season&apos;s roster.</p>
        </div>
        <NewEventButton />
      </div>

      <DataTable
        columns={[
          {
            key: "name",
            header: "Event",
            render: (e) => (
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-brand-orange-light text-brand-orange-dark">
                  <DynamicIcon name={e.icon} className="size-3.5" />
                </span>
                <span className="font-medium text-brand-navy">{e.name}</span>
              </div>
            ),
          },
          { key: "category", header: "Category", render: (e) => <CategoryBadge category={e.category} /> },
          {
            key: "status",
            header: "Status",
            render: (e) =>
              e.is_active ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Inactive
                </Badge>
              ),
          },
          { key: "season", header: "Season", render: (e) => e.season },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (e) => (
              <div className="flex justify-end gap-1">
                <EditEventButton event={e} />
                <DeleteButton action={() => deleteEventAction(e.id)} description={`"${e.name}" will be permanently removed.`} />
              </div>
            ),
          },
        ]}
        data={events}
        getRowKey={(e) => e.id}
        emptyTitle="No events yet"
      />
    </div>
  );
}
