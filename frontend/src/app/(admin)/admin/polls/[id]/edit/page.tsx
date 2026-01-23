import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { EditPollForm } from "./edit-poll-form";
import type { Poll } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Poll | Admin Dashboard",
};

async function getPoll(id: string): Promise<Poll | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/polls/${id}`, {
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

export default async function EditPollPage({ params }: Props) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Poll</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update poll details and manage options.
        </p>
      </div>

      <EditPollForm poll={poll} />
    </div>
  );
}
