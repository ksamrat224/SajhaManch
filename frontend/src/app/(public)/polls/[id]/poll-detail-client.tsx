"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Users, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VotingOptions } from "@/components/voting-options";
import { ResultsList } from "@/components/results-bar";
import { FeedbackForm } from "@/components/feedback-form";
import type { Poll, PollResults } from "@/types";

interface PollDetailClientProps {
  poll: Poll;
  initialHasVoted: boolean;
  initialResults: PollResults | null;
  isAuthenticated: boolean;
  isActive: boolean;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeRemaining(endsAt: string | null): string {
  if (!endsAt) return "No deadline";

  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes} minutes remaining`;
}

export function PollDetailClient({
  poll,
  initialHasVoted,
  initialResults,
  isAuthenticated,
  isActive,
}: PollDetailClientProps) {
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [results, setResults] = useState<PollResults | null>(initialResults);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const timeRemaining = getTimeRemaining(poll.endsAt);
  const voteCount = poll._count?.votes ?? results?.totalVotes ?? 0;

  const fetchResults = useCallback(async () => {
    setIsLoadingResults(true);
    try {
      const res = await fetch(`/api/votes/poll/${poll.id}/results`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsLoadingResults(false);
    }
  }, [poll.id]);

  const handleVoteSuccess = () => {
    setHasVoted(true);
    fetchResults();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: poll.title,
        text: poll.description || "Check out this poll!",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/polls"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to polls
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Poll header */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {isActive ? (
                <Badge className="bg-primary/90">Active</Badge>
              ) : (
                <Badge variant="secondary">
                  {timeRemaining === "Ended" ? "Ended" : "Inactive"}
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {timeRemaining}
              </Badge>
            </div>

            <h1 className="mb-3 text-2xl font-bold lg:text-3xl">
              {poll.title}
            </h1>

            {poll.description && (
              <p className="mb-4 text-muted-foreground">{poll.description}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {voteCount} vote{voteCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {formatDate(poll.createdAt)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="ml-auto gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Voting section */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {hasVoted || !isActive ? "Poll Results" : "Cast Your Vote"}
            </h2>

            {poll.options && !hasVoted && isActive ? (
              <VotingOptions
                pollId={poll.id}
                options={poll.options}
                hasVoted={hasVoted}
                isActive={isActive}
                isAuthenticated={isAuthenticated}
                onVoteSuccess={handleVoteSuccess}
              />
            ) : results ? (
              <ResultsList
                results={results.results}
                winners={results.winners}
                totalVotes={results.totalVotes}
              />
            ) : isLoadingResults ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading results...
              </div>
            ) : hasVoted ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>You have voted! Loading results...</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchResults}
                  className="mt-4"
                >
                  Refresh Results
                </Button>
              </div>
            ) : !isAuthenticated ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  Please log in to vote and see results
                </p>
                <Link href={`/auth/login?redirectTo=/polls/${poll.id}`}>
                  <Button>Log in to Vote</Button>
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                This poll is no longer accepting votes
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poll options summary */}
          {poll.options && poll.options.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <h3 className="mb-3 font-semibold">Options</h3>
              <div className="space-y-2">
                {poll.options.map((option) => (
                  <div
                    key={option.id}
                    className="rounded-lg bg-secondary/30 px-3 py-2 text-sm"
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Poll info */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <h3 className="mb-3 font-semibold">Poll Info</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium">
                  {isActive ? "Active" : "Inactive"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Votes</dt>
                <dd className="font-medium">{voteCount}</dd>
              </div>
              {poll.endsAt && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Ends</dt>
                  <dd className="font-medium text-right text-xs">
                    {formatDate(poll.endsAt)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Feedback form */}
          <FeedbackForm pollId={poll.id} />
        </div>
      </div>
    </section>
  );
}
