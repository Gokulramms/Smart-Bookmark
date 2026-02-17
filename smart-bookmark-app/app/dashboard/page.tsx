'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/hooks/useToast';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { BookmarkItem } from '@/components/BookmarkItem';
import { ToastContainer } from '@/components/Toast';
import type { Bookmark } from '@/types';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'alphabetical'
    | 'category';

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const { bookmarks, isLoading, deleteBookmark } = useBookmarks();
    const toast = useToast();

    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortBy>('newest');
    const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K - Focus search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
            // Cmd/Ctrl + N - New bookmark
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                setIsModalOpen(true);
            }
            // Cmd/Ctrl + G - Toggle grid/list
            if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
                e.preventDefault();
                setViewMode(v => v === 'grid' ? 'list' : 'grid');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleAddBookmark = async (url: string, title?: string) => {
        const response = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, title }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.duplicate) {
                toast.warning(`Duplicate detected! (${data.confidence}% match)`);
            }
            throw new Error(data.error || 'Failed to add bookmark');
        }

        // Show warning if AI was blocked (e.g., college network)
        if (data.warning) {
            toast.warning(data.warning);
        } else {
            toast.success('Bookmark added successfully! ✨');
        }

        setIsModalOpen(false);
    };

    const handleDeleteBookmark = async (id: string) => {
        try {
            await deleteBookmark(id);
            toast.success('Bookmark deleted');
            setSelectedBookmarks(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (error) {
            toast.error('Failed to delete bookmark');
            throw error;
        }
    };

    const handleBulkDelete = async () => {
        if (selectedBookmarks.size === 0) return;

        const confirmed = window.confirm(`Delete ${selectedBookmarks.size} bookmarks?`);
        if (!confirmed) return;

        try {
            await Promise.all(Array.from(selectedBookmarks).map(id => deleteBookmark(id)));
            toast.success(`Deleted ${selectedBookmarks.size} bookmarks`);
            setSelectedBookmarks(new Set());
        } catch (error) {
            toast.error('Failed to delete some bookmarks');
        }
    };

    const toggleBookmarkSelection = (id: string) => {
        setSelectedBookmarks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectAll = () => {
        setSelectedBookmarks(new Set(filteredBookmarks.map(b => b.id)));
    };

    const deselectAll = () => {
        setSelectedBookmarks(new Set());
    };

    // Filter and sort bookmarks
    const filteredBookmarks = bookmarks
        .filter(bookmark => {
            const matchesSearch = !searchQuery ||
                bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bookmark.summary?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || bookmark.category === selectedCategory;
            const matchesTag = !selectedTag || bookmark.tags?.includes(selectedTag);

            return matchesSearch && matchesCategory && matchesTag;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'category':
                    return (a.category || '').localeCompare(b.category || '');
                default:
                    return 0;
            }
        });

    // Get statistics
    const categories = Array.from(new Set(bookmarks.map(b => b.category).filter(Boolean)));
    const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags || [])));
    const stats = {
        total: bookmarks.length,
        categories: categories.length,
        tags: allTags.length,
        thisWeek: bookmarks.filter(b =>
            new Date(b.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-950 to-black relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

            {/* Floating orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000" />
            </div>

            {/* Header */}
            <header className="relative bg-gradient-to-r from-purple-900/30 via-black/40 to-blue-900/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    Smart Bookmark
                                </h1>
                                <p className="text-xs text-purple-300/60 font-medium mt-0.5">AI-Powered Organization</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Stats Toggle */}
                            <button
                                onClick={() => setShowStats(!showStats)}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-sm font-medium text-white/80"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Stats
                            </button>

                            {user && (
                                <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="relative">
                                        <img
                                            src={user.user_metadata?.avatar_url}
                                            alt={user.user_metadata?.name}
                                            className="w-10 h-10 rounded-full ring-2 ring-purple-400/50"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{user.user_metadata?.name}</p>
                                        <p className="text-xs text-purple-300/70">Pro Member</p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium text-sm border border-white/5"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative max-w-7xl mx-auto px-6 py-10">
                {/* Stats Dashboard */}
                {showStats && (
                    <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                        {[
                            { label: 'Total Bookmarks', value: stats.total, icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', color: 'from-purple-500 to-blue-500' },
                            { label: 'Categories', value: stats.categories, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'from-cyan-500 to-blue-500' },
                            { label: 'Tags', value: stats.tags, icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'from-blue-500 to-purple-500' },
                            { label: 'This Week', value: stats.thisWeek, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'from-purple-500 to-cyan-500' },
                        ].map((stat, i) => (
                            <div key={i} className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all`} />
                                <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10">
                                    <svg className="w-8 h-8 text-white/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                    </svg>
                                    <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-white/60 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search, View Controls, and Actions */}
                <div className="mb-10 space-y-5">
                    {/* Search and Add Button */}
                    <div className="flex flex-col lg:flex-row gap-5">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
                            <input
                                id="search-input"
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search your universe of bookmarks... (⌘K)"
                                className="relative w-full pl-14 pr-6 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 transition-all text-lg font-medium shadow-2xl"
                            />
                            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="relative lg:w-auto group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-md group-hover:blur-lg transition-all" />
                            <div className="relative px-10 py-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-3xl font-bold text-lg shadow-2xl transform group-hover:scale-105 transition-all flex items-center justify-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Bookmark
                                <span className="hidden sm:inline text-xs bg-white/20 px-2 py-1 rounded-lg">⌘N</span>
                            </div>
                        </button>
                    </div>

                    {/* View Controls and Sort */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-white/50 hover:text-white/80'}`}
                                title="Grid View (⌘G)"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'text-white/50 hover:text-white/80'}`}
                                title="List View"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            className="px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-medium text-sm focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer hover:bg-white/10"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">A-Z</option>
                            <option value="category">By Category</option>
                        </select>

                        {/* Bulk Actions */}
                        {selectedBookmarks.size > 0 && (
                            <div className="flex items-center gap-3 ml-auto animate-fade-in">
                                <span className="text-sm font-medium text-white/70">
                                    {selectedBookmarks.size} selected
                                </span>
                                <button
                                    onClick={deselectAll}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
                                >
                                    Deselect All
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 text-red-300 hover:text-red-200 text-sm font-bold transition-all"
                                >
                                    Delete Selected
                                </button>
                            </div>
                        )}

                        {filteredBookmarks.length > 0 && selectedBookmarks.size === 0 && (
                            <button
                                onClick={selectAll}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all ml-auto"
                            >
                                Select All
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                {(categories.length > 0 || allTags.length > 0) && (
                    <div className="mb-10 space-y-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
                        {categories.length > 0 && (
                            <div>
                                <p className="text-sm font-bold text-purple-300 mb-4 uppercase tracking-wider">Categories</p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all transform hover:scale-105 ${!selectedCategory
                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all transform hover:scale-105 ${selectedCategory === category
                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {allTags.length > 0 && (
                            <div>
                                <p className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider">Tags</p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all transform hover:scale-105 ${!selectedTag
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {allTags.slice(0, 20).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all transform hover:scale-105 ${selectedTag === tag
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                                }`}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bookmarks Grid/List */}
                {isLoading ? (
                    <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-3xl h-72 animate-pulse border border-white/10" />
                        ))}
                    </div>
                ) : filteredBookmarks.length > 0 ? (
                    <div className={`animate-fade-in ${viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}>
                        {filteredBookmarks.map(bookmark => (
                            <div key={bookmark.id} className="relative">
                                {selectedBookmarks.size > 0 && (
                                    <button
                                        onClick={() => toggleBookmarkSelection(bookmark.id)}
                                        className="absolute top-4 left-4 z-10 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:scale-110 transition-transform"
                                    >
                                        {selectedBookmarks.has(bookmark.id) ? (
                                            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                            </svg>
                                        ) : (
                                            <div className="w-4 h-4 rounded border-2 border-white/50" />
                                        )}
                                    </button>
                                )}
                                <BookmarkItem
                                    bookmark={bookmark}
                                    onDelete={handleDeleteBookmark}
                                    viewMode={viewMode}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 animate-fade-in">
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-30" />
                            <div className="relative w-40 h-40 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                                <svg className="w-20 h-20 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-5xl font-black text-white mb-5">
                            {searchQuery || selectedCategory || selectedTag ? 'No bookmarks found' : 'Your Collection Awaits'}
                        </h2>
                        <p className="text-white/50 text-xl mb-12 max-w-md mx-auto">
                            {searchQuery || selectedCategory || selectedTag
                                ? 'Try adjusting your filters or search terms'
                                : 'Start curating your digital universe with AI-powered intelligence'}
                        </p>
                        {!searchQuery && !selectedCategory && !selectedTag && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg group-hover:blur-xl transition-all" />
                                <div className="relative px-12 py-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-3xl font-bold text-xl shadow-2xl transform group-hover:scale-110 transition-all inline-flex items-center gap-4">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Your First Bookmark
                                </div>
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Add Bookmark Modal */}
            <AddBookmarkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddBookmark}
            />

            {/* Toast Container */}
            <ToastContainer />

            <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}
