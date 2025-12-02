import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')?.value

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

// GET /api/saved-jobs - Get saved jobs
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request)
        if (!user || user.role !== 'EMPLOYEE') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const savedJobs = await prisma.savedJob.findMany({
            where: {
                employeeId: user.id
            },
            include: {
                job: {
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
                        },
                        applications: {
                            where: {
                                employeeId: user.id
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(savedJobs)
    } catch (error) {
        console.error('Error fetching saved jobs:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/saved-jobs - Save/unsave a job
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request)
        if (!user || user.role !== 'EMPLOYEE') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { jobId, action } = body // action: 'save' or 'unsave'

        if (action === 'save') {
            const savedJob = await prisma.savedJob.create({
                data: {
                    jobId,
                    employeeId: user.id
                },
                include: {
                    job: {
                        include: {
                            employer: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    company: true
                                }
                            }
                        }
                    }
                }
            })
            return NextResponse.json(savedJob)
        } else if (action === 'unsave') {
            await prisma.savedJob.delete({
                where: {
                    jobId_employeeId: {
                        jobId,
                        employeeId: user.id
                    }
                }
            })
            return NextResponse.json({ message: 'Job unsaved successfully' })
        }
    } catch (error) {
        console.error('Error managing saved job:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}