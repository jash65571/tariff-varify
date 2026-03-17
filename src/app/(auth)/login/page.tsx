import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — TariffVerify",
};

export default function LoginPage() {
  return (
    <>
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Log in to your TariffVerify account.
        </p>
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-gray-950 hover:underline dark:text-gray-50"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
