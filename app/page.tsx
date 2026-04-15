'use client';

import { useState } from 'react';
import { getVideoInfo, getDownloadUrl } from '@/lib/api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInfoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!url) return;
    window.location.href = getDownloadUrl(url);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          YouTube Video Downloader
        </h1>

        <form onSubmit={handleInfoRequest} className="flex gap-2 mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Fetching...' : 'Get Info'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-8">
            {error}
          </div>
        )}

        {videoInfo && (
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full rounded-lg shadow"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {videoInfo.title}
              </h2>
              <p className="text-gray-600 mb-4">Uploader: {videoInfo.uploader}</p>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                Download MP4
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 text-gray-500">
        <p>© 2026 YTDownloader. Built with Next.js & FastAPI.</p>
      </footer>
    </main>
  );
}
