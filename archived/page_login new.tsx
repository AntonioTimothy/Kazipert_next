"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Invalid email or password");

      const data = await res.json();
      // Redirect based on user role
      if (data.role === "employer") router.push("/employer/dashboard");
      else router.push("/employee/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side – Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 items-center justify-center p-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md space-y-6 text-center"
        >
          <Image
            src="/kazipert-logo.svg"
            alt="Kazipert Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h1 className="text-3xl font-bold">Welcome Back to Kazipert</h1>
          <p className="text-lg text-blue-100">
            Connecting employers from abroad with skilled Kenyan professionals.
          </p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-sm italic text-blue-200"
          >
            “Empowering cross-border talent partnerships.”
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side – Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 sm:p-16">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Log in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="text-sm text-center text-gray-600 mt-3">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-blue-600 hover:underline font-medium"
              >
                Create one
              </button>
            </div>
          </form>

          {/* Progress animation on loading */}
          {loading && (
            <motion.div
              className="mt-6 h-1 bg-blue-200 rounded-full overflow-hidden"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="h-full bg-blue-600"
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
