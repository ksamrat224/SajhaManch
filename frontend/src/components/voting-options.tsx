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
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
        <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
        <p className="font-medium text-green-400">You have already voted!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          View the results below
        </p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="rounded-xl border border-muted bg-muted/30 p-4 text-center">
        <p className="font-medium text-muted-foreground">
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

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            disabled={isSubmitting}
            className={cn(
              "poll-option w-full rounded-xl border p-4 text-left transition-all",
              selectedOption === option.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-border/50 bg-card/50 hover:border-primary/30",
              isSubmitting && "cursor-not-allowed opacity-50",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  selectedOption === option.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/50",
                )}
              >
                {selectedOption === option.id && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
              <span className="font-medium">{option.name}</span>
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={handleVote}
        disabled={!selectedOption || isSubmitting}
        className="vote-btn w-full gap-2 rounded-xl bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Vote className="h-5 w-5" />
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
