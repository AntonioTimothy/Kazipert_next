// app/api/onboarding/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId, mpesaNumber } = await request.json();

        // Simulate payment processing
        const paymentSuccess = false; // Always fail for demo

        if (!paymentSuccess) {
            return NextResponse.json({
                success: false,
                error: 'Payment service temporarily unavailable. Please try again later.'
            }, { status: 400 });
        }

        const kyc = await prisma.kycDetails.update({
            where: { userId },
            data: {
                mpesaNumber,
                paymentStatus: 'completed',
                paymentVerified: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Payment processed successfully'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}