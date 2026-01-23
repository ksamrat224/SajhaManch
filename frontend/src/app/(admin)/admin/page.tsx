import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import {
  BarChart3,
  Users,
  Vote,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard | Voting & Feedback",
};

async function getStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const [pollsRes, feedbacksRes, votesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/polls?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/votes`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    const polls = pollsRes.ok ? await pollsRes.json() : { meta: { total: 0 } };
    const feedbacks = feedbacksRes.ok ? await feedbacksRes.json() : [];
    const votes = votesRes.ok ? await votesRes.json() : [];

    return {
      totalPolls: polls.meta?.total || 0,
      totalFeedbacks: Array.isArray(feedbacks) ? feedbacks.length : 0,
      totalVotes: Array.isArray(votes) ? votes.length : 0,
    };
  } catch {
    return null;
  }
}

async function getRecentPolls() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return [];

  try {
    const res = await fetch(
      `${API_BASE_URL}/polls?limit=5&sort=createdAt&order=desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const [stats, recentPolls] = await Promise.all([
    getStats(),
    getRecentPolls(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage polls, review feedback, and monitor platform activity.
          </p>
        </div>
        <Link href="/admin/polls/create">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Polls</p>
              <p className="text-2xl font-bold">{stats?.totalPolls ?? "--"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3">
              <Vote className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Votes</p>
              <p className="text-2xl font-bold">{stats?.totalVotes ?? "--"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <MessageSquare className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Feedback Items</p>
              <p className="text-2xl font-bold">
                {stats?.totalFeedbacks ?? "--"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Polls</p>
              <p className="text-2xl font-bold">
                {recentPolls?.filter((p: any) => p.isActive).length ?? "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Polls */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Polls</h2>
          <Link
            href="/admin/polls"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentPolls && recentPolls.length > 0 ? (
          <div className="space-y-3">
            {recentPolls.map((poll: any) => (
              <Link
                key={poll.id}
                href={`/admin/polls/${poll.id}`}
                className="flex items-center justify-between rounded-xl border border-border/30 bg-background/50 p-4 transition-colors hover:bg-card"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{poll.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {poll.description || "No description"}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      poll.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {poll.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {poll._count?.votes ?? 0} votes
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No polls created yet.</p>
            <Link href="/admin/polls/create">
              <Button variant="outline" className="mt-4">
                Create your first poll
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/polls/create"
          className="group rounded-2xl border border-border/50 bg-card/30 p-6 transition-all hover:border-primary/50 hover:bg-card/50"
        >
          <div className="mb-3 rounded-xl bg-primary/10 p-3 w-fit">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            Create New Poll
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up a new poll with multiple options
          </p>
        </Link>

        <Link
          href="/admin/polls"
          className="group rounded-2xl border border-border/50 bg-card/30 p-6 transition-all hover:border-primary/50 hover:bg-card/50"
        >
          <div className="mb-3 rounded-xl bg-accent/10 p-3 w-fit">
            <BarChart3 className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            Manage Polls
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit, delete, or view poll results
          </p>
        </Link>

        <Link
          href="/admin/feedbacks"
          className="group rounded-2xl border border-border/50 bg-card/30 p-6 transition-all hover:border-primary/50 hover:bg-card/50"
        >
          <div className="mb-3 rounded-xl bg-green-500/10 p-3 w-fit">
            <MessageSquare className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            View Feedback
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Read user feedback and comments
          </p>
        </Link>
      </div>
    </div>
  );
}
