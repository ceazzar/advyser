import { NextResponse, type NextRequest } from "next/server";
import { pathHasPrefix } from "@/lib/mvp-mode";

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

  if (DISABLED_ROUTE_PREFIXES.some((prefix) => pathHasPrefix(pathname, prefix))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    // Run on all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
