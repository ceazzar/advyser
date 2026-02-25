import { type NextRequest,NextResponse } from "next/server";

import { pathHasPrefix, shouldBypassDisabledAdminRoute } from "@/lib/mvp-mode";

const DISABLED_ROUTE_PREFIXES = [
  "/dashboard",
  "/advisor",
  "/admin",
  "/claim",
  "/login",
  "/signup",
  "/verify",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/components",
  "/design-system",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  const hostHeader =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const bypassDisabledAdminRoute = shouldBypassDisabledAdminRoute({
    pathname,
    hostHeader,
    nodeEnv: process.env.NODE_ENV,
    enableLocalAdmin: process.env.ENABLE_LOCAL_ADMIN,
  });

  if (
    !bypassDisabledAdminRoute &&
    DISABLED_ROUTE_PREFIXES.some((prefix) => pathHasPrefix(pathname, prefix))
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
