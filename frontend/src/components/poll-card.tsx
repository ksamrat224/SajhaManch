"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  const hasOptions = poll.options && poll.options.length > 0;
  const isYesNo =
    hasOptions &&
    poll.options!.length === 2 &&
    poll.options!.some((o) => o.name.toLowerCase() === "yes") &&
    poll.options!.some((o) => o.name.toLowerCase() === "no");

  // Calculate a mock conviction percentage based on votes (for display purposes)
  const convictionPercent = Math.min(Math.max(voteCount * 3, 5), 100);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      {/* Header with badges */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status dot */}
          <span
            className={`w-2.5 h-2.5 rounded-full ${poll.isActive && !isEnded ? "bg-emerald-500" : "bg-slate-500"}`}
          />

          {/* Tags */}
          <Badge className="bg-red-500/90 hover:bg-red-500 text-white text-xs border-0">
            Poll
          </Badge>
          <Badge
            variant="outline"
            className="text-slate-300 border-slate-600 text-xs"
          >
            Single
          </Badge>
          {showVoteCount && (
            <Badge
              variant="outline"
              className="text-slate-400 border-slate-600 text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              {voteCount}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="text-slate-400 border-slate-600 text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Nepal
          </Badge>

          {hasVoted && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs ml-auto">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Voted
            </Badge>
          )}
        </div>
      </div>

      {/* Main content with link */}
      <Link href={`/polls/${poll.id}`} className="block px-4">
        <div className="flex gap-3">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
            <Image
              src="/layout.png"
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title and time */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold leading-tight line-clamp-2 hover:text-emerald-400 transition-colors">
              {poll.title}
            </h3>
            <div className="flex items-center gap-1 mt-1.5 text-slate-400 text-xs">
              <Clock className="h-3 w-3" />
              <span>{timeRemaining}</span>
            </div>
          </div>
        </div>

        {/* Conviction bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-slate-400 text-xs">Conviction</span>
            <span className="text-slate-300 text-xs font-medium">
              {convictionPercent}%
            </span>
          </div>
          <Progress value={convictionPercent} className="h-1.5 bg-slate-700" />
        </div>
      </Link>

      {/* Vote buttons */}
      <div className="px-4 py-4 mt-2">
        {isYesNo ? (
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium h-10"
              onClick={(e) => e.stopPropagation()}
            >
              Yes
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium h-10"
              onClick={(e) => e.stopPropagation()}
            >
              No
            </Button>
          </div>
        ) : hasOptions ? (
          <Link href={`/polls/${poll.id}`}>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium h-10 justify-between">
              <span>{poll.options![0]?.name || "Select Option"}</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </Link>
        ) : (
          <Link href={`/polls/${poll.id}`}>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium h-10">
              Vote Now
            </Button>
          </Link>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
            S
          </div>
          <span>@sajhamanch</span>
        </div>
        <span>
          {new Date(poll.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
