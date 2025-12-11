'use server';

import { prisma } from '@/lib/prisma';

export async function getJobsByEmployer(employerId: string) {
    return prisma.job.findMany({
        where: { employerId },
        include: {
            employer: true,
            _count: { select: { applications: true } },
        },
    });
}

export async function getJob(jobId: string) {
    return prisma.job.findUnique({
        where: { id: jobId },
        include: {
            employer: true,
        },
    });
}

export async function createJob(data: any) {
    return prisma.job.create({ data });
}

export async function updateJob(jobId: string, data: any) {
    return prisma.job.update({ where: { id: jobId }, data });
}

export async function deleteJob(jobId: string) {
    return prisma.job.delete({ where: { id: jobId } });
}

export async function getJobs(params: { role: string, status?: string, userId?: string }) {
    const { role, status, userId } = params;

    if (role === 'employer') {
        if (!userId) throw new Error("User ID required for employer jobs");
        return {
            jobs: await prisma.job.findMany({
                where: {
                    employerId: userId,
                    ...(status ? { status: status as any } : {})
                },
                include: {
                    employer: true,
                    _count: { select: { applications: true } }
                },
                orderBy: { createdAt: 'desc' }
            })
        };
    } else if (role === 'employee') {
        return {
            jobs: await prisma.job.findMany({
                where: { status: 'ACTIVE' },
                include: {
                    employer: true,
                    _count: { select: { applications: true } }
                },
                orderBy: { createdAt: 'desc' }
            })
        };
    }
    return { jobs: [] };
}

export async function getApplications(params: { role: string, userId?: string }) {
    const { role, userId } = params;
    if (!userId) throw new Error("User ID required");

    if (role === 'employer') {
        const applications = await prisma.jobApplication.findMany({
            where: {
                job: { employerId: userId }
            },
            include: {
                job: { include: { employer: true } },
                employee: { include: { profile: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { applications };
    } else if (role === 'employee') {
        const applications = await prisma.jobApplication.findMany({
            where: { employeeId: userId },
            include: {
                job: { include: { employer: true } },
                employee: { include: { profile: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { applications };
    }
    return { applications: [] };
}

export async function getSavedJobs() {
    // Placeholder for saved jobs logic if needed
    return [];
}

export async function saveJob(jobId: string) {
    // Placeholder
    return {};
}

export async function unsaveJob(jobId: string) {
    // Placeholder
    return {};
}

export async function createApplication(jobId: string, employeeId: string, coverLetter: string, isDraft: boolean) {
    return prisma.jobApplication.create({
        data: {
            jobId,
            employeeId,
            coverLetter,
            status: 'PENDING',
            isDraft,
            expectedSalary: 0,
        }
    });
}

export async function uploadMedicalDocument(applicationId: string, file: any) {
    // Placeholder
    return {};
}

export async function updateApplicationStep(applicationId: string, step: string) {
    return prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status: step as any } // Cast to any to avoid enum issues if string is passed
    });
}
