import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { CategoryBadge } from "@/components/shared/event-badge";
import { formatDateTime } from "@/lib/utils/date";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEventCaptainName, getMyEventMemberships } from "@/lib/data/member";
import { getEventNextPractice, listEventResources } from "@/lib/data/events";
import type { EventCategory } from "@/types/database";

export const metadata: Metadata = { title: "My Events | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function DashboardEventsPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const memberships = await getMyEventMemberships(profile.id);

  const detailed = await Promise.all(
    memberships.map(async (m) => {
      const event = m.event as { id: string; name: string; slug: string; icon: string; category: EventCategory } | null;
      const partner = m.partner as { full_name: string; preferred_name: string | null } | null;
      if (!event) return null;
      const [captain, nextPractice, resources] = await Promise.all([
        getEventCaptainName(event.name),
        getEventNextPractice(event.name),
        listEventResources(event.id),
      ]);
      return { membership: m, event, partner, captain, nextPractice, recentResource: resources[0] ?? null };
    })
  );

  const rows = detailed.filter((d): d is NonNullable<typeof d> => !!d);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">My Events</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Events you&apos;re rostered on this season, with your partner, captain, and next practice.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No events assigned yet"
          description="Take a placement test or ask an officer to add you to an event roster."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map(({ membership, event, partner, captain, nextPractice, recentResource }) => (
            <div key={membership.id} className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
                    <DynamicIcon name={event.icon} className="size-5" />
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-brand-navy">{event.name}</p>
                    <CategoryBadge category={event.category} className="mt-1" />
                  </div>
                </div>
                {membership.role === "captain" && (
                  <Badge variant="outline" className="border-brand-orange/30 bg-brand-orange-light text-brand-orange-dark">
                    Captain
                  </Badge>
                )}
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Partner</dt>
                  <dd className="text-right font-medium text-brand-navy">
                    {partner ? partner.preferred_name || partner.full_name : "None assigned"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Event Captain</dt>
                  <dd className="text-right font-medium text-brand-navy">{captain ?? "Not assigned"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Next Practice</dt>
                  <dd className="text-right font-medium text-brand-navy">
                    {nextPractice ? formatDateTime(nextPractice.start_at) : "None scheduled"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Recent Resource</dt>
                  <dd className="max-w-[60%] truncate text-right font-medium text-brand-navy">
                    {recentResource ? recentResource.title : "None yet"}
                  </dd>
                </div>
              </dl>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                render={<Link href={`/events/${event.slug}`} />}
              >
                View Event
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
