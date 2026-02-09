'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function saveSetting(key: string, value: any) {
    setSaving(true);
    setMessage('');
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      setMessage('Settings saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const site = settings.site || { title: '', description: '', url: '' };
  const social = settings.social || { github: '', twitter: '', linkedin: '', email: '' };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
      <p className="text-gray-400 mb-8">Manage your site configuration</p>

      {message && (
        <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
          {message}
        </div>
      )}

      {/* Site Settings */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Site Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Site Title</label>
            <input
              type="text"
              value={site.title}
              onChange={(e) => setSettings({ ...settings, site: { ...site, title: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <input
              type="text"
              value={site.description}
              onChange={(e) => setSettings({ ...settings, site: { ...site, description: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">URL</label>
            <input
              type="text"
              value={site.url}
              onChange={(e) => setSettings({ ...settings, site: { ...site, url: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => saveSetting('site', settings.site)}
            disabled={saving}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Social Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">GitHub Username</label>
            <input
              type="text"
              value={social.github}
              onChange={(e) => setSettings({ ...settings, social: { ...social, github: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Twitter/X Username</label>
            <input
              type="text"
              value={social.twitter}
              onChange={(e) => setSettings({ ...settings, social: { ...social, twitter: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">LinkedIn Username</label>
            <input
              type="text"
              value={social.linkedin}
              onChange={(e) => setSettings({ ...settings, social: { ...social, linkedin: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Contact Email</label>
            <input
              type="email"
              value={social.email}
              onChange={(e) => setSettings({ ...settings, social: { ...social, email: e.target.value } })}
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => saveSetting('social', settings.social)}
            disabled={saving}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      </div>
    </div>
  );
}
