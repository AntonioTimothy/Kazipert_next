import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 APPLICATION PROGRESS API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ APPLICATION PROGRESS API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 APPLICATION PROGRESS API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ APPLICATION PROGRESS API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 APPLICATION PROGRESS API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ APPLICATION PROGRESS API - Error getting user from request:', error)
        return null
    }
}

function getNextActions(currentStep: string, role: string) {
    const actions = []

    if (role === 'EMPLOYER') {
        switch (currentStep) {
            case 'APPLICATION_SUBMITTED':
                actions.push('UNDER_REVIEW', 'SHORTLISTED', 'REJECTED')
                break
            case 'UNDER_REVIEW':
                actions.push('SHORTLISTED', 'REJECTED')
                break
            case 'SHORTLISTED':
                actions.push('INTERVIEW_SCHEDULED', 'MEDICAL_REQUESTED')
                break
            case 'MEDICAL_SUBMITTED':
                actions.push('MEDICAL_APPROVED')
                break
            case 'MEDICAL_APPROVED':
                actions.push('CONTRACT_SENT')
                break
            case 'CONTRACT_SIGNED':
                actions.push('VISA_APPLIED')
                break
            case 'VISA_APPROVED':
                actions.push('FLIGHT_TICKET_SENT')
                break
        }
    } else if (role === 'EMPLOYEE') {
        switch (currentStep) {
            case 'MEDICAL_REQUESTED':
                actions.push('MEDICAL_SUBMITTED')
                break
            case 'CONTRACT_SENT':
                actions.push('CONTRACT_SIGNED')
                break
            case 'FLIGHT_TICKET_SENT':
                actions.push('FLIGHT_TICKET_RECEIVED')
                break
        }
    }

    return actions
}

function generateTimeline(application: any) {
    const timeline = []

    // Add all step timestamps that exist
    const stepFields = {
        APPLICATION_SUBMITTED: 'applicationSubmittedAt',
        UNDER_REVIEW: 'underReviewAt',
        SHORTLISTED: 'shortlistedAt',
        INTERVIEW_SCHEDULED: 'interviewScheduledAt',
        MEDICAL_REQUESTED: 'medicalRequestedAt',
        MEDICAL_SUBMITTED: 'medicalSubmittedAt',
        MEDICAL_APPROVED: 'medicalApprovedAt',
        CONTRACT_SENT: 'contractSentAt',
        CONTRACT_SIGNED: 'contractSignedAt',
        VISA_APPLIED: 'visaAppliedAt',
        VISA_APPROVED: 'visaApprovedAt',
        FLIGHT_TICKET_SENT: 'flightTicketSentAt',
        FLIGHT_TICKET_RECEIVED: 'flightTicketReceivedAt',
        DEPLOYMENT_READY: 'deploymentReadyAt'
    }

    for (const [step, field] of Object.entries(stepFields)) {
        if (application[field]) {
            timeline.push({
                step,
                timestamp: application[field],
                status: step === application.currentStep ? 'current' :
                    application[field] ? 'completed' : 'pending'
            })
        }
    }

    return timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('📊 APPLICATION PROGRESS API - GET request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ APPLICATION PROGRESS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: applicationId } = params

        console.log('📊 APPLICATION PROGRESS API - Fetching progress for application:', applicationId)

        // Get application with detailed progress information
        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: {
                employee: {
                    include: {
                        kycDetails: {
                            select: {
                                profileVerified: true,
                                idVerified: true,
                                medicalVerified: true,
                                dateOfBirth: true,
                                workExperience: true,
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
                    include: {
                        employer: {
                            select: {
                                firstName: true,
                                lastName: true,
                                company: true,
                                profile: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                },
                documents: {
                    orderBy: {
                        uploadedAt: 'desc'
                    }
                }
            }
        })

        if (!application) {
            console.log('❌ APPLICATION PROGRESS API - Application not found')
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Verify permissions
        if (user.role === 'EMPLOYER' && application.job.employerId !== user.id) {
            console.log('❌ APPLICATION PROGRESS API - Forbidden: Employer does not own this job')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (user.role === 'EMPLOYEE' && application.employeeId !== user.id) {
            console.log('❌ APPLICATION PROGRESS API - Forbidden: Employee does not own this application')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Calculate progress percentage
        const allSteps = [
            'APPLICATION_SUBMITTED',
            'UNDER_REVIEW',
            'SHORTLISTED',
            'INTERVIEW_SCHEDULED',
            'MEDICAL_REQUESTED',
            'MEDICAL_SUBMITTED',
            'MEDICAL_APPROVED',
            'CONTRACT_SENT',
            'CONTRACT_SIGNED',
            'VISA_APPLIED',
            'VISA_APPROVED',
            'FLIGHT_TICKET_SENT',
            'FLIGHT_TICKET_RECEIVED',
            'DEPLOYMENT_READY'
        ]

        const currentStepIndex = allSteps.indexOf(application.currentStep)
        const progressPercentage = Math.round(((currentStepIndex + 1) / allSteps.length) * 100)

        // Get next available actions based on role and current step
        const nextActions = getNextActions(application.currentStep, user.role)

        const progressData = {
            ...application,
            progressPercentage,
            nextActions,
            timeline: generateTimeline(application)
        }

        console.log('✅ APPLICATION PROGRESS API - Progress data fetched successfully')
        return NextResponse.json(progressData)
    } catch (error) {
        console.error('❌ APPLICATION PROGRESS API - Error fetching application progress:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}