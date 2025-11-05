import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 SHORTLIST API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ SHORTLIST API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 SHORTLIST API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ SHORTLIST API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 SHORTLIST API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ SHORTLIST API - Error getting user from request:', error)
        return null
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('⭐ SHORTLIST API - POST request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ SHORTLIST API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (user.role !== 'EMPLOYER') {
            console.log('❌ SHORTLIST API - Forbidden: User is not employer')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id: applicationId } = params

        console.log('⭐ SHORTLIST API - Shortlisting application:', applicationId)

        // Verify application exists and belongs to employer's job
        const application = await prisma.jobApplication.findFirst({
            where: {
                id: applicationId,
                job: {
                    employerId: user.id
                }
            }
        })

        if (!application) {
            console.log('❌ SHORTLIST API - Application not found')
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Shortlist the application
        const updatedApplication = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: {
                currentStep: 'SHORTLISTED',
                status: 'SHORTLISTED',
                shortlistedAt: new Date(),
                updatedAt: new Date()
            },
            include: {
                employee: {
                    include: {
                        kycDetails: true,
                        profile: true
                    }
                },
                job: true
            }
        })

        console.log('✅ SHORTLIST API - Application shortlisted successfully')
        return NextResponse.json(updatedApplication)
    } catch (error) {
        console.error('❌ SHORTLIST API - Error shortlisting application:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}