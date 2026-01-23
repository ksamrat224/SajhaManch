// Type definitions for polls and voting system

export interface PollOption {
  id: number;
  name: string;
  pollId: number;
}

export interface Poll {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  options?: PollOption[];
  _count?: {
    votes: number;
  };
}

export interface PollsResponse {
  data: Poll[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface Vote {
  id: number;
  userId: number;
  pollId: number;
  pollOptionId: number;
  votedAt: string;
}

export interface PollResult {
  optionId: number;
  optionName: string;
  voteCount: number;
  percentage: number;
}

export interface PollResults {
  pollId: number;
  title: string;
  description: string | null;
  totalVotes: number;
  isActive: boolean;
  results: PollResult[];
  winners: {
    optionId: number;
    optionName: string;
    voteCount: number;
    percentage: number;
  }[];
}

export interface Feedback {
  id: number;
  message: string;
  userId: number | null;
  pollId: number;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}
