import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Logo size={20} />
            <nav className="flex gap-6">
              <Link href="/features" className="text-sm text-gray-500 transition-colors duration-150 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-500 transition-colors duration-150 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50">Pricing</Link>
              <Link href="/faq" className="text-sm text-gray-500 transition-colors duration-150 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50">FAQ</Link>
            </nav>
          </div>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <a href="mailto:founders@tariffverify.com" className="text-sm text-gray-500 dark:text-gray-400">
              founders@tariffverify.com
            </a>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              &copy; {new Date().getFullYear()} TariffVerify
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
