import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pollId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { pollId } = await params;

  if (!token) {
    return NextResponse.json({ hasVoted: false });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/votes/poll/${pollId}/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ hasVoted: false });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to check vote status:", error);
    return NextResponse.json({ hasVoted: false });
  }
}
