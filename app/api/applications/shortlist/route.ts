import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { applicationId, status } = await req.json()

        if (!applicationId || !status) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 })
        }

        // Update application status
        const application = await prisma.jobApplication.update({
            where: { id: applicationId },
            data: { status },
            include: { job: true }
        })

        // Create notification
        await prisma.notification.create({
            data: {
                userId: application.employeeId,
                type: 'SHORTLISTED',
                title: 'Application Update',
                message: `You have been ${status.toLowerCase()} for the position: ${application.job.title}`,
                link: `/portals/worker/jobs`
            }
        })

        return NextResponse.json({ success: true, application })
    } catch (error) {
        console.error('Error shortlisting:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
