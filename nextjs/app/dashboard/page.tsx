"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Load posts on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    apiFetch("/posts", {}, token)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Delete post handler
  async function handleDelete(id: number) {
    const confirmDelete = window.confirm("Yakin ingin menghapus post ini?");
    if (!confirmDelete) return;

    const token = getToken();
    if (!token) {
      alert("Unauthorized. Silakan login ulang.");
      return;
    }

    try {
      await apiFetch(`/posts/${id}`, { method: "DELETE" }, token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setMessage("✅ Post berhasil dihapus.");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Error deleting post:", err);
      setMessage("❌ Gagal menghapus post.");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📋 Dashboard</h1>
        <Link
          href="/posts/new"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
        >
          + New Post
        </Link>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm text-center ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada postingan.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="px-6 py-3">Judul</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{p.title}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {p.author?.name || "Anonim"}
                  </td>
                  <td className="px-6 py-3 flex justify-end gap-2">
                    <Link
                      href={`/posts/${p.id}/edit`}
                      className="px-3 py-1 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
