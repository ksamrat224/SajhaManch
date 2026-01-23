"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Poll, PollOption } from "@/types";

const schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be at most 200 characters"),
  isActive: z.boolean(),
  endsAt: z.string().min(1, "End date is required"),
});

type FormValues = z.infer<typeof schema>;

interface EditPollFormProps {
  poll: Poll;
}

export function EditPollForm({ poll }: EditPollFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<PollOption[]>(poll.options || []);
  const [newOptionName, setNewOptionName] = useState("");
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [isDeletingOption, setIsDeletingOption] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: poll.title,
      description: poll.description || "",
      isActive: poll.isActive,
      endsAt: poll.endsAt
        ? new Date(poll.endsAt).toISOString().slice(0, 16)
        : "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/polls/${poll.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          isActive: values.isActive,
          endsAt: new Date(values.endsAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update poll");
      }

      router.push("/admin/polls");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update poll";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOption = async () => {
    if (!newOptionName.trim()) return;

    setIsAddingOption(true);
    try {
      const res = await fetch("/api/poll-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newOptionName,
          pollId: poll.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add option");
      }

      const newOption = await res.json();
      setOptions([...options, newOption]);
      setNewOptionName("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add option";
      setError(message);
    } finally {
      setIsAddingOption(false);
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    if (options.length <= 2) {
      setError("Poll must have at least 2 options");
      return;
    }

    setIsDeletingOption(optionId);
    try {
      const res = await fetch(`/api/poll-options/${optionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete option");
      }

      setOptions(options.filter((o) => o.id !== optionId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete option";
      setError(message);
    } finally {
      setIsDeletingOption(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
      <Link
        href="/admin/polls"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to polls
      </Link>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poll Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What's your question?"
                    className="bg-background/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide more context about this poll..."
                    className="bg-background/50 min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="bg-background/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border border-border/50 bg-background/30 p-4">
                <div>
                  <FormLabel className="text-base">Active Poll</FormLabel>
                  <FormDescription>
                    Allow users to vote on this poll
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Options Section */}
          <div className="space-y-4">
            <div>
              <FormLabel className="text-base">Poll Options</FormLabel>
              <p className="text-sm text-muted-foreground">
                Manage the voting options for this poll
              </p>
            </div>

            <div className="space-y-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-lg bg-background/30 px-4 py-3"
                >
                  <span>{option.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDeleteOption(option.id)}
                    disabled={
                      isDeletingOption === option.id || options.length <= 2
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {isDeletingOption === option.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="New option name"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                className="bg-background/50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddOption}
                disabled={!newOptionName.trim() || isAddingOption}
              >
                {isAddingOption ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Link href="/admin/polls">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
