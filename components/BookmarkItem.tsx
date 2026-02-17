'use client';

import { useState } from 'react';
import type { Bookmark } from '@/types';
import { getFaviconUrl, formatRelativeTime, truncate } from '@/lib/utils';

interface BookmarkItemProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
    viewMode?: 'grid' | 'list';
}

export function BookmarkItem({
    bookmark,
    onDelete,
    viewMode = 'grid',
}: BookmarkItemProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete(bookmark.id);
        } catch (error) {
            console.error('Error deleting bookmark:', error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const categoryColors: Record<
        string,
        { from: string; to: string; glow: string }
    > = {
        Work: {
            from: 'from-blue-500',
            to: 'to-blue-700',
            glow: 'shadow-blue-500/50',
        },
        Personal: {
            from: 'from-purple-500',
            to: 'to-purple-700',
            glow: 'shadow-purple-500/50',
        },
        Research: {
            from: 'from-green-500',
            to: 'to-green-700',
            glow: 'shadow-green-500/50',
        },
        Shopping: {
            from: 'from-cyan-500',
            to: 'to-cyan-700',
            glow: 'shadow-cyan-500/50',
        },
        Entertainment: {
            from: 'from-orange-500',
            to: 'to-orange-700',
            glow: 'shadow-orange-500/50',
        },
        News: {
            from: 'from-red-500',
            to: 'to-red-700',
            glow: 'shadow-red-500/50',
        },
        Education: {
            from: 'from-indigo-500',
            to: 'to-indigo-700',
            glow: 'shadow-indigo-500/50',
        },
        Tools: {
            from: 'from-gray-500',
            to: 'to-gray-700',
            glow: 'shadow-gray-500/50',
        },
        Social: {
            from: 'from-yellow-500',
            to: 'to-yellow-700',
            glow: 'shadow-yellow-500/50',
        },
        Other: {
            from: 'from-slate-500',
            to: 'to-slate-700',
            glow: 'shadow-slate-500/50',
        },
    };

    const colors = categoryColors[bookmark.category || 'Other'];

    return (
        <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none" />

            {/* Delete Confirmation Overlay */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-20 flex items-center justify-center p-6 rounded-3xl">
                    <div className="bg-gradient-to-br from-red-950/80 to-red-900/80 backdrop-blur-2xl rounded-2xl p-8 max-w-xs w-full shadow-2xl border border-red-500/30">
                        <h3 className="text-2xl font-black mb-3 text-white">
                            Delete Forever?
                        </h3>
                        <p className="text-sm text-white/70 mb-6 leading-relaxed">
                            This bookmark will be permanently deleted and cannot be
                            recovered.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 transition-all font-bold text-sm"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 px-5 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-bold text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative p-7">
                {/* Header with Favicon */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl blur-lg" />
                            <img
                                src={bookmark.favicon_url || getFaviconUrl(bookmark.url)}
                                alt=""
                                className="relative w-14 h-14 rounded-2xl bg-white/10 p-2 border border-white/10 shadow-xl object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'data:image/svg+xml;utf8,' +
                                        encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                    `);
                                }}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-black text-white truncate text-xl mb-2">
                                {bookmark.title}
                            </h3>
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-400/80 hover:text-purple-300 hover:underline truncate block font-medium"
                            >
                                {truncate(bookmark.url, 40)}
                            </a>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex-shrink-0 p-3 text-white/30 hover:text-red-400 hover:bg-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-500/30"
                        title="Delete bookmark"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Summary */}
                {bookmark.summary && (
                    <p className="text-sm text-white/60 mb-5 line-clamp-2 leading-relaxed font-medium">
                        {bookmark.summary}
                    </p>
                )}

                {/* Category */}
                {bookmark.category && (
                    <span
                        className={`px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r ${colors.from} ${colors.to} text-white shadow-lg ${colors.glow} uppercase tracking-wide`}
                    >
                        {bookmark.category}
                    </span>
                )}

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs text-white/40 font-medium mt-4">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{formatRelativeTime(bookmark.created_at)}</span>
                </div>
            </div>

            {/* Bottom gradient accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </div>
    );
}
