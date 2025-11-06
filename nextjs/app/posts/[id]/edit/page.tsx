"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // ambil ID post dari URL

  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch data post saat pertama kali dibuka
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function fetchPost() {
      try {
        const res = await apiFetch(`/posts/${id}`, {}, token ?? undefined);
        setForm({
          title: res.title || "",
          body: res.body || "",
        });
      } catch (err: any) {
        console.error("❌ Gagal memuat post:", err);
        setError("Gagal memuat data post.");
      } finally {
        setFetching(false);
      }
    }

    if (id) fetchPost();
  }, [id, router]);

  // Handler untuk simpan perubahan
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized. Silakan login ulang.");

      const res = await apiFetch(
        `/posts/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(form),
        },
        token
      );

      console.log("✅ Post updated:", res);
      setSuccess("Post berhasil diperbarui!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      console.error("❌ Error updating post:", err);
      if (err.message.includes("Forbidden")) {
        setError("Anda tidak memiliki izin untuk mengedit post ini.");
      } else if (err.message.includes("422")) {
        setError("Data tidak valid. Pastikan semua field terisi.");
      } else {
        setError(err.message || "Gagal memperbarui post.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat data post...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">✏️ Edit Post</h2>

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input
            type="text"
            placeholder="Masukkan judul..."
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Isi Konten</label>
          <textarea
            placeholder="Tulis isi post di sini..."
            required
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Menyimpan..." : "Perbarui Post"}
        </button>
      </form>
    </div>
  );
}
