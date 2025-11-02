// app/api/auth/me/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        console.log('Auth check - Access token exists:', !!accessToken);

        if (!accessToken) {
            console.log('No access token found in cookies');
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = verifyAccessToken(accessToken);
        console.log('Token decoded:', !!decoded);

        if (!decoded) {
            console.log('Invalid or expired token');
            // Clear invalid tokens
            const response = NextResponse.json({ user: null }, { status: 200 });
            response.cookies.delete('access_token');
            response.cookies.delete('refresh_token');
            return response;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true,
                userPermissions: {
                    include: {
                        permission: true
                    }
                },
                onboardingProgress: true,
                kycDetails: true
            }
        });

        if (!user) {
            console.log('User not found in database');
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const userSession = {
            id: user.id,
            email: user.email,
            name: user.fullName || user.firstName || user.email,
            role: user.role,
            avatar: user.profile?.avatar,
            isSuperAdmin: user.role === 'SUPER_ADMIN',
            onboardingCompleted: user.onboardingProgress?.completed || false,
            kycVerified: user.kycDetails?.profileVerified || false,
        };

        console.log('Returning user data for:', userSession.email);
        return NextResponse.json({ user: userSession }, { status: 200 });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}