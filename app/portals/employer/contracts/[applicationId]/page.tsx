'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as applicationService from '@/app/lib/services/applicationService';
import * as jobService from '@/app/lib/services/jobService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplicationStepper } from '@/components/employer/ApplicationStepper';
import { CheckCircle } from 'lucide-react';

export default function ContractPage() {
    const router = useRouter();
    const { applicationId } = useParams() as { applicationId: string };
    const [application, setApplication] = useState<any>(null);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const app = await applicationService.getById(applicationId);
            if (!app) {
                router.push('/portals/employer/jobs');
                return;
            }
            const j = await jobService.getJob(app.jobId);
            setApplication(app);
            setJob(j);
            setLoading(false);
        })();
    }, [applicationId]);

    const advanceStep = async (nextStep: string) => {
        if (nextStep === 'CONTRACT_SENT') {
            // generate contract PDF via backend endpoint
            const res = await fetch(`/api/contracts/generate/${applicationId}`);
            const { url } = await res.json();
            await applicationService.updateStatus(applicationId, nextStep);
            // store contract URL (simplified – normally you'd update DB)
            setApplication((prev: any) => ({ ...prev, contractUrl: url }));
        } else {
            await applicationService.updateStatus(applicationId, nextStep);
        }
        // refresh status locally
        setApplication((prev: any) => ({ ...prev, status: nextStep }));
    };

    if (loading) return <p className="text-center py-8">Loading…</p>;

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Contract for {job?.title}</h1>

            {/* Contract preview */}
            <Card className="border-0 shadow-xl bg-card/80">
                <CardHeader>
                    <CardTitle>Contract Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Employer:</strong> {job?.employer?.firstName} {job?.employer?.lastName}</p>
                    <p><strong>Employee:</strong> {application?.employee?.firstName} {application?.employee?.lastName}</p>
                    <p><strong>Salary:</strong> {job?.salary} {job?.salaryCurrency}</p>
                    <p><strong>Duties:</strong></p>
                    <ul className="list-disc pl-6">
                        {job?.duties?.map((d: string) => (
                            <li key={d}>{d.replace('_', ' ')}</li>
                        ))}
                        {job?.additionalDutiesDescription && (
                            <li>{job.additionalDutiesDescription}</li>
                        )}
                    </ul>
                </CardContent>
            </Card>

            {/* Stepper */}
            <ApplicationStepper
                currentStep={application?.status}
                onAdvance={advanceStep}
            />

            {/* Show contract download button when available */}
            {application?.contractUrl && (
                <Button
                    variant="outline"
                    onClick={() => window.open(application.contractUrl, '_blank')}
                >
                    Download Contract
                </Button>
            )}
        </div>
    );
}
