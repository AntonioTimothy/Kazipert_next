import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (!accessToken) return null

        const decoded = verifyAccessToken(accessToken)
        if (!decoded) return null

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })

        return user
    } catch (error) {
        console.error('Error getting user from request:', error)
        return null
    }
}

// GET /api/jobs/[id]/applications - Get applications for a specific job
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify job ownership
        const job = await prisma.job.findUnique({
            where: { id }
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (job.employerId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const applications = await prisma.jobApplication.findMany({
            where: { jobId: id },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        profile: true,
                        kycDetails: true
                    }
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(applications)
    } catch (error) {
        console.error('Error fetching job applications:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
