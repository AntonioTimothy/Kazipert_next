// app/api/onboarding/progress/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const progress = await prisma.onboardingProgress.findUnique({
            where: { userId },
        });

        return NextResponse.json(progress || {
            currentStep: 1,
            completed: false,
            data: {},
            completedSteps: []
        });
    } catch (error) {
        console.error('Error fetching onboarding progress:', error);
        return NextResponse.json(
            { error: 'Failed to fetch onboarding progress' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, step, data, completedSteps } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const progress = await prisma.onboardingProgress.upsert({
            where: { userId },
            update: {
                currentStep: step,
                data: {
                    ...data,
                    updatedAt: new Date().toISOString()
                },
                completedSteps: completedSteps || [],
                updatedAt: new Date(),
            },
            create: {
                userId,
                currentStep: step,
                data: {
                    ...data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                completedSteps: completedSteps || [],
            },
        });

        // Also update KYC details if provided
        if (data.fullName || data.idNumber) {
            await prisma.kycDetails.upsert({
                where: { userId },
                update: {
                    ...(data.fullName && { /* map to appropriate fields */ }),
                    ...(data.idNumber && { idNumber: data.idNumber }),
                    ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
                    ...(data.county && { county: data.county }),
                    ...(data.physicalAddress && { physicalAddress: data.physicalAddress }),
                    ...(data.gender && { /* map gender if needed */ }),
                },
                create: {
                    userId,
                    ...(data.idNumber && { idNumber: data.idNumber }),
                    ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
                    ...(data.county && { county: data.county }),
                    ...(data.physicalAddress && { physicalAddress: data.physicalAddress }),
                },
            });
        }

        return NextResponse.json(progress);
    } catch (error) {
        console.error('Error updating onboarding progress:', error);
        return NextResponse.json(
            { error: 'Failed to update onboarding progress' },
            { status: 500 }
        );
    }
}