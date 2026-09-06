import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate, formatTime } from "@/lib/utils/date";
import { listAllMeetingsForAdmin } from "@/lib/data/meetings";
import { EditMeetingButton, NewMeetingButton } from "./meeting-dialogs";
import { deleteMeetingAction } from "./actions";

export const metadata: Metadata = { title: "Manage Meetings | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminMeetingsPage() {
  const meetings = await listAllMeetingsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Meetings</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage general meetings, agendas, and archives.</p>
        </div>
        <NewMeetingButton />
      </div>

      <DataTable
        columns={[
          { key: "title", header: "Title", render: (m) => <span className="font-medium text-brand-navy">{m.title}</span> },
          { key: "date", header: "Date", render: (m) => formatDate(m.meeting_date) },
          { key: "time", header: "Time", render: (m) => formatTime(m.start_time) },
          { key: "location", header: "Location", render: (m) => m.location },
          {
            key: "attendance",
            header: "Attendance",
            render: (m) =>
              m.attendance_required ? (
                <Badge variant="outline" className="border-brand-orange/30 bg-brand-orange-light text-brand-orange-dark">
                  Required
                </Badge>
              ) : (
                "—"
              ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (m) => (
              <div className="flex justify-end gap-1">
                <EditMeetingButton meeting={m} />
                <DeleteButton action={() => deleteMeetingAction(m.id)} description={`"${m.title}" will be permanently removed.`} />
              </div>
            ),
          },
        ]}
        data={meetings}
        getRowKey={(m) => m.id}
        emptyTitle="No meetings yet"
      />
    </div>
  );
}
