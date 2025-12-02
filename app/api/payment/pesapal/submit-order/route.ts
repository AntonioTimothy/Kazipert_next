// app/api/payment/pesapal/submit-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { submitOrder, createOrderRequest, ensureIpnId } from '@/lib/pesapal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, amount, currency } = body;

        if (!userId || !amount) {
            return NextResponse.json(
                { success: false, error: 'userId and amount are required' },
                { status: 400 }
            );
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Ensure IPN ID is available
        const ipnId = await ensureIpnId();
        console.log('Using IPN ID:', ipnId);

        // Create order request
        const orderData = createOrderRequest(
            user.id,
            user.email,
            user.phone || '',
            user.fullName || user.email,
            amount,
            currency || 'KES',
            ipnId
        );

        // Submit order to Pesapal
        const result = await submitOrder(orderData);

        // Save order tracking ID to database
        await prisma.kycDetails.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                paymentStatus: 'pending',
                paymentMethod: 'pesapal',
                paymentCurrency: currency || 'KES',
                paymentAmount: amount,
                pesapalOrderTrackingId: result.order_tracking_id,
                pesapalMerchantReference: result.merchant_reference,
            },
            update: {
                paymentStatus: 'pending',
                paymentMethod: 'pesapal',
                paymentCurrency: currency || 'KES',
                paymentAmount: amount,
                pesapalOrderTrackingId: result.order_tracking_id,
                pesapalMerchantReference: result.merchant_reference,
            },
        });

        return NextResponse.json({
            success: true,
            order_tracking_id: result.order_tracking_id,
            merchant_reference: result.merchant_reference,
            redirect_url: result.redirect_url,
            message: 'Order created successfully'
        });
    } catch (error: any) {
        console.error('Pesapal order submission error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Order submission failed'
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
