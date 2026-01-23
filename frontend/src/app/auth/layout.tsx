import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Vote } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication | VoteSphere",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <Link href="/" className="relative mb-8 flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Vote className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-bold gradient-text">VoteSphere</span>
      </Link>

      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 shadow-xl">{children}</div>
      </div>

      <p className="relative mt-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} VoteSphere. All rights reserved.
      </p>
    </div>
  );
}
