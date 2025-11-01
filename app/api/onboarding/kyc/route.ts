// app/api/onboarding/kyc/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { userId, ...kycData } = data;

        const kyc = await prisma.kycDetails.upsert({
            where: { userId },
            update: kycData,
            create: {
                userId,
                ...kycData
            }
        });

        // Update onboarding progress
        await prisma.onboardingProgress.upsert({
            where: { userId },
            update: {
                currentStep: 3, // Move to document upload step
                steps: {
                    personalInfo: true,
                    kycDetails: true
                }
            },
            create: {
                userId,
                currentStep: 3,
                steps: {
                    personalInfo: true,
                    kycDetails: true
                }
            }
        });

        return NextResponse.json({ kyc });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}