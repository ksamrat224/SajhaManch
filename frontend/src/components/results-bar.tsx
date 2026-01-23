"use client";

import { cn } from "@/lib/utils";
import type { PollResult } from "@/types";

interface ResultsBarProps {
  result: PollResult;
  isWinner?: boolean;
  isSelected?: boolean;
  showAnimation?: boolean;
}

export function ResultsBar({
  result,
  isWinner = false,
  isSelected = false,
  showAnimation = true,
}: ResultsBarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all",
        isWinner
          ? "border-primary/50 bg-primary/10"
          : "border-border/50 bg-card/50",
        isSelected && "ring-2 ring-primary/50",
      )}
    >
      {/* Progress bar background */}
      <div
        className={cn(
          "absolute inset-0 origin-left",
          isWinner ? "bg-primary/20" : "bg-secondary/30",
          showAnimation && "progress-animate",
        )}
        style={{ width: `${result.percentage}%` }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isWinner && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              🏆
            </span>
          )}
          <span
            className={cn(
              "font-medium",
              isWinner ? "text-primary" : "text-foreground",
            )}
          >
            {result.optionName}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            {result.voteCount} vote{result.voteCount !== 1 ? "s" : ""}
          </span>
          <span
            className={cn(
              "min-w-[3rem] text-right font-semibold",
              isWinner ? "text-primary" : "text-foreground",
            )}
          >
            {result.percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface ResultsListProps {
  results: PollResult[];
  winners: { optionId: number }[];
  selectedOptionId?: number;
  totalVotes: number;
}

export function ResultsList({
  results,
  winners,
  selectedOptionId,
  totalVotes,
}: ResultsListProps) {
  const winnerIds = winners.map((w) => w.optionId);

  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total votes</span>
        <span className="font-semibold text-foreground">{totalVotes}</span>
      </div>

      {results.map((result) => (
        <ResultsBar
          key={result.optionId}
          result={result}
          isWinner={winnerIds.includes(result.optionId)}
          isSelected={selectedOptionId === result.optionId}
        />
      ))}
    </div>
  );
}
