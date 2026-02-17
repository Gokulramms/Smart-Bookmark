'use client';

import { useState } from 'react';
import { isValidUrl } from '@/lib/utils';

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (url: string, title?: string) => Promise<void>;
}

export function AddBookmarkModal({ isOpen, onClose, onAdd }: AddBookmarkModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        if (!isValidUrl(url)) {
            setError('Please enter a valid HTTP or HTTPS URL');
            return;
        }

        try {
            setIsProcessing(true);
            await onAdd(url, title.trim() || undefined);

            // Reset form on success
            setUrl('');
            setTitle('');
            setError('');
        } catch (err) {
            console.error('Error adding bookmark:', err);
            setError(err instanceof Error ? err.message : 'Failed to add bookmark');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (!isProcessing) {
            setUrl('');
            setTitle('');
            setError('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Add Bookmark
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                                <p className="text-sm text-purple-300">
                                    AI is analyzing... (title, summary, tags, duplicates)
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="url" className="block text-sm font-semibold text-white/90 mb-2">
                            URL <span className="text-pink-400">*</span>
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            disabled={isProcessing}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 disabled:opacity-50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-white/90 mb-2">
                            Title <span className="text-sm font-normal text-white/50">(optional - AI will generate)</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Leave empty for AI magic ✨"
                            disabled={isProcessing}
                            maxLength={200}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 disabled:opacity-50 transition-all"
                        />
                    </div>

                    {/* AI Features Info */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
                        <p className="text-sm font-semibold text-white mb-3">🤖 AI will automatically:</p>
                        <ul className="text-sm text-white/70 space-y-2">
                            {[
                                'Generate smart title (if empty)',
                                'Create concise summary',
                                'Auto-categorize content',
                                'Suggest relevant tags',
                                'Check for duplicates'
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isProcessing}
                            className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all disabled:opacity-50 border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing || !url.trim()}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {isProcessing ? 'Processing...' : 'Add Bookmark'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
