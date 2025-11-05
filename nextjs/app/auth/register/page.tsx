"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      saveToken(res.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto card bg-base-100 shadow-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {["name", "email", "password", "password_confirmation"].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : "text"}
            placeholder={field.replace("_", " ")}
            className="input input-bordered w-full"
            value={(form as any)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
        <button className="btn btn-primary w-full" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
