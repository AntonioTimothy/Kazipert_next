// app/api/jobs/[jobId]/applicants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Helper to get user from request (same as in jobs/route.ts)
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;
        if (!accessToken) return null;
        const decoded = verifyAccessToken(accessToken);
        if (!decoded) return null;
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { profile: true },
        });
        return user;
    } catch (e) {
        console.error('Error in getUserFromRequest:', e);
        return null;
    }
}

// GET: fetch all applicants for a specific job
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    if (!jobId) {
        return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const user = await getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure the user is the employer of this job
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    if (job.employerId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applications = await prisma.jobApplication.findMany({
        where: { jobId },
        include: {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profile: true,
                },
            },
        },
    });

    return NextResponse.json({ applications });
}

// POST: shortlist an applicant (only one per job)
export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    if (!jobId) {
        return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const user = await getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    if (job.employerId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure no employee has been shortlisted yet
    if (job.shortlistedEmployeeId) {
        return NextResponse.json({ error: 'Job already has a shortlisted employee' }, { status: 400 });
    }

    const body = await request.json();
    const { applicantId } = body;
    if (!applicantId) {
        return NextResponse.json({ error: 'Missing applicantId' }, { status: 400 });
    }

    // Verify the applicant applied to this job
    const application = await prisma.jobApplication.findFirst({
        where: { jobId, employeeId: applicantId },
    });
    if (!application) {
        return NextResponse.json({ error: 'Applicant did not apply to this job' }, { status: 404 });
    }

    // Update job with shortlisted employee
    const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { shortlistedEmployeeId: applicantId },
    });

    // Optionally, you could also update the application status to SHORTLISTED
    await prisma.jobApplication.update({
        where: { id: application.id },
        data: { status: 'SHORTLISTED' as any }, // cast to any to avoid enum mismatch in TS
    });

    return NextResponse.json({ job: updatedJob, message: 'Applicant shortlisted successfully' });
}
