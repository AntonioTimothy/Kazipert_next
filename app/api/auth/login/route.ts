import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        console.log('Login attempt for email:', email);

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('User not found:', email);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user is verified
        if (!user.emailVerified) {
            console.log('User email not verified:', email);
            return NextResponse.json(
                { error: 'Please verify your email address before logging in. Check your inbox for the verification code.' },
                { status: 403 }
            );
        }

        // For enhanced security, always require OTP for login
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in database
        await prisma.otpVerification.create({
            data: {
                email,
                otp,
                type: 'LOGIN',
                expiresAt
            }
        });

        console.log(`Login OTP for ${email}: ${otp}`);

        // Send OTP via email
        const emailResult = await emailService.sendOtpEmail(email, otp);

        if (!emailResult.success && process.env.NODE_ENV === 'production') {
            console.error('Failed to send login OTP email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send verification code. Please try again.' },
                { status: 500 }
            );
        }

        // In development, include debug OTP
        const responseData: any = {
            message: 'Verification code sent to your email',
            requiresOtp: true,
        };

        if (process.env.NODE_ENV === 'development' || emailResult.debugOtp) {
            responseData.debugOtp = otp;
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed. Please try again.' },
            { status: 500 }
        );
    }
}