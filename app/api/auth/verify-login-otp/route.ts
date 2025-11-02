// app/api/auth/verify-login-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

        // Get temporary session from cookie
        const cookieStore = await cookies();
        const tempSession = cookieStore.get('temp_session')?.value;

        if (!tempSession) {
            return NextResponse.json(
                { error: 'Session expired. Please login again.' },
                { status: 401 }
            );
        }

        const sessionData = JSON.parse(tempSession);

        // Verify the session matches the request
        if (sessionData.email !== email || !sessionData.tempAuth) {
            return NextResponse.json(
                { error: 'Invalid session. Please login again.' },
                { status: 401 }
            );
        }

        // Find user with complete data including permissions
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

        // Calculate session duration based on remember me
        const rememberMe = sessionData.rememberMe || false;
        const sessionDuration = rememberMe
            ? 30 * 24 * 60 * 60 // 30 days
            : 24 * 60 * 60; // 1 day

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in database
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });

        // Get user permissions - UPDATED: Handle missing RolePermission
        const userPermissions = await getUserPermissions(user);

        // Create user session data
        const userSession = {
            id: user.id,
            email: user.email,
            name: user.fullName || user.firstName || user.email,
            role: user.role,
            avatar: user.profile?.avatar,
            permissions: userPermissions,
            isSuperAdmin: user.role === 'SUPER_ADMIN',
            onboardingCompleted: user.onboardingProgress?.completed || false,
            kycVerified: user.kycDetails?.profileVerified || false,
        };

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        console.log('Login successful for user:', user.email);

        // Create response with user data
        const response = NextResponse.json({
            message: 'Login successful',
            user: userSession,
            requiresOnboarding: !user.onboardingProgress?.completed,
        }, { status: 200 });

        const isProduction = process.env.NODE_ENV === 'production';

        // Set access token cookie
        response.cookies.set('access_token', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: sessionDuration,
            path: '/',
        });

        // Set refresh token cookie (30 days)
        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        // Clear temporary session
        response.cookies.delete('temp_session');

        console.log('Session cookies set successfully for user:', user.email);

        return response;

    } catch (error: any) {
        console.error('Verify login OTP error:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}

// UPDATED: Helper function to get user permissions
async function getUserPermissions(user: any) {
    const permissions: any = {};

    // Initialize all modules with default false permissions
    const adminModules = [
        'USER_MANAGEMENT', 'JOB_MANAGEMENT', 'PAYMENT_MANAGEMENT',
        'CONTRACT_MANAGEMENT', 'REPORTING', 'SYSTEM_SETTINGS',
        'AUDIT_LOGS', 'CONTENT_MANAGEMENT'
    ];

    adminModules.forEach(module => {
        permissions[module] = {
            canView: false,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canExport: false,
            canApprove: false,
        };
    });

    try {
        // Get user-specific permissions from UserPermission table
        const userPermissions = user.userPermissions || [];

        // Apply granted permissions from UserPermission
        userPermissions.forEach((userPerm: any) => {
            const permission = userPerm.permission;
            if (permission && permissions[permission.module]) {
                permissions[permission.module][`can${permission.action.charAt(0).toUpperCase() + permission.action.slice(1).toLowerCase()}`] = userPerm.granted;
            }
        });

        // For admin users, set default permissions based on role
        if (['ADMIN', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHOTO_STUDIO_ADMIN', 'EMBASSY_ADMIN'].includes(user.role)) {

            // Super Admin gets all permissions
            if (user.role === 'SUPER_ADMIN') {
                Object.keys(permissions).forEach(module => {
                    Object.keys(permissions[module]).forEach(action => {
                        permissions[module][action] = true;
                    });
                });
            }
            // Other admin roles get basic view permissions by default
            else {
                Object.keys(permissions).forEach(module => {
                    permissions[module].canView = true;
                });
            }
        }

    } catch (error) {
        console.error('Error loading permissions:', error);
        // If permissions fail to load, user gets no permissions (safe default)
    }

    return permissions;
}