import type { Metadata } from "next";
import { AlertTriangle, UserX, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { DeleteButton } from "@/components/admin/delete-button";
import { CategoryBadge } from "@/components/shared/event-badge";
import { listTeams, listAllTeamMemberships, listAllEventAssignments } from "@/lib/data/teams";
import { listAllMembersForAdmin } from "@/lib/data/members";
import { listAllEventsForAdmin } from "@/lib/data/events";
import { NewTeamButton, EditTeamButton, ManageRosterButton } from "./team-dialogs";
import { NewAssignmentButton, EditAssignmentButton } from "./assignment-dialogs";
import { deleteTeamAction, deleteAssignmentAction } from "./actions";

export const metadata: Metadata = { title: "Manage Teams | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

const OVERLOAD_THRESHOLD = 4;

export default async function AdminTeamsPage() {
  const [teams, memberships, assignments, members, events] = await Promise.all([
    listTeams(),
    listAllTeamMemberships(),
    listAllEventAssignments(),
    listAllMembersForAdmin(),
    listAllEventsForAdmin(),
  ]);

  const activeEvents = events.filter((e) => e.is_active);
  const activeMembers = members.filter((m) => m.is_active && m.role !== "sponsor");

  const memberOptions = activeMembers.map((m) => ({ id: m.id, name: m.full_name }));
  const teamOptions = teams.map((t) => ({ id: t.id, name: t.name }));
  const eventOptions = activeEvents.map((e) => ({ id: e.id, name: e.name }));

  const assignmentCountByProfile = new Map<string, number>();
  for (const a of assignments) {
    assignmentCountByProfile.set(a.profile_id, (assignmentCountByProfile.get(a.profile_id) ?? 0) + 1);
  }

  const unassignedMembers = activeMembers.filter((m) => !assignmentCountByProfile.has(m.id));
  const overloadedMembers = activeMembers.filter((m) => (assignmentCountByProfile.get(m.id) ?? 0) >= OVERLOAD_THRESHOLD);
  const unfilledEvents = activeEvents.filter((e) => !assignments.some((a) => a.event_id === e.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Teams &amp; Assignments</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage rosters and the season&apos;s student-to-event assignment matrix.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Unfilled Events" value={unfilledEvents.length} icon={AlertTriangle} accent={unfilledEvents.length > 0 ? "warning" : "neutral"} />
        <StatCard label="Unassigned Students" value={unassignedMembers.length} icon={UserX} accent={unassignedMembers.length > 0 ? "warning" : "neutral"} />
        <StatCard label={`Overloaded (${OVERLOAD_THRESHOLD}+ events)`} value={overloadedMembers.length} icon={Users} accent={overloadedMembers.length > 0 ? "warning" : "neutral"} />
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Assignment Matrix</TabsTrigger>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-6">
          <div className="flex justify-end">
            <NewAssignmentButton events={eventOptions} members={memberOptions} teams={teamOptions} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Event</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Assigned Students</th>
                  <th scope="col" className="px-4 py-3 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {activeEvents.map((event) => {
                  const eventAssignments = assignments.filter((a) => a.event_id === event.id);
                  return (
                    <tr key={event.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-brand-navy">{event.name}</td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={event.category} />
                      </td>
                      <td className="px-4 py-3">
                        {eventAssignments.length === 0 ? (
                          <span className="text-xs text-amber-600">No students assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {eventAssignments.map((a) => (
                              <Badge key={a.id} variant="outline" className="bg-muted">
                                {a.profile?.preferred_name ?? a.profile?.full_name ?? "Unknown"}
                                {a.team?.name && <span className="ml-1 text-brand-orange-dark">· {a.team.name}</span>}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="outline" className={eventAssignments.length === 0 ? "border-amber-200 bg-amber-50 text-amber-700" : ""}>
                          {eventAssignments.length}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(unassignedMembers.length > 0 || overloadedMembers.length > 0) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-4">
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
                  <UserX className="size-4 text-amber-600" /> Students with no assigned event
                </h3>
                {unassignedMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Everyone has at least one event. Nice work!</p>
                ) : (
                  <ul className="space-y-1 text-sm text-slate-700">
                    {unassignedMembers.map((m) => (
                      <li key={m.id}>{m.full_name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
                  <AlertTriangle className="size-4 text-amber-600" /> Students with {OVERLOAD_THRESHOLD}+ events
                </h3>
                {overloadedMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No one is overloaded right now.</p>
                ) : (
                  <ul className="space-y-1 text-sm text-slate-700">
                    {overloadedMembers.map((m) => (
                      <li key={m.id}>
                        {m.full_name} <span className="text-muted-foreground">({assignmentCountByProfile.get(m.id)} events)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-end">
            <NewAssignmentButton events={eventOptions} members={memberOptions} teams={teamOptions} />
          </div>
          <DataTable
            columns={[
              { key: "student", header: "Student", render: (a) => a.profile?.full_name ?? "—" },
              { key: "event", header: "Event", render: (a) => a.event?.name ?? "—" },
              { key: "partner", header: "Partner", render: (a) => a.partner?.full_name ?? "—" },
              { key: "team", header: "Team", render: (a) => a.team?.name ?? "Unassigned" },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: (a) => (
                  <div className="flex justify-end gap-1">
                    <EditAssignmentButton assignment={a} events={eventOptions} members={memberOptions} teams={teamOptions} />
                    <DeleteButton action={() => deleteAssignmentAction(a.id)} description="This assignment will be permanently removed." />
                  </div>
                ),
              },
            ]}
            data={assignments}
            getRowKey={(a) => a.id}
            emptyTitle="No assignments yet"
          />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-end">
            <NewTeamButton />
          </div>
          {teams.length === 0 ? (
            <EmptyState title="No teams yet" description="Create your first team, like Varsity A." />
          ) : (
            <DataTable
              columns={[
                { key: "name", header: "Team", render: (t) => <span className="font-medium text-brand-navy">{t.name}</span> },
                { key: "season", header: "Season", render: (t) => t.season },
                {
                  key: "roster",
                  header: "Roster Size",
                  render: (t) => memberships.filter((m) => m.team_id === t.id).length,
                },
                {
                  key: "actions",
                  header: "",
                  className: "text-right",
                  render: (t) => (
                    <div className="flex justify-end gap-1">
                      <ManageRosterButton
                        teamId={t.id}
                        allMembers={activeMembers}
                        rosterProfileIds={memberships.filter((m) => m.team_id === t.id).map((m) => m.profile_id)}
                      />
                      <EditTeamButton team={t} />
                      <DeleteButton action={() => deleteTeamAction(t.id)} description={`"${t.name}" and its roster links will be permanently removed.`} />
                    </div>
                  ),
                },
              ]}
              data={teams}
              getRowKey={(t) => t.id}
              emptyTitle="No teams yet"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
