"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobCard } from '@/components/employer/JobCard';
import * as jobService from '@/lib/services/jobService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmployerJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

  useEffect(() => {
    if (!user?.id) router.push('/login');
    else {
      jobService.getJobsByEmployer(user.id).then(setJobs).finally(() => setLoading(false));
    }
  }, [router, user?.id]);

  if (loading) return <p className="text-center py-8">Loading…</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Posted Jobs</h1>
      {jobs.length === 0 ? (
        <Card className="border-0 shadow-xl text-center bg-card/80 backdrop-blur-sm">
          <CardContent className="py-16">
            <p className="text-muted-foreground mb-6">You haven’t posted any jobs yet.</p>
            <Button
              onClick={() => router.push('/portals/employer/post-job')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3"
            >
              Post a New Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => router.push(`/portals/employer/applications/${job.id}`)}
              onEdit={() => router.push(`/portals/employer/post-job?jobId=${job.id}`)}
              onDelete={async () => {
                if (confirm('Delete this job?')) {
                  await jobService.deleteJob(job.id);
                  setJobs((prev) => prev.filter((j) => j.id !== job.id));
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}