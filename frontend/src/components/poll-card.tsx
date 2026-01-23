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
      <div className="group relative flex flex-col justify-between h-full bg-card rounded-xl border border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg p-5">
        
        {/* Top: Status Badges */}
        <div className="flex items-center justify-between mb-3">
           <div className="flex gap-2">
             {poll.isActive && !isEnded ? (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {isEnded ? "Ended" : "Inactive"}
                </Badge>
              )}
           </div>
           {hasVoted && (
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Voted
              </Badge>
            )}
        </div>

        {/* Middle: Title & Description */}
        <div className="mb-4">
          <h3 className="text-lg font-bold leading-snug text-foreground mb-2 group-hover:text-primary transition-colors font-heading">
            {poll.title}
          </h3>
          {poll.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {poll.description}
            </p>
          )}
        </div>

        {/* Bottom: Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
             <span className="flex items-center gap-1.5">
               <Clock className="h-3.5 w-3.5 text-primary/70" />
               {timeRemaining}
             </span>
             {showVoteCount && (
               <span className="flex items-center gap-1.5">
                 <Users className="h-3.5 w-3.5 text-primary/70" />
                 {voteCount} votes
               </span>
             )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
