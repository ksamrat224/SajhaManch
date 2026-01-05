import { NextRequest, NextResponse } from "next/server";

// Basic middleware to protect authenticated and admin routes based on presence of JWT cookie.
// Detailed role checks are enforced in server components / route handlers.

const AUTH_COOKIE = "token";

const AUTH_PREFIXES = ["/user", "/admin"];
const AUTH_PAGES = ["/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  const isAuthPage = AUTH_PAGES.some((prefix) => pathname.startsWith(prefix));
  const requiresAuth = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // If user is logged in and visits auth pages, redirect to user dashboard
  if (token && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }

  // If route requires auth but no token, redirect to login
  if (!token && requiresAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/user/:path*",
    "/admin/:path*",
  ],
};


