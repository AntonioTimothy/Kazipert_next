import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 FLIGHT TICKET API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ FLIGHT TICKET API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 FLIGHT TICKET API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ FLIGHT TICKET API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 FLIGHT TICKET API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ FLIGHT TICKET API - Error getting user from request:', error)
        return null
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('✈️ FLIGHT TICKET API - POST request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ FLIGHT TICKET API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: applicationId } = params
        const formData = await request.formData()
        const flightTicket = formData.get('flightTicket') as File
        const flightDetails = formData.get('flightDetails')

        if (!flightTicket || !flightDetails) {
            console.log('❌ FLIGHT TICKET API - Flight ticket and details are required')
            return NextResponse.json(
                { error: 'Flight ticket and details are required' },
                { status: 400 }
            )
        }

        console.log('✈️ FLIGHT TICKET API - Processing flight ticket for application:', applicationId)

        // Verify application exists and user has permission
        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: {
                job: true
            }
        })

        if (!application) {
            console.log('❌ FLIGHT TICKET API - Application not found')
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Only employers can upload flight tickets
        if (user.role !== 'EMPLOYER' || application.job.employerId !== user.id) {
            console.log('❌ FLIGHT TICKET API - Forbidden: Only job owner can upload flight tickets')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Parse flight details
        let flightDetailsJson
        try {
            flightDetailsJson = JSON.parse(flightDetails as string)
        } catch (error) {
            console.log('❌ FLIGHT TICKET API - Invalid flight details format')
            return NextResponse.json({ error: 'Invalid flight details format' }, { status: 400 })
        }

        // Convert file to buffer and generate filename (simulate upload)
        const bytes = await flightTicket.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const fileExtension = flightTicket.name.split('.').pop() || 'pdf'
        const filename = `flight-ticket-${applicationId}-${timestamp}.${fileExtension}`

        // In production, upload to cloud storage
        const ticketUrl = `/uploads/flight-tickets/${filename}`

        // Update application with flight ticket
        const updatedApplication = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: {
                flightTicketUrl: ticketUrl,
                flightTicketDetails: flightDetailsJson,
                flightTicketSent: true,
                flightTicketSentAt: new Date(),
                currentStep: 'FLIGHT_TICKET_SENT',
                status: 'FLIGHT_PENDING',
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

        console.log('✅ FLIGHT TICKET API - Flight ticket uploaded successfully')
        return NextResponse.json(updatedApplication)
    } catch (error) {
        console.error('❌ FLIGHT TICKET API - Error uploading flight ticket:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}