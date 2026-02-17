'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { type RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark } from '@/types';

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchBookmarks = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setBookmarks([]);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('✅ Fetched bookmarks:', data?.length || 0);
            setBookmarks(data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setBookmarks([]);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    // Setup realtime subscription
    useEffect(() => {
        let channel: RealtimeChannel | null = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            console.log('🔌 Setting up realtime for user:', user.id);

            channel = supabase
                .channel(`public:bookmarks:user_id=eq.${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('📡 REALTIME INSERT:', payload);
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            // Avoid duplicates
                            if (prev.some(b => b.id === newBookmark.id)) return prev;
                            return [newBookmark, ...prev];
                        });
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'DELETE',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('📡 REALTIME DELETE:', payload);
                        const deletedId = payload.old.id;
                        setBookmarks((prev) => prev.filter(b => b.id !== deletedId));
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'bookmarks',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('📡 REALTIME UPDATE:', payload);
                        const updatedBookmark = payload.new as Bookmark;
                        setBookmarks((prev) =>
                            prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b)
                        );
                    }
                )
                .subscribe((status, err) => {
                    console.log('📡 Subscription status:', status);
                    if (err) console.error('📡 Subscription error:', err);
                    if (status === 'SUBSCRIBED') {
                        console.log('✅ Realtime connected!');
                    }
                });
        };

        setupRealtime();

        return () => {
            if (channel) {
                console.log('🔌 Cleaning up realtime');
                supabase.removeChannel(channel);
            }
        };
    }, [supabase]);

    // Initial fetch
    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const addBookmark = useCallback(async (bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const newBookmark = {
            ...bookmark,
            user_id: user.id,
        };

        const { data, error } = await supabase
            .from('bookmarks')
            .insert([newBookmark])
            .select()
            .single();

        if (error) throw error;

        // Optimistic update - add immediately
        setBookmarks((prev) => [data, ...prev]);
        console.log('✅ Bookmark added locally');

        return data;
    }, [supabase]);

    const deleteBookmark = useCallback(async (id: string) => {
        // Optimistic update - remove immediately
        setBookmarks((prev) => prev.filter(b => b.id !== id));
        console.log('✅ Bookmark removed locally');

        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id);

        if (error) {
            // Revert on error
            await fetchBookmarks();
            throw error;
        }
    }, [supabase, fetchBookmarks]);

    return {
        bookmarks,
        isLoading,
        addBookmark,
        deleteBookmark,
        refetch: fetchBookmarks,
    };
}
