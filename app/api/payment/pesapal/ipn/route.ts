// app/api/payment/pesapal/ipn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus, isPaymentSuccessful } from '@/lib/pesapal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle both GET and POST IPN notifications
export async function GET(request: NextRequest) {
    return handleIPN(request);
}

export async function POST(request: NextRequest) {
    return handleIPN(request);
}

async function handleIPN(request: NextRequest) {
    try {
        let orderTrackingId: string | null = null;
        let merchantReference: string | null = null;

        // Handle GET request (query parameters)
        if (request.method === 'GET') {
            const searchParams = request.nextUrl.searchParams;
            orderTrackingId = searchParams.get('OrderTrackingId');
            merchantReference = searchParams.get('OrderMerchantReference');
        }
        // Handle POST request (JSON body)
        else if (request.method === 'POST') {
            const body = await request.json();
            orderTrackingId = body.OrderTrackingId;
            merchantReference = body.OrderMerchantReference;
        }

        console.log('🔔 Pesapal IPN received:', { orderTrackingId, merchantReference, method: request.method });

        if (!orderTrackingId) {
            return NextResponse.json(
                { success: false, error: 'OrderTrackingId is required' },
                { status: 400 }
            );
        }

        // Get transaction status from Pesapal
        const status = await getTransactionStatus(orderTrackingId);
        const paymentSuccessful = isPaymentSuccessful(status.payment_status_code);

        console.log('💳 IPN Payment Status:', {
            status: status.payment_status_description,
            code: status.payment_status_code,
            successful: paymentSuccessful
        });

        // Find KYC record by order tracking ID
        const kycDetails = await prisma.kycDetails.findFirst({
            where: { pesapalOrderTrackingId: orderTrackingId },
        });

        if (!kycDetails) {
            console.error('❌ KYC details not found for IPN order:', orderTrackingId);
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update payment status
        await prisma.kycDetails.update({
            where: { id: kycDetails.id },
            data: {
                paymentStatus: paymentSuccessful ? 'completed' : 'failed',
                paymentVerified: paymentSuccessful,
                transactionCode: status.confirmation_code,
            },
        });

        // If payment successful, mark user as verified
        if (paymentSuccessful) {
            await prisma.user.update({
                where: { id: kycDetails.userId },
                data: {
                    verified: true,
                    onboardingCompleted: true,
                },
            });

            console.log('✅ User verified via IPN:', kycDetails.userId);
        }

        return NextResponse.json({
            success: true,
            message: 'IPN processed successfully',
            payment_status: status.payment_status_description,
        });
    } catch (error: any) {
        console.error('❌ Pesapal IPN error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'IPN processing failed'
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
