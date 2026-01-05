import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Voting & Feedback",
};

export default function LoginPage() {
  // TODO: Implement server action or API route to call NestJS /auth/login and set httpOnly token cookie
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Login</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Sign in to vote on polls, track your results, and access your dashboard.
      </p>
      <form className="space-y-4">
        <div className="space-y-1 text-sm">
          <label htmlFor="username" className="text-zinc-200">
            Email or mobile
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none ring-0 focus:border-violet-400"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="text-zinc-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none ring-0 focus:border-violet-400"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-white py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Continue
        </button>
      </form>
      <p className="mt-4 text-xs text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-violet-300 hover:text-violet-200"
        >
          Create one
        </Link>
        .
      </p>
    </>
  );
}


