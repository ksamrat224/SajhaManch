import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Vote, Calendar, ExternalLink } from "lucide-react";
import type { Vote as VoteType } from "@/types";

export const metadata: Metadata = {
  title: "My Votes | Voting & Feedback",
};

async function getUserVotes(): Promise<VoteType[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/votes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function UserVotesPage() {
  const votes = await getUserVotes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Votes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A history of all the polls you&apos;ve voted on.
        </p>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Vote className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{votes.length}</p>
            <p className="text-sm text-muted-foreground">Total Votes Cast</p>
          </div>
        </div>
      </div>

      {/* Votes List */}
      {votes.length > 0 ? (
        <div className="space-y-4">
          {votes.map((vote) => (
            <div
              key={vote.id}
              className="rounded-2xl border border-border/50 bg-card/50 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Poll #{vote.pollId}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Voted on {formatDate(vote.votedAt)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Selected option #{vote.pollOptionId}
                  </p>
                </div>
                <Link href={`/polls/${vote.pollId}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Poll
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card/30 py-16 text-center">
          <Vote className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-medium">No votes yet</h3>
          <p className="mt-2 text-muted-foreground">
            You haven&apos;t voted on any polls yet. Start participating!
          </p>
          <Link href="/polls">
            <Button className="mt-6">Browse Polls</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
