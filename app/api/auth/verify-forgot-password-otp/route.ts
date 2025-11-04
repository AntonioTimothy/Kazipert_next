// app/api/auth/verify-forgot-password-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Find valid OTP
        const otpRecord = await prisma.otpVerification.findFirst({
            where: {
                email,
                otp,
                type: 'FORGOT_PASSWORD',
                verified: false,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { verified: true }
        });

        return NextResponse.json(
            { message: 'Code verified successfully' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Verify forgot password OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to verify code. Please try again.' },
            { status: 500 }
        );
    }
}