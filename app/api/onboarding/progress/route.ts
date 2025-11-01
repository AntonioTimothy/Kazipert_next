// app/api/onboarding/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { saveOnboardingProgress, fetchOnboardingProgress } from '@/lib/onboarding-service'
import { getCurrentUser, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        // Get current user using cookie-based auth
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { currentStep, data } = await request.json()

        // Validate current step
        if (typeof currentStep !== 'number' || currentStep < 1 || currentStep > 8) {
            return NextResponse.json({ error: 'Invalid step number' }, { status: 400 })
        }

        // Validate data structure
        if (!data || typeof data !== 'object') {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
        }

        const result = await saveOnboardingProgress(user.id, currentStep, data)

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            progress: result.progress,
            message: 'Progress saved successfully'
        })
    } catch (error: any) {
        console.error('Progress save error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        // Get current user using cookie-based auth
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const progress = await fetchOnboardingProgress(user.id)

        return NextResponse.json({
            success: true,
            progress,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })
    } catch (error: any) {
        console.error('Progress fetch error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 })
    }
}

// Optional: PUT method for partial updates
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { step, data } = await request.json()

        if (!step || !data) {
            return NextResponse.json({ error: 'Step and data are required' }, { status: 400 })
        }

        // Get existing progress to merge with new data
        const existingProgress = await fetchOnboardingProgress(user.id)

        const result = await saveOnboardingProgress(user.id, step, {
            ...existingProgress.data,
            ...data
        })

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            progress: result.progress,
            message: 'Progress updated successfully'
        })
    } catch (error: any) {
        console.error('Progress update error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 })
    }
}