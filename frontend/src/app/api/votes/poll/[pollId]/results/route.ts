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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/votes/poll/${pollId}/results`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch poll results:", error);
    return NextResponse.json(
      { message: "Failed to fetch poll results" },
      { status: 500 },
    );
  }
}
