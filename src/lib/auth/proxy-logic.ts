export interface ProxyRedirectDecision {
  redirect: string | null;
}

export function decideRedirect(
  pathname: string,
  isLoggedIn: boolean,
  origin: string,
): ProxyRedirectDecision {
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnSignIn = pathname === "/sign-in";

  if (isOnSignIn && isLoggedIn) {
    return { redirect: new URL("/admin", origin).toString() };
  }

  if (isOnAdmin && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return { redirect: signInUrl.toString() };
  }

  return { redirect: null };
}
