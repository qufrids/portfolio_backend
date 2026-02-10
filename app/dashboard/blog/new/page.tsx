'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
  });

  function handleTitleChange(title: string) {
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setForm({ ...form, title, slug });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard/blog');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">New Blog Post</h1>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-4 sm:p-8 space-y-6 max-w-3xl">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            placeholder="My Awesome Blog Post"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            placeholder="my-awesome-blog-post"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Excerpt</label>
          <input
            type="text"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Short description of your post"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">Content (Markdown)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={15}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none font-mono text-sm resize-y"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 rounded accent-indigo-500"
          />
          <label htmlFor="published" className="text-gray-300 text-sm">Publish immediately</label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/blog')}
            className="px-8 py-3 border border-white/10 text-gray-400 rounded-lg hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
