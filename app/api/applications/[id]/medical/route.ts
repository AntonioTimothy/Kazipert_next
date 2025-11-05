import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 MEDICAL UPLOAD API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ MEDICAL UPLOAD API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 MEDICAL UPLOAD API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ MEDICAL UPLOAD API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 MEDICAL UPLOAD API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ MEDICAL UPLOAD API - Error getting user from request:', error)
        return null
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🏥 MEDICAL UPLOAD API - POST request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ MEDICAL UPLOAD API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: applicationId } = params
        const formData = await request.formData()
        const medicalDocument = formData.get('medicalDocument') as File

        if (!medicalDocument) {
            console.log('❌ MEDICAL UPLOAD API - Medical document is required')
            return NextResponse.json({ error: 'Medical document is required' }, { status: 400 })
        }

        console.log('🏥 MEDICAL UPLOAD API - Processing medical document for application:', applicationId)

        // Verify application exists and user has permission
        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: {
                job: true
            }
        })

        if (!application) {
            console.log('❌ MEDICAL UPLOAD API - Application not found')
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        if (user.role === 'EMPLOYEE' && application.employeeId !== user.id) {
            console.log('❌ MEDICAL UPLOAD API - Forbidden: Employee does not own this application')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Only employees can upload medical documents
        if (user.role !== 'EMPLOYEE') {
            console.log('❌ MEDICAL UPLOAD API - Forbidden: Only employees can upload medical documents')
            return NextResponse.json({ error: 'Only employees can upload medical documents' }, { status: 403 })
        }

        // Convert file to buffer
        const bytes = await medicalDocument.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const fileExtension = medicalDocument.name.split('.').pop()
        const filename = `medical-${applicationId}-${timestamp}.${fileExtension}`

        // In production, you would upload to cloud storage (S3, etc.)
        // For now, we'll simulate by storing the filename
        const documentUrl = `/uploads/medical/${filename}`

        // Update application with medical document
        const updatedApplication = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: {
                medicalDocumentUrl: documentUrl,
                medicalSubmitted: true,
                medicalSubmittedAt: new Date(),
                currentStep: 'MEDICAL_SUBMITTED',
                status: 'MEDICAL_PENDING',
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

        console.log('✅ MEDICAL UPLOAD API - Medical document uploaded successfully')
        return NextResponse.json(updatedApplication)
    } catch (error) {
        console.error('❌ MEDICAL UPLOAD API - Error uploading medical document:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}