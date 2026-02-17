import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = {
    name: string;
    value: string;
    options?: Record<string, any>;
};

export async function middleware(request: NextRequest) {
    // If env variables are missing, skip middleware to prevent 500 error
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnon) {
        return NextResponse.next();
    }

    const response = NextResponse.next();

    const supabase = createServerClient(supabaseUrl, supabaseAnon, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookies: CookieToSet[]) {
                cookies.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protect dashboard
    if (!user && pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from login
    if (user && pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
