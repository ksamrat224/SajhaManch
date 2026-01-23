import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPollsClient } from "./polls-client";
import type { PollsResponse } from "@/types";

export const metadata: Metadata = {
  title: "Manage Polls | Admin Dashboard",
};

async function getPolls(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const params = new URLSearchParams();
  if (searchParams.page) params.set("page", String(searchParams.page));
  if (searchParams.limit) params.set("limit", String(searchParams.limit || 10));
  if (searchParams.search) params.set("search", String(searchParams.search));
  params.set("sort", "createdAt");
  params.set("order", "desc");

  try {
    const res = await fetch(`${API_BASE_URL}/polls?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json() as Promise<PollsResponse>;
  } catch {
    return null;
  }
}

export default async function AdminPollsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pollsData = await getPolls(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Polls</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and manage all polls on the platform.
          </p>
        </div>
        <Link href="/admin/polls/create">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create Poll
          </Button>
        </Link>
      </div>

      <AdminPollsClient initialData={pollsData} />
    </div>
  );
}
