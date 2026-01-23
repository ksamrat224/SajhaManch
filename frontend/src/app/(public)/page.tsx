import type { Metadata } from "next";
import Link from "next/link";
import {
  Vote,
  Shield,
  ArrowRight,
  TrendingUp,
  Globe,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "SajhaManch | Every Voice Matters",
  description:
    "Participate in transparent, secure, and real-time voting on SajhaManch.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/layout.png')" }}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl  font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl mb-6 drop-shadow-lg font-heading">
            Every Voice Matters
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/90 mb-10 font-light leading-relaxed drop-shadow-md">
            Join the community of changemakers. Participate in transparent,
            secure, and real-time decision making processes that shape our
            future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/polls">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-white/90 hover:scale-105 transition-transform shadow-lg font-semibold rounded-full"
              >
                View Active Polls
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-2 border-white/50 text-white hover:bg-white/20 hover:text-white hover:border-white transition-all rounded-full bg-white/10 backdrop-blur-sm"
              >
                Start a Poll
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 font-heading">
              Why Vote with SajhaManch?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a robust platform designed for transparency, security,
              and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Secure & Transparent"
              description="Every vote is recorded securely. Our platform ensures fairness and transparency in every poll."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
              title="Real-Time Results"
              description="Watch the impact of your vote instantly with live updated charts and statistics."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-primary" />}
              title="Global Community"
              description="Connect with people worldwide. Share your opinion on topics that matter to everyone."
            />
          </div>
        </div>
      </section>

      {/* Stats/Call to Action Strip */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">
              Ready to make an impact?
            </h3>
            <p className="text-slate-400">
              Join thousands of users making their voices heard today.
            </p>
          </div>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
            >
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center __text-center p-8 bg-card rounded-2xl shadow-sm border border-border/40 hover:shadow-md transition-shadow">
      <div className="mb-6 p-4 bg-primary/5 rounded-2xl">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-foreground font-heading">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
}
