import type { Metadata } from "next";
import { CalendarCategoryBadge } from "@/components/shared/event-badge";
import { DataTable } from "@/components/shared/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateTime } from "@/lib/utils/date";
import { listCalendarEvents } from "@/lib/data/calendar";
import { EditCalendarEventButton, NewCalendarEventButton } from "./calendar-dialogs";
import { deleteCalendarEventAction } from "./actions";

export const metadata: Metadata = { title: "Manage Calendar | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const events = await listCalendarEvents();
  const sorted = [...events].sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Calendar</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage every meeting, practice, deadline, and competition on the calendar.</p>
        </div>
        <NewCalendarEventButton />
      </div>

      <DataTable
        columns={[
          { key: "title", header: "Title", render: (e) => <span className="font-medium text-brand-navy">{e.title}</span> },
          { key: "category", header: "Category", render: (e) => <CalendarCategoryBadge category={e.category} /> },
          { key: "start", header: "Start", render: (e) => formatDateTime(e.start_at) },
          { key: "location", header: "Location", render: (e) => e.location ?? "—" },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (e) => (
              <div className="flex justify-end gap-1">
                <EditCalendarEventButton event={e} />
                <DeleteButton action={deleteCalendarEventAction} id={e.id} description={`"${e.title}" will be permanently removed.`} />
              </div>
            ),
          },
        ]}
        data={sorted}
        getRowKey={(e) => e.id}
        emptyTitle="No calendar events yet"
      />
    </div>
  );
}
