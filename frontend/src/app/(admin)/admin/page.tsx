import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard | Voting & Feedback",
};

export default function AdminDashboardPage() {
  // TODO: Fetch admin metrics: total polls, total votes, recent feedbacks
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="text-sm text-zinc-400">
        Manage polls, review feedback, and monitor platform health.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs text-zinc-400">Total polls</p>
          <p className="mt-2 text-2xl font-semibold">--</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs text-zinc-400">Total votes</p>
          <p className="mt-2 text-2xl font-semibold">--</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm">
          <p className="text-xs text-zinc-400">Feedback items</p>
          <p className="mt-2 text-2xl font-semibold">--</p>
        </div>
      </div>
    </div>
  );
}
