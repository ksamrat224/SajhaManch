import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | Voting & Feedback",
};

export default function RegisterPage() {
  // TODO: Implement server action or API route to call NestJS /auth/register and set httpOnly token cookie
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Create an account</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Join the platform to create polls, vote, and see live insights.
      </p>
      <form className="space-y-4">
        <div className="space-y-1 text-sm">
          <label htmlFor="name" className="text-zinc-200">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none ring-0 focus:border-violet-400"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="text-zinc-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none ring-0 focus:border-violet-400"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="mobile" className="text-zinc-200">
            Mobile
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
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
          Create account
        </button>
      </form>
      <p className="mt-4 text-xs text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-violet-300 hover:text-violet-200"
        >
          Sign in
        </Link>
        .
      </p>
    </>
  );
}


