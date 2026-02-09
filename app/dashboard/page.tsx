'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ messages: 0, posts: 0, views: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [msgRes, blogRes, analyticsRes] = await Promise.all([
          fetch('/api/contact').then(r => r.json()),
          fetch('/api/blog?published=false').then(r => r.json()),
          fetch('/api/analytics').then(r => r.json()),
        ]);

        setStats({
          messages: msgRes.messages?.length || 0,
          unread: msgRes.messages?.filter((m: any) => m.status === 'UNREAD').length || 0,
          posts: blogRes.pagination?.total || 0,
          views: analyticsRes.totalViews || 0,
        });
        setRecentMessages(msgRes.messages?.slice(0, 5) || []);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
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
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome back, Umar!</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Views" value={stats.views} icon="👁️" color="indigo" />
        <StatCard label="Messages" value={stats.messages} icon="💬" color="purple" />
        <StatCard label="Unread" value={stats.unread} icon="📩" color="yellow" />
        <StatCard label="Blog Posts" value={stats.posts} icon="📝" color="cyan" />
      </div>

      {/* Recent Messages */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Messages</h2>
          <a href="/dashboard/messages" className="text-indigo-400 hover:text-indigo-300 text-sm">View All →</a>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No messages yet</p>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg: any) => (
              <div key={msg.id} className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white">{msg.name}</h3>
                  <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-400">{msg.email}</p>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
  };

  return (
    <div className={`p-6 rounded-xl border bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value.toLocaleString()}</p>
    </div>
  );
}
