import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BookmarkCategory } from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use gemini-2.5-flash as requested
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    },
});

/**
 * Generate title for a URL if not provided
 */
export async function generateTitle(url: string): Promise<string> {
    try {
        const prompt = `Analyze this URL and generate a clear, descriptive title (max 60 characters):

URL: ${url}

Rules:
- Extract the main topic or purpose
- Make it readable and professional
- Return ONLY the title, no quotes or extra text

Title:`;

        const result = await model.generateContent(prompt);
        const title = result.response.text().trim().replace(/^["']|["']$/g, '');

        return title || new URL(url).hostname;
    } catch (error) {
        console.error('Error generating title:', error);
        try {
            const hostname = new URL(url).hostname.replace('www.', '');
            return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
        } catch {
            return 'Untitled Bookmark';
        }
    }
}

/**
 * Advanced: Fetch and analyze page content
 */
async function fetchPageContent(url: string): Promise<string> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) return '';

        const html = await response.text();

        // Extract text content (simple version)
        const textContent = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 3000); // Limit to 3000 chars

        return textContent;
    } catch (error) {
        console.error('Error fetching page content:', error);
        return '';
    }
}

/**
 * Generate smart summary with optional content analysis
 */
export async function generateSummary(url: string, title: string): Promise<string> {
    try {
        // Try to fetch actual page content for better summaries
        const pageContent = await fetchPageContent(url);

        const prompt = pageContent
            ? `Generate a brief, informative 2-3 sentence summary for this webpage:

Title: ${title}
URL: ${url}
Content Preview: ${pageContent.slice(0, 1500)}

Summary:`
            : `Generate a brief 2-3 sentence summary for a bookmark with this information:

Title: ${title}
URL: ${url}

Summary:`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim();

        return summary || '';
    } catch (error) {
        console.error('Error generating summary:', error);
        return '';
    }
}

/**
 * Advanced categorization with confidence scoring
 */
export async function categorizeBookmark(url: string, title: string): Promise<BookmarkCategory> {
    try {
        const prompt = `Analyze and categorize this bookmark into ONE category:

URL: ${url}
Title: ${title}

Available Categories:
- Work: Professional tools, business, productivity
- Personal: Personal projects, hobbies, lifestyle
- Research: Academic, studies, documentation
- Shopping: E-commerce, products, deals
- Entertainment: Movies, games, music, fun
- News: Current events, journalism, updates
- Education: Learning resources, courses, tutorials
- Tools: Software, utilities, development tools
- Social: Social media, communication, networking
- Other: Everything else

Return ONLY the category name (one word), nothing else.

Category:`;

        const result = await model.generateContent(prompt);
        const category = result.response.text().trim() as BookmarkCategory;

        // Validate category
        const validCategories: BookmarkCategory[] = [
            'Work', 'Personal', 'Research', 'Shopping', 'Entertainment',
            'News', 'Education', 'Tools', 'Social', 'Other'
        ];

        return validCategories.includes(category) ? category : 'Other';
    } catch (error) {
        console.error('Error categorizing bookmark:', error);
        return 'Other';
    }
}

/**
 * Advanced tag suggestion with semantic understanding
 */
