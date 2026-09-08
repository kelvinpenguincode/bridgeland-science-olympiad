import type { Metadata } from "next";
import { MembersExplorer } from "@/components/admin/members-explorer";
import { listAllMembersForAdmin } from "@/lib/data/members";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Manage Members | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  await requireAdmin("/admin/members");
  const members = await listAllMembersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Roster</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage member roles and status. New members appear here automatically after they sign up — role changes require admin/sponsor access.
        </p>
      </div>
      <MembersExplorer members={members} />
    </div>
  );
}
