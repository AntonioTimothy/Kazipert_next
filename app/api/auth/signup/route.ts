import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, password, phone, fullName, gender, role } = await request.json();

        console.log('Signup attempt:', { email, phone, fullName });

        // Validate required fields
        if (!email || !password || !phone || !fullName || !gender || !role) {
            console.log('Missing fields:', { email, password, phone, fullName, gender, role });
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return NextResponse.json(
                { error: 'User with this email or phone already exists' },
                { status: 409 }
            );
        }

        // Check verification status from OTP records
        const emailVerification = await prisma.otpVerification.findFirst({
            where: {
                email,
                type: 'EMAIL',
                verified: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const phoneVerification = await prisma.otpVerification.findFirst({
            where: {
                phone,
                type: 'PHONE',
                verified: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('Verification status:', {
            emailVerified: !!emailVerification,
            phoneVerified: !!phoneVerification
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with verification status
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                fullName,
                gender,
                role,
                verified: false, // Overall verification status
                emailVerified: !!emailVerification, // Set based on OTP verification
                phoneVerified: !!phoneVerification  // Set based on OTP verification
            }
        });

        console.log('User created successfully:', user.email, {
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: userWithoutPassword,
                verified: {
                    email: user.emailVerified,
                    phone: user.phoneVerified
                }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}