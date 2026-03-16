"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Tariff<span className="text-emerald-500">Verify</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 transition-colors duration-150 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors duration-150 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-600"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-900 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-800 md:hidden"
          >
            <div className="flex flex-col gap-1 bg-white px-4 py-3 dark:bg-gray-950">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-2 border-gray-200 dark:border-gray-800" />
              <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">
                Log in
              </Link>
              <Link
                href="/signup"
                className="mt-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
