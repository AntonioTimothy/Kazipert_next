import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendContractEmail } from '@/lib/emailSender';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const applicationId = params.id;
    // Retrieve application with related data
    const application = await prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: { job: { include: { employer: true } }, employee: { include: { profile: true } } },
    }) as any;

    if (!application) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Path to the previously generated PDF (assumes it exists in public/contracts)
    const pdfPath = path.join(process.cwd(), 'public', 'contracts', `${applicationId}.pdf`);
    try {
        const pdfBuffer = await fs.readFile(pdfPath);
        const employerEmail = application.job.employer.email;
        const employeeEmail = application.employee.email;
        const subject = `Contract for ${application.job.title}`;
        const text = `Dear ${application.employee.firstName},\n\nPlease find attached the contract for the position ${application.job.title}.`;
        // Send to both parties
        await sendContractEmail(employerEmail, subject, text, pdfBuffer);
        await sendContractEmail(employeeEmail, subject, text, pdfBuffer);
        // Update status to CONTRACT_SENT
        await prisma.jobApplication.update({
            where: { id: applicationId },
            data: {
                status: 'CONTRACT_SENT',
                contractUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/contracts/${applicationId}.pdf`
            },
        });
        return NextResponse.json({ message: 'Emails sent and status updated' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }
}
