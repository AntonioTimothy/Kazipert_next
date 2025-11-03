import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 APPLICATIONS API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ APPLICATIONS API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 APPLICATIONS API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ APPLICATIONS API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 APPLICATIONS API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ APPLICATIONS API - Error getting user from request:', error)
        return null
    }
}

// GET /api/applications - Get applications for employer or employee
export async function GET(request: NextRequest) {
    try {
        console.log('📋 APPLICATIONS API - GET request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ APPLICATIONS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const status = searchParams.get('status')

        console.log('📋 APPLICATIONS API - Request params:', { role, status, userRole: user.role })

        if (role === 'employer') {
            // Verify user is employer
            if (user.role !== 'EMPLOYER') {
                console.log('❌ APPLICATIONS API - Forbidden: User is not employer, role is:', user.role)
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            console.log('👔 APPLICATIONS API - Fetching employer applications')
            // Get applications for employer's jobs
            const applications = await prisma.jobApplication.findMany({
                where: {
                    job: {
                        employerId: user.id
                    },
                    ...(status && { status: status as any })
                },
                include: {
                    job: {
                        select: {
                            id: true,
                            title: true,
                            salary: true,
                            city: true
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
                    _count: {
                        select: {
                            messages: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            console.log('✅ APPLICATIONS API - Found', applications.length, 'applications for employer')
            return NextResponse.json(applications)
        } else {
            // Verify user is employee
            if (user.role !== 'EMPLOYEE') {
                console.log('❌ APPLICATIONS API - Forbidden: User is not employee, role is:', user.role)
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            console.log('👷 APPLICATIONS API - Fetching employee applications')
            // Get employee's applications
            const applications = await prisma.jobApplication.findMany({
                where: {
                    employeeId: user.id,
                    ...(status && { status: status as any })
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
                            }
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

            console.log('✅ APPLICATIONS API - Found', applications.length, 'applications for employee')
            return NextResponse.json(applications)
        }
    } catch (error) {
        console.error('❌ APPLICATIONS API - Error fetching applications:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/applications - Create a new application
export async function POST(request: NextRequest) {
    try {
        console.log('📝 APPLICATIONS API - POST request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ APPLICATIONS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (user.role !== 'EMPLOYEE') {
            console.log('❌ APPLICATIONS API - Forbidden: User is not employee, role is:', user.role)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        console.log('📝 APPLICATIONS API - Application data:', {
            jobId: body.jobId,
            hasCoverLetter: !!body.coverLetter,
            expectedSalary: body.expectedSalary
        })

        // Check if already applied
        const existingApplication = await prisma.jobApplication.findUnique({
            where: {
                jobId_employeeId: {
                    jobId: body.jobId,
                    employeeId: user.id
                }
            }
        })

        if (existingApplication) {
            console.log('⚠️ APPLICATIONS API - User already applied to this job')
            return NextResponse.json(
                { error: 'Already applied to this job' },
                { status: 400 }
            )
        }

        console.log('📝 APPLICATIONS API - Creating new application')
        const application = await prisma.jobApplication.create({
            data: {
                jobId: body.jobId,
                employeeId: user.id,
                coverLetter: body.coverLetter,
                expectedSalary: body.expectedSalary
            },
            include: {
                job: {
                    include: {
                        employer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        console.log('✅ APPLICATIONS API - Application created successfully:', application.id)
        return NextResponse.json(application)
    } catch (error) {
        console.error('❌ APPLICATIONS API - Error creating application:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}