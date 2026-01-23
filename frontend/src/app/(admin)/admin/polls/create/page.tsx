import type { Metadata } from "next";
import { CreatePollForm } from "./create-poll-form";

export const metadata: Metadata = {
  title: "Create Poll | Admin Dashboard",
};

export default function CreatePollPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Poll</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up a new poll with multiple voting options.
        </p>
      </div>

      <CreatePollForm />
    </div>
  );
}
