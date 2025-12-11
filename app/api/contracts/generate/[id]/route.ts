import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateContractPdf } from '@/lib/pdfGenerator';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const applicationId = params.id;
  // Fetch application and related job data
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: { job: { include: { employer: true } }, employee: { include: { profile: true } } },
  }) as any;

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Build simple HTML contract template
  const html = `
    <html>
      <head><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;}</style></head>
      <body>
        <h1>Employment Contract</h1>
        <p><strong>Employer:</strong> ${application.job.employer.firstName} ${application.job.employer.lastName}</p>
        <p><strong>Employee:</strong> ${application.employee.firstName} ${application.employee.lastName}</p>
        <p><strong>Job Title:</strong> ${application.job.title}</p>
        <p><strong>Salary:</strong> ${application.job.salary} ${application.job.salaryCurrency}</p>
        <p><strong>Duties:</strong></p>
        <ul>
          ${application.job.duties.map((d: string) => `<li>${d.replace('_', ' ')}</li>`).join('')}
          ${application.job.additionalDutiesDescription ? `<li>${application.job.additionalDutiesDescription}</li>` : ''}
        </ul>
      </body>
    </html>
  `;

  const pdfBuffer = await generateContractPdf(html);

  // Save PDF to public/contracts folder
  const contractsDir = path.join(process.cwd(), 'public', 'contracts');
  await fs.mkdir(contractsDir, { recursive: true });
  const filePath = path.join(contractsDir, `${applicationId}.pdf`);
  await fs.writeFile(filePath, pdfBuffer);

  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/contracts/${applicationId}.pdf`;
  return NextResponse.json({ url: publicUrl });
}
