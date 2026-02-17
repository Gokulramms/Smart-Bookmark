import { z } from 'zod';

/**
 * Environment variable schema for validation
 */
const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
    GEMINI_API_KEY: z.string().min(1, 'Gemini API key is required'),
});

/**
 * Validates environment variables at build time
 */
export function validateEnv() {
    const env = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    };

    try {
        envSchema.parse(env);
        return env as z.infer<typeof envSchema>;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
            throw new Error(`Environment validation failed:\n${errors}`);
        }
        throw error;
    }
}

/**
 * URL validation schema
 */
export const urlSchema = z.string().url('Please enter a valid URL').refine(
    (url) => {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    },
    { message: 'URL must use HTTP or HTTPS protocol' }
);

/**
 * Add bookmark input validation schema
 */
export const addBookmarkSchema = z.object({
    url: urlSchema,
    title: z.string().max(200, 'Title must be 200 characters or less').optional(),
});

/**
 * Bookmark category validation
 */
export const categorySchema = z.enum([
    'Work',
    'Personal',
    'Research',
    'Shopping',
    'Entertainment',
    'News',
    'Education',
    'Tools',
    'Social',
    'Other',
]);
