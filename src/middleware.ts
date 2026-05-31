import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "fmnu.ir";

  // "my-restaurant.fmnu.ir" → "my-restaurant"
  const subdomain = hostname
    .replace(`.${domain}`, "")
    .replace(`.${domain}`, "");

  // Subdomain detected — rewrite to /[slug] route internally
  if (subdomain && subdomain !== "www" && subdomain !== hostname) {
    url.pathname = `/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // No subdomain — auth check for /admin routes
  const sessionId = request.cookies.get("session-id")?.value;

  if (url.pathname.startsWith("/admin") && !sessionId) {
    const loginUrl = url.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("callbackUrl", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", url.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
