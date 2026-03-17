import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up — TariffVerify",
};

export default function SignupPage() {
  return (
    <>
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-gray-950 hover:underline dark:text-gray-50"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
