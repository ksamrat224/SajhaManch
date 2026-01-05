import type { ReactNode } from "react";
import Link from "next/link";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold">
            Voting &amp; Feedback
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-300">
            <Link href="/user" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/user/votes" className="hover:text-white">
              My votes
            </Link>
            <Link href="/user/profile" className="hover:text-white">
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}


