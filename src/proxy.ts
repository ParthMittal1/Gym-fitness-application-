import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ---------------------------------------------------------------------------
// Route groups
// ---------------------------------------------------------------------------

/** Pages that require the user to be authenticated */
const PROTECTED_PREFIXES = ["/dashboard"] as const;

/** Pages that logged-in users should be bounced away from */
const AUTH_PREFIXES = ["/login", "/register"] as const;

/** Exact public paths — always pass through */
const PUBLIC_PATHS = ["/", "/about", "/pricing", "/locations", "/workouts"];

// ---------------------------------------------------------------------------
// Proxy function  (Next.js 16 naming convention — replaces `middleware`)
// ---------------------------------------------------------------------------
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Decode JWT from cookie (edge-safe, no DB hit) ──────────────────
  const token = await getToken({
    req:    request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = Boolean(token);

  // ── 2. Protected routes → redirect unauthenticated users to /login ────
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Auth routes → redirect authenticated users to /dashboard ───────
  const isAuthPage = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 4. Admin-only guard ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
      // Authenticated but not an admin → send to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ── 5. All other requests pass through ───────────────────────────────
  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher — run proxy on app routes; skip static assets & Next internals
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static bundle files)
     * - _next/image   (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files (images, icons, etc.)
     * - api/auth (NextAuth endpoints — must be reachable without a session)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
