// app/api/payment/mpesa-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const callbackData = await request.json();
        console.log('📞 Received M-Pesa callback:', JSON.stringify(callbackData, null, 2));

        // Process the callback from the new gateway
        let resultCode, resultDesc, amount, mpesaReceiptNumber, phoneNumber, accountReference;

        // Try to parse different possible callback structures
        if (callbackData.Body?.stkCallback) {
            // Safaricom-style callback
            resultCode = callbackData.Body.stkCallback.ResultCode;
            resultDesc = callbackData.Body.stkCallback.ResultDesc;

            if (resultCode === 0) {
                const callbackMetadata = callbackData.Body.stkCallback.CallbackMetadata;
                const items = callbackMetadata.Item;
                amount = items.find((item: any) => item.Name === 'Amount')?.Value;
                mpesaReceiptNumber = items.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
                phoneNumber = items.find((item: any) => item.Name === 'PhoneNumber')?.Value;

                // Get account reference from CallbackMetadata if available
                accountReference = items.find((item: any) => item.Name === 'AccountReference')?.Value;
            }
        } else if (callbackData.responseCode !== undefined) {
            // New gateway style callback
            resultCode = callbackData.responseCode;
            resultDesc = callbackData.responseMessage;
            amount = callbackData.transAmount;
            mpesaReceiptNumber = callbackData.transactionID;
            phoneNumber = callbackData.phoneNumber;
            accountReference = callbackData.accountReference;
        } else {
            // Fallback: log the entire structure for debugging
            console.log('🔍 Unknown callback structure, logging full data:', callbackData);
            resultCode = callbackData.ResultCode || callbackData.resultCode;
            resultDesc = callbackData.ResultDesc || callbackData.resultDesc;
            accountReference = callbackData.accountReference;
        }

        if (resultCode === 0 || resultCode === '0') {
            // Payment was successful
            console.log('✅ Payment successful:', {
                amount,
                mpesaReceiptNumber,
                phoneNumber,
                accountReference,
                resultDesc
            });

            // ✅ UPDATE DATABASE HERE
            // await prisma.payment.update({
            //   where: { transactionReference: accountReference },
            //   data: {
            //     status: 'completed',
            //     mpesaReceiptNumber: mpesaReceiptNumber,
            //     phoneNumber: phoneNumber,
            //     amount: amount,
            //     completedAt: new Date(),
            //   },
            // });

            // ✅ UPDATE USER KYC STATUS
            // await prisma.user.update({
            //   where: { id: userId }, // You need to map accountReference to user
            //   data: {
            //     kycStatus: 'paid',
            //     paymentVerified: true,
            //   },
            // });

            // ✅ SEND NOTIFICATION TO USER
            // await sendPaymentConfirmation(phoneNumber, amount, mpesaReceiptNumber);

            return NextResponse.json({
                success: true,
                message: 'Callback processed successfully',
                data: {
                    amount,
                    mpesaReceiptNumber,
                    phoneNumber,
                    accountReference
                }
            });
        } else {
            // Payment failed
            console.error('❌ Payment failed:', {
                resultCode,
                resultDesc,
                callbackData
            });

            // ✅ UPDATE DATABASE WITH FAILURE STATUS
            // await prisma.payment.update({
            //   where: { transactionReference: accountReference },
            //   data: {
            //     status: 'failed',
            //     errorMessage: resultDesc,
            //     failedAt: new Date(),
            //   },
            // });

            return NextResponse.json({
                success: false,
                error: 'Payment failed',
                resultCode,
                resultDesc
            });
        }

    } catch (error) {
        console.error('🚨 Error processing M-Pesa callback:', error);
        return NextResponse.json(
            {
                error: 'Callback processing failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Also support GET for health checks
export async function GET() {
    return NextResponse.json({
        status: 'OK',
        message: 'M-Pesa callback endpoint is running',
        timestamp: new Date().toISOString()
    });
}