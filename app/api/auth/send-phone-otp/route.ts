import { NextRequest, NextResponse } from 'next/server';
import { otpService } from '@/lib/services/otpService';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        let otp = Math.floor(1000 + Math.random() * 9000).toString();

        console.log('Send phone OTP request:', { phone, otp });

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { phone }
        });

        if (user) {
            console.log('User with phone number:', phone);
            return NextResponse.json(
                { error: 'This phone number already exists, proceed to Login' },
                { status: 401 }
            );
        }
        
                // Store OTP in database
                await prisma.otpVerification.create({
                    data: {
                        phone,
                        otp,
                        type: 'PHONE',
                        expiresAt
                    }
                });

        const result = await otpService.sendPhoneOtp(phone , otp);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        const responseData: any = {
            message: result.message,
        };

        // Include debug OTP in development only
        if (process.env.NODE_ENV === 'development' && result.debugOtp) {
            responseData.debugOtp = result.debugOtp;
        }

        return NextResponse.json(responseData, { status: 200 });
    } catch (error: any) {
        console.error('Send phone OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code: ' + error.message },
            { status: 500 }
        );
    }
}