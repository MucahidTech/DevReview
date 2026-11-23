import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInForm } from "./sign-in-form";

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <SignInForm callbackUrl={callbackUrl} />
    </main>
  );
}
