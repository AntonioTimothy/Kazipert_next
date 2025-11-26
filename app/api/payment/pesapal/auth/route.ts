// app/api/payment/pesapal/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken();

        return NextResponse.json({
            success: true,
            token,
            message: 'Authentication successful'
        });
    } catch (error: any) {
        console.error('Pesapal auth error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Authentication failed'
            },
            { status: 500 }
        );
    }
}
