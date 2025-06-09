import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("_token_");
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  
  const publicPaths = ["/login", "/register"]

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  const isStaticFile = pathname.startsWith("/_next/") || pathname.startsWith("/images/") || pathname.includes("favicon.ico");

  if (isStaticFile) {
    return NextResponse.next();
  }

  if ((pathname === "/login" || pathname == "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
