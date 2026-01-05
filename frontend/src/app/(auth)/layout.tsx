import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50">
      <Link
        href="/"
        className="mb-8 text-sm font-semibold tracking-tight text-zinc-200"
      >
        Voting &amp; Feedback
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}


