// app/api/payment/pesapal/register-ipn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerIPN } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, notification_type } = body;

        if (!url) {
            return NextResponse.json(
                { success: false, error: 'IPN URL is required' },
                { status: 400 }
            );
        }

        const ipnData = {
            url: url,
            ipn_notification_type: (notification_type || 'POST') as 'GET' | 'POST',
        };

        const result = await registerIPN(ipnData);

        return NextResponse.json({
            success: true,
            ipn_id: result.ipn_id,
            url: result.url,
            ipn_status: result.ipn_status,
            message: 'IPN registered successfully. Add this IPN ID to your .env file as PESAPAL_IPN_ID'
        });
    } catch (error: any) {
        console.error('Pesapal IPN registration error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'IPN registration failed'
            },
            { status: 500 }
        );
    }
}
