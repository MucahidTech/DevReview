import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { decideRedirect } from "@/lib/auth/proxy-logic";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const decision = decideRedirect(nextUrl.pathname, isLoggedIn, nextUrl.origin);

  if (decision.redirect) {
    return NextResponse.redirect(decision.redirect);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
