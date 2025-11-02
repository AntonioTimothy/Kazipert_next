// app/api/auth/login/route.ts - UPDATED VERSION
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';
import { generateAccessToken, generateRefreshToken, generateSessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

function generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email, password, rememberMe = false } = await request.json();

        console.log('Login attempt for email:', email, 'Remember Me:', rememberMe);

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email with permissions
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true,
                userPermissions: {
                    include: {
                        permission: true
                    }
                },
                onboardingProgress: true,
                kycDetails: true
            }
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

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

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

        // Generate session data (without tokens until OTP verification)
        const sessionData = {
            userId: user.id,
            email: user.email,
            role: user.role,
            requiresOtp: true,
            rememberMe,
            tempAuth: generateSessionToken() // Temporary token for OTP phase
        };

        // Store temporary session data in HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('temp_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60, // 10 minutes for OTP verification
            path: '/',
        });

        // In development, include debug OTP
        const responseData: any = {
            message: 'Verification code sent to your email',
            requiresOtp: true,
            tempAuth: sessionData.tempAuth // For client-side state management
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