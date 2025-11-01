import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService'; // Import email service directly

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Generate OTP
        let otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log('Send email OTP request:', { email, otp });

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            console.log('User with email already exists:', email);
            return NextResponse.json(
                { error: 'This email already exists, proceed to Login' },
                { status: 401 }
            );
        }

        // Store OTP in database
        await prisma.otpVerification.create({
            data: {
                email,
                otp,
                type: 'EMAIL', // Use appropriate type for email signup
                expiresAt
            }
        });

        // Send email OTP directly using email service
        const result = await emailService.sendOtpEmail(email, otp);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send verification email' },
                { status: 400 }
            );
        }

        const responseData: any = {
            message: 'Verification code sent successfully to your email',
        };

        // Include debug OTP in development only
        if (process.env.NODE_ENV === 'development') {
            responseData.debugOtp = otp;
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error('Send email OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code: ' + error.message },
            { status: 500 }
        );
    }
}