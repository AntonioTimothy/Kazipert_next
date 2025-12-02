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

            // Return HTML that notifies parent and closes popup
            return new NextResponse(`
<!DOCTYPE html>
<html>
<head>
    <title>Payment Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .checkmark {
            font-size: 80px;
            margin-bottom: 20px;
        }
        h1 { margin: 0 0 10px 0; }
        p { margin: 10px 0; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="checkmark">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your verification payment has been processed.</p>
        <p>This window will close automatically...</p>
    </div>
    <script>
        // Notify parent window
        if (window.opener) {
            window.opener.postMessage({
                type: 'PESAPAL_PAYMENT_SUCCESS',
                orderTrackingId: '${orderTrackingId}',
                status: 'success'
            }, '*');
        }
        // Close popup after 2 seconds
        setTimeout(() => {
            window.close();
        }, 2000);
    </script>
</body>
</html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        } else {
            console.log('❌ Payment failed for user:', kycDetails.userId);

            // Return HTML for failed payment
            return new NextResponse(`
<!DOCTYPE html>
<html>
<head>
    <title>Payment Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
        h1 { margin: 0 0 10px 0; }
        p { margin: 10px 0; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✗</div>
        <h1>Payment Failed</h1>
        <p>Your payment could not be processed.</p>
        <p>This window will close automatically...</p>
    </div>
    <script>
        // Notify parent window
        if (window.opener) {
            window.opener.postMessage({
                type: 'PESAPAL_PAYMENT_FAILED',
                orderTrackingId: '${orderTrackingId}',
                status: 'failed'
            }, '*');
        }
        // Close popup after 3 seconds
        setTimeout(() => {
            window.close();
        }, 3000);
    </script>
</body>
</html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
    } catch (error: any) {
        console.error('❌ Pesapal callback error:', error);
        return NextResponse.redirect(new URL('/portals/employer/verification?error=callback_error', request.url));
    } finally {
        await prisma.$disconnect();
    }
}
