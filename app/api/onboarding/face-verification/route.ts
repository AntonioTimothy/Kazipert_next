// app/api/onboarding/face-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        // Simulate face recognition - in production integrate with CompreFace
        const faceVerified = Math.random() > 0.2; // 80% success rate for demo

        const kyc = await prisma.kycDetails.update({
            where: { userId },
            data: {
                faceVerified,
                profileVerified: faceVerified
            }
        });

        return NextResponse.json({
            success: true,
            faceVerified,
            message: faceVerified ? 'Face verification successful' : 'Face verification failed'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}