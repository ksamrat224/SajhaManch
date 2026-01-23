import type { ReactNode } from "react";
import Link from "next/link";
import { Vote, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-fade-in font-sans">
      {/* Navbar: Clean White with Border */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-colors">
              <Vote className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight font-heading">
              SajhaManch
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/polls"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Vote
            </Link>
            <Link
              href="/results"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Results
            </Link>
            <Link
              href="/mission"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Mission
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="gap-2 bg-red-500 hover:from-red-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all border-0"
              >
                Join Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-primary/10">
                <Vote className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">SajhaManch</span>
            </div>

            <div className="text-sm text-muted-foreground">
              Empowering voices through secure, transparent voting.
            </div>

            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-dashed border-border/40 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SajhaManch System. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
