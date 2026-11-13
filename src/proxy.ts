import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnAdmin = nextUrl.pathname.startsWith("/admin");
  const isOnSignIn = nextUrl.pathname === "/sign-in";

  if (isOnSignIn && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  if (isOnAdmin && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
