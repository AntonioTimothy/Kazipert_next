import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 JOB APPLICATIONS API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ JOB APPLICATIONS API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 JOB APPLICATIONS API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ JOB APPLICATIONS API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 JOB APPLICATIONS API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ JOB APPLICATIONS API - Error getting user from request:', error)
        return null
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { jobId: string } }
) {
    try {
        console.log('📋 JOB APPLICATIONS API - GET request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ JOB APPLICATIONS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { jobId } = params

        console.log('📋 JOB APPLICATIONS API - Fetching applications for job:', jobId)

        // Verify the job belongs to the employer
        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                employerId: user.id
            }
        })

        if (!job) {
            console.log('❌ JOB APPLICATIONS API - Job not found or access denied')
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        // Get applications with employee details
        const applications = await prisma.jobApplication.findMany({
            where: {
                jobId
            },
            include: {
                employee: {
                    include: {
                        kycDetails: {
                            select: {
                                dateOfBirth: true,
                                workExperience: true,
                                profileVerified: true,
                                idVerified: true,
                                medicalVerified: true,
                                passportNumber: true,
                                idNumber: true
                            }
                        },
                        profile: {
                            select: {
                                avatar: true
                            }
                        }
                    }
                },
                job: {
                    select: {
                        title: true,
                        city: true,
                        salary: true,
                        salaryCurrency: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log('✅ JOB APPLICATIONS API - Found', applications.length, 'applications')
        return NextResponse.json(applications)
    } catch (error) {
        console.error('❌ JOB APPLICATIONS API - Error fetching job applications:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}