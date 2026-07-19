import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Auth check for /admin routes
  const sessionId = request.cookies.get("session-id")?.value;

  if (url.pathname.startsWith("/admin")) {
    if (!sessionId) {
      return redirectToLogin(url);
    }

    // Validate session against DB via internal API route
    const validateUrl = new URL("/api/auth/validate", url.origin);
    const res = await fetch(validateUrl, {
      headers: { cookie: `session-id=${sessionId}` },
    });

    if (!res.ok) {
      const response = redirectToLogin(url);
      response.cookies.delete("session-id");
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", url.pathname);
  return response;
}

function redirectToLogin(url: URL) {
  const loginUrl = new URL(url);
  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set("callbackUrl", url.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
