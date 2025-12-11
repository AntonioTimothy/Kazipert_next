'use server';

import { prisma } from '@/lib/prisma';

export async function getByJob(jobId: string) {
    return prisma.jobApplication.findMany({
        where: { jobId },
        include: {
            employee: { include: { profile: true } },
            job: true,
        },
    });
}

export async function getById(applicationId: string) {
    return prisma.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
            employee: { include: { profile: true } },
            job: true,
        },
    });
}

/**
 * Shortlist a candidate for a job. Ensures only one SHORTLISTED application per job.
 */
export async function shortlistCandidate(jobId: string, applicationId: string) {
    const existing = await prisma.jobApplication.findFirst({
        where: { jobId, status: 'SHORTLISTED' },
    });
    if (existing && existing.id !== applicationId) {
        throw new Error('A candidate has already been shortlisted for this job');
    }
    return prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status: 'SHORTLISTED' },
    });
}

export async function updateStatus(applicationId: string, status: string) {
    const updated = await prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status: status as any },
    });
    if (status === 'CONTRACT_SENT') {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/email/send-contract/${applicationId}`, {
                method: 'POST',
            });
        } catch (e) {
            console.error('Failed to trigger contract email:', e);
        }
    }
    return updated;
}

/**
 * Convenience wrapper to send contract email manually.
 */
export async function sendContractEmail(applicationId: string) {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/email/send-contract/${applicationId}`, {
        method: 'POST',
    });
}
export async function uploadMedicalReport(applicationId: string, file: any) {
    // Placeholder to fix build error
    return {};
}
