import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (!accessToken) {
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        if (!decoded) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        return user
    } catch (error) {
        console.error('Error getting user from request:', error)
        return null
    }
}

// GET /api/jobs/[id] - Get specific job
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
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
                applications: {
                    where: user.role === 'EMPLOYER' ? undefined : {
                        employeeId: user.id
                    },
                    include: user.role === 'EMPLOYER' ? {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                profile: true,
                                kycDetails: true
                            }
                        }
                    } : undefined
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

        // Record view if employee
        if (user.role === 'EMPLOYEE') {
            await prisma.jobView.create({
                data: {
                    jobId: id,
                    viewerId: user.id
                }
            })
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

// PUT /api/jobs/[id] - Update job
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromRequest(request)
        if (!user || user.role !== 'EMPLOYER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id } = await params

        // Verify job belongs to employer
        const existingJob = await prisma.job.findFirst({
            where: {
                id,
                employerId: user.id
            }
        })

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        const job = await prisma.job.update({
            where: { id },
            data: {
                ...body,
                postedAt: body.status === 'ACTIVE' && existingJob.status !== 'ACTIVE' ? new Date() : existingJob.postedAt
            }
        })

        return NextResponse.json(job)
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUserFromRequest(request)
        if (!user || user.role !== 'EMPLOYER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify job belongs to employer
        const existingJob = await prisma.job.findFirst({
            where: {
                id,
                employerId: user.id
            }
        })

        if (!existingJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
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