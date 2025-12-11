"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import * as jobService from "@/app/lib/services/jobService"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82',
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplication = async () => {
      setLoading(true)

      try {
        // Get user from session
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

        // Get application details
        const applicationData = await jobService.getApplication(resolvedParams.id)
        setApplication(applicationData)
      } catch (error) {
        console.error('Error loading application:', error)
        setApplication(null)
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [resolvedParams.id, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'UNDER_REVIEW': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'SHORTLISTED': return 'bg-purple-500/10 text-purple-600 border-purple-200'
      case 'INTERVIEW_SCHEDULED': return 'bg-amber-500/10 text-amber-600 border-amber-200'
      case 'CONTRACT_PENDING': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'COMPLETED': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'New Application'
      case 'UNDER_REVIEW': return 'Under Review'
      case 'SHORTLISTED': return 'Shortlisted'
      case 'INTERVIEW_SCHEDULED': return 'Interview Scheduled'
      case 'CONTRACT_PENDING': return 'Contract Sent'
      case 'COMPLETED': return 'Hired'
      case 'REJECTED': return 'Rejected'
      default: return status
    }
  }

  const handleSendContract = async () => {
    try {
      await jobService.sendContract(application.id, '')
      // Reload application data
      const updatedApplication = await jobService.getApplication(resolvedParams.id)
      setApplication(updatedApplication)
    } catch (error) {
      console.error('Error sending contract:', error)
      alert('Failed to send contract. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Application Not Found</h2>
            <p className="text-gray-600 mt-2">The application you're looking for doesn't exist.</p>
          </div>
          <Button onClick={() => router.push('/portals/employer/applications')}>
            Back to Applications
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/portals/employer/applications')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">Review candidate information and manage application</p>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {getStatusText(application.status)}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback
                      className="text-white text-lg font-semibold"
                      style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                    >
                      {application.employee.firstName?.charAt(0)}{application.employee.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {application.employee.firstName} {application.employee.lastName}
                    </h3>
                    <p className="text-gray-600">Applied for {application.job.title}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{application.employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{application.employee.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{application.employee.profile?.address || 'Not provided'}</span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                  <p className="text-gray-600">{application.job.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{application.job.salary} {application.job.salaryCurrency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{application.job.city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.status === 'PENDING' && (
                  <>
                    <Button
                      className="w-full"
                      style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
                      onClick={async () => {
                        try {
                          await jobService.updateApplication(application.id, { status: 'SHORTLISTED' })
                          const updated = await jobService.getApplication(resolvedParams.id)
                          setApplication(updated)
                        } catch (error) {
                          console.error('Error shortlisting:', error)
                        }
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Shortlist Candidate
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        try {
                          await jobService.updateApplication(application.id, { status: 'REJECTED' })
                          const updated = await jobService.getApplication(resolvedParams.id)
                          setApplication(updated)
                        } catch (error) {
                          console.error('Error rejecting:', error)
                        }
                      }}
                    >
                      Reject Application
                    </Button>
                  </>
                )}

                {application.status === 'SHORTLISTED' && (
                  <Button
                    className="w-full"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
                    onClick={handleSendContract}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Contract
                  </Button>
                )}

                {application.contractUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(application.contractUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Contract
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">{new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {application.status !== 'PENDING' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Status Updated</p>
                      <p className="text-sm text-gray-600">{getStatusText(application.status)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}