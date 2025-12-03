import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateContractPDF } from "@/lib/utils/contractGenerator"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
    try {
        const { applicationId, jobId, employerId, employeeId } = await req.json()

        // Basic validation of required identifiers
        if (!applicationId || !jobId || !employerId || !employeeId) {
            return NextResponse.json({
                error: 'Missing required identifiers',
                details: {
                    applicationId: !!applicationId,
                    jobId: !!jobId,
                    employerId: !!employerId,
                    employeeId: !!employeeId
                }
            }, { status: 400 })
        }

        // Fetch details
        const job = await prisma.job.findUnique({ where: { id: jobId } })
        const employer = await prisma.user.findUnique({ where: { id: employerId }, include: { profile: true } })
        const employee = await prisma.user.findUnique({
            where: { id: employeeId },
            include: {
                profile: true,
                kycDetails: true
            }
        })

        const application = await prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true }
        })

        if (!job || !employer || !employee || !application) {
            return NextResponse.json({ error: "Missing data" }, { status: 404 })
        }

        // Consistency checks (non-fatal, but we can enforce to avoid wrong linking)
        if (application.jobId !== jobId || application.employeeId !== employeeId) {
            return NextResponse.json({
                error: 'Mismatched identifiers for application',
                details: {
                    expected: { jobId, employeeId },
                    actual: { jobId: application.jobId, employeeId: application.employeeId }
                }
            }, { status: 400 })
        }

        // If a contract already exists and has a PDF URL, return it (idempotent behavior)
        const existingContract = await prisma.contract.findUnique({ where: { applicationId } })
        if (existingContract?.pdfUrl) {
            return NextResponse.json({ success: true, contract: existingContract, pdfUrl: existingContract.pdfUrl })
        }

        // Helper for display name with fallbacks
        const getDisplayName = (u: any) => {
            const full = (u.fullName && String(u.fullName).trim())
            const combined = `${u.firstName || ''} ${u.lastName || ''}`.trim()
            return full || combined || u.email || 'Unknown'
        }

        const safe = <T extends string | number | null | undefined>(v: T, fallback: string) =>
            (v === null || v === undefined || (typeof v === 'string' && v.trim() === '')) ? fallback : String(v)

        const formatDate = (d?: Date | string | null, fb: string = 'N/A') => {
            try {
                if (!d) return fb
                const date = typeof d === 'string' ? new Date(d) : d
                if (isNaN(date.getTime())) return fb
                return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            } catch { return fb }
        }

        const contractId = `KZ-${uuidv4().substring(0, 8).toUpperCase()}`
        const issueDate = formatDate(new Date())
        const startDate = formatDate(new Date()) // Could be passed from frontend later

        // Prepare data for PDF with placeholders
        const contractData = {
            contractId,
            employerName: safe(employer.company, getDisplayName(employer)),
            employerId: safe(employer.profile?.idNumber, 'N/A'),
            employerPhone: safe(employer.phone, 'N/A'),
            employerAddress: safe(employer.profile?.address, safe(job?.city, 'Muscat, Oman')),
            employerEmail: safe(employer.email, 'N/A'),

            employeeName: getDisplayName(employee),
            employeePassport: safe(employee.kycDetails?.passportNumber, 'N/A'),
            employeePassportExpiry: formatDate(employee.kycDetails?.passportExpiry),
            employeeDob: formatDate(employee.kycDetails?.dateOfBirth),
            employeeAddress: safe(employee.profile?.address, 'Kenya'),
            employeeEducation: safe(employee.profile?.education, 'Secondary'),

            nextOfKinName: safe(employee.kycDetails?.nextOfKinName, 'N/A'),
            nextOfKinRelation: safe(employee.kycDetails?.nextOfKinRelation, 'Relative'),
            nextOfKinPhone: safe(employee.kycDetails?.nextOfKinPhone, 'N/A'),

            startDate,
            duration: '2 Years',
            salary: job?.salary ? `${job.salary} ${job.salaryCurrency || 'OMR'}` : 'N/A',
            workingHours: safe(job?.workingHours, '10 hours/day'),
            issueDate
        }

        // Generate PDF
        const pdfUrl = await generateContractPDF(contractData)

        // Save to DB (idempotent via upsert on unique applicationId)
        const contract = await prisma.contract.upsert({
            where: { applicationId },
            create: {
                id: contractId,
                applicationId, // required relation per schema
                employerId,
                employeeId,
                content: JSON.stringify(contractData),
                pdfUrl,
                status: 'DRAFT'
            },
            update: {
                content: JSON.stringify(contractData),
                pdfUrl
            }
        })

        // Update the specific application status and timestamps
        await prisma.jobApplication.update({
            where: { id: applicationId },
            data: {
                status: 'CONTRACT_PENDING',
                contractUrl: pdfUrl,
                contractSentAt: new Date(),
                currentStep: 'CONTRACT_SENT'
            }
        })

        // Close Job if needed (best-effort, ignore errors if status value not supported)
        try {
            if ((job as any)?.status !== 'CLOSED') {
                await prisma.job.update({
                    where: { id: jobId },
                    data: { status: 'CLOSED', closedAt: new Date() as any }
                })
            }
        } catch (e) {
            // no-op
        }

        // Create Notification only if this is the first time (no previous contract)
        if (!existingContract) {
            await prisma.notification.create({
                data: {
                    userId: employeeId,
                    type: 'CONTRACT_GENERATED',
                    title: 'Contract Generated',
                    message: `A contract has been generated for ${job.title}. Please review and sign.`,
                    actionUrl: `/portals/worker/contract`
                }
            })
        }

        return NextResponse.json({ success: true, contract, pdfUrl })

    } catch (error) {
        console.error('Error in contract generation:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
