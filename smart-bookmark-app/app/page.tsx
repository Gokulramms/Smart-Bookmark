'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-950 to-black relative overflow-hidden text-white">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse" />
      </div>

      {/* Header (same style as dashboard) */}
      <header className="relative bg-gradient-to-r from-purple-900/30 via-black/40 to-blue-900/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-sm group-hover:blur-md transition-all" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Smart Bookmark
              </h1>
              <p className="text-xs text-purple-300/60 font-medium mt-0.5">
                AI-Powered Organization
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition"
          >
            Initialize Session
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="space-y-10">
          <div className="inline-block px-6 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm font-semibold">
              ⚡ Next-Gen AI Technology
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            Bookmark Intelligence
          </h2>

          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Advanced neural categorization • Real-time sync • Lightning-fast search
          </p>

          <Link
            href="/login"
            className="inline-block px-12 py-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-3xl font-bold text-lg shadow-2xl hover:scale-105 transition"
          >
            Launch System
          </Link>
        </div>

        {/* Feature cards (dashboard style) */}
        <div className="grid md:grid-cols-3 gap-8 mt-28">
          {[
            {
              title: 'Neural AI',
              desc: 'Automatically categorizes and tags bookmarks.',
            },
            {
              title: 'Real-Time Sync',
              desc: 'Instant updates across all your devices.',
            },
            {
              title: 'Instant Search',
              desc: 'Find anything in milliseconds.',
            },
          ].map((feature, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}

      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10 text-center text-white/40 text-sm">
        © 2026 Smart Bookmark • Built with Next.js & Supabase
      </footer>
    </div>
  );
}
