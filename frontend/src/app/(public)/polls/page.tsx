import type { Metadata } from "next";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { PollsClient } from "./polls-client";
import type { PollsResponse } from "@/types";

export const metadata: Metadata = {
  title: "Live Polls | Voting & Feedback",
  description:
    "Browse and vote on active polls. See real-time results and participate in community decisions.",
};

async function getPolls(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const params = new URLSearchParams();
  if (searchParams.page) params.set("page", String(searchParams.page));
  if (searchParams.limit) params.set("limit", String(searchParams.limit));
  if (searchParams.search) params.set("search", String(searchParams.search));
  if (searchParams.sort) params.set("sort", String(searchParams.sort));
  if (searchParams.order) params.set("order", String(searchParams.order));

  try {
    const res = await fetch(`${API_BASE_URL}/polls?${params.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json() as Promise<PollsResponse>;
  } catch (error) {
    console.error("Failed to fetch polls:", error);
    return null;
  }
}

export default async function PollsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pollsData = await getPolls(params);

  return (
    <section className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <PollsClient initialData={pollsData} />
      </div>
    </section>
  );
}
