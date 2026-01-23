"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Phone, Shield, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(1, "Mobile is required"),
});

type FormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  profile: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    role: string;
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  profile.role === "ADMIN"
                    ? "border-primary/50 text-primary"
                    : "border-accent/50 text-accent"
                }
              >
                <Shield className="mr-1 h-3 w-3" />
                {profile.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
        <h3 className="mb-4 font-semibold">Account Information</h3>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
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
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" className="bg-background/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
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

      {/* Logout */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
        <h3 className="mb-2 font-semibold">Session</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Sign out of your account on this device.
        </p>
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
