import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found — TariffVerify" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        This page doesn&apos;t exist — or maybe it moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-600"
      >
        Go back home
      </Link>
    </main>
  );
}
