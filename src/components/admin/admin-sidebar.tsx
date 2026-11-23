import Link from "next/link";
import { LayoutDashboard, FileQuestion, Tags } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/questions", label: "Questions", icon: FileQuestion },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-muted/40">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="text-lg font-semibold">
          DevReview Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
