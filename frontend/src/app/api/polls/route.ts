import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();

  try {
    const res = await fetch(
      `${API_BASE_URL}/polls${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch polls:", error);
    return NextResponse.json(
      { message: "Failed to fetch polls" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE_URL}/polls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to create poll:", error);
    return NextResponse.json(
      { message: "Failed to create poll" },
      { status: 500 },
    );
  }
}
