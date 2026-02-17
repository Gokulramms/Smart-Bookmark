'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error signing in:', error);
            setError(error instanceof Error ? error.message : 'Failed to sign in');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-black text-white">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-950" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Glow Orbs */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[140px] opacity-30 animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-30 animate-pulse" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side – Branding */}
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
                            ⚡ Next-Gen AI Technology
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black leading-tight">
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Smart Bookmark
                            </span>
                        </h1>

                        <p className="text-white/60 text-lg max-w-md">
                            AI-powered bookmark manager with smart summaries,
                            auto-categorization, and real-time sync.
                        </p>

                        <div className="grid grid-cols-3 gap-6 pt-6">
                            <div>
                                <div className="text-2xl mb-1">🤖</div>
                                <p className="text-sm text-white/60">AI Analysis</p>
                            </div>
                            <div>
                                <div className="text-2xl mb-1">⚡</div>
                                <p className="text-sm text-white/60">Realtime Sync</p>
                            </div>
                            <div>
                                <div className="text-2xl mb-1">🔒</div>
                                <p className="text-sm text-white/60">Secure Cloud</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side – Login Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition" />

                        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

                            <h2 className="text-3xl font-bold mb-2">
                                Welcome❤️
                            </h2>
                            <p className="text-white/50 mb-8">
                                Sign in to access your AI-powered bookmarks
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl">
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-semibold shadow-xl hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#fff"
                                            d="M21.35 11.1H12v2.9h5.35c-.23 1.24-.92 2.3-1.96 3.01v2.49h3.17c1.86-1.71 2.94-4.24 2.94-7.21 0-.66-.06-1.3-.15-1.92z"
                                        />
                                        <path
                                            fill="#fff"
                                            d="M12 22c2.7 0 4.96-.9 6.61-2.45l-3.17-2.49c-.88.59-2 .94-3.44.94-2.64 0-4.88-1.78-5.68-4.18H3.06v2.63C4.7 19.98 8.08 22 12 22z"
                                        />
                                        <path
                                            fill="#fff"
                                            d="M6.32 13.82A5.98 5.98 0 016 12c0-.63.11-1.23.32-1.82V7.55H3.06A9.99 9.99 0 002 12c0 1.64.39 3.2 1.06 4.45l3.26-2.63z"
                                        />
                                        <path
                                            fill="#fff"
                                            d="M12 6.5c1.47 0 2.79.51 3.83 1.51l2.87-2.87C16.95 3.3 14.7 2.5 12 2.5 8.08 2.5 4.7 4.52 3.06 7.55l3.26 2.63C7.12 8.28 9.36 6.5 12 6.5z"
                                        />
                                    </svg>
                                )}
                                {isLoading ? 'Signing in...' : 'Continue with Google'}
                            </button>

                            <p className="mt-6 text-xs text-white/40 text-center">
                                By signing in, you agree to our terms and privacy policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
