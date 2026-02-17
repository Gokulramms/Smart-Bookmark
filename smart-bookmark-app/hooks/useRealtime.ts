'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Bookmark } from '@/types';

interface UseRealtimeProps {
    onInsert?: (bookmark: Bookmark) => void;
    onDelete?: (bookmarkId: string) => void;
    userId?: string;
}

export function useRealtime({ onInsert, onDelete, userId }: UseRealtimeProps) {
    const supabase = createClient();

    useEffect(() => {
        if (!userId) return;

        // Subscribe to changes for this user's bookmarks
        const channel = supabase
            .channel(`bookmarks:user_id=eq.${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Realtime INSERT:', payload);
                    if (onInsert && payload.new) {
                        onInsert(payload.new as Bookmark);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Realtime DELETE:', payload);
                    if (onDelete && payload.old) {
                        onDelete((payload.old as Bookmark).id);
                    }
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, onInsert, onDelete]);
}
