"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import { jobService } from "@/lib/services/jobService"
import {
  Plus,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

const COLORS = {
  primary: '#117c82',
  secondary: '#009CA6',
  gold: '#FDB913',
  purple: '#463189',
}

interface Job {
  id: string
  title: string
  category: string
  description: string
  location: string
  city: string
  salary: number
  salaryCurrency: string
  status: string
  createdAt: string
  bedrooms: number
  bathrooms: number
  workingHours: string
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EmployerJobsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Applicants Modal State
  const [showApplicantsModal, setShowApplicantsModal] = useState(false)
  const [selectedJobApplicants, setSelectedJobApplicants] = useState<any[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [selectedJobTitle, setSelectedJobTitle] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const userData = sessionStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "EMPLOYER") {
        router.push("/login")
        return
      }

      setUser(parsedUser)

      try {
        const employerJobs = await jobService.getEmployerJobs(parsedUser.id)
        setJobs(employerJobs)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleViewApplicants = async (jobId: string, jobTitle: string) => {
    setSelectedJobTitle(jobTitle)
    setShowApplicantsModal(true)
    setLoadingApplicants(true)
    try {
      const applicants = await jobService.getJobApplications(jobId)
      setSelectedJobApplicants(applicants || [])
    } catch (error) {
      console.error('Error fetching applicants:', error)
      setSelectedJobApplicants([])
    } finally {
      setLoadingApplicants(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-red-100 text-red-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
              My Job Postings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your job listings and track applications
            </p>
          </div>
          <Button
            onClick={() => router.push('/portals/employer/post-job')}
            className="flex items-center gap-2"
            style={{ backgroundColor: COLORS.primary, color: 'white' }}
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                <p className="text-gray-500 mb-6">
                  Start by posting your first job to find the perfect helper for your family
                </p>
                <Button
                  onClick={() => router.push('/portals/employer/post-job')}
                  style={{ backgroundColor: COLORS.primary, color: 'white' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                      <CardDescription className="mt-1 capitalize">
                        {job.category.replace('_', ' ').toLowerCase()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}, {job.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold" style={{ color: COLORS.primary }}>
                      {job.salary} {job.salaryCurrency}/month
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{job.workingHours}</span>
                  </div>

                  <div className="text-sm text-gray-500">
                    {job.bedrooms} bed, {job.bathrooms} bath
                  </div>

                  <div className="text-xs text-gray-400">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex flex-col gap-2 pt-3">
                    <Button
                      className="w-full"
                      style={{ backgroundColor: COLORS.secondary, color: 'white' }}
                      onClick={() => handleViewApplicants(job.id, job.title)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Applicants
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/portals/employer/jobs/${job.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/portals/employer/jobs/${job.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Applicants Modal */}
        <Dialog open={showApplicantsModal} onOpenChange={setShowApplicantsModal}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJobTitle}</DialogTitle>
              <DialogDescription>
                Review candidates who have applied for this position.
              </DialogDescription>
            </DialogHeader>

            {loadingApplicants ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : selectedJobApplicants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No applicants yet for this job.</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {selectedJobApplicants.map((app) => (
                  <Card key={app.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/portals/employer/applications?application=${app.id}`)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {app.employee?.firstName?.charAt(0)}{app.employee?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{app.employee?.firstName} {app.employee?.lastName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{app.employee?.kycDetails?.nationality || 'Nationality N/A'}</span>
                            <span>•</span>
                            <span>{app.employee?.kycDetails?.workExperience || 'Exp N/A'}</span>
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{app.expectedSalary || 'N/A'} OMR</div>
                        <div className="text-xs text-gray-500">Expected</div>
                        <Button size="sm" variant="ghost" className="mt-2 text-primary hover:text-primary/80 p-0 h-auto">
                          View Profile <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}