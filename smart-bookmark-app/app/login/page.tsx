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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sign in to access your smart bookmarks
                    </p>
                </div>

                {/* Sign In Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        <span className="text-gray-700 dark:text-gray-200">
                            {isLoading ? 'Signing in...' : 'Continue with Google'}
                        </span>
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl mb-1">🤖</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">AI-Powered</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-1">⚡</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Realtime Sync</p>
                    </div>
                    <div>
                        <div className="text-2xl mb-1">🔒</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Secure</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
