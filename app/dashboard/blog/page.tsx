'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog?published=false')
      .then(r => r.json())
      .then(data => setPosts(data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-gray-400">Manage your articles</p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-400 mb-4">No blog posts yet.</p>
          <Link
            href="/dashboard/blog/new"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div key={post.id} className="glass rounded-xl p-4 sm:p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{post.excerpt || 'No excerpt'}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-gray-500">{post.views} views</span>
                  <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
