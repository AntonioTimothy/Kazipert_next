// app/employee/applications/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import * as jobService from "@/lib/services/jobService"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Home,
  Baby,
  ShieldCheck,
  Plane,
  CreditCard,
  FileCheck,
  UserCheck,
  Download,
  MessageSquare,
  Phone,
  Mail,
  ArrowLeft
} from "lucide-react"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  accent: '#6c71b5'
}

export default function EmployeeApplicationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const userData = sessionStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "EMPLOYEE") {
        router.push("/login")
        return
      }

      setUser(parsedUser)

      try {
        const applicationsData = await jobService.getApplications({ role: 'employee' })
        setApplications(applicationsData.applications || [])
      } catch (error) {
        console.error('Error loading applications:', error)
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500/10 text-blue-600'
      case 'UNDER_REVIEW': return 'bg-orange-500/10 text-orange-600'
      case 'ACCEPTED': return 'bg-green-500/10 text-green-600'
      case 'REJECTED': return 'bg-red-500/10 text-red-600'
      case 'CONTRACT_SENT': return 'bg-purple-500/10 text-purple-600'
      case 'VISA_PROCESSING': return 'bg-indigo-500/10 text-indigo-600'
      case 'FLIGHT_BOOKED': return 'bg-teal-500/10 text-teal-600'
      case 'ARRIVED': return 'bg-emerald-500/10 text-emerald-600'
      default: return 'bg-gray-500/10 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return FileText
      case 'UNDER_REVIEW': return Clock
      case 'ACCEPTED': return CheckCircle
      case 'REJECTED': return XCircle
      case 'CONTRACT_SENT': return FileCheck
      case 'VISA_PROCESSING': return ShieldCheck
      case 'FLIGHT_BOOKED': return Plane
      case 'ARRIVED': return UserCheck
      default: return AlertCircle
    }
  }

  const getNextStep = (status: string) => {
    const steps = {
      'PENDING': 'Employer Review',
      'UNDER_REVIEW': 'Interview',
      'ACCEPTED': 'Contract Preparation',
      'CONTRACT_SENT': 'Visa Processing',
      'VISA_PROCESSING': 'Flight Booking',
      'FLIGHT_BOOKED': 'Travel to Oman',
      'ARRIVED': 'Start Employment'
    }
    return steps[status as keyof typeof steps] || 'Processing'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/employee/jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">Track your job application progress</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {applications.length} Applications
          </Badge>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => {
              const StatusIcon = getStatusIcon(application.status)
              return (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{application.job?.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.job?.city}, Oman
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {application.job?.salary} OMR/month
                          </span>
                          <span className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            {application.job?.residenceType}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Application Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Application Progress</span>
                        <span className="text-gray-600">Next: {getNextStep(application.status)}</span>
                      </div>
                      <Progress value={getProgressValue(application.status)} className="h-2" />
                    </div>

                    {/* Family Information */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{application.job?.familyMembers} family members</span>
                      </div>
                      {application.job?.childrenCount > 0 && (
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4 text-gray-500" />
                          <span>{application.job?.childrenCount} children</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-gray-500" />
                        <span>{application.job?.bedrooms} bedrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Current Step Details */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-semibold text-blue-900">
                            {getStepDescription(application.status)}
                          </div>
                          <div className="text-sm text-blue-700">
                            {getStepInstructions(application.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    {application.status === 'CONTRACT_SENT' && (
                      <Button
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => application.contractUrl && window.open(application.contractUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Review Contract
                      </Button>
                    )}
                    {application.status === 'VISA_PROCESSING' && (
                      <Button variant="outline">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                    )}
                    {application.status === 'FLIGHT_BOOKED' && (
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plane className="h-4 w-4 mr-2" />
                        View Flight Details
                      </Button>
                    )}
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Employer
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs to track your progress here.</p>
            <Button
              onClick={() => router.push('portals/worker/jobs')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Browse Jobs
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

function getProgressValue(status: string): number {
  const progressMap = {
    'PENDING': 20,
    'UNDER_REVIEW': 40,
    'ACCEPTED': 60,
    'CONTRACT_SENT': 70,
    'VISA_PROCESSING': 80,
    'FLIGHT_BOOKED': 90,
    'ARRIVED': 100
  }
  return progressMap[status as keyof typeof progressMap] || 0
}

function getStepDescription(status: string): string {
  const descriptions = {
    'PENDING': 'Application Under Review',
    'UNDER_REVIEW': 'Interview Stage',
    'ACCEPTED': 'Offer Accepted',
    'CONTRACT_SENT': 'Contract Ready for Review',
    'VISA_PROCESSING': 'Visa Processing',
    'FLIGHT_BOOKED': 'Flight Booked',
    'ARRIVED': 'Ready to Start Work'
  }
  return descriptions[status as keyof typeof descriptions] || 'Processing'
}

function getStepInstructions(status: string): string {
  const instructions = {
    'PENDING': 'Employer is reviewing your application. You will hear back soon.',
    'UNDER_REVIEW': 'Prepare for your interview. Check your email for schedule.',
    'ACCEPTED': 'Congratulations! The employer has accepted your application.',
    'CONTRACT_SENT': 'Please review the employment contract carefully before signing.',
    'VISA_PROCESSING': 'Upload required documents for your work visa processing.',
    'FLIGHT_BOOKED': 'Your flight to Oman has been booked. Check details above.',
    'ARRIVED': 'Welcome to Oman! Get ready to start your new position.'
  }
  return instructions[status as keyof typeof instructions] || 'Your application is being processed.'
}