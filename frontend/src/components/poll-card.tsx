"use client";

import Link from "next/link";
import { Clock, Users, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Poll } from "@/types";

interface PollCardProps {
  poll: Poll;
  hasVoted?: boolean;
  showVoteCount?: boolean;
}

function getTimeRemaining(endsAt: string | null): string {
  if (!endsAt) return "No deadline";

  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes} min${minutes > 1 ? "s" : ""} left`;
}

export function PollCard({
  poll,
  hasVoted,
  showVoteCount = true,
}: PollCardProps) {
  const timeRemaining = getTimeRemaining(poll.endsAt);
  const isEnded = timeRemaining === "Ended";
  const voteCount = poll._count?.votes ?? 0;

  return (
    <Link href={`/polls/${poll.id}`}>
      <div className="group relative rounded-2xl border border-border/50 bg-card/80 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
        {/* Status badges */}
        <div className="mb-3 flex items-center gap-2">
          {poll.isActive && !isEnded ? (
            <Badge
              variant="default"
              className="bg-primary/90 text-primary-foreground"
            >
              Active
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              {isEnded ? "Ended" : "Inactive"}
            </Badge>
          )}
          {hasVoted && (
            <Badge
              variant="outline"
              className="border-green-500/50 text-green-400"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Voted
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {poll.title}
        </h3>

        {/* Description */}
        {poll.description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {poll.description}
          </p>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeRemaining}
            </span>
            {showVoteCount && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {voteCount} vote{voteCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        {/* Options preview */}
        {poll.options && poll.options.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {poll.options.slice(0, 3).map((option) => (
              <span
                key={option.id}
                className="rounded-full bg-secondary/50 px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {option.name}
              </span>
            ))}
            {poll.options.length > 3 && (
              <span className="rounded-full bg-secondary/30 px-2.5 py-1 text-xs text-muted-foreground">
                +{poll.options.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
