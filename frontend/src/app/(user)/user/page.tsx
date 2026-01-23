import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { Vote, BarChart3, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Poll, Vote as VoteType } from "@/types";

export const metadata: Metadata = {
  title: "My Dashboard | Voting & Feedback",
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

async function getActivePolls(): Promise<Poll[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const res = await fetch(
      `${API_BASE_URL}/polls?limit=5&sort=createdAt&order=desc`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).filter((p: Poll) => p.isActive);
  } catch {
    return [];
  }
}

export default async function UserDashboardPage() {
  const [votes, activePolls] = await Promise.all([
    getUserVotes(),
    getActivePolls(),
  ]);

  const votedPollIds = new Set(votes.map((v) => v.pollId));
  const pollsToVote = activePolls.filter((p) => !votedPollIds.has(p.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Your voting activity and active polls at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Vote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Votes</p>
              <p className="text-2xl font-bold">{votes.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Polls</p>
              <p className="text-2xl font-bold">{activePolls.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Polls to Vote</p>
              <p className="text-2xl font-bold">{pollsToVote.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Polls to Vote */}
      {pollsToVote.length > 0 && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Polls Waiting for Your Vote
              </h2>
            </div>
            <Link
              href="/polls"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all polls
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pollsToVote.slice(0, 4).map((poll) => (
              <Link
                key={poll.id}
                href={`/polls/${poll.id}`}
                className="rounded-xl border border-border/50 bg-card/80 p-4 transition-all hover:border-primary/50 hover:bg-card"
              >
                <h3 className="font-medium line-clamp-1">{poll.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {poll.description || "No description"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {poll._count?.votes ?? 0} votes
                  </span>
                  <span className="text-xs font-medium text-primary">
                    Vote now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Votes */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Recent Votes</h2>
          <Link
            href="/user/votes"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {votes.length > 0 ? (
          <div className="space-y-3">
            {votes.slice(0, 5).map((vote) => (
              <div
                key={vote.id}
                className="flex items-center justify-between rounded-xl border border-border/30 bg-background/50 p-4"
              >
                <div>
                  <p className="font-medium">Poll #{vote.pollId}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Voted on{" "}
                    {new Date(vote.votedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Link href={`/polls/${vote.pollId}`}>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Vote className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">You haven&apos;t voted on any polls yet</p>
            <Link href="/polls">
              <Button variant="outline" className="mt-4">
                Browse Polls
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
