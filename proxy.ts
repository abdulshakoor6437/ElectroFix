import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ── Security headers ────────────────────────────────────────────────────────
function applySecurityHeaders(response: NextResponse, isAdmin: boolean): NextResponse {
  const h = response.headers;

  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );

  if (process.env.NODE_ENV === "production") {
    h.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

  h.set("Content-Security-Policy", csp);

  if (isAdmin) {
    // Never index or cache admin pages
    h.set("X-Robots-Tag", "noindex, nofollow");
    // Prevent browser back-button bypass after logout
    h.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    h.set("Pragma", "no-cache");
    h.set("Expires", "0");
  }

  return response;
}

// ── Proxy (runs on every non-static request) ────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi  = pathname.startsWith("/api/admin");
  const isAdmin     = isAdminPage || isAdminApi;
  const isLoginPage = pathname === "/admin/login";

  if (isAdmin && !isLoginPage) {
    // getToken reads the JWT directly from the request cookie —
    // the correct and reliable method for proxy/middleware auth checks.
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      // ── Admin API: return 401 JSON ──────────────────────────────────
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in to the admin panel." },
          { status: 401 }
        );
      }

      // ── Admin page: redirect to login with callbackUrl ──────────────
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const redirect = NextResponse.redirect(loginUrl);
      // Clear stale cookies to ensure clean state
      redirect.headers.set("Cache-Control", "no-store");
      return redirect;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return applySecurityHeaders(response, isAdmin);
}

export const config = {
  matcher: [
    /*
     * Run on ALL paths EXCEPT:
     *   _next/static, _next/image, favicon.ico, and static assets
     * This guarantees /admin/* and /api/admin/* are always intercepted.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)$).*)",
  ],
};
