"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import * as jobService from "@/lib/services/jobService"
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Video,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Shield,
  GraduationCap,
  BookOpen,
  Heart,
  Baby,
  Dog,
  Home,
  Utensils,
  Car,
  Sparkles,
  ArrowLeft,
  Send,
  Download,
  FileCheck,
  Plane,
  CreditCard,
  UserCheck,
  ShieldCheck,
  FileSearch
} from "lucide-react"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82',
  accent: '#6c71b5',
  brown: '#8B7355',
  background: '#f8fafc',
  backgroundLight: '#ffffff',
  text: '#1a202c',
  textLight: '#718096',
  border: '#e2e8f0'
}

export default function EmployerApplicationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

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
        const [applicationsData, jobsData] = await Promise.all([
          jobService.getApplications({ role: 'employer', userId: parsedUser.id }),
          jobService.getJobs({ role: 'employer', status: 'ACTIVE', userId: parsedUser.id })
        ])

        setApplications(applicationsData.applications || [])
        setJobs(jobsData.jobs || [])

        // Check if there's a specific application to show
        const applicationId = searchParams.get('application')
        if (applicationId && applicationsData.applications) {
          const app = applicationsData.applications.find((a: any) => a.id === applicationId)
          if (app) setSelectedApplication(app)
        }

      } catch (error) {
        console.error('Error loading applications:', error)
        setApplications([])
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, searchParams])

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    // Check for single shortlist constraint
    if (status === 'SHORTLISTED') {
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        const existingShortlist = applications.find(a =>
          a.jobId === app.jobId &&
          a.id !== applicationId &&
          ['SHORTLISTED', 'CONTRACT_SENT', 'VISA_PROCESSING', 'FLIGHT_BOOKED', 'ARRIVED'].includes(a.status)
        );

        if (existingShortlist) {
          alert(`You have already shortlisted ${existingShortlist.employee?.firstName} for this job. You can only shortlist one candidate per job.`);
          return;
        }
      }
    }

    try {
      if (status === 'CONTRACT_SENT') {
        // Trigger contract generation and email
        // 1. Generate PDF
        const genRes = await fetch(`/api/contracts/generate/${applicationId}`);
        if (!genRes.ok) throw new Error('Failed to generate contract');
        
        // 2. Send Email (this also updates status to CONTRACT_SENT)
        const emailRes = await fetch(`/api/email/send-contract/${applicationId}`, { method: 'POST' });
        if (!emailRes.ok) throw new Error('Failed to send contract email');
      } else {
        // Use Server Action for other status updates
        await jobService.updateApplicationStep(applicationId, status);
      }

      // Update local state
      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status } : app
      ))

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(prev => ({ ...prev, status }))
      }
      
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'UNDER_REVIEW': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'ACCEPTED': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-200'
      case 'CONTRACT_SENT': return 'bg-purple-500/10 text-purple-600 border-purple-200'
      case 'VISA_PROCESSING': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
      case 'FLIGHT_BOOKED': return 'bg-teal-500/10 text-teal-600 border-teal-200'
      case 'ARRIVED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'New Application'
      case 'UNDER_REVIEW': return 'Interview Stage'
      case 'ACCEPTED': return 'Offer Accepted'
      case 'REJECTED': return 'Rejected'
      case 'CONTRACT_SENT': return 'Contract Sent'
      case 'VISA_PROCESSING': return 'Visa Processing'
      case 'FLIGHT_BOOKED': return 'Flight Booked'
      case 'ARRIVED': return 'Employee Arrived'
      default: return status.replace('_', ' ')
    }
  }

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true
    return app.status === activeTab
  })

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/employer/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
              <p className="text-gray-600">Manage and review candidate applications</p>
            </div>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {applications.length} Total Applications
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="PENDING">New</TabsTrigger>
                <TabsTrigger value="UNDER_REVIEW">Interview</TabsTrigger>
                <TabsTrigger value="ACCEPTED">Accepted</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4 mt-4">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <Card
                      key={application.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${selectedApplication?.id === application.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {application.employee?.firstName?.charAt(0)}{application.employee?.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {application.employee?.firstName} {application.employee?.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{application.job?.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusText(application.status)}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Applied {new Date(application.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {application.expectedSalary || application.job?.salary} OMR
                            </div>
                            <div className="text-sm text-gray-600">Expected</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-600">No applications match your current filters.</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Application Details */}
          <div className="space-y-6">
            {selectedApplication ? (
              <ApplicationDetails
                application={selectedApplication}
                onStatusUpdate={updateApplicationStatus}
              />
            ) : (
              <Card className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Application</h3>
                <p className="text-gray-600">Choose an application to view details and take action.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ApplicationDetails({ application, onStatusUpdate }: { application: any, onStatusUpdate: (id: string, status: string) => void }) {
  const [activeStep, setActiveStep] = useState(0)

  const hiringSteps = [
    { step: 1, status: 'PENDING', title: 'Application Received', description: 'Candidate has applied', icon: FileText },
    { step: 2, status: 'UNDER_REVIEW', title: 'Interview Stage', description: 'Schedule and conduct interviews', icon: Video },
    { step: 3, status: 'SHORTLISTED', title: 'Shortlisted', description: 'Candidate selected for the role', icon: Star },
    { step: 4, status: 'CONTRACT_SENT', title: 'Contract Sent', description: 'Digital contract prepared', icon: FileCheck },
    { step: 5, status: 'VISA_PROCESSING', title: 'Visa Processing', description: 'Work visa application', icon: ShieldCheck },
    { step: 6, status: 'FLIGHT_BOOKED', title: 'Flight Booked', description: 'Travel arrangements made', icon: Plane },
    { step: 7, status: 'ARRIVED', title: 'Employee Arrived', description: 'Ready to start work', icon: UserCheck }
  ]

  const currentStepIndex = hiringSteps.findIndex(step => step.status === application.status)

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {application.employee?.firstName?.charAt(0)}{application.employee?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div>{application.employee?.firstName} {application.employee?.lastName}</div>
            <div className="text-sm font-normal text-gray-600">{application.job?.title}</div>
          </div>
        </CardTitle>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Application Progress</span>
            <span className="font-medium text-[#117c82]">{Math.round(((currentStepIndex + 1) / hiringSteps.length) * 100)}%</span>
          </div>
          <Progress value={((currentStepIndex + 1) / hiringSteps.length) * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hiring Progress */}
        <div className="space-y-4">
          <h4 className="font-semibold">Hiring Progress</h4>
          <div className="space-y-3">
            {hiringSteps.map((step, index) => (
              <div key={step.step} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${index <= currentStepIndex
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStepIndex + 1
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300 text-gray-400'
                  }`}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${index <= currentStepIndex ? 'text-green-600' : 'text-gray-600'
                    }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Information */}
        <div className="space-y-3">
          <h4 className="font-semibold">Candidate Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Expected Salary</div>
              <div className="font-semibold">{application.expectedSalary || application.job?.salary} OMR</div>
            </div>
            <div>
              <div className="text-gray-600">Experience</div>
              <div className="font-semibold">{application.employee?.kycDetails?.workExperience || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-gray-600">Location</div>
              <div className="font-semibold">{application.employee?.country || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-gray-600">Languages</div>
              <div className="font-semibold">
                {application.employee?.kycDetails?.languages ?
                  Object.keys(application.employee.kycDetails.languages).join(', ') :
                  'Not specified'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="space-y-2">
            <h4 className="font-semibold">Cover Letter</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <h4 className="font-semibold">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {application.status === 'PENDING' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(application.id, 'UNDER_REVIEW')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusUpdate(application.id, 'REJECTED')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            {application.status === 'UNDER_REVIEW' && (
              <>
                <Button
                  onClick={() => onStatusUpdate(application.id, 'SHORTLISTED')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Shortlist Candidate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onStatusUpdate(application.id, 'REJECTED')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            {application.status === 'SHORTLISTED' && (
              <Button
                onClick={() => onStatusUpdate(application.id, 'CONTRACT_SENT')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Generate Contract
              </Button>
            )}
            {application.status === 'CONTRACT_SENT' && (
              <Button
                onClick={() => onStatusUpdate(application.id, 'VISA_PROCESSING')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Start Visa Process
              </Button>
            )}
            {application.status === 'VISA_PROCESSING' && (
              <Button
                onClick={() => onStatusUpdate(application.id, 'FLIGHT_BOOKED')}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plane className="h-4 w-4 mr-2" />
                Book Flight
              </Button>
            )}
            {application.status === 'FLIGHT_BOOKED' && (
              <Button
                onClick={() => onStatusUpdate(application.id, 'ARRIVED')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Confirm Arrival
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}