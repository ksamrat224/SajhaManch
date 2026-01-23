import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { PollDetailClient } from "./poll-detail-client";
import type { Poll, PollResults } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) {
    return {
      title: "Poll Not Found | Voting & Feedback",
    };
  }

  return {
    title: `${poll.title} | Voting & Feedback`,
    description:
      poll.description || "Vote on this poll and see real-time results.",
  };
}

async function getPoll(id: string): Promise<Poll | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${API_BASE_URL}/polls/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function checkVoteStatus(pollId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/votes/poll/${pollId}/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;
    const data = await res.json();
    return data.hasVoted;
  } catch {
    return false;
  }
}

async function getPollResults(pollId: string): Promise<PollResults | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/votes/poll/${pollId}/results`, {
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

async function getCurrentUser() {
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

export default async function PollDetailPage({ params }: Props) {
  const { id } = await params;
  const [poll, hasVoted, results, user] = await Promise.all([
    getPoll(id),
    checkVoteStatus(id),
    checkVoteStatus(id).then((voted) => (voted ? getPollResults(id) : null)),
    getCurrentUser(),
  ]);

  if (!poll) {
    notFound();
  }

  // Check if poll has ended
  const now = new Date();
  const endsAt = poll.endsAt ? new Date(poll.endsAt) : null;
  const hasEnded = endsAt ? endsAt < now : false;
  const isActive = poll.isActive && !hasEnded;

  return (
    <PollDetailClient
      poll={poll}
      initialHasVoted={hasVoted}
      initialResults={results}
      isAuthenticated={!!user}
      isActive={isActive}
    />
  );
}
