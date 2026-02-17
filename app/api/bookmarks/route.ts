import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processBookmark } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { url, title } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Fetch existing bookmarks for duplicate detection
        const { data: existingBookmarks, error: fetchError } = await supabase
            .from('bookmarks')
            .select('id, url, title')
            .eq('user_id', user.id);

        if (fetchError) {
            console.error('Error fetching existing bookmarks:', fetchError);
        }

        // Process bookmark with AI (with fallback if AI fails)
        let aiData;
        let aiWarning = null;
        try {
            aiData = await processBookmark(
                url,
                title,
                existingBookmarks || []
            );
        } catch (aiError: any) {
            console.error('AI processing failed, using fallback:', aiError);

            // Determine if it's a network issue
            const isNetworkError =
                aiError.message?.includes('fetch') ||
                aiError.message?.includes('network') ||
                aiError.message?.includes('ECONNREFUSED') ||
                aiError.code === 'ENOTFOUND';

            aiWarning = isNetworkError
                ? 'AI features unavailable (network blocked). Bookmark saved with basic info.'
                : 'AI processing failed. Bookmark saved with basic info.';

            // Fallback: Use manual values with smart defaults
            const hostname = new URL(url).hostname.replace('www.', '');
            aiData = {
                title: title || hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1),
                summary: `Saved from ${hostname}`,
                category: 'Other',
                tags: [hostname.split('.')[0]],
                duplicate: { isDuplicate: false }
            };
        }

        // Check if duplicate
        if (aiData.duplicate.isDuplicate) {
            return NextResponse.json({
                error: 'Duplicate bookmark detected',
                duplicate: true,
                confidence: aiData.duplicate.confidence,
                existingBookmarkId: aiData.duplicate.matchId,
            }, { status: 409 });
        }

        // Add bookmark to database
        const { data: newBookmark, error: insertError } = await supabase
            .from('bookmarks')
            .insert({
                user_id: user.id,
                url,
                title: aiData.title,
                summary: aiData.summary,
                category: aiData.category,
                tags: aiData.tags,
                favicon_url: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
            } as any)
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting bookmark:', insertError);
            return NextResponse.json({ error: 'Failed to save bookmark' }, { status: 500 });
        }

        return NextResponse.json({
            bookmark: newBookmark,
            warning: aiWarning // Include network/AI warning if exists
        }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/bookmarks:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
