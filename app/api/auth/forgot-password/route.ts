// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal that user doesn't exist for security
            return NextResponse.json(
                { message: 'If the email exists, a verification code has been sent' },
                { status: 200 }
            );
        }

        // Generate OTP
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this email and type
        await prisma.otpVerification.deleteMany({
            where: {
                email,
                type: 'FORGOT_PASSWORD'
            }
        });

        // Store OTP in database
        await prisma.otpVerification.create({
            data: {
                email,
                otp,
                type: 'FORGOT_PASSWORD',
                expiresAt
            }
        });

        console.log(`Forgot Password OTP for ${email}: ${otp}`);

        // Send OTP via email
        const emailResult = await emailService.sendPasswordResetOtpEmail(email, otp);

        if (!emailResult.success && process.env.NODE_ENV === 'production') {
            console.error('Failed to send password reset OTP email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send verification code. Please try again.' },
                { status: 500 }
            );
        }

        const responseData: any = {
            message: 'If the email exists, a verification code has been sent'
        };

        if (process.env.NODE_ENV === 'development' || emailResult.debugOtp) {
            responseData.debugOtp = otp;
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process request. Please try again.' },
            { status: 500 }
        );
    }
}