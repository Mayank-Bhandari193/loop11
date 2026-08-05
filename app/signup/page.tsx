"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Mayank Bhandari",
    email: "mayankbhandari267@gmail.com",
    password: "123@",
    workspaceName: "Spectrum Workspace",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-up failed");

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="p-3 mb-4 bg-red-500/20 border border-red-500 text-red-300 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Workspace Name</label>
            <input
              type="text"
              required
              className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={formData.workspaceName}
              onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2.5 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}