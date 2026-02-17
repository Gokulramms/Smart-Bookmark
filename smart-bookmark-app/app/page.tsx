import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header */}
        <nav className="flex justify-between items-center mb-24">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Bookmark
            </span>
          </div>

          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold transform hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            AI-Powered
            <br />
            Bookmark Magic
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            Intelligent categorization, smart summaries, and seamless real-time sync.
            Your web, organized by AI.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all"
            >
              {user ? "Open Dashboard" : "Get Started Free →"}
            </Link>
            <a
              href="#features"
              className="px-10 py-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-6 mt-32">
            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/15 hover:shadow-2xl hover:shadow-purple-500/20 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/50">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">AI Auto-Categorization</h3>
              <p className="text-white/70 leading-relaxed">
                AI automatically organizes bookmarks into smart categories and suggests relevant tags instantly.
              </p>
            </div>

            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/15 hover:shadow-2xl hover:shadow-purple-500/20 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-500/50">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Realtime Sync</h3>
              <p className="text-white/70 leading-relaxed">
                Bookmarks sync instantly across all tabs and devices in real-time. Never lose a link again.
              </p>
            </div>

            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/15 hover:shadow-2xl hover:shadow-pink-500/20 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-cyan-500/50">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Smart Summaries</h3>
              <p className="text-white/70 leading-relaxed">
                Get AI-generated summaries so you remember exactly why you saved each bookmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
