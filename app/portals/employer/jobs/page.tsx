"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTheme } from "@/contexts/ThemeContext"
import { jobService } from "@/lib/services/jobService"
import {
    Briefcase,
    Users,
    Clock,
    MapPin,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    FileText,
    UserCheck
} from "lucide-react"

const COLORS = {
    primary: '#117c82',
    secondary: '#009CA6',
    gold: '#FDB913',
    purple: '#463189',
}

export default function EmployerJobsPage() {
    const router = useRouter()
    const { currentTheme } = useTheme()
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [applications, setApplications] = useState<any[]>([])
    const [loadingApps, setLoadingApps] = useState(false)
    const [showApplicants, setShowApplicants] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const loadData = async () => {
            const userData = sessionStorage.getItem("user")
            if (!userData) {
                router.push("/login")
                return
            }
            setUser(JSON.parse(userData))

            try {
                const data = await jobService.getJobs({ role: 'employer' })
                setJobs(data.jobs || [])
            } catch (error) {
                console.error("Error loading jobs:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [router])

    const handleViewApplicants = async (job: any) => {
        setSelectedJob(job)
        setShowApplicants(true)
        setLoadingApps(true)
        try {
            const data = await jobService.getJobApplications(job.id)
            setApplications(data.applications || [])
        } catch (error) {
            console.error("Error loading applications:", error)
        } finally {
            setLoadingApps(false)
        }
    }

    const handleShortlist = async (appId: string) => {
        try {
            await jobService.shortlistApplication(appId)
            // Refresh list
            const data = await jobService.getJobApplications(selectedJob.id)
            setApplications(data.applications || [])
            alert("Candidate shortlisted successfully!")
        } catch (error) {
            console.error("Error shortlisting:", error)
            alert("Failed to shortlist candidate")
        }
    }

    const handleHire = async (app: any) => {
        if (!confirm(`Are you sure you want to hire ${app.employee.firstName}? This will generate a contract.`)) return

        try {
            await jobService.generateContract(app.id, selectedJob.id, user.id, app.employee.id)
            alert("Contract generated successfully! You can view it in the Contracts section.")
            setShowApplicants(false)
            router.push('/portals/employer/contracts')
        } catch (error) {
            console.error("Error generating contract:", error)
            alert("Failed to generate contract")
        }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
                        <p className="text-gray-600">Manage your job postings and applications</p>
                    </div>
                    <Button
                        onClick={() => router.push('/portals/employer/post-job')}
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        Post New Job
                    </Button>
                </div>

                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="bg-white p-1 border">
                        <TabsTrigger value="active">Active Jobs</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                        <TabsTrigger value="closed">Closed</TabsTrigger>
                    </TabsList>

                    {['active', 'draft', 'closed'].map((status) => (
                        <TabsContent key={status} value={status} className="mt-6">
                            <div className="grid gap-6">
                                {jobs.filter(j =>
                                    status === 'active' ? j.status === 'OPEN' || j.status === 'ACTIVE' :
                                        status === 'draft' ? j.status === 'DRAFT' :
                                            j.status === 'CLOSED'
                                ).map((job) => (
                                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                                                        <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'}>
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" /> {job.city}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" /> {job.workingHours}
                                                        </span>
                                                        <span className="flex items-center gap-1 font-medium text-green-600">
                                                            <Briefcase className="h-4 w-4" /> {job.salary} OMR
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {status === 'draft' ? (
                                                        <Button variant="outline" onClick={() => router.push(`/portals/employer/post-job?id=${job.id}`)}>
                                                            <Edit className="h-4 w-4 mr-2" /> Edit
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleViewApplicants(job)}
                                                            className="border-primary text-primary hover:bg-primary/5"
                                                        >
                                                            <Users className="h-4 w-4 mr-2" />
                                                            Applicants ({job._count?.applications || 0})
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {jobs.filter(j =>
                                    status === 'active' ? j.status === 'OPEN' || j.status === 'ACTIVE' :
                                        status === 'draft' ? j.status === 'DRAFT' :
                                            j.status === 'CLOSED'
                                ).length === 0 && (
                                        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                                            <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                                            <p className="text-gray-500">You haven't posted any jobs in this category yet.</p>
                                        </div>
                                    )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* Applicants Modal */}
                <Dialog open={showApplicants} onOpenChange={setShowApplicants}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
                            <DialogDescription>
                                Review and manage candidates for this position
                            </DialogDescription>
                        </DialogHeader>

                        {loadingApps ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="space-y-4 mt-4">
                                {applications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No applications yet.</p>
                                    </div>
                                ) : (
                                    applications.map((app) => (
                                        <Card key={app.id} className="border border-gray-200">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                        {app.employee.firstName[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-lg">
                                                            {app.employee.firstName} {app.employee.lastName}
                                                        </h4>
                                                        <div className="flex gap-3 text-sm text-gray-500">
                                                            <span>{app.employee.profile?.nationality || 'Kenyan'}</span>
                                                            <span>•</span>
                                                            <span>{app.employee.profile?.experience || '2 years exp'}</span>
                                                        </div>
                                                        <div className="mt-1">
                                                            <Badge variant={
                                                                app.status === 'SHORTLISTED' ? 'default' :
                                                                    app.status === 'HIRED' ? 'success' : 'secondary'
                                                            }>
                                                                {app.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm">
                                                        <FileText className="h-4 w-4 mr-2" /> View Profile
                                                    </Button>

                                                    {app.status === 'PENDING' && (
                                                        <Button
                                                            onClick={() => handleShortlist(app.id)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <UserCheck className="h-4 w-4 mr-2" /> Shortlist
                                                        </Button>
                                                    )}

                                                    {app.status === 'SHORTLISTED' && (
                                                        <Button
                                                            onClick={() => handleHire(app)}
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-2" /> Hire & Contract
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
