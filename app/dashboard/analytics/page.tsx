'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(setData)
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
      <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
      <p className="text-gray-400 mb-8">Last 30 days overview</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Page Views</p>
          <p className="text-4xl font-bold text-white mt-2">{(data?.totalViews || 0).toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-gray-400 text-sm">Last 30 Days</p>
          <p className="text-4xl font-bold text-white mt-2">{(data?.recentViews || 0).toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-6">
          <p className="text-gray-400 text-sm">Top Pages</p>
          <p className="text-4xl font-bold text-white mt-2">{data?.topPages?.length || 0}</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Top Pages</h2>
        {(!data?.topPages || data.topPages.length === 0) ? (
          <p className="text-gray-400 text-center py-8">No page views yet. Views will appear here as visitors come to your site.</p>
        ) : (
          <div className="space-y-3">
            {data.topPages.map((page: any, i: number) => (
              <div key={page.path} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-indigo-500/40">#{i + 1}</span>
                  <span className="text-white">{page.path}</span>
                </div>
                <span className="text-gray-400">{page.views} views</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
