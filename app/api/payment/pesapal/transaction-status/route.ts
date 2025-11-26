// app/api/payment/pesapal/transaction-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus, isPaymentSuccessful } from '@/lib/pesapal';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orderTrackingId = searchParams.get('orderTrackingId');

        if (!orderTrackingId) {
            return NextResponse.json(
                { success: false, error: 'orderTrackingId is required' },
                { status: 400 }
            );
        }

        const status = await getTransactionStatus(orderTrackingId);

        return NextResponse.json({
            success: true,
            payment_status: status.payment_status_description,
            payment_status_code: status.payment_status_code,
            is_successful: isPaymentSuccessful(status.payment_status_code),
            amount: status.amount,
            currency: status.currency,
            payment_method: status.payment_method,
            confirmation_code: status.confirmation_code,
            merchant_reference: status.merchant_reference,
        });
    } catch (error: any) {
        console.error('Pesapal transaction status error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to get transaction status'
            },
            { status: 500 }
        );
    }
}
