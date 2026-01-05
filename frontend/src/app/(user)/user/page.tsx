import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My dashboard | Voting & Feedback",
};

export default function UserDashboardPage() {
  // TODO: Fetch /auth/profile and user-specific stats (e.g., total votes, recent polls)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">My dashboard</h1>
      <p className="text-sm text-zinc-400">
        Overview of your activity, recent votes, and saved polls.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs text-zinc-400">Total votes</p>
          <p className="mt-2 text-2xl font-semibold">--</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs text-zinc-400">Active polls</p>
          <p className="mt-2 text-2xl font-semibold">--</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs text-zinc-400">Feedback submitted</p>
          <p className="mt-2 text-2xl font-semibold">--</p>
        </div>
      </div>
    </div>
  );
}

