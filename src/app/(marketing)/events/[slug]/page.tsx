import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Calendar, MapPin, Users, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBadge, ResultBadge } from "@/components/shared/event-badge";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { ResourceCard } from "@/components/shared/resource-card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatDateTime } from "@/lib/utils/date";
import {
  getEventBySlug,
  getEventCaptainOfficer,
  getEventCompetitionHistory,
  getEventNextPractice,
  getEventRoster,
  listEventResources,
} from "@/lib/data/events";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found | Bridgeland Science Olympiad" };
  return {
    title: `${event.name} | Bridgeland Science Olympiad`,
    description: event.description,
  };
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const [roster, captainOfficer, resources, nextPractice, history] = await Promise.all([
    getEventRoster(event.id),
    getEventCaptainOfficer(event.name),
    listEventResources(event.id),
    getEventNextPractice(event.name),
    getEventCompetitionHistory(event.id),
  ]);

  const captains = roster.filter((r) => r.role === "captain");
  const members = roster.filter((r) => r.role === "member");

  return (
    <>
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange-dark">
              <DynamicIcon name={event.icon} className="size-7" aria-hidden="true" />
            </span>
            <div>
              <CategoryBadge category={event.category} className="mb-2" />
              <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
                {event.name}
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">{event.description}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {event.official_rules_url && (
              <Button variant="outline" render={<a href={event.official_rules_url} target="_blank" rel="noreferrer" />}>
                Official Rules
                <ExternalLink className="size-3.5" data-icon="inline-end" />
              </Button>
            )}
            {event.official_resources_url && (
              <Button variant="outline" render={<a href={event.official_resources_url} target="_blank" rel="noreferrer" />}>
                Official Resources
                <ExternalLink className="size-3.5" data-icon="inline-end" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <Trophy className="size-3.5 text-brand-orange" /> Event Captain
                </p>
                <p className="mt-2 text-sm font-medium text-brand-navy">
                  {captainOfficer?.full_name ??
                    (captains[0]?.profile as { full_name?: string } | null)?.full_name ??
                    "Not yet assigned"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <Users className="size-3.5 text-brand-orange" /> Roster Size
                </p>
                <p className="mt-2 text-sm font-medium text-brand-navy">
                  {roster.length} member{roster.length === 1 ? "" : "s"} assigned
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <Calendar className="size-3.5 text-brand-orange" /> Next Practice
                </p>
                <p className="mt-2 text-sm font-medium text-brand-navy">
                  {nextPractice ? formatDateTime(nextPractice.start_at) : "None scheduled"}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-slate-600">
              Bridgeland Science Olympiad links to the official Science Olympiad event rules and resources
              rather than hosting copyrighted materials directly. Use the buttons above to open the
              official pages for {event.name}.
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            {resources.length === 0 ? (
              <EmptyState icon={FileText} title="No resources yet" description="Check back soon, or ask your event captain." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="practice" className="mt-6 space-y-4">
            {nextPractice ? (
              <div className="rounded-xl border border-brand-orange/30 bg-brand-orange-light p-5">
                <p className="text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">
                  Next Practice / Practice Test
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold text-brand-navy">{nextPractice.title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-700">
                  <Calendar className="size-4" /> {formatDateTime(nextPractice.start_at)}
                </p>
                {nextPractice.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                    <MapPin className="size-4" /> {nextPractice.location}
                  </p>
                )}
                {nextPractice.description && (
                  <p className="mt-2 text-sm text-slate-600">{nextPractice.description}</p>
                )}
              </div>
            ) : (
              <EmptyState icon={Calendar} title="No practice sessions scheduled" description="Check the team calendar for updates." />
            )}
            <Button variant="outline" size="sm" render={<Link href="/calendar" />}>
              View full calendar
            </Button>
          </TabsContent>

          <TabsContent value="members" className="mt-6 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Event Captain{captains.length === 1 ? "" : "s"}
              </h3>
              {captains.length === 0 ? (
                <p className="text-sm text-muted-foreground">No captain assigned yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {captains.map((c) => {
                    const profile = c.profile as { id: string; full_name: string; preferred_name: string | null; grade: number | null; avatar_url: string | null } | null;
                    if (!profile) return null;
                    return (
                      <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                        <Avatar className="size-10">
                          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
                          <AvatarFallback className="bg-brand-navy text-white">{initials(profile.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-brand-navy">{profile.preferred_name || profile.full_name}</p>
                          {profile.grade && <p className="text-xs text-muted-foreground">Grade {profile.grade}</p>}
                        </div>
                        <Badge variant="outline" className="ml-auto border-brand-orange/30 bg-brand-orange-light text-brand-orange-dark">
                          Captain
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Assigned Members
              </h3>
              {members.length === 0 ? (
                <EmptyState icon={Users} title="No members assigned yet" description="Sign in to see full roster details." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {members.map((m) => {
                    const profile = m.profile as { id: string; full_name: string; preferred_name: string | null; grade: number | null; avatar_url: string | null } | null;
                    if (!profile) return null;
                    return (
                      <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                        <Avatar className="size-10">
                          <AvatarImage src={profile.avatar_url ?? undefined} alt="" />
                          <AvatarFallback className="bg-muted text-brand-navy">{initials(profile.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-brand-navy">{profile.preferred_name || profile.full_name}</p>
                          {profile.grade && <p className="text-xs text-muted-foreground">Grade {profile.grade}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {history.length === 0 ? (
              <EmptyState icon={Trophy} title="No competition history yet" description="Results will appear here after each tournament." />
            ) : (
              <div className="space-y-3">
                {history.map((h) => {
                  const comp = h.competition as { name: string; slug: string; competition_date: string } | null;
                  return (
                    <div
                      key={h.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4"
                    >
                      <div>
                        <Link href={comp ? `/competitions/${comp.slug}` : "/competitions"} className="text-sm font-medium text-brand-navy hover:text-brand-orange-dark">
                          {comp?.name ?? "Competition"}
                        </Link>
                        <p className="text-xs text-muted-foreground">{comp ? formatDate(comp.competition_date) : ""}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {h.placement && (
                          <span className="text-sm font-semibold text-brand-navy">Placed {h.placement}</span>
                        )}
                        <ResultBadge medal={h.medal} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
