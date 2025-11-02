// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

// CORRECT: Export as named "proxy" function
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = [
        '/',                    // Landing page
        '/login',
        '/signup',
        '/forgot-password',
        '/api/auth',
        '/unauthorized',        // Unauthorized page
        '/_next/static',        // Next.js static files
        '/_next/image',         // Next.js image optimization
        '/favicon.ico'          // Favicon
    ];

    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route ||
        pathname.startsWith(route + '/')
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check for access token in cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
        // Redirect to login if no token found
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
        // Token invalid, clear cookies and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
    }

    // Role-based route protection
    const userRole = decoded.role;

    // Worker routes (old structure)
    if (pathname.startsWith('/worker') && userRole !== 'EMPLOYEE') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Employer routes (old structure)
    if (pathname.startsWith('/employer') && userRole !== 'EMPLOYER') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Admin routes (old structure)
    if (pathname.startsWith('/admin') && !['ADMIN', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHOTO_STUDIO_ADMIN', 'EMBASSY_ADMIN'].includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // New portal structure protection
    if (pathname.startsWith('/portals/worker') && userRole !== 'EMPLOYEE') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/portals/employer') && userRole !== 'EMPLOYER') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/portals/admin') && !['ADMIN', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHOTO_STUDIO_ADMIN', 'EMBASSY_ADMIN'].includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add user info to headers for server components
    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId);
    response.headers.set('x-user-role', userRole);

    return response;
}

// CORRECT: Export config for proxy
export const config = {
    matcher: [
        '/portals/:path*',
        '/worker/:path*',
        '/employer/:path*',
        '/admin/:path*',
        '/portals/:path*',
        '/dashboard/:path*',
        '/profile/:path*',
    ],
};