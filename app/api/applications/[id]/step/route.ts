import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { contractService } from '@/lib/services/contractService'

async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 APPLICATION STEP API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ APPLICATION STEP API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 APPLICATION STEP API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ APPLICATION STEP API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 APPLICATION STEP API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ APPLICATION STEP API - Error getting user from request:', error)
        return null
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log('🔄 APPLICATION STEP API - PUT request received')
        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ APPLICATION STEP API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: applicationId } = await params
        const body = await request.json()
        const { step, interviewDate, interviewNotes, contractUrl, signature } = body

        if (!step) {
            console.log('❌ APPLICATION STEP API - Step is required')
            return NextResponse.json({ error: 'Step is required' }, { status: 400 })
        }

        console.log('🔄 APPLICATION STEP API - Updating step:', step, 'for application:', applicationId)

        // Get application with job details
        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: {
                job: {
                    include: {
                        employer: {
                            include: {
                                profile: true
                            }
                        }
                    }
                },
                employee: {
                    include: {
                        profile: true,
                        kycDetails: true
                    }
                }
            }
        })

        if (!application) {
            console.log('❌ APPLICATION STEP API - Application not found')
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Verify permissions
        if (user.role === 'EMPLOYER' && application.job.employerId !== user.id) {
            console.log('❌ APPLICATION STEP API - Forbidden: Employer does not own this job')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (user.role === 'EMPLOYEE' && application.employeeId !== user.id) {
            console.log('❌ APPLICATION STEP API - Forbidden: Employee does not own this application')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Prepare update data based on step
        const updateData: any = {
            currentStep: step,
            updatedAt: new Date()
        }

        // Set timestamp for the step
        const timestampField = `${step.toLowerCase()}At`
        updateData[timestampField] = new Date()

        // Handle specific step data
        switch (step) {
            case 'INTERVIEW_SCHEDULED':
                if (!interviewDate) {
                    console.log('❌ APPLICATION STEP API - Interview date is required')
                    return NextResponse.json({ error: 'Interview date is required' }, { status: 400 })
                }
                updateData.interviewDate = new Date(interviewDate)
                updateData.interviewNotes = interviewNotes
                updateData.status = 'INTERVIEW_SCHEDULED'
                break

            case 'CONTRACT_SENT':
                if (!contractUrl) {
                    console.log('🔄 APPLICATION STEP API - Generating contract...')
                    try {
                        const contractUrl = await contractService.generateContract({
                            employerName: `${application.job.employer.firstName} ${application.job.employer.lastName}`,
                            employerId: application.job.employer.profile?.idNumber || 'N/A',
                            employerContact: `${application.job.employer.firstName} ${application.job.employer.lastName}`,
                            employerPhone: application.job.employer.phone || 'N/A',
                            employerAddress: application.job.employer.profile?.address || 'N/A',
                            employerEmail: application.job.employer.email,
                            employeeName: `${application.employee.firstName} ${application.employee.lastName}`,
                            employeePassport: application.employee.kycDetails?.passportNumber || 'N/A',
                            employeePassportExpiry: application.employee.kycDetails?.passportExpiry ? new Date(application.employee.kycDetails.passportExpiry).toLocaleDateString() : 'N/A',
                            employeeDob: application.employee.profile?.dateOfBirth ? new Date(application.employee.profile.dateOfBirth).toLocaleDateString() : 'N/A',
                            employeeArrival: new Date().toLocaleDateString(), // Assuming arrival is now/soon
                            employeeEducation: application.employee.profile?.education || 'N/A',
                            employeeAddress: application.employee.profile?.address || 'N/A',
                            nextOfKinName: application.employee.kycDetails?.nextOfKinName || 'N/A',
                            nextOfKinPhone: application.employee.kycDetails?.nextOfKinPhone || 'N/A',
                            contractDuration: '2 Years',
                            contractStartDate: new Date().toLocaleDateString(),
                            monthlySalary: `${application.job.salary} ${application.job.salaryCurrency}`,
                            documentId: `KZ-EMP-${application.id.slice(-5).toUpperCase()}`,
                            issueDate: new Date().toLocaleDateString()
                        })
                        updateData.contractUrl = contractUrl
                        console.log('✅ APPLICATION STEP API - Contract generated:', contractUrl)
                    } catch (error) {
                        console.error('❌ APPLICATION STEP API - Error generating contract:', error)
                        return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 })
                    }
                } else {
                    updateData.contractUrl = contractUrl
                }
                updateData.status = 'CONTRACT_PENDING'
                break

            case 'MEDICAL_SUBMITTED':
                updateData.medicalSubmitted = true
                updateData.status = 'MEDICAL_PENDING'
                break

            case 'MEDICAL_APPROVED':
                updateData.medicalApproved = true
                updateData.medicalVerified = true
                break

            case 'CONTRACT_SIGNED':
                if (!signature) {
                    return NextResponse.json({ error: 'Signature is required' }, { status: 400 })
                }

                // Update contract with signature
                // First check if contract exists, if not create it (should exist from SENT step)
                // But for now we just regenerate the PDF and update URL

                try {
                    // Regenerate contract with signature
                    const signedContractUrl = await contractService.generateContract({
                        employerName: `${application.job.employer.firstName} ${application.job.employer.lastName}`,
                        employerId: application.job.employer.profile?.idNumber || 'N/A',
                        employerContact: `${application.job.employer.firstName} ${application.job.employer.lastName}`,
                        employerPhone: application.job.employer.phone || 'N/A',
                        employerAddress: application.job.employer.profile?.address || 'N/A',
                        employerEmail: application.job.employer.email,
                        employeeName: `${application.employee.firstName} ${application.employee.lastName}`,
                        employeePassport: application.employee.kycDetails?.passportNumber || 'N/A',
                        employeePassportExpiry: application.employee.kycDetails?.passportExpiry ? new Date(application.employee.kycDetails.passportExpiry).toLocaleDateString() : 'N/A',
                        employeeDob: application.employee.profile?.dateOfBirth ? new Date(application.employee.profile.dateOfBirth).toLocaleDateString() : 'N/A',
                        employeeArrival: new Date().toLocaleDateString(),
                        employeeEducation: application.employee.profile?.education || 'N/A',
                        employeeAddress: application.employee.profile?.address || 'N/A',
                        nextOfKinName: application.employee.kycDetails?.nextOfKinName || 'N/A',
                        nextOfKinPhone: application.employee.kycDetails?.nextOfKinPhone || 'N/A',
                        contractDuration: '2 Years',
                        contractStartDate: new Date().toLocaleDateString(),
                        monthlySalary: `${application.job.salary} ${application.job.salaryCurrency}`,
                        documentId: `KZ-EMP-${application.id.slice(-5).toUpperCase()}`,
                        issueDate: new Date().toLocaleDateString(),
                        employeeSignature: signature
                    })

                    updateData.contractUrl = signedContractUrl
                    updateData.contractSigned = true

                    // Also update/create Contract record
                    await prisma.contract.upsert({
                        where: { applicationId: applicationId },
                        create: {
                            applicationId: applicationId,
                            employerId: application.job.employerId,
                            employeeId: application.employeeId,
                            content: 'HTML Content', // We could store HTML here
                            pdfUrl: signedContractUrl,
                            employeeSigned: true,
                            employeeSignedAt: new Date(),
                            employeeSignature: signature,
                            status: 'PENDING_SIGNATURES' // Still needs employer/admin
                        },
                        update: {
                            pdfUrl: signedContractUrl,
                            employeeSigned: true,
                            employeeSignedAt: new Date(),
                            employeeSignature: signature
                        }
                    })

                } catch (error) {
                    console.error('❌ APPLICATION STEP API - Error signing contract:', error)
                    return NextResponse.json({ error: 'Failed to sign contract' }, { status: 500 })
                }
                break

            case 'VISA_APPROVED':
                updateData.visaApproved = true
                updateData.status = 'VISA_PROCESSING'
                break

            case 'FLIGHT_TICKET_SENT':
                updateData.flightTicketSent = true
                updateData.status = 'FLIGHT_PENDING'
                break

            case 'DEPLOYMENT_READY':
                updateData.status = 'READY_FOR_DEPLOYMENT'
                break

            case 'SHORTLISTED':
                updateData.status = 'SHORTLISTED'
                break

            case 'UNDER_REVIEW':
                updateData.status = 'UNDER_REVIEW'
                break

            case 'REJECTED':
                updateData.status = 'REJECTED'
                break
        }

        // Update application
        const updatedApplication = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: updateData,
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

        console.log('✅ APPLICATION STEP API - Application step updated successfully')
        return NextResponse.json(updatedApplication)
    } catch (error) {
        console.error('❌ APPLICATION STEP API - Error updating application step:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}