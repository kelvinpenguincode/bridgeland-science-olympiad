import type { Metadata } from "next";
import { Users, Trophy, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { OfficerCard } from "@/components/shared/officer-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listOfficersGrouped } from "@/lib/data/officers";

export const metadata: Metadata = {
  title: "Team | Bridgeland Science Olympiad",
  description: "Meet the officers, event captains, and coaches leading Bridgeland Science Olympiad.",
};

export const revalidate = 60;

function OfficerSection({
  title,
  icon: Icon,
  officers,
  emptyLabel,
}: {
  title: string;
  icon: typeof Users;
  officers: Awaited<ReturnType<typeof listOfficersGrouped>>["officers"];
  emptyLabel: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-navy">
        <Icon className="size-5 text-brand-orange" aria-hidden="true" />
        {title}
      </h2>
      {officers.length === 0 ? (
        <EmptyState title={emptyLabel} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {officers.map((officer) => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function TeamPage() {
  const { officers, captains, coaches } = await listOfficersGrouped();

  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Team & Leadership"
        description="Bridgeland Science Olympiad is run by a dedicated group of student officers, event captains, and adult coaches — all working to make every season a success."
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <OfficerSection title="Officers" icon={Users} officers={officers} emptyLabel="Officer roster coming soon" />
        <OfficerSection title="Event Captains" icon={Trophy} officers={captains} emptyLabel="Event captains coming soon" />
        <OfficerSection title="Coaches & Sponsors" icon={GraduationCap} officers={coaches} emptyLabel="Coach roster coming soon" />
      </div>
    </>
  );
}
