import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { getCurrentProfile } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/types/domain";

export const metadata: Metadata = { title: "Profile & Settings | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Profile &amp; Settings</h2>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="border-brand-navy/20 bg-brand-navy/5 text-brand-navy">
            {ROLE_LABELS[profile.role]}
          </Badge>
          {profile.grade && (
            <Badge variant="outline" className="bg-muted">
              Grade {profile.grade}
            </Badge>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-border bg-white p-6">
        <h3 className="font-heading text-base font-semibold text-brand-navy">Personal Information</h3>
        <p className="mt-1 text-sm text-muted-foreground">Grade and role are managed by team officers.</p>
        <div className="mt-5">
          <ProfileForm profile={profile} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-6">
        <h3 className="font-heading text-base font-semibold text-brand-navy">Password</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password you don&apos;t use elsewhere.</p>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
