import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import prisma directly

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        console.log('Verify email OTP request:', { email, otp });

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Find valid OTP in database (direct database logic)
        const verification = await prisma.otpVerification.findFirst({
            where: {
                email, // Use email field
                type: 'EMAIL', // Use appropriate type for email signup
                otp,
                expiresAt: {
                    gt: new Date(), // Not expired
                },
                verified: false, // Not already verified
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent OTP
            },
        });

        if (!verification) {
            return NextResponse.json(
                { error: 'Invalid or expired verification code' },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await prisma.otpVerification.update({
            where: { id: verification.id },
            data: { verified: true },
        });

        console.log('Email OTP verified successfully for:', email);

        return NextResponse.json(
            {
                message: 'Email verified successfully',
                verified: true,
                email: email
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Verify email OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed: ' + error.message },
            { status: 500 }
        );
    }
}