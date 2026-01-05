import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // TODO: Enforce ADMIN role in server components using /auth/profile
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-violet-200">
            Admin · Voting &amp; Feedback
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-300">
            <Link href="/admin" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/admin/polls" className="hover:text-white">
              Polls
            </Link>
            <Link href="/admin/feedbacks" className="hover:text-white">
              Feedbacks
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}


