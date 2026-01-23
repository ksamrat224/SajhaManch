import type { Metadata } from "next";
import Link from "next/link";
import {
  Vote,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  Users,
  BarChart3,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

export const metadata: Metadata = {
  title: "VoteSphere | Real-time Polling Platform",
  description:
    "Vote on trending polls, see top questions, and watch real-time results.",
};

async function getStats() {
  try {
    const pollsRes = await fetch(`${API_BASE_URL}/polls?limit=1`, {
      next: { revalidate: 60 },
    });
    const polls = await pollsRes.json();
    return {
      activePolls: polls.meta?.total || 0,
    };
  } catch {
    return { activePolls: 0 };
  }
}

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
            {/* Hero Text */}
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Activity className="h-4 w-4" />
                Real-time voting platform
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Create polls,{" "}
                <span className="gradient-text">collect votes,</span> see{" "}
                <span className="text-primary">live results</span>
              </h1>

              <p className="max-w-xl text-lg text-muted-foreground">
                A fast, real-time voting platform powered by NestJS & Next.js.
                Join live polls, share feedback, and visualize results
                instantly.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/polls">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Browse Polls
                  </Button>
                </Link>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Real-time</h3>
                  <p className="text-sm text-muted-foreground">
                    Live vote updates via WebSockets
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    JWT auth with role-based access
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Top & trending polls at a glance
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="flex-1 max-w-md">
              <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Live Stats
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-card/80 border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-muted-foreground">
                        Online Users
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-primary">--</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-card/80 border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-muted-foreground">
                        Active Polls
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-accent">
                      {stats.activePolls}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-card/80 border border-border/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Vote className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-muted-foreground">Votes Today</span>
                    </div>
                    <span className="text-2xl font-bold text-green-500">
                      --
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-xs text-muted-foreground text-center">
                  Stats update in real-time via WebSocket connection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to start voting?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join thousands of users who trust VoteSphere for their polling
              needs.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/polls">
                <Button size="lg" variant="outline">
                  Explore Polls
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
