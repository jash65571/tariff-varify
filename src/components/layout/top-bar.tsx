"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/upload": "Upload BOM",
  "/reports": "Reports",
  "/scenarios": "Scenarios",
  "/settings": "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const title =
    Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-800 sm:px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="hidden text-gray-400 dark:text-gray-500 md:inline">
          TariffVerify
        </span>
        <span className="hidden text-gray-300 dark:text-gray-700 md:inline">
          /
        </span>
        <span className="font-medium">{title}</span>
      </div>
    </header>
  );
}
