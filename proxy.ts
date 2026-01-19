import { type NextRequest, NextResponse } from "next/server";

// Determine the correct cookie name based on environment
function getSessionCookieName(): string {
  const isSecure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;

  const baseName = "better-auth.session_token";

  return isSecure ? `__Secure-${baseName}` : baseName;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for API routes
  if (pathname.startsWith("/api/")) {
    const origin = getAllowedOrigin(request);

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  const sessionCookieName = getSessionCookieName();

  // Check for auth cookie presence for dashboard protection
  if (pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get(sessionCookieName);

    if (!authCookie) {
      const signInUrl = new URL("/", request.url);
      signInUrl.searchParams.set("callbackURL", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Redirect authenticated users from root/sign-up to dashboard
  if (pathname === "/" || pathname.startsWith("/signup")) {
    const authCookie = request.cookies.get(sessionCookieName);

    if (authCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

function getAllowedOrigin(request: NextRequest): string {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://afrique-bitcoin.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }

  return allowedOrigins[0];
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/", "/signup"],
};

// Export as middleware for Next.js 16
export { proxy as middleware };
