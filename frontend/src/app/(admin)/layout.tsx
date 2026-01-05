import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/user");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-violet-200">
            Admin · Voting &amp; Feedback
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-300">
            <span className="text-xs text-zinc-400">
              {user.name || user.email}
            </span>
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

