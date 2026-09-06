import type { Metadata } from "next";
import { Pin } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { PriorityBadge } from "@/components/shared/event-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDateTime } from "@/lib/utils/date";
import { ANNOUNCEMENT_AUDIENCE_LABELS } from "@/types/domain";
import { listAllAnnouncementsForAdmin } from "@/lib/data/announcements";
import { listEvents } from "@/lib/data/events";
import { listTeams } from "@/lib/data/teams";
import { EditAnnouncementButton, NewAnnouncementButton } from "./announcement-dialogs";
import { deleteAnnouncementAction } from "./actions";

export const metadata: Metadata = { title: "Manage Announcements | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const [announcements, events, teams] = await Promise.all([
    listAllAnnouncementsForAdmin(),
    listEvents(),
    listTeams(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Announcements</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and manage team-wide announcements.</p>
        </div>
        <NewAnnouncementButton teams={teams} events={events} />
      </div>

      <DataTable
        columns={[
          {
            key: "title",
            header: "Title",
            render: (a) => (
              <div className="flex items-center gap-1.5">
                {a.is_pinned && <Pin className="size-3.5 text-brand-orange" />}
                <span className="font-medium text-brand-navy">{a.title}</span>
              </div>
            ),
          },
          {
            key: "priority",
            header: "Priority",
            render: (a) => (a.priority === "normal" ? "Normal" : <PriorityBadge priority={a.priority} />),
          },
          { key: "audience", header: "Audience", render: (a) => ANNOUNCEMENT_AUDIENCE_LABELS[a.audience] },
          { key: "publish", header: "Publish At", render: (a) => formatDateTime(a.publish_at) },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (a) => (
              <div className="flex justify-end gap-1">
                <EditAnnouncementButton announcement={a} teams={teams} events={events} />
                <DeleteButton
                  action={() => deleteAnnouncementAction(a.id)}
                  title="Delete this announcement?"
                  description={`"${a.title}" will be permanently removed.`}
                />
              </div>
            ),
          },
        ]}
        data={announcements}
        getRowKey={(a) => a.id}
        emptyTitle="No announcements yet"
        emptyDescription="Create your first announcement to get started."
      />
    </div>
  );
}
