// Middleware for route protection
// Uses a simple JWT check without database queries

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = [
        '/',
        '/login',
        '/registro',
        '/servicios',
        '/especialidades',
        '/medicos',
        '/membresias',
        '/promociones',
        '/contacto',
        '/aliados',
    ];

    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );

    // Allow public routes and API routes
    if (isPublicRoute || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Check for session token (NextAuth v5 uses authjs.session-token)
    const sessionToken = request.cookies.get('authjs.session-token') ||
        request.cookies.get('__Secure-authjs.session-token') ||
        request.cookies.get('next-auth.session-token') ||
        request.cookies.get('__Secure-next-auth.session-token');

    console.log('🔍 Middleware checking path:', pathname);
    console.log('🍪 Session token found:', !!sessionToken);

    // If no session token, redirect to login
    if (!sessionToken) {
        console.log('❌ No session token, redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    console.log('✅ Session token found, allowing access');
    // Allow authenticated users
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, icon files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp).*)',
    ],
};
