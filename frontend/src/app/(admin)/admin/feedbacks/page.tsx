import type { Metadata } from "next";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { MessageSquare, Calendar } from "lucide-react";
import type { Feedback } from "@/types";

export const metadata: Metadata = {
  title: "Feedback | Admin Dashboard",
};

async function getFeedbacks(): Promise<Feedback[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/feedbacks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminFeedbacksPage() {
  const feedbacks = await getFeedbacks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage feedback submitted by users.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 rounded-2xl border border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{feedbacks.length}</p>
            <p className="text-sm text-muted-foreground">Total Feedback</p>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-2xl border border-border/50 bg-card/50 p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Poll #{feedback.pollId}
                  </span>
                  {feedback.userId && (
                    <span className="text-xs">User #{feedback.userId}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(feedback.createdAt)}
                </div>
              </div>
              <p className="text-foreground">{feedback.message}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card/30 py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              No feedback submitted yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              User feedback will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
