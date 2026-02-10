'use client';

import { useEffect, useState } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.json())
      .then(data => setMessages(data.messages || []))
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
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Messages</h1>
      <p className="text-gray-400 mb-8">Contact form submissions</p>

      {messages.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-400">No messages yet. Once someone fills your contact form, messages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <div key={msg.id} className="glass rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white">{msg.name}</h3>
                  <p className="text-sm text-gray-400 break-all">{msg.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {msg.status === 'UNREAD' && (
                    <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded-full">New</span>
                  )}
                  <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {msg.subject && <p className="text-sm text-indigo-400 mb-2">Subject: {msg.subject}</p>}
              <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
