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
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
        {/* Colorful header with gradient */}
        <div className="relative h-32 bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />

          {/* Status badges */}
          <div className="relative mb-2 flex items-center gap-2">
            {poll.isActive && !isEnded ? (
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Active
              </Badge>
            ) : (
              <Badge className="bg-black/20 text-white border-white/20 backdrop-blur-sm">
                {isEnded ? "Ended" : "Inactive"}
              </Badge>
            )}
            {hasVoted && (
              <Badge className="bg-accent/20 text-white border-white/30 backdrop-blur-sm">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Voted
              </Badge>
            )}
          </div>

          {/* Title on colored background */}
          <h3 className="relative text-lg font-bold leading-tight text-white line-clamp-2">
            {poll.title}
          </h3>
        </div>

        {/* Content section */}
        <div className="p-4">
          {/* Description */}
          {poll.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {poll.description}
            </p>
          )}

          {/* Footer info */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{timeRemaining}</span>
              </span>
              {showVoteCount && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-secondary" />
                  <span className="font-medium">{voteCount}</span>
                </span>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </div>
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
    </Link>
  );
}
