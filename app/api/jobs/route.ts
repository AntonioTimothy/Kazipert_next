import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 JOBS API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ JOBS API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 JOBS API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ JOBS API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 JOBS API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ JOBS API - Error getting user from request:', error)
        return null
    }
}

// GET /api/jobs - Get jobs for employer or employee
export async function GET(request: NextRequest) {
    try {
        console.log('📋 JOBS API - GET request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ JOBS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const status = searchParams.get('status')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        console.log('📋 JOBS API - Request params:', { role, status, userRole: user.role })

        if (role === 'employer') {
            // Verify user is employer
            if (user.role !== 'EMPLOYER') {
                console.log('❌ JOBS API - Forbidden: User is not employer, role is:', user.role)
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            console.log('👔 JOBS API - Fetching employer jobs')
            const jobs = await prisma.job.findMany({
                where: {
                    employerId: user.id,
                    ...(status && { status: status as any })
                },
                include: {
                    applications: {
                        include: {
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
                    },
                    _count: {
                        select: {
                            applications: true,
                            views: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            })

            const total = await prisma.job.count({
                where: {
                    employerId: user.id,
                    ...(status && { status: status as any })
                }
            })

            console.log('✅ JOBS API - Found', jobs.length, 'jobs for employer')
            return NextResponse.json({
                jobs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            })
        } else {
            console.log('👷 JOBS API - Fetching employee jobs')
            // Get jobs for employees (browsing)
            const jobs = await prisma.job.findMany({
                where: {
                    status: 'ACTIVE',
                    ...(status && { status: status as any })
                },
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
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            })

            const total = await prisma.job.count({
                where: {
                    status: 'ACTIVE',
                    ...(status && { status: status as any })
                }
            })

            console.log('✅ JOBS API - Found', jobs.length, 'jobs for employee')
            return NextResponse.json({
                jobs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            })
        }
    } catch (error) {
        console.error('❌ JOBS API - Error fetching jobs:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
    try {
        console.log('📝 JOBS API - POST request received')
        const user = await getUserFromRequest(request)

        if (!user) {
            console.log('❌ JOBS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (user.role !== 'EMPLOYER') {
            console.log('❌ JOBS API - Forbidden: User is not employer, role is:', user.role)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        console.log('✅ JOBS API - User authorized:', user.email, 'Role:', user.role)

        const body = await request.json()
        console.log('📝 JOBS API - Creating job with data:', {
            title: body.title,
            type: body.type,
            salary: body.salary
        })

        // Remove fields that don't exist in the Job model
        const { agreeToTerms, ...jobData } = body

        const job = await prisma.job.create({
            data: {
                ...jobData,
                employerId: user.id,
                postedAt: jobData.status === 'ACTIVE' ? new Date() : null,
                // Ensure arrays are properly handled
                childrenAges: jobData.childrenAges || [],
                pets: jobData.pets || [],
                duties: jobData.duties || [],
                languageRequirements: jobData.languageRequirements || [],
                benefits: jobData.benefits || [],
                certifications: jobData.certifications || [],
                skills: jobData.skills || []
            }
        })

        console.log('✅ JOBS API - Job created successfully:', job.id)
        return NextResponse.json(job)
    } catch (error) {
        console.error('❌ JOBS API - Error creating job:', error)

        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('Invalid `prisma.job.create()`')) {
                return NextResponse.json(
                    { error: 'Invalid job data provided' },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}