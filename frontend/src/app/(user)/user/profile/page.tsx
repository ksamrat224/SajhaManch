import type { Metadata } from "next";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "My Profile | Voting & Feedback",
};

async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function UserProfilePage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card/30 p-8 text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      )}
    </div>
  );
}
