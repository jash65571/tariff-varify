"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company_name: companyName },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setError("An account with this email already exists. Try logging in instead.");
      } else if (error.message.includes("at least")) {
        setError("Password needs to be at least 6 characters.");
      } else {
        setError(error.message);
      }
      return;
    }

    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="py-4 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          We sent a confirmation link to{" "}
          <span className="font-medium text-gray-950 dark:text-gray-50">{email}</span>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Start analyzing your tariff exposure.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium">
            Company name
          </label>
          <input
            id="company"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Manufacturing"
            className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:placeholder:text-gray-600 dark:focus-visible:ring-offset-gray-900"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:placeholder:text-gray-600 dark:focus-visible:ring-offset-gray-900"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6+ characters"
            className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:placeholder:text-gray-600 dark:focus-visible:ring-offset-gray-900"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </>
  );
}
