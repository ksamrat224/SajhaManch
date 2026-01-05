import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Live Polls | Voting & Feedback",
  description:
    "Vote on trending polls, see top questions, and watch real-time results.",
};

export default function LandingPage() {
  // TODO: Fetch trending and top polls from backend using server components
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        <p className="inline-flex rounded-full border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
          Real-time voting &amp; feedback
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Create polls, collect votes, and see{" "}
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            live results
          </span>
          .
        </h1>
        <p className="max-w-xl text-sm text-zinc-300">
          A fast, real-time voting platform powered by NestJS &amp; Next.js.
          Join live polls, share feedback, and visualize results instantly.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/(auth)/register"
            className="rounded-full bg-white px-5 py-2 font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Get started
          </Link>
          <Link
            href="/polls"
            className="rounded-full border border-zinc-700 px-5 py-2 text-zinc-200 hover:border-zinc-500"
          >
            Browse polls
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-zinc-300 sm:max-w-md">
          <div>
            <div className="text-lg font-semibold text-white">Real-time</div>
            <p>Live vote updates via WebSockets.</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">Secure</div>
            <p>JWT auth with role-based access.</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">Insights</div>
            <p>Top &amp; trending polls at a glance.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-200">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Live stats
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2">
            <span className="text-zinc-400">Online users</span>
            <span className="font-semibold text-violet-300">--</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2">
            <span className="text-zinc-400">Active polls</span>
            <span className="font-semibold">--</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2">
            <span className="text-zinc-400">Votes today</span>
            <span className="font-semibold">--</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          Upcoming: this panel will stream live stats from your NestJS
          WebSocket gateway.
        </p>
      </div>
    </section>
  );
}


