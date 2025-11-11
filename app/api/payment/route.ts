// app/api/payment/mpesa/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, amount, accountReference } = await request.json();

        // Validate input
        if (!phoneNumber || !amount) {
            return NextResponse.json(
                { error: 'Phone number and amount are required' },
                { status: 400 }
            );
        }

        // M-Pesa STK Push implementation
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -4);
        const password = Buffer.from(
            `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
        ).toString('base64');

        const stkPushPayload = {
            BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: `${process.env.NEXTAUTH_URL}/api/payment/mpesa-callback`,
            AccountReference: accountReference,
            TransactionDesc: 'Kazipert Verification Fee',
        };

        // First get access token
        const authResponse = await fetch(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
                    ).toString('base64')}`,
                },
            }
        );

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        // Initiate STK Push
        const stkResponse = await fetch(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stkPushPayload),
            }
        );

        const stkData = await stkResponse.json();

        if (stkData.ResponseCode === '0') {
            return NextResponse.json({
                success: true,
                checkoutRequestID: stkData.CheckoutRequestID,
                message: 'Payment initiated successfully',
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to initiate payment', details: stkData },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('M-Pesa payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Callback endpoint for M-Pesa
export async function POST_CALLBACK(request: NextRequest) {
    try {
        const callbackData = await request.json();

        // Process the callback from M-Pesa
        const resultCode = callbackData.Body.stkCallback.ResultCode;
        const resultDesc = callbackData.Body.stkCallback.ResultDesc;

        if (resultCode === 0) {
            // Payment was successful
            const callbackMetadata = callbackData.Body.stkCallback.CallbackMetadata;
            const items = callbackMetadata.Item;

            const amount = items.find((item: any) => item.Name === 'Amount')?.Value;
            const mpesaReceiptNumber = items.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
            const phoneNumber = items.find((item: any) => item.Name === 'PhoneNumber')?.Value;

            // Update the user's payment status in the database
            // await prisma.kycDetails.update({
            //   where: { /* user criteria */ },
            //   data: {
            //     paymentStatus: 'completed',
            //     mpesaNumber: phoneNumber,
            //     transactionCode: mpesaReceiptNumber,
            //   },
            // });

            console.log('Payment successful:', {
                amount,
                mpesaReceiptNumber,
                phoneNumber,
            });
        } else {
            // Payment failed
            console.error('Payment failed:', resultDesc);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);
        return NextResponse.json(
            { error: 'Callback processing failed' },
            { status: 500 }
        );
    }
}