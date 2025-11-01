import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        console.log('Send login OTP request for:', email);

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate OTP // 10 minutes
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        console.log(`Generated login OTP for ${email}: ${otp}`);

        // Store OTP in database
        await prisma.otpVerification.create({
            data: {
                email,
                otp,
                type: 'LOGIN',
                expiresAt
            }
        });

        // Send OTP via email
        const emailResult = await emailService.sendOtpEmail(email, otp);

        if (!emailResult.success && process.env.NODE_ENV === 'production') {
            console.error('Failed to send login OTP email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send verification code. Please try again.' },
                { status: 500 }
            );
        }

        const responseData: any = {
            message: 'Verification code sent to your email',
        };

        if (process.env.NODE_ENV === 'development' || emailResult.debugOtp) {
            responseData.debugOtp = otp;
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error('Send login OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code. Please try again.' },
            { status: 500 }
        );
    }
}