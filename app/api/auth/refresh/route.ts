// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

export async function POST(request: NextRequest) {
    try {
        // Get refresh token from cookies first, then fallback to request body
        const refreshTokenFromCookie = request.cookies.get('refreshToken')?.value;
        const { refreshToken: refreshTokenFromBody } = await request.json().catch(() => ({}));

        const refreshToken = refreshTokenFromCookie || refreshTokenFromBody;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token is required' },
                { status: 401 }
            );
        }

        console.log('Refreshing token for user...');

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
            userId: string;
            email: string;
            role: string;
            iat?: number;
            exp?: number;
        };

        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!storedToken) {
            console.log('Refresh token not found in database');
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            );
        }

        if (storedToken.expiresAt < new Date()) {
            console.log('Refresh token expired');
            // Clean up expired token
            await prisma.refreshToken.delete({
                where: { id: storedToken.id }
            });
            return NextResponse.json(
                { error: 'Refresh token expired' },
                { status: 401 }
            );
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(storedToken.user);
        const newRefreshToken = generateRefreshToken(storedToken.user);

        // Delete old refresh token
        await prisma.refreshToken.delete({
            where: { id: storedToken.id }
        });

        // Store new refresh token
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        console.log('Tokens refreshed successfully for user:', storedToken.user.email);

        const response = NextResponse.json(
            {
                message: 'Token refreshed successfully',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: storedToken.user.id,
                    email: storedToken.user.email,
                    role: storedToken.user.role,
                }
            },
            { status: 200 }
        );

        // Set new cookies with consistent settings
        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
        });

        response.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Token refresh error:', error);

        // Clear cookies on any error
        const response = NextResponse.json(
            { error: 'Invalid refresh token' },
            { status: 401 }
        );

        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set('accessToken', '', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return response;
    }
}

// GET endpoint for silent refresh (useful for middleware)
export async function GET(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token available' },
                { status: 401 }
            );
        }

        console.log('Silent token refresh requested');

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
            userId: string;
            email: string;
            role: string;
        };

        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        // Generate new access token only (silent refresh)
        const newAccessToken = generateAccessToken(storedToken.user);

        const response = NextResponse.json(
            {
                message: 'Access token refreshed successfully',
                accessToken: newAccessToken,
                user: {
                    id: storedToken.user.id,
                    email: storedToken.user.email,
                    role: storedToken.user.role,
                }
            },
            { status: 200 }
        );

        // Set new access token cookie
        const isProduction = process.env.NODE_ENV === 'production';
        response.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
        });

        console.log('Silent refresh successful for user:', storedToken.user.email);

        return response;
    } catch (error: any) {
        console.error('Silent refresh error:', error);
        return NextResponse.json(
            { error: 'Token refresh failed' },
            { status: 401 }
        );
    }
}