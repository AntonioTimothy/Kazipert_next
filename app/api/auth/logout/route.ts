// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        // Get refresh token from cookies first, then fallback to request body
        const refreshTokenFromCookie = request.cookies.get('refreshToken')?.value;
        const { refreshToken: refreshTokenFromBody } = await request.json().catch(() => ({}));

        const refreshToken = refreshTokenFromCookie || refreshTokenFromBody;

        if (refreshToken) {
            try {
                // Delete refresh token from database
                await prisma.refreshToken.deleteMany({
                    where: { token: refreshToken }
                });
            } catch (dbError) {
                console.error('Error deleting refresh token from database:', dbError);
                // Continue with logout even if DB operation fails
            }
        }

        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear cookies with consistent settings
        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);

        // Also clear any other auth-related cookies for completeness
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);

        // Still attempt to clear cookies even if there's an error
        const response = NextResponse.json(
            { error: 'Logout completed with warnings' },
            { status: 500 }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    }
}

// Support GET method for logout (useful for logout links)
export async function GET(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (refreshToken) {
            try {
                // Delete refresh token from database
                await prisma.refreshToken.deleteMany({
                    where: { token: refreshToken }
                });
            } catch (dbError) {
                console.error('Error deleting refresh token from database:', dbError);
                // Continue with logout even if DB operation fails
            }
        }

        const response = NextResponse.redirect(new URL('/login', request.url));

        // Clear cookies
        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);

        // Redirect to login even on error
        const response = NextResponse.redirect(new URL('/login', request.url));

        // Clear cookies
        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    }
}