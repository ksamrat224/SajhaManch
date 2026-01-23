import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  Vote,
  LayoutDashboard,
  History,
  User,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Vote className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:inline-block">
              VoteSphere
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/polls">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Polls</span>
              </Button>
            </Link>
            <Link href="/user">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/user/votes">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">My Votes</span>
              </Button>
            </Link>
            <Link href="/user/profile">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>

            <div className="mx-2 h-6 w-px bg-border/50" />

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-card/50 border border-border/50 px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {((user.name || user.email) ?? "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium truncate max-w-[120px]">
                {user.name || user.email}
              </span>
            </div>

            <form action="/api/auth/logout" method="POST">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Vote className="h-4 w-4" />
              <span className="text-sm">VoteSphere</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
