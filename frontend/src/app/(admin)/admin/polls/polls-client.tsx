"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Poll, PollsResponse } from "@/types";

interface AdminPollsClientProps {
  initialData: PollsResponse | null;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminPollsClient({ initialData }: AdminPollsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PollsResponse | null>(initialData);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    poll: Poll | null;
  }>({ open: false, poll: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const fetchPolls = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "10");
      if (search) params.set("search", search);

      const res = await fetch(`/api/polls?${params.toString()}`);
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: String(page) });
  };

  const handleDelete = async () => {
    if (!deleteDialog.poll) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/polls/${deleteDialog.poll.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteDialog({ open: false, poll: null });
        fetchPolls();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete poll");
      }
    } catch (error) {
      console.error("Failed to delete poll:", error);
      alert("Failed to delete poll");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search polls..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card/50"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Poll
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Votes
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Ends
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((poll) => (
                  <tr
                    key={poll.id}
                    className="border-b border-border/30 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{poll.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {poll.description || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={poll.isActive ? "default" : "secondary"}
                        className={
                          poll.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : ""
                        }
                      >
                        {poll.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {poll._count?.votes ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(poll.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {poll.endsAt ? formatDate(poll.endsAt) : "No deadline"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/polls/${poll.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/polls/${poll.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteDialog({ open: true, poll })
                              }
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No polls found</p>
            <Link href="/admin/polls/create">
              <Button variant="outline" className="mt-4">
                Create your first poll
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!data.meta.has_prev}
          >
            Previous
          </Button>
          <span className="px-4 text-sm text-muted-foreground">
            Page {currentPage} of {data.meta.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!data.meta.has_next}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, poll: open ? deleteDialog.poll : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Poll</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.poll?.title}
              &quot;? This action cannot be undone and will remove all
              associated votes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, poll: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
