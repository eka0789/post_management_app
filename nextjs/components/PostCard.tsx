"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PostCard({ post }: { post: any }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
    >
      {/* Header (judul) */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {post.body?.slice(0, 120) || "Tidak ada konten."}
        </p>
      </div>

      {/* Footer info */}
      <div className="border-t px-5 py-3 flex justify-between items-center text-sm text-gray-500">
        <span>{post.author?.name || "Anonim"}</span>
        <Link
          href={`/posts/${post.id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          Baca →
        </Link>
      </div>
    </motion.div>
  );
}
