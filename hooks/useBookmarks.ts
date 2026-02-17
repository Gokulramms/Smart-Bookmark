'use client';

import { useEffect, useState, useCallback } from 'react';
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

            setBookmarks(data || []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setBookmarks([]);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    // Realtime subscription
    useEffect(() => {
        let channel: RealtimeChannel | null = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

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
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
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
                        const updatedBookmark = payload.new as Bookmark;
                        setBookmarks((prev) =>
                            prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b)
                        );
                    }
                )
                .subscribe();
        };

        setupRealtime();

        return () => {
            if (channel) {
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
            .insert(newBookmark as any)   // ← FIXED HERE
            .select()
            .single();

        if (error) throw error;

        setBookmarks((prev) => [data, ...prev]);
        return data;
    }, [supabase]);

    const deleteBookmark = useCallback(async (id: string) => {
        setBookmarks((prev) => prev.filter(b => b.id !== id));

        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', id);

        if (error) {
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
