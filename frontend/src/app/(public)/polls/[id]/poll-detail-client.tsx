"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Calendar, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VotingOptions } from "@/components/voting-options";
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

function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
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

  if (days > 0) return `${days} days left`;
  if (hours > 0) return `${hours} hours left`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes} min left`;
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
  const [timeFilter, setTimeFilter] = useState("All");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Red Header Bar */}
      <div className="bg-red-600 h-2" />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poll Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src="/layout.png"
                      alt={poll.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Poll Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-slate-800 mb-3 leading-tight">
                    {poll.title}
                  </h1>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <span className="text-slate-600 font-medium">
                      @sajhamanch
                    </span>
                    <span className="text-slate-400 text-sm">
                      {formatShortDate(poll.createdAt)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {voteCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {timeRemaining}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Chart Header */}
              <div className="flex items-center justify-between mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
                  <ChevronDown className="h-4 w-4" />
                  All outcomes
                </button>

                <div className="flex gap-1">
                  {["1H", "24H", "7D", "All"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timeFilter === filter
                          ? "bg-slate-800 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Placeholder - Simple visualization */}
              <div className="h-64 border border-slate-200 rounded-lg p-4 flex items-end justify-around gap-2">
                {poll.options?.map((option, idx) => {
                  const result = results?.results.find(
                    (r) => r.optionId === option.id,
                  );
                  const percentage =
                    result?.percentage ?? (idx === 0 ? 70 : 30);
                  return (
                    <div
                      key={option.id}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <div
                        className={`w-full rounded-t-lg ${idx === 0 ? "bg-blue-500" : "bg-orange-400"}`}
                        style={{ height: `${percentage * 2}px` }}
                      />
                      <span className="text-xs text-slate-500">
                        {option.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                {poll.options?.map((option, idx) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${idx === 0 ? "bg-blue-500" : "bg-orange-400"}`}
                    />
                    <span className="text-slate-600">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <Star className="h-5 w-5 text-amber-500" />
                  Rules
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400" />
              </button>
              <div className="px-4 pb-4 text-sm text-slate-600">
                <p>
                  This poll measures public opinion among verified SajhaManch
                  users. Each user may cast one vote per poll.
                </p>
              </div>
            </div>

            {/* Description */}
            {poll.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-slate-700 mb-3">
                  Description
                </h3>
                <p className="text-slate-600">{poll.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Current Results Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-center font-semibold text-slate-700 mb-4">
                Current Results
              </h3>

              <div className="space-y-4">
                {poll.options?.map((option, idx) => {
                  const result = results?.results.find(
                    (r) => r.optionId === option.id,
                  );
                  const percentage =
                    result?.percentage ?? (idx === 0 ? 80 : 20);
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">
                          {option.name}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? "bg-gradient-to-r from-purple-400 to-pink-400"
                              : "bg-gradient-to-r from-slate-300 to-slate-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sign in to Vote / Vote Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {!isAuthenticated ? (
                <>
                  <h3 className="text-center font-semibold text-slate-700 mb-2">
                    Sign in to Vote
                  </h3>
                  <p className="text-center text-sm text-slate-500 mb-4">
                    You need to be signed in to vote in this platform.
                  </p>
                  <Link href={`/auth/login?redirectTo=/polls/${poll.id}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12">
                      Sign in
                    </Button>
                  </Link>
                </>
              ) : hasVoted ? (
                <>
                  <h3 className="text-center font-semibold text-slate-700 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-center text-sm text-slate-500">
                    Your vote has been recorded.
                  </p>
                </>
              ) : isActive && poll.options ? (
                <>
                  <h3 className="text-center font-semibold text-slate-700 mb-4">
                    Cast Your Vote
                  </h3>
                  <VotingOptions
                    pollId={poll.id}
                    options={poll.options}
                    hasVoted={hasVoted}
                    isActive={isActive}
                    isAuthenticated={isAuthenticated}
                    onVoteSuccess={handleVoteSuccess}
                  />
                </>
              ) : (
                <p className="text-center text-sm text-slate-500">
                  This poll is no longer accepting votes.
                </p>
              )}
            </div>

            {/* Poll Metadata */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Poll Metadata</h3>
                <span className="text-sm text-slate-500">PID #{poll.id}</span>
              </div>

              <div className="space-y-3">
                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                    Poll
                  </Badge>
                  <Badge variant="outline" className="text-slate-600">
                    Single
                  </Badge>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"} hover:bg-emerald-100 border-0`}
                  >
                    {isActive ? "Active" : "Ended"}
                  </Badge>
                  {poll.endsAt && (
                    <span className="text-xs text-slate-500">
                      Ends: {formatDate(poll.endsAt)}
                    </span>
                  )}
                </div>

                {/* Created */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-slate-600">
                    Created
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {formatDate(poll.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <FeedbackForm pollId={poll.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
