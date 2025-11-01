update my verify login endpoint as per the instruction AnimationPlaybackEvent

// app/api/auth/verify-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, password } = await request.json();

        console.log('Verify login OTP for:', email);

        if (!email || !otp || !password) {
            return NextResponse.json(
                { error: 'Email, OTP, and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify password again for security
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Find valid OTP
        const verification = await prisma.otpVerification.findFirst({
            where: {
                email,
                type: 'LOGIN',
                otp,
                expiresAt: {
                    gt: new Date(),
                },
                verified: false,
            },
            orderBy: {
                createdAt: 'desc',
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

        // Generate tokens and set cookies
        const { accessToken, refreshToken } = await setAuthCookies(user);

        // Store refresh token in database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        console.log('Login successful for user:', user.email);

        // Create response with user data
        const response = NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        }, { status: 200 });

        // Note: Cookies are already set by setAuthCookies function
        // But we can also set them manually here for additional security headers

        return response;

    } catch (error: any) {
        console.error('Verify login OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}






update the refresh token api below as per the instruction above, share full cdes 


// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        // Get refresh token from cookies first, then fallback to request body
        const refreshTokenFromCookie = request.cookies.get('refreshToken')?.value;
        const { refreshToken: refreshTokenFromBody } = await request.json().catch(() => ({}));
        
        const refreshToken = refreshTokenFromCookie || refreshTokenFromBody;

        if (refreshToken) {
            try {
                // Delete refresh token from database
                await prisma.refreshToken.deleteMany({
                    where: { token: refreshToken }
                });
            } catch (dbError) {
                console.error('Error deleting refresh token from database:', dbError);
                // Continue with logout even if DB operation fails
            }
        }

        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear cookies with consistent settings
        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);

        // Also clear any other auth-related cookies for completeness
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);
        
        // Still attempt to clear cookies even if there's an error
        const response = NextResponse.json(
            { error: 'Logout completed with warnings' },
            { status: 500 }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    }
}

// Support GET method for logout (useful for logout links)
export async function GET(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (refreshToken) {
            try {
                // Delete refresh token from database
                await prisma.refreshToken.deleteMany({
                    where: { token: refreshToken }
                });
            } catch (dbError) {
                console.error('Error deleting refresh token from database:', dbError);
                // Continue with logout even if DB operation fails
            }
        }

        const response = NextResponse.redirect(new URL('/login', request.url));

        // Clear cookies
        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);
        
        // Redirect to login even on error
        const response = NextResponse.redirect(new URL('/login', request.url));
        
        // Clear cookies
        const isProduction = process.env.NODE_ENV === 'production';
        const clearCookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
            maxAge: 0,
        };

        response.cookies.set('accessToken', '', clearCookieOptions);
        response.cookies.set('refreshToken', '', clearCookieOptions);
        response.cookies.set('token', '', clearCookieOptions);

        return response;
    }
}