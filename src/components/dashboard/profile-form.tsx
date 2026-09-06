"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileAction, type ActionResult } from "@/app/dashboard/profile/actions";
import type { ProfileRow } from "@/types/database";

const initialState: ActionResult = { success: false };

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  useEffect(() => {
    if (state.success) toast.success("Profile updated.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" defaultValue={profile.full_name} required minLength={2} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredName">Preferred Name</Label>
          <Input id="preferredName" name="preferredName" defaultValue={profile.preferred_name ?? ""} placeholder="Optional" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={profile.email} disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} placeholder="Optional" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} placeholder="A few words about you" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save Changes"}
        {!pending && <Save className="size-4" data-icon="inline-end" />}
      </Button>
    </form>
  );
}
