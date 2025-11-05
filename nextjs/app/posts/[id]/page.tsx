import { apiFetch } from "@/lib/api";

export default async function PostDetail({ params }: any) {
  const post = await apiFetch(`/posts/${params.id}`);

  return (
    <div className="max-w-2xl mx-auto bg-base-100 p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author?.name ?? "Unknown"} • {new Date(post.created_at).toLocaleString()}
      </p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.body }} />
    </div>
  );
}
