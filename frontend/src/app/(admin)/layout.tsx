import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  Vote,
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  LogOut,
  Shield,
  Plus,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Vote className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:inline-block">
                SajhaManch
              </span>
            </Link>
            <Badge
              variant="outline"
              className="border-accent/50 text-accent gap-1 hidden sm:flex"
            >
              <Shield className="h-3 w-3" />
              Admin
            </Badge>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/admin/polls">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Polls</span>
              </Button>
            </Link>
            <Link href="/admin/feedbacks">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden md:inline">Feedbacks</span>
              </Button>
            </Link>
            <Link href="/admin/polls/create">
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Poll</span>
              </Button>
            </Link>

            <div className="mx-2 h-6 w-px bg-border/50 hidden sm:block" />

            {/* Admin Info */}
            <div className="hidden md:flex items-center gap-2 rounded-lg bg-card/50 border border-accent/30 px-3 py-1.5">
              <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="h-3 w-3 text-accent" />
              </div>
              <span className="text-sm font-medium truncate max-w-[100px]">
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
              <span className="text-sm">SajhaManch Admin Panel</span>
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
