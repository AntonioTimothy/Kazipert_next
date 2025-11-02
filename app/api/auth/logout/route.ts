// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear all auth cookies
        const response = NextResponse.json({
            message: 'Logout successful'
        }, { status: 200 });

        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        response.cookies.delete('temp_session');

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}