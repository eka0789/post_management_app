import { apiFetch } from "@/lib/api";
import PostCard from "@/components/PostCard";

export default async function HomePage() {
  const posts = await apiFetch("/posts?per_page=10");

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to PostManager
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Kelola dan bagikan tulisan Anda dengan mudah. Platform modern untuk
          admin, editor, dan penulis profesional.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            ✨ Latest Posts
          </h2>
          <a
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition"
          >
            Go to Dashboard →
          </a>
        </div>

        {posts?.data?.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Belum ada postingan tersedia.
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} PostManager. Dibuat dengan ❤️ oleh tim Anda.
      </footer>
    </main>
  );
}
