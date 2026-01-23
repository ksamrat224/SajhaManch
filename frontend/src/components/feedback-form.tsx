"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, Send, CheckCircle } from "lucide-react";

interface FeedbackFormProps {
  pollId: number;
}

export function FeedbackForm({ pollId }: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, pollId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit feedback");
      }

      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Share Feedback</h3>
      </div>

      {success ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-4 text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span>Thank you for your feedback!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts about this poll..."
            className="min-h-[100px] resize-none bg-background/50"
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
