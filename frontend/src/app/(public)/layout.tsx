import type { ReactNode } from "react";
import Link from "next/link";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold">
            Voting &amp; Feedback
          </Link>
          <nav className="flex gap-4 text-sm text-zinc-300">
            <Link href="/polls" className="hover:text-white">
              Polls
            </Link>
            <Link href="/auth/login" className="hover:text-white">
              Login
            </Link>
            <Link href="/auth/register" className="hover:text-white">
              Register
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} Voting &amp; Feedback System
      </footer>
    </div>
  );
}
