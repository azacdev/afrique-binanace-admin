import { type NextRequest, NextResponse } from "next/server";

// Check for session cookie - try both secure and non-secure variants
function hasSessionCookie(request: NextRequest): boolean {
  const baseName = "better-auth.session_token";
  const secureName = `__Secure-${baseName}`;

  // Check for either cookie variant
  return !!(request.cookies.get(secureName) || request.cookies.get(baseName));
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

  // Check for auth cookie presence for dashboard protection
  // if (pathname.startsWith("/dashboard")) {
  //   if (!hasSessionCookie(request)) {
  //     const signInUrl = new URL("/", request.url);
  //     signInUrl.searchParams.set("callbackURL", request.url);
  //     return NextResponse.redirect(signInUrl);
  //   }
  // }

  // Redirect authenticated users from root/sign-up to dashboard (or callbackURL)
  if (pathname === "/" || pathname.startsWith("/signup")) {
    if (hasSessionCookie(request)) {
      // Check for callbackURL parameter
      const callbackURL = request.nextUrl.searchParams.get("callbackURL");
      if (callbackURL) {
        try {
          // Extract the pathname from the callback URL to avoid external redirects
          const callbackPath = new URL(callbackURL).pathname;
          return NextResponse.redirect(new URL(callbackPath, request.url));
        } catch {
          // If URL parsing fails, fall back to dashboard
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
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
    "https://afrique-binanace-admin.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }

  return allowedOrigins[0];
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/", "/signup"],
};