export async function suggestTags(url: string, title: string, summary: string): Promise<string[]> {
    try {
        const prompt = `Generate 3-5 relevant, searchable tags for this bookmark:

Title: ${title}
URL: ${url}
Summary: ${summary}

Rules:
- Tags should be 1-2 words, lowercase
- Focus on topics, technologies, and key concepts
- Make them searchable and useful
- Separate with commas
- No hashtags, just the words

Tags:`;

        const result = await model.generateContent(prompt);
        const tagsText = result.response.text().trim();

        // Parse and clean tags
        const tags = tagsText
            .split(',')
            .map(tag => tag.trim().toLowerCase().replace(/^#/, ''))
            .filter(tag => tag.length > 0 && tag.length < 20)
            .slice(0, 5);

        return tags;
    } catch (error) {
        console.error('Error suggesting tags:', error);
        // Fallback: extract from URL
        try {
            const hostname = new URL(url).hostname.replace('www.', '');
            return [hostname.split('.')[0]];
        } catch {
            return [];
        }
    }
}

/**
 * Advanced duplicate detection with semantic similarity
 */
export async function detectDuplicate(
    url: string,
    title: string,
    existingBookmarks: Array<{ url: string; title: string; id: string }>
): Promise<{ isDuplicate: boolean; matchId?: string; confidence?: number }> {
    try {
        if (existingBookmarks.length === 0) {
            return { isDuplicate: false };
        }

        // Check exact URL match first (instant)
        const exactMatch = existingBookmarks.find(b => {
            try {
                const url1 = new URL(b.url).href;
                const url2 = new URL(url).href;
                return url1 === url2;
            } catch {
                return b.url === url;
            }
        });

        if (exactMatch) {
            return { isDuplicate: true, matchId: exactMatch.id, confidence: 100 };
        }

        // Semantic similarity check (only if many bookmarks)
        if (existingBookmarks.length > 50) {
            // Sample most recent 30 bookmarks for performance
            const recentBookmarks = existingBookmarks.slice(0, 30);
            return await checkSemanticDuplicate(url, title, recentBookmarks);
        }

        return await checkSemanticDuplicate(url, title, existingBookmarks);
    } catch (error) {
        console.error('Error detecting duplicate:', error);
        return { isDuplicate: false };
    }
}

/**
 * Semantic duplicate check using AI
 */
async function checkSemanticDuplicate(
    url: string,
    title: string,
    bookmarks: Array<{ url: string; title: string; id: string }>
): Promise<{ isDuplicate: boolean; matchId?: string; confidence?: number }> {
    try {
        const bookmarkList = bookmarks
            .map((b, i) => `${i + 1}. "${b.title}" - ${b.url}`)
            .join('\n');

        const prompt = `Analyze if this NEW bookmark is a duplicate or very similar to any EXISTING bookmark:

NEW BOOKMARK:
Title: "${title}"
URL: ${url}

EXISTING BOOKMARKS:
${bookmarkList}

Rules:
- Same URL with different params = duplicate (100% confidence)
- Same article/page on same site = duplicate (90%+ confidence)
- Similar topic but different page = NOT duplicate
- Different sites = NOT duplicate (unless exact same article reposted)

If duplicate found, respond with: MATCH [number] [confidence%]
Examples: "MATCH 3 95" or "MATCH 1 100"

If NOT duplicate, respond with: NO_MATCH

Response:`;

        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        if (response === 'NO_MATCH' || response.includes('NO_MATCH')) {
            return { isDuplicate: false };
        }

        // Parse "MATCH 3 95" format
        const match = response.match(/MATCH\s+(\d+)\s+(\d+)/i);
        if (match) {
            const bookmarkIndex = parseInt(match[1]) - 1;
            const confidence = parseInt(match[2]);

            // Only consider high confidence matches (75%+)
            if (confidence >= 75 && bookmarkIndex >= 0 && bookmarkIndex < bookmarks.length) {
                return {
                    isDuplicate: true,
                    matchId: bookmarks[bookmarkIndex].id,
                    confidence,
                };
            }
        }

        return { isDuplicate: false };
    } catch (error) {
        console.error('Error in semantic duplicate check:', error);
        return { isDuplicate: false };
    }
}

/**
 * OPTIMIZED: Process bookmark with SINGLE AI call
 * Avoids rate limiting by combining all AI tasks into one request
 */
export async function processBookmark(
    url: string,
    providedTitle: string | undefined,
    existingBookmarks: Array<{ url: string; title: string; id: string }>
) {
    try {
        console.log('🤖 AI Processing bookmark:', url);

        // Quick duplicate check first (no AI needed)
        const exactMatch = existingBookmarks.find(b => {
            try {
                const url1 = new URL(b.url).href;
                const url2 = new URL(url).href;
                return url1 === url2;
            } catch {
                return b.url === url;
            }
        });

        if (exactMatch) {
            console.log('⚠️ Exact duplicate found');
            return {
                title: exactMatch.title,
                summary: '',
                category: 'Other' as BookmarkCategory,
                tags: [],
                duplicate: { isDuplicate: true, matchId: exactMatch.id, confidence: 100 },
            };
        }

        // SINGLE AI CALL - Get everything at once to avoid rate limiting
        const bookmarkList = existingBookmarks.length > 0
            ? existingBookmarks.slice(0, 20).map((b, i) => `${i + 1}. "${b.title}" - ${b.url}`).join('\n')
            : 'None';

        const prompt = `Analyze this bookmark and provide complete metadata in JSON format:

URL: ${url}
${providedTitle ? `Provided Title: ${providedTitle}` : ''}

Existing Bookmarks (for duplicate check):
${bookmarkList}

Provide a JSON response with these fields:
{
  "title": "Clear, descriptive title (max 60 chars)${providedTitle ? ' - use provided title if good' : ''}",
  "summary": "Brief 2-3 sentence summary describing what this bookmark is about",
  "category": "ONE of: Work, Personal, Research, Shopping, Entertainment, News, Education, Tools, Social, Other",
  "tags": ["tag1", "tag2", "tag3"],
  "duplicate": {
    "isDuplicate": false,
    "confidence": 0,
    "matchNumber": 0
  }
}

Rules:
- Title: Professional and readable
- Summary: Informative and concise
- Category: Choose the BEST fit from the 10 options
- Tags: 3-5 relevant lowercase tags (1-2 words each)
- Duplicate: Set isDuplicate=true ONLY if this URL/page already exists in the list above (95%+ similar). Include matchNumber (1-based) and confidence (0-100).

Return ONLY the JSON object, no markdown, no code blocks, just pure JSON:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Parse JSON response
        let aiData;
        try {
            // Remove markdown code blocks if present
            const jsonText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            aiData = JSON.parse(jsonText);
            console.log('✅ AI Response:', aiData);
        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            throw new Error('AI response parsing failed');
        }

        // Validate and use AI data
        const validCategories: BookmarkCategory[] = [
            'Work', 'Personal', 'Research', 'Shopping', 'Entertainment',
            'News', 'Education', 'Tools', 'Social', 'Other'
        ];

        const title = providedTitle || aiData.title || new URL(url).hostname;
        const summary = aiData.summary || '';
        const category = validCategories.includes(aiData.category) ? aiData.category : 'Other';
        const tags = Array.isArray(aiData.tags)
            ? aiData.tags.slice(0, 5).map((t: string) => t.toLowerCase().trim())
            : [];

        // Handle duplicate check from AI response
        let duplicate: { isDuplicate: boolean; matchId?: string; confidence?: number } = { isDuplicate: false };
        if (aiData.duplicate?.isDuplicate && aiData.duplicate?.matchNumber > 0) {
            const matchIndex = aiData.duplicate.matchNumber - 1;
            if (matchIndex >= 0 && matchIndex < existingBookmarks.length && aiData.duplicate.confidence >= 75) {
                duplicate = {
                    isDuplicate: true,
                    matchId: existingBookmarks[matchIndex].id,
                    confidence: aiData.duplicate.confidence,
                };
            }
        }

        console.log('🎉 AI Processing complete!');
        console.log('  Title:', title);
        console.log('  Category:', category);
        console.log('  Tags:', tags);
        console.log('  Duplicate:', duplicate.isDuplicate ? 'Yes' : 'No');

        return {
            title,
            summary,
            category,
            tags,
            duplicate,
        };

    } catch (error: any) {
        console.error('❌ AI Processing failed:', error);

        // Check for rate limiting
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
            console.error('⚠️ Rate Limited! Using fallback...');
        }

        // Check if it's an API key issue
        if (error.message?.includes('API_KEY') || error.message?.includes('apiKey')) {
            console.error('🔑 Gemini API Key issue - check your .env.local file');
        }

        // Return intelligent fallback
        const hostname = new URL(url).hostname.replace('www.', '');
        const fallbackTitle = providedTitle || hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);

        return {
            title: fallbackTitle,
            summary: `Saved from ${hostname}`,
            category: 'Other' as BookmarkCategory,
            tags: [hostname.split('.')[0]],
            duplicate: { isDuplicate: false },
        };
    }
}

