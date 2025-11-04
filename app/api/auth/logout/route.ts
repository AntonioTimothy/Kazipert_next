// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Get the refresh token from cookies to delete from database
        const refreshToken = cookieStore.get('refresh_token')?.value;

        // If refresh token exists, delete it from database
        if (refreshToken) {
            try {
                await prisma.refreshToken.deleteMany({
                    where: {
                        token: refreshToken
                    }
                });
                console.log('Refresh token deleted from database');
            } catch (dbError) {
                console.error('Error deleting refresh token from database:', dbError);
                // Continue with logout even if DB deletion fails
            }
        }

        // Create response
        const response = NextResponse.json({
            message: 'Logout successful'
        }, { status: 200 });

        // Clear all auth cookies from the response
        response.cookies.set({
            name: 'access_token',
            value: '',
            expires: new Date(0),
            path: '/',
        });

        response.cookies.set({
            name: 'refresh_token',
            value: '',
            expires: new Date(0),
            path: '/',
        });

        response.cookies.set({
            name: 'temp_session',
            value: '',
            expires: new Date(0),
            path: '/',
        });

        // Also clear any session-related cookies that might exist
        response.cookies.set({
            name: 'session',
            value: '',
            expires: new Date(0),
            path: '/',
        });

        console.log('All auth cookies cleared successfully');

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Handle GET requests for logout as well
    return await POST();
}