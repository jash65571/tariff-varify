"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Upload,
  FileText,
  GitBranch,
  Settings,
  ChevronsLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload BOM", href: "/upload", icon: Upload },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Scenarios", href: "/scenarios", icon: GitBranch },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ email }: { email: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "hidden flex-col border-r border-gray-200 dark:border-gray-800 md:flex",
        "transition-[width] duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-gray-200 dark:border-gray-800",
          collapsed ? "justify-center px-2" : "px-4"
        )}
      >
        <Logo size={24} showText={!collapsed} href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg py-2 text-sm transition-all duration-150",
                collapsed ? "justify-center px-2" : "px-3",
                active
                  ? "bg-gray-100 font-medium text-gray-950 dark:bg-gray-800/50 dark:text-gray-50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500" />
              )}
              <item.icon size={20} strokeWidth={1.5} className="shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-3 py-2.5 text-sm text-gray-400 transition-all hover:text-gray-950 dark:hover:text-gray-50",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          <ChevronsLeft
            size={18}
            strokeWidth={1.5}
            className={cn(
              "shrink-0 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Collapse</span>}
        </button>

        <div
          className={cn(
            "border-t border-gray-200 p-3 dark:border-gray-800",
            collapsed && "px-2"
          )}
        >
          {!collapsed && (
            <p className="mb-2 truncate px-2 text-xs text-gray-400 dark:text-gray-500">
              {email}
            </p>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg py-2 text-sm text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50",
              collapsed ? "justify-center px-2" : "px-2"
            )}
          >
            <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
