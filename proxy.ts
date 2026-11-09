import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route prefixes that require an authenticated session
const PROTECTED_ROUTES = [
  "/dashboard",
  "/feed",
  "/opportunities",
  "/applications",
  "/community",
  "/referrals",
  "/career-tools",
  "/contributions",
  "/profile",
  "/settings",
  "/notifications",
  "/admin",
];

// Auth routes where authenticated users should be redirected to the dashboard
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isSignoutAction = request.nextUrl.searchParams.get("signout") === "true";

  // Check if current route is an auth route
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If explicit signout requested on auth route, strip session cookies and render auth page cleanly
  if (isAuthRoute && isSignoutAction) {
    const response = NextResponse.next();
    const cookieNames = [
      "better-auth.session_token",
      "__Secure-better-auth.session_token",
      "better-auth.session_data",
      "__Secure-better-auth.session_data",
      "better-auth.dont_remember",
      "__Secure-better-auth.dont_remember",
    ];
    for (const name of cookieNames) {
      response.cookies.delete(name);
      response.cookies.set({
        name,
        value: "",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      });
    }
    return response;
  }

  // Retrieve Better Auth session token cookie
  const rawSessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = Boolean(rawSessionToken && rawSessionToken.trim() !== "");

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Unauthenticated users accessing protected routes -> Redirect to /login with callbackUrl
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    const callbackUrl = pathname + search;
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users accessing login/register -> Redirect to requested callbackUrl or /feed
  if (isAuthRoute && isAuthenticated) {
    const hasError = request.nextUrl.searchParams.has("error");

    if (!hasError) {
      const callbackParam = request.nextUrl.searchParams.get("callbackUrl");
      let destination = "/feed";

      if (callbackParam) {
        // Prevent redirecting back to an auth route
        if (!callbackParam.startsWith("/login") && !callbackParam.startsWith("/register")) {
          destination = callbackParam.startsWith("/") ? callbackParam : `/${callbackParam}`;
        }
      }

      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

// Backward-compatibility alias
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and public assets
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
