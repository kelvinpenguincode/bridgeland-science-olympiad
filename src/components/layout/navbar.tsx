import { getCurrentProfile } from "@/lib/auth/session";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const profile = await getCurrentProfile();
  return (
    <NavbarClient
      profile={
        profile
          ? {
              fullName: profile.full_name,
              preferredName: profile.preferred_name,
              avatarUrl: profile.avatar_url,
              role: profile.role,
            }
          : null
      }
    />
  );
}
