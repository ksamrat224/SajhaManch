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
      {/* Search bar */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
          />
        </form>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 bg-slate-800 border-slate-700 hover:bg-slate-700"
        >
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 bg-slate-800 border-slate-700 hover:bg-slate-700"
        >
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </Button>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-red-500 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "active"
              ? "bg-red-500 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("ended")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "ended"
              ? "bg-red-500 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          Ended
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          Public Opinion
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          Development
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
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
        <div className="rounded-2xl border border-slate-700 bg-slate-800 py-16 text-center">
          <p className="text-lg font-medium text-slate-300">No polls found</p>
          <p className="mt-2 text-sm text-slate-500">
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
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
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
                    <span className="px-2 text-slate-500">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[2.5rem] ${
                      currentPage === page
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
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
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
