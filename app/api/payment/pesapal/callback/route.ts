// app/api/payment/pesapal/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus, isPaymentSuccessful } from '@/lib/pesapal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orderTrackingId = searchParams.get('OrderTrackingId');
        const merchantReference = searchParams.get('OrderMerchantReference');

        console.log('📞 Pesapal Callback received:', { orderTrackingId, merchantReference });

        if (!orderTrackingId) {
            return NextResponse.redirect(new URL('/portals/employer/verification?error=missing_tracking_id', request.url));
        }

        // Get transaction status from Pesapal
        const status = await getTransactionStatus(orderTrackingId);
        const paymentSuccessful = isPaymentSuccessful(status.payment_status_code);

        console.log('💳 Payment Status:', {
            status: status.payment_status_description,
            code: status.payment_status_code,
            successful: paymentSuccessful
        });

        // Find KYC record by order tracking ID
        const kycDetails = await prisma.kycDetails.findFirst({
            where: { pesapalOrderTrackingId: orderTrackingId },
            include: { user: true }
        });

        if (!kycDetails) {
            console.error('❌ KYC details not found for order:', orderTrackingId);
            return NextResponse.redirect(new URL('/portals/employer/verification?error=order_not_found', request.url));
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

            console.log('✅ User verified successfully:', kycDetails.userId);

            // Redirect to success page
            return NextResponse.redirect(new URL('/portals/employer/verification?step=7&payment=success', request.url));
        } else {
            console.log('❌ Payment failed for user:', kycDetails.userId);

            // Redirect to failure page
            return NextResponse.redirect(new URL('/portals/employer/verification?step=6&payment=failed', request.url));
        }
    } catch (error: any) {
        console.error('❌ Pesapal callback error:', error);
        return NextResponse.redirect(new URL('/portals/employer/verification?error=callback_error', request.url));
    } finally {
        await prisma.$disconnect();
    }
}
