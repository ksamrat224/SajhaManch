"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PollCard } from "@/components/poll-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Clock, BarChart3, Loader2 } from "lucide-react";
import type { PollsResponse } from "@/types";

interface PollsClientProps {
  initialData: PollsResponse | null;
}

export function PollsClient({ initialData }: PollsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PollsResponse | null>(initialData);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

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
      params.set("limit", "12");
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      if (order) params.set("order", order);

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
  }, [currentPage, search, sort, order]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search, page: "1" });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateURL({ sort: value, page: "1" });
  };

  const handleOrderChange = (value: string) => {
    setOrder(value);
    updateURL({ order: value, page: "1" });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: String(page) });
  };

  const filteredPolls = data?.data?.filter((poll) => {
    if (filter === "active") return poll.isActive;
    if (filter === "ended") return !poll.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Filter tabs */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="all" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="ended" className="gap-2">
              <Clock className="h-4 w-4" />
              Ended
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Sort */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search polls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:w-64 bg-card/50"
            />
          </form>

          <div className="flex gap-2">
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32 bg-card/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <Select value={order} onValueChange={handleOrderChange}>
              <SelectTrigger className="w-28 bg-card/50">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {data?.meta?.total
          ? `Showing ${filteredPolls?.length || 0} of ${data.meta.total} polls`
          : "No polls found"}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Polls grid */}
      {!isLoading && filteredPolls && filteredPolls.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/30 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No polls found
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70">
            {search
              ? "Try adjusting your search terms"
              : "Check back later for new polls"}
          </p>
        </div>
      ) : null}

      {/* Pagination */}
      {data?.meta && data.meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!data.meta.has_prev}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: data.meta.total_pages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === data.meta.total_pages ||
                  Math.abs(page - currentPage) <= 1,
              )
              .map((page, index, arr) => (
                <span key={page}>
                  {index > 0 && arr[index - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                </span>
              ))}
          </div>

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
    </div>
  );
}
