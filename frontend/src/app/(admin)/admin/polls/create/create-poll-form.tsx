"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
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
import { Plus, X, Loader2, ArrowLeft } from "lucide-react";

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
  options: z
    .array(
      z.object({
        name: z.string().min(1, "Option name is required"),
      }),
    )
    .min(2, "At least 2 options are required"),
});

type FormValues = z.infer<typeof schema>;

export function CreatePollForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      isActive: true,
      endsAt: "",
      options: [{ name: "" }, { name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Create the poll first
      const pollRes = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          isActive: values.isActive,
          endsAt: new Date(values.endsAt).toISOString(),
        }),
      });

      if (!pollRes.ok) {
        const data = await pollRes.json();
        throw new Error(data.message || "Failed to create poll");
      }

      const poll = await pollRes.json();

      // Create poll options
      const optionPromises = values.options.map((option) =>
        fetch("/api/poll-options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: option.name,
            pollId: poll.id,
          }),
        }),
      );

      const optionResults = await Promise.all(optionPromises);

      // Check if any option failed
      for (const res of optionResults) {
        if (!res.ok) {
          throw new Error("Failed to create some poll options");
        }
      }

      router.push("/admin/polls");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create poll";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get default end date (7 days from now)
  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 16);
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
                <FormDescription>
                  A clear, concise question for voters (5-50 characters)
                </FormDescription>
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
                <FormDescription>
                  Additional details to help voters understand the poll (10-200
                  characters)
                </FormDescription>
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
                    min={new Date().toISOString().slice(0, 16)}
                    {...field}
                  />
                </FormControl>
                <FormDescription>When should voting close?</FormDescription>
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
                    Allow users to vote on this poll immediately
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

          {/* Poll Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <FormLabel className="text-base">Poll Options</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Add at least 2 options for voters to choose from
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "" })}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder={`Option ${index + 1}`}
                            className="bg-background/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {form.formState.errors.options?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.options.root.message}
              </p>
            )}
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
                  Creating...
                </>
              ) : (
                "Create Poll"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
