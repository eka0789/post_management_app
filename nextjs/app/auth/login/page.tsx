"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.token) throw new Error("Token tidak ditemukan dalam respons API.");

      saveToken(res.token);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Gagal login. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl p-8"
      >
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Masuk untuk melanjutkan ke Dashboard Anda.
          </p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm text-center mb-3 bg-red-50 p-2 rounded-md"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Masukkan email Anda"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 text-white rounded-lg font-medium transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
            }`}
          >
            {loading ? "Memproses..." : "Masuk Sekarang"}
          </motion.button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <a
            href="/auth/register"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Daftar Sekarang
          </a>
        </div>
      </motion.div>
    </div>
  );
}
