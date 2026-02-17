'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Matrix Rain Effect
  useEffect(() => {
    const matrix = document.getElementById('matrix-canvas');
    if (!matrix) return;

    const columns = Math.floor(window.innerWidth / 20);
    const drops: number[] = Array(columns).fill(1);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    for (let i = 0; i < columns; i++) {
      const span = document.createElement('span');
      span.className = 'matrix-column';
      span.style.left = `${i * 20}px`;
      span.style.animationDuration = `${Math.random() * 3 + 4}s`;
      span.style.animationDelay = `${Math.random() * 5}s`;
      span.textContent = Array(20).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('\\n');
      matrix.appendChild(span);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-black relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div id="matrix-canvas" className="matrix-rain" />

      {/* Cyber Grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 animate-slide-left">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-12 h-12 bg-black border-2 border-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-black text-matrix-glow">
              SMART BOOKMARK
            </h1>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="cyber-button px-6 py-3 rounded-xl font-bold animate-slide-right"
          >
            Initialize Session
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 glass-panel rounded-full mb-6">
              <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider">
                ⚡ Next-Gen AI Technology
              </span>
            </div>

            <h2 className="text-7xl md:text-8xl font-black leading-tight">
              <span className="text-cyber">AI-Powered</span>
              <br />
              <span className="text-matrix-glow">Bookmark Intelligence</span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Advanced neural categorization • Real-time synchronization • Quantum-speed search
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in delay-200">
            <button
              onClick={handleGoogleSignIn}
              className="cyber-button px-12 py-5 rounded-2xl text-lg font-black group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Launch System
              </span>
            </button>

            <button className="px-12 py-5 rounded-2xl text-lg font-bold border-2 border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all">
              View Demo →
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24 animate-fade-in delay-300">
            {[
              {
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                title: 'Neural AI',
                desc: 'Advanced ML algorithms auto-categorize and tag your bookmarks with 95% accuracy'
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Real-Time Sync',
                desc: 'Quantum-speed synchronization across all devices. Updates propagate instantly.'
              },
              {
                icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                title: 'Instant Search',
                desc: 'Find anything in microseconds. Semantic search understands context and intent.'
              }
            ].map((feature, i) => (
              <div key={i} className={`glass-panel card-3d-hover p-8 rounded-2xl group animate-scale delay-${(i + 4) * 100}`}>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative w-16 h-16 bg-black border-2 border-emerald-500 rounded-xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-emerald-400 mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-24 max-w-3xl mx-auto animate-fade-in delay-500">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '99.9%', label: 'Uptime' },
              { value: '< 100ms', label: 'Response Time' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-matrix-glow mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 mt-32 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            © 2026 Smart Bookmark • Powered by AI • Built with Next.js & Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
