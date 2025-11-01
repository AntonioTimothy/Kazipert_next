// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateTokenForMiddleware, validateRefreshTokenForMiddleware } from './lib/edge-auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    console.log('Middleware:', {
        path: pathname,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
    })

    // Allow auth API routes and public routes to pass through without checking
    const publicRoutes = [
        '/api/auth/login',
        '/api/auth/verify-login-otp',
        '/api/auth/refresh',
        '/api/auth/logout',
        '/login',
        '/signup',
        '/forgot-password',
        '/_next',
        '/favicon.ico',
        '/public'
    ]

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Protected routes
    const protectedRoutes = [
        '/worker',
        '/employer',
        '/admin',
        '/api/onboarding',
        '/api/worker'
    ]

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    if (isProtectedRoute) {
        console.log('Protected route access attempt:', pathname)

        // If no tokens at all, redirect to login
        if (!accessToken && !refreshToken) {
            console.log('No tokens found, redirecting to login')
            return redirectToLogin(request, pathname)
        }

        // For middleware, be more permissive - if tokens exist, allow access
        // Let the destination page handle detailed validation
        if (accessToken || refreshToken) {
            console.log('Tokens exist, allowing access to:', pathname)

            // Add headers to help with client-side routing
            const response = NextResponse.next()
            response.headers.set('x-middleware-cache', 'no-cache')
            return response
        }

        console.log('No valid authentication, redirecting to login')
        return redirectToLogin(request, pathname)
    }

    return NextResponse.next()
}

function redirectToLogin(request: NextRequest, returnPath: string) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', returnPath)

    console.log('Redirecting to login, callbackUrl:', returnPath)

    const response = NextResponse.redirect(loginUrl)

    // Don't clear cookies on redirect - let the client handle expired tokens
    return response
}

export const config = {
    matcher: [
        '/worker/:path*',
        '/employer/:path*',
        '/admin/:path*',
        '/api/onboarding/:path*',
        '/api/worker/:path*'
    ]
}