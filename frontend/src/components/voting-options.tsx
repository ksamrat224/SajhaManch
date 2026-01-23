"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Vote } from "lucide-react";
import type { PollOption } from "@/types";

interface VotingOptionsProps {
  pollId: number;
  options: PollOption[];
  hasVoted: boolean;
  isActive: boolean;
  isAuthenticated: boolean;
  onVoteSuccess?: () => void;
}

export function VotingOptions({
  pollId,
  options,
  hasVoted,
  isActive,
  isAuthenticated,
  onVoteSuccess,
}: VotingOptionsProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    if (!selectedOption) return;

    if (!isAuthenticated) {
      router.push(`/auth/login?redirectTo=/polls/${pollId}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId,
          pollOptionId: selectedOption,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit vote");
      }

      onVoteSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="rounded-2xl border-2 border-accent bg-accent/10 p-6 text-center">
        <Check className="mx-auto mb-3 h-12 w-12 text-accent" />
        <p className="text-lg font-bold text-accent">You have already voted!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          View the results below
        </p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="rounded-2xl border-2 border-border bg-muted p-6 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          This poll is no longer accepting votes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            disabled={isSubmitting}
            className={cn(
              "poll-option w-full rounded-xl border-2 p-5 text-left font-semibold text-lg transition-all hover:scale-[1.02]",
              selectedOption === option.id
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                : "border-border bg-white hover:border-primary/50 hover:shadow-md",
              isSubmitting && "cursor-not-allowed opacity-50",
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border-3 transition-colors",
                  selectedOption === option.id
                    ? "border-white bg-white"
                    : "border-muted-foreground/50 bg-transparent",
                )}
              >
                {selectedOption === option.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <span>{option.name}</span>
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleVote}
        disabled={!selectedOption || isSubmitting}
        className="w-full gap-3 rounded-xl bg-primary py-7 text-lg font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl transition-all"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Vote className="h-6 w-6" />
            {isAuthenticated ? "Cast Your Vote" : "Login to Vote"}
          </>
        )}
      </Button>

      {!isAuthenticated && (
        <p className="text-center text-sm text-muted-foreground">
          You need to{" "}
          <a href="/auth/login" className="text-primary hover:underline">
            log in
          </a>{" "}
          to vote
        </p>
      )}
    </div>
  );
}
