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

export default function EmployerJobsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-red-100 text-red-800'
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800'
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

                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/portals/employer/jobs/${job.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}