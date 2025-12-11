
"use client"
    
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as applicationService from '@/app/lib/services/applicationService';
import * as jobService from '@/app/lib/services/jobService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ApplicationsPage() {
    const router = useRouter();
    const { jobId } = useParams() as { jobId: string };
    const [applications, setApplications] = useState<any[]>([]);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

    useEffect(() => {
        if (!user?.id) router.push('/login');
        else {
            Promise.all([
                jobService.getJob(jobId),
                applicationService.getByJob(jobId),
            ])
                .then(([j, apps]) => {
                    setJob(j);
                    setApplications(apps);
                })
                .finally(() => setLoading(false));
        }
    }, [router, jobId, user?.id]);

    const shortlist = async (appId: string) => {
        try {
            await applicationService.shortlistCandidate(jobId, appId);
            setApplications((prev) =>
                prev.map((a) => (a.id === appId ? { ...a, status: 'SHORTLISTED' } : a))
            );
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Failed to shortlist');
        }
    };

    if (loading) return <p className="text-center py-8">Loading…</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Applications for {job?.title}</h1>
            {applications.length === 0 ? (
                <p className="text-muted-foreground">No applications yet.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="border-0 shadow-lg bg-card/80">
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={app.employee?.profile?.avatarUrl ?? '/placeholder.png'}
                                        alt="avatar"
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {app.employee?.firstName} {app.employee?.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Applied {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3 md:mt-0">
                                    <Badge className="px-2 py-1">{app.status.replace('_', ' ')}</Badge>
                                    {app.status === 'SUBMITTED' && (
                                        <Button variant="default" onClick={() => shortlist(app.id)}>
                                            Shortlist
                                        </Button>
                                    )}
                                    {app.status === 'SHORTLISTED' && (
                                        <Button
                                            onClick={() =>
                                                router.push(`/portals/employer/contracts/${app.id}`)
                                            }
                                        >
                                            Generate Contract
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
