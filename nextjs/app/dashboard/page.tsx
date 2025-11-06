"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import ConfirmModal from "@/components/ConfirmModal";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Pagination & filter state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // 🔹 Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch posts & authors
  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, search, statusFilter, authorFilter, sortBy]);

  async function fetchAuthors() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await apiFetch("/authors", {}, token); // endpoint daftar author
      setAuthors(res.data || []);
    } catch (err) {
      console.error("Gagal memuat authors:", err);
    }
  }

  async function fetchPosts() {
    setLoading(true);
    const token = getToken();
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const query = new URLSearchParams({
        page: page.toString(),
        per_page: "10",
        ...(search ? { search } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(authorFilter ? { author_id: authorFilter } : {}),
        ...(sortBy ? { sort: sortBy } : {}),
      }).toString();

      const res = await apiFetch(`/posts?${query}`, {}, token);
      setPosts(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setMessage("❌ Gagal memuat data post.");
    } finally {
      setLoading(false);
    }
  }

  function openDeleteModal(id: number) {
    setSelectedId(id);
    setShowModal(true);
  }

  async function confirmDelete() {
    if (!selectedId) return;
    const token = getToken();
    if (!token) return alert("Unauthorized");

    setDeleting(true);

    try {
      await apiFetch(`/posts/${selectedId}`, { method: "DELETE" }, token);
      setPosts((prev) => prev.filter((p) => p.id !== selectedId));
      setMessage("✅ Post berhasil dihapus.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal menghapus post.");
    } finally {
      setDeleting(false);
      setShowModal(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📋 Dashboard</h1>
        <Link
          href="/posts/new"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
        >
          + New Post
        </Link>
      </div>

      {/* 🔍 Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari judul post..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        >
          <option value="">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={authorFilter}
          onChange={(e) => {
            setPage(1);
            setAuthorFilter(e.target.value);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        >
          <option value="">Semua Author</option>
          {authors.map((a: any) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setPage(1);
            setSortBy(e.target.value);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        >
          <option value="latest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="title_asc">Judul A-Z</option>
          <option value="title_desc">Judul Z-A</option>
        </select>
      </div>

      {/* Message */}
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

      {/* Loading & Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-600">
          Memuat data...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Tidak ada postingan ditemukan.
        </div>
      ) : (
        <>
          {/* Table */}
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
                        onClick={() => openDeleteModal(p.id)}
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

          {/* Pagination with clickable pages */}
          <div className="flex flex-wrap items-center justify-center mt-5 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 text-sm rounded-md ${
                  num === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🔹 Confirm Delete Modal */}
      <ConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus Post"
        message="Apakah Anda yakin ingin menghapus post ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Hapus"
      />
    </div>
  );
}
