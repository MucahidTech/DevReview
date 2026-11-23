import { SignOutButton } from "./sign-out-button";

interface AdminHeaderProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <p className="text-sm font-medium">{userName ?? "Admin"}</p>
        <p className="text-xs text-muted-foreground">{userEmail}</p>
      </div>
      <SignOutButton />
    </header>
  );
}
