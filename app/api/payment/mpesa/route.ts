// app/api/payment/mpesa/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Custom fetch function that ignores SSL errors
const fetchWithSSLBypass = async (url: string, options: any = {}) => {
    // Use node-fetch with custom agent to bypass SSL verification
    const { default: fetch } = await import('node-fetch');
    const { Agent } = await import('https');

    const agent = new Agent({
        rejectUnauthorized: false, // This bypasses SSL certificate verification
    });

    return fetch(url, {
        ...options,
        agent, // Use the custom agent
    });
};

export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, amount, accountReference, userId } = await request.json();

        // Validate input
        if (!phoneNumber || !amount || !accountReference) {
            return NextResponse.json(
                { error: 'Phone number, amount, and account reference are required' },
                { status: 400 }
            );
        }

        // Configuration
        const config = {
            authUrl: 'https://apps.nationalbank.co.ke/auth2/master/protocol/openid-connect/token',
            stkPushUrl: 'https://apps.nationalbank.co.ke/stk/stk_request',
            credentials: {
                clientId: "MARTSTEC",
                clientSecret: "9aC8X0X!Z8$PUQb4fVQv1bgJkFJy",
                username: "MARTSTEC",
                password: "COt$2233B123#k12"
            }
        };

        // Generate Base64 encoded credentials
        const getBase64Credentials = () => {
            const credentials = `${config.credentials.clientId}:${config.credentials.clientSecret}`;
            return Buffer.from(credentials).toString('base64');
        };

        // Generate unique transaction reference
        const generateTransactionReference = () => {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 8).toUpperCase();
            return `KZP-${timestamp}-${random}`;
        };

        const getCurrentDate = () => new Date().toISOString();

        // Step 1: Get Access Token with SSL bypass
        console.log('🔐 Getting Access Token...');
        console.log(`📡 URL: ${config.authUrl}`);

        const authResponse = await fetchWithSSLBypass(config.authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${getBase64Credentials()}`,
            },
            body: 'grant_type=client_credentials',
        });

        console.log(`📊 Auth Response Status: ${authResponse.status}`);

        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            console.error('❌ Auth failed:', errorText);
            return NextResponse.json(
                {
                    error: 'Failed to authenticate with payment gateway',
                    details: errorText,
                    status: authResponse.status
                },
                { status: authResponse.status }
            );
        }

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        if (!accessToken) {
            console.error('❌ No access token in response:', authData);
            return NextResponse.json(
                { error: 'No access token received from payment gateway' },
                { status: 500 }
            );
        }

        console.log('✅ Access Token Obtained Successfully!');
        console.log(`📝 Token: ${accessToken.substring(0, 50)}...`);

        // Step 2: Make STK Push Request with SSL bypass
        const transactionReference = generateTransactionReference();

        const requestData = {
            accountReference: "20173154#MARTSTEC",
            businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || "174379",
            phoneNumber: phoneNumber,
            requestDate: getCurrentDate(),
            // transAmount: amount.toString(),
            transAmount: "1", // For testing purposes
            transactionDesc: "Kazipert Verification Fee",
            transactionReference: transactionReference,
            callbackurl: `https://kazipert.com/api/payment/mpesa-callback`
        };

        console.log('💰 Making STK Push Request...');
        console.log(`📡 URL: ${config.stkPushUrl}`);
        console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));

        const stkResponse = await fetchWithSSLBypass(config.stkPushUrl, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'username': config.credentials.username,
                'password': config.credentials.password,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestData),
        });

        console.log(`📊 STK Response Status: ${stkResponse.status}`);

        const stkData = await stkResponse.json();
        console.log('📋 STK Response Data:', JSON.stringify(stkData, null, 2));

        if (!stkResponse.ok) {
            return NextResponse.json(
                {
                    error: 'Failed to initiate payment',
                    details: stkData,
                    status: stkResponse.status
                },
                { status: stkResponse.status }
            );
        }

        // ✅ SAVE PAYMENT RECORD TO DATABASE (uncomment when ready)
        /*
        await prisma.payment.create({
          data: {
            transactionReference: transactionReference,
            accountReference: accountReference,
            userId: userId,
            phoneNumber: phoneNumber,
            amount: amount,
            status: 'pending',
            initiatedAt: new Date(),
          }
        });
        */

        if (stkData.responseCode === '0' || stkData.ResponseCode === '0') {
            return NextResponse.json({
                success: true,
                checkoutRequestID: stkData.checkoutRequestID || stkData.CheckoutRequestID,
                transactionReference: transactionReference,
                message: 'Payment initiated successfully',
                customerMessage: stkData.customerMessage || stkData.CustomerMessage || 'Check your phone for MPESA prompt',
                responseData: stkData
            });
        } else {
            return NextResponse.json(
                {
                    error: 'Payment request failed',
                    responseCode: stkData.responseCode || stkData.ResponseCode,
                    responseMessage: stkData.responseMessage || stkData.ResponseDescription,
                    customerMessage: stkData.customerMessage || stkData.CustomerMessage,
                    details: stkData
                },
                { status: 400 }
            );
        }

    } catch (error: any) {
        console.error('🚨 M-Pesa payment error:', error);
        console.error('🚨 Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error.message,
                code: error.code
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'OK',
        message: 'M-Pesa payment endpoint is running',
        timestamp: new Date().toISOString()
    });
}