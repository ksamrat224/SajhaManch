import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Delete the token cookie
  cookieStore.delete("token");

  // Redirect to login
  return NextResponse.redirect(
    new URL(
      "/auth/login",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
  );
}
