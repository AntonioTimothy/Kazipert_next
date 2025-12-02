import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateContractPDF } from "@/lib/utils/contractGenerator"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
    try {
        const { applicationId, jobId, employerId, employeeId } = await req.json()

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

        if (!job || !employer || !employee) {
            return NextResponse.json({ error: "Missing data" }, { status: 404 })
        }

        const contractId = `KZ-${uuidv4().substring(0, 8).toUpperCase()}`
        const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        const startDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) // Assuming start today or passed from frontend

        // Prepare data for PDF
        const contractData = {
            contractId,
            employerName: employer.company || `${employer.firstName} ${employer.lastName}`,
            employerId: employer.profile?.idNumber || 'N/A',
            employerPhone: employer.phone || 'N/A',
            employerAddress: employer.profile?.address || 'Muscat, Oman',
            employerEmail: employer.email,

            employeeName: `${employee.firstName} ${employee.lastName}`,
            employeePassport: employee.kycDetails?.passportNumber || 'N/A',
            employeePassportExpiry: employee.kycDetails?.passportExpiry ? new Date(employee.kycDetails.passportExpiry).toLocaleDateString() : 'N/A',
            employeeDob: employee.kycDetails?.dateOfBirth ? new Date(employee.kycDetails.dateOfBirth).toLocaleDateString() : 'N/A',
            employeeAddress: employee.profile?.address || 'Kenya',
            employeeEducation: employee.profile?.education || 'Secondary',

            nextOfKinName: employee.kycDetails?.nextOfKinName || 'N/A',
            nextOfKinRelation: employee.kycDetails?.nextOfKinRelation || 'Relative',
            nextOfKinPhone: employee.kycDetails?.nextOfKinPhone || 'N/A',

            startDate,
            duration: '2 Years',
            salary: `${job.salary} OMR`,
            workingHours: job.workingHours || '10 hours/day',
            issueDate
        }

        // Generate PDF
        const pdfUrl = await generateContractPDF(contractData)

        // Save to DB
        const contract = await prisma.contract.create({
            data: {
                id: contractId,
                employerId,
                employeeId,
                jobId,
                status: 'DRAFT',
                content: JSON.stringify(contractData), // Store data used
                pdfUrl,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
                salary: job.salary,
                terms: "Standard Kazipert Terms"
            }
        })

        // Update Application Status
        await prisma.jobApplication.updateMany({
            where: { jobId, employeeId },
            data: { status: 'HIRED' }
        })

        // Close Job
        await prisma.job.update({
            where: { id: jobId },
            data: { status: 'CLOSED' }
        })

        // Create Notification
        await prisma.notification.create({
            data: {
                userId: employeeId,
                type: 'CONTRACT_GENERATED',
                title: 'Contract Generated',
                message: `You have been hired for ${job.title}! Your contract is ready for review.`,
                link: `/portals/worker/contract`
            }
        })

        return NextResponse.json({ success: true, contract })

    } catch (error) {
        console.error('Error in contract generation:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
