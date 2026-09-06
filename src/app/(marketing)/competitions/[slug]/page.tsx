import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ExternalLink, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ResultBadge } from "@/components/shared/event-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/shared/data-table";
import { formatDate, formatTime } from "@/lib/utils/date";
import { COMPETITION_TYPE_LABELS } from "@/types/domain";
import {
  getCompetitionAssignments,
  getCompetitionBySlug,
  getCompetitionResults,
  getCompetitionSchedule,
  getCompetitionTeams,
} from "@/lib/data/competitions";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);
  if (!competition) return { title: "Competition Not Found | Bridgeland Science Olympiad" };
  return {
    title: `${competition.name} | Bridgeland Science Olympiad`,
    description: competition.description ?? undefined,
  };
}

export default async function CompetitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);
  if (!competition) notFound();

  const [teams, schedule, assignments, results] = await Promise.all([
    getCompetitionTeams(competition.id),
    getCompetitionSchedule(competition.id),
    getCompetitionAssignments(competition.id),
    getCompetitionResults(competition.id),
  ]);

  const overallResults = results.filter((r) => !r.event_id);
  const eventResults = results.filter((r) => r.event_id);

  return (
    <>
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div>
            <Badge variant="outline" className="mb-2 border-brand-navy/20 bg-brand-navy/5 text-brand-navy">
              {COMPETITION_TYPE_LABELS[competition.type]}
            </Badge>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              {competition.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-brand-orange" /> {formatDate(competition.competition_date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-brand-orange" /> {competition.location}
              </span>
            </div>
          </div>
          {competition.forms_url && (
            <Button variant="outline" render={<a href={competition.forms_url} target="_blank" rel="noreferrer" />}>
              Forms &amp; Permission Slips
              <ExternalLink className="size-3.5" data-icon="inline-end" />
            </Button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            {competition.description ? (
              <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{competition.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No description provided yet.</p>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Registration Deadline
                </p>
                <p className="mt-1 text-sm font-medium text-brand-navy">
                  {competition.registration_deadline ? formatDate(competition.registration_deadline) : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Teams Attending</p>
                <p className="mt-1 text-sm font-medium text-brand-navy">{teams.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Results Status</p>
                <p className="mt-1 text-sm font-medium text-brand-navy">
                  {competition.results_status === "released" ? "Posted" : "Pending"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            {schedule.length === 0 ? (
              <EmptyState icon={Clock} title="Schedule not published yet" />
            ) : (
              <div className="space-y-2">
                {schedule.map((s) => {
                  const event = s.event as { name: string; slug: string } | null;
                  return (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-white p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-brand-navy">{s.title}</p>
                        {event && (
                          <Link href={`/events/${event.slug}`} className="text-xs text-brand-orange-dark hover:underline">
                            {event.name}
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {s.start_time && (
                          <span>
                            {formatTime(s.start_time)}
                            {s.end_time ? ` – ${formatTime(s.end_time)}` : ""}
                          </span>
                        )}
                        {s.location && <span>{s.location}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams" className="mt-6 space-y-6">
            {teams.length === 0 ? (
              <EmptyState icon={Users} title="Team roster not finalized" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {teams.map((t) => (
                  <Badge key={t.id} variant="outline" className="bg-muted px-3 py-1 text-sm">
                    {t.name}
                  </Badge>
                ))}
              </div>
            )}
            {assignments.length > 0 && (
              <DataTable
                columns={[
                  {
                    key: "event",
                    header: "Event",
                    render: (a) => (a.event as { name: string } | null)?.name ?? "—",
                  },
                  {
                    key: "student",
                    header: "Student",
                    render: (a) => (a.profile as { full_name: string } | null)?.full_name ?? "—",
                  },
                  {
                    key: "team",
                    header: "Team",
                    render: (a) => (a.team as { name: string } | null)?.name ?? "—",
                  },
                  { key: "room", header: "Room", render: (a) => a.room ?? "—" },
                ]}
                data={assignments}
                getRowKey={(a) => a.id}
                emptyTitle="No assignments yet"
              />
            )}
          </TabsContent>

          <TabsContent value="logistics" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Address</p>
                <p className="mt-1 text-sm text-slate-600">{competition.address ?? "See official tournament info"}</p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Departure / Return</p>
                <p className="mt-1 text-sm text-slate-600">
                  {competition.departure_time ? formatTime(competition.departure_time) : "TBD"} departure
                  {competition.return_estimate ? ` · est. return ${formatTime(competition.return_estimate)}` : ""}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5 sm:col-span-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">What to Bring</p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                  {competition.what_to_bring ?? "Details coming soon."}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6 space-y-6">
            {competition.results_status !== "released" ? (
              <EmptyState title="Results not yet released" description="Check back after the tournament wraps up." />
            ) : (
              <>
                {overallResults.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Overall Team Placement
                    </h3>
                    <div className="space-y-2">
                      {overallResults.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between rounded-xl border border-border bg-white p-4"
                        >
                          <span className="text-sm font-medium text-brand-navy">
                            {(r.team as { name: string } | null)?.name ?? "Team"}
                          </span>
                          <div className="flex items-center gap-3">
                            {r.placement && <span className="text-sm font-semibold">Placed {r.placement}</span>}
                            <ResultBadge medal={r.medal} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Individual Event Results
                  </h3>
                  {eventResults.length === 0 ? (
                    <EmptyState title="No event results recorded" />
                  ) : (
                    <DataTable
                      columns={[
                        { key: "event", header: "Event", render: (r) => (r.event as { name: string } | null)?.name ?? "—" },
                        { key: "team", header: "Team", render: (r) => (r.team as { name: string } | null)?.name ?? "—" },
                        {
                          key: "placement",
                          header: "Placement",
                          render: (r) => (r.placement ? `#${r.placement}` : "—"),
                        },
                        { key: "medal", header: "Medal", render: (r) => <ResultBadge medal={r.medal} /> },
                        { key: "score", header: "Score", render: (r) => r.score ?? "—" },
                      ]}
                      data={eventResults}
                      getRowKey={(r) => r.id}
                    />
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
