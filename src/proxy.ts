import { NextRequest, NextResponse } from "next/server";

// Demo-only guard for the standalone admin portal.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = request.cookies.has("admin_session");
  const isLogin = pathname === "/admin/login";

  if (!signedIn && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (signedIn && (isLogin || pathname === "/admin")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
