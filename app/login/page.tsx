"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// 1. Core Form Component (useSearchParams is context me chalega)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {registered && (
        <div className="p-3 mb-4 bg-green-500/20 border border-green-500 text-green-300 rounded text-sm text-center">
          Account create ho gaya hai! Ab login karein.
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 bg-red-500/20 border border-red-500 text-red-300 rounded text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-400">
        Account nahi hai?{" "}
        <Link href="/signup" className="text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

// 2. Main Page Component wrapped with Suspense
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <Suspense fallback={<div className="text-gray-400">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}