// app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (!accessToken) return null

        const decoded = verifyAccessToken(accessToken)
        if (!decoded) return null

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { profile: true }
        })

        return user
    } catch (error) {
        console.error('Error getting user from request:', error)
        return null
    }
}

// PUT /api/applications/[id] - Update application status
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // const applicationId = params.id
        const body = await request.json()
        const { status, applicationId } = body

        console.log("the request to move to shortlisting is", status)

        // Verify the user owns this application or the job
        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true }
        })

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Check if user is employer of this job or the employee who applied
        if (user.role === 'EMPLOYER' && application.job.employerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (user.role === 'EMPLOYEE' && application.employeeId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Update application status
        const updatedApplication = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: { status },
            include: {
                job: {
                    include: {
                        employer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                profile: true
                            }
                        }
                    }
                },
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
            }
        })

        return NextResponse.json(updatedApplication)
    } catch (error) {
        console.error('Error updating application:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// GET /api/applications/[id] - Get specific application
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const applicationId = params.id

        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: {
                job: {
                    include: {
                        employer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phone: true,
                                profile: true
                            }
                        }
                    }
                },
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
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profile: true
                            }
                        }
                    }
                }
            }
        })

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Verify access rights
        if (user.role === 'EMPLOYER' && application.job.employerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (user.role === 'EMPLOYEE' && application.employeeId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json(application)
    } catch (error) {
        console.error('Error fetching application:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}