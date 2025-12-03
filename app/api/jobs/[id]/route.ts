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

// GET /api/jobs/[id] - Get a single job
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

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                employer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        profile: true
                    }
                },
                _count: {
                    select: {
                        applications: true,
                        views: true
                    }
                }
            }
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error fetching job:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const job = await prisma.job.findUnique({
            where: { id }
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (job.employerId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const updatedJob = await prisma.job.update({
            where: { id },
            data: body
        })

        return NextResponse.json(updatedJob)
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const job = await prisma.job.findUnique({
            where: { id }
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (job.employerId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await prisma.job.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Job deleted successfully' })
    } catch (error) {
        console.error('Error deleting job:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
