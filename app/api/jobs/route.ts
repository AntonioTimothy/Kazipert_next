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

        // Remove fields that don't exist in the Job model (whitelist known keys)
        const { agreeToTerms, ...rawJobData } = body

        const allowedKeys = new Set([
            'title', 'type', 'description', 'status', 'category', 'agreeToTruth',
            'availableFromType', 'residenceType', 'bedrooms', 'bathrooms', 'totalFloors',
            'hasGarden', 'hasPool', 'squareMeters', 'familyMembers', 'childrenCount',
            'childrenAges', 'elderlyCare', 'specialNeeds', 'pets', 'duties',
            'experienceRequired', 'languageRequirements', 'workingHours', 'overtimeRequired',
            'accommodation', 'meals', 'vacationDays', 'benefits', 'certifications', 'skills',
            'salary', 'salaryCurrency', 'location', 'city', 'availableFrom', 'interviewRequired',
            'emergencySupport', 'autoSalaryCalculation', 'postedAt', 'closedAt'
        ])

        const sanitizedData: Record<string, any> = {}
        for (const key of Object.keys(rawJobData)) {
            if (allowedKeys.has(key)) sanitizedData[key] = rawJobData[key]
        }

        // Log any ignored/unknown fields so we can detect unexpected client payloads
        const ignoredKeys = Object.keys(rawJobData).filter(k => !allowedKeys.has(k))
        if (ignoredKeys.length > 0) {
            try {
                if (process.env.NODE_ENV === 'production') {
                    console.info('JOBS API - Ignored job fields (production):', ignoredKeys)
                } else {
                    const ignoredValues: Record<string, any> = {}
                    for (const k of ignoredKeys) ignoredValues[k] = rawJobData[k]
                    console.warn('JOBS API - Ignored job fields:', ignoredKeys)
                    console.debug('JOBS API - Ignored field values:', ignoredValues)
                }
            } catch (logErr) {
                // Ensure logging never crashes the API
                console.error('JOBS API - Error while logging ignored fields:', logErr)
            }
        }

        // Apply safe defaults aligned with the Prisma schema/enums
        const jobCreateData = {
            ...sanitizedData,
            type: sanitizedData.type || 'FULL_TIME',
            employerId: user.id,
            totalFloors: sanitizedData.totalFloors ?? 1,
            postedAt: (sanitizedData.status === 'ACTIVE') ? new Date() : null,
            familyMembers: sanitizedData.familyMembers ?? 1,
            accommodation: sanitizedData.accommodation || 'PROVIDED',
            meals: sanitizedData.meals || 'INCLUDED',
            experienceRequired: sanitizedData.experienceRequired || 'ONE_TO_TWO_YEARS',
            languageRequirements: sanitizedData.languageRequirements || [],
            workingHours: sanitizedData.workingHours || '10.5 hours/day',
            status: sanitizedData.status || 'DRAFT',
            childrenAges: sanitizedData.childrenAges || [],
            pets: sanitizedData.pets || [],
            duties: sanitizedData.duties || [],
            benefits: sanitizedData.benefits || [],
            certifications: sanitizedData.certifications || [],
            skills: sanitizedData.skills || []
        }

        const job = await prisma.job.create({ data: jobCreateData })

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