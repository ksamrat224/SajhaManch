import { cookies } from "next/headers";
import { API_BASE_URL } from "./api";

export type CurrentUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}


