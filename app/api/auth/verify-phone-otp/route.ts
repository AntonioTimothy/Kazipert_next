import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import prisma directly

export async function POST(request: NextRequest) {
    try {
        const { phone, otp } = await request.json();

        console.log('Verify phone OTP request:', { phone, otp });

        if (!phone || !otp) {
            return NextResponse.json(
                { error: 'Phone and OTP are required' },
                { status: 400 }
            );
        }

        // Find valid OTP in database (direct database logic)
        const verification = await prisma.otpVerification.findFirst({
            where: {
                phone, // Use phone field
                type: 'PHONE', // Use appropriate type for phone signup
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

        console.log('Phone OTP verified successfully for:', phone);

        return NextResponse.json(
            {
                message: 'Phone number verified successfully',
                verified: true,
                phone: phone
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Verify phone OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed: ' + error.message },
            { status: 500 }
        );
    }
}