import type { ReactNode } from "react";
import Link from "next/link";
import { Vote, LogIn, UserPlus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header with bright red background like janamat */}
      <header className="sticky top-0 z-50 bg-primary shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 transition-colors group-hover:bg-white/30">
              <Vote className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline-block">
              VoteSphere
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/polls">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-white/90 hover:text-white hover:bg-white/10"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Polls</span>
              </Button>
            </Link>
            <div className="mx-2 h-6 w-px bg-white/20 hidden sm:block" />
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-white/90 hover:text-white hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Register</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              <span className="font-semibold">VoteSphere</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VoteSphere. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link
                href="/polls"
                className="hover:text-foreground transition-colors"
              >
                Browse Polls
              </Link>
              <Link
                href="/auth/login"
                className="hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
