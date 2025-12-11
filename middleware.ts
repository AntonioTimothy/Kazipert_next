// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

// CORRECT: Export as named "proxy" function
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',                    // Landing page
    '/login',
    '/signup',
    '/forgot-password',
    '/api/auth',
    '/api/payment/mpesa-callback',
    '/api/payment/pesapal/ipn',
    '/unauthorized',        // Unauthorized page
    '/_next/static',        // Next.js static files
    '/_next/image',         // Next.js image optimization
    '/favicon.ico'         // Favicon
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
    console.log('🔐 No access token found, redirecting to login');
    // Redirect to login if no token found
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify access token
  const decoded = verifyAccessToken(accessToken);
  if (!decoded) {
    console.log('❌ Invalid access token, clearing cookies and redirecting');
    // Token invalid, clear cookies and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  console.log('✅ Token verified for user:', decoded.email, 'role:', decoded.role);

  // Role-based route protection - ONLY CHECK NEW PORTAL STRUCTURE
  const userRole = decoded.role;

  // Remove old structure checks - they're causing the redirect loop
  // Only check the new portal structure

  if (pathname.startsWith('/portals/worker') && userRole !== 'EMPLOYEE') {
    console.log('🚫 Access denied: Worker portal requires EMPLOYEE role, user has:', userRole);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/portals/employer') && userRole !== 'EMPLOYER') {
    console.log('🚫 Access denied: Employer portal requires EMPLOYER role, user has:', userRole);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/portals/admin') && !['ADMIN', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHOTO_STUDIO_ADMIN', 'EMBASSY_ADMIN'].includes(userRole)) {
    console.log('🚫 Access denied: Admin portal requires admin role, user has:', userRole);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Add user info to headers for server components
  const response = NextResponse.next();
  response.headers.set('x-user-id', decoded.userId);
  response.headers.set('x-user-role', userRole);

  console.log('✅ Access granted to:', pathname, 'for role:', userRole);

  return response;
}

// CORRECT: Export config for proxy
export const config = {
  matcher: [
    // Remove old structure paths to avoid conflicts
    '/portals/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/:path*',
  ],
};