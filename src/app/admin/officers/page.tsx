import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/shared/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/auth/session";
import { listAllOfficersForAdmin } from "@/lib/data/officers";
import { EditOfficerButton, NewOfficerButton } from "./officer-dialogs";
import { deleteOfficerAction } from "./actions";

export const metadata: Metadata = { title: "Manage Officers | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  officer: "Officer",
  event_captain: "Event Captain",
  coach: "Coach / Sponsor",
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default async function AdminOfficersPage() {
  await requireAdmin("/admin/officers");
  const officers = await listAllOfficersForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Officers &amp; Leadership</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage the public officer, event captain, and coach profiles shown on the Team page.</p>
        </div>
        <NewOfficerButton />
      </div>

      <DataTable
        columns={[
          {
            key: "name",
            header: "Name",
            render: (o) => (
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={o.photo_url ?? undefined} alt="" />
                  <AvatarFallback className="bg-brand-navy text-xs text-white">{initials(o.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-brand-navy">{o.full_name}</p>
                  <p className="text-xs text-muted-foreground">{o.role_title}</p>
                </div>
              </div>
            ),
          },
          { key: "category", header: "Category", render: (o) => <Badge variant="outline">{CATEGORY_LABEL[o.category]}</Badge> },
          { key: "grade", header: "Grade", render: (o) => o.grade ?? "—" },
          {
            key: "status",
            header: "Visible",
            render: (o) =>
              o.is_active ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Yes
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Hidden
                </Badge>
              ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (o) => (
              <div className="flex justify-end gap-1">
                <EditOfficerButton officer={o} />
                <DeleteButton action={() => deleteOfficerAction(o.id)} description={`"${o.full_name}"'s profile will be permanently removed.`} />
              </div>
            ),
          },
        ]}
        data={officers}
        getRowKey={(o) => o.id}
        emptyTitle="No officer profiles yet"
      />
    </div>
  );
}
