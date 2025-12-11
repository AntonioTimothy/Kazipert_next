// app/portals/worker/dashboard/page.tsx - UPDATED FOR MOBILE & VERIFICATION
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import * as jobService from "@/lib/services/jobService"
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle,
  Clock4,
  XCircle,
  User,
  Award,
  MessageSquare,
  Eye,
  Users,
  Building,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Home,
  ShieldCheck,
  FileText,
  Zap,
  Heart,
  Target,
  BarChart3,
  AlertCircle
} from "lucide-react"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#6c71b5',
  accent: '#e53e3e',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function EmployeeDashboard() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  // Real data states
  const [applications, setApplications] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    interviewApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    profileViews: 0,
    profileStrength: 0,
    totalEarnings: 0
  })

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

      // Check if user needs verification
      if (!parsedUser.verified || !parsedUser.onboardingCompleted) {
        // Don't redirect automatically - just show the verification banner
        console.log('User needs verification, showing banner')
      }

      try {
        // Load applications and jobs using the jobService
        const [applicationsData, jobsData] = await Promise.all([
          jobService.getApplications({ role: 'employee' }),
          jobService.getJobs({ role: 'employee' })
        ])

        setApplications(applicationsData?.applications || [])
        setJobs(jobsData?.jobs || [])

        // Calculate stats from actual data
        const totalApplications = applicationsData?.applications?.length || 0
        const pendingApplications = applicationsData?.applications?.filter((app: any) =>
          app.status === 'PENDING' || app.status === 'UNDER_REVIEW'
        ).length || 0
        const interviewApplications = applicationsData?.applications?.filter((app: any) =>
          app.status === 'INTERVIEW_SCHEDULED' || app.status === 'INTERVIEW_COMPLETED'
        ).length || 0
        const acceptedApplications = applicationsData?.applications?.filter((app: any) =>
          app.status === 'ACCEPTED' || app.status === 'HIRED'
        ).length || 0
        const rejectedApplications = applicationsData?.applications?.filter((app: any) =>
          app.status === 'REJECTED'
        ).length || 0

        // Calculate total earnings from accepted applications
        const totalEarnings = applicationsData?.applications?.reduce((sum: number, app: any) => {
          if ((app.status === 'ACCEPTED' || app.status === 'HIRED') && app.expectedSalary) {
            return sum + (parseFloat(app.expectedSalary) || 0)
          }
          return sum
        }, 0) || 0

        // Get profile data from user session
        const profileStrength = parsedUser.profileCompletion || (parsedUser.verified ? 100 : 65)
        const profileViews = parsedUser.profileViews || 0

        setStats({
          totalApplications,
          pendingApplications,
          interviewApplications,
          acceptedApplications,
          rejectedApplications,
          profileViews,
          profileStrength,
          totalEarnings
        })

        // Check if profile is complete (verified and onboarding completed)
        const isProfileComplete = parsedUser.verified && parsedUser.onboardingCompleted
        setProfileComplete(isProfileComplete)

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Set default empty data
        setApplications([])
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Get recent applications (last 3)
  const recentApplications = applications.slice(0, 3)

  // Get upcoming interviews
  const upcomingInterviews = applications
    .filter((app: any) =>
      (app.status === 'INTERVIEW_SCHEDULED' || app.status === 'UNDER_REVIEW') &&
      app.interviewDate &&
      new Date(app.interviewDate) > new Date()
    )
    .slice(0, 2)

  // Quick stats for dashboard - Mobile optimized
  const quickStats = [
    {
      title: "Applications",
      value: stats.totalApplications.toString(),
      description: "Total applied",
      icon: FileText,
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      trend: stats.totalApplications > 0 ? "+" + Math.floor(stats.totalApplications * 0.2) : "0",
      route: "/portals/worker/applications"
    },
    {
      title: "Interviews",
      value: stats.interviewApplications.toString(),
      description: "Scheduled",
      icon: Calendar,
      color: KAZIPERT_COLORS.secondary,
      bgColor: `${KAZIPERT_COLORS.secondary}15`,
      trend: stats.interviewApplications > 0 ? "+" + Math.floor(stats.interviewApplications * 0.3) : "0",
      route: "/portals/worker/applications"
    },
    {
      title: "Profile Views",
      value: stats.profileViews.toString(),
      description: "Employer views",
      icon: Eye,
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      trend: stats.profileViews > 0 ? "+" + Math.floor(stats.profileViews * 0.1) : "0",
      route: "/portals/worker/profile"
    },
    {
      title: "Earnings",
      value: `${stats.totalEarnings} OMR`,
      description: "Potential income",
      icon: DollarSign,
      color: KAZIPERT_COLORS.secondary,
      bgColor: `${KAZIPERT_COLORS.secondary}15`,
      trend: stats.totalEarnings > 0 ? "+" + Math.floor(stats.totalEarnings * 0.15) + " OMR" : "0 OMR",
      route: "/portals/worker/payments"
    }
  ]

  const quickActions = [
    {
      name: "Find Jobs",
      description: "Browse opportunities",
      icon: Briefcase,
      action: "find-jobs",
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      route: "/portals/worker/jobs"
    },
    {
      name: "My Applications",
      description: "View applications",
      icon: FileText,
      action: "view-applications",
      color: KAZIPERT_COLORS.secondary,
      bgColor: `${KAZIPERT_COLORS.secondary}15`,
      route: "/portals/worker/applications"
    },
    {
      name: "My Profile",
      description: profileComplete ? "View profile" : "Complete verification",
      icon: User,
      action: profileComplete ? "view-profile" : "verify-profile",
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      route: profileComplete ? "/portals/worker/profile" : "/portals/worker/verification"
    },
    {
      name: "Messages",
      description: "Chat with employers",
      icon: MessageSquare,
      action: "messages",
      color: KAZIPERT_COLORS.secondary,
      bgColor: `${KAZIPERT_COLORS.secondary}15`,
      route: "/portals/worker/support"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'UNDER_REVIEW': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'INTERVIEW_SCHEDULED': return 'bg-purple-500/10 text-purple-600 border-purple-200'
      case 'INTERVIEW_COMPLETED': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
      case 'ACCEPTED': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'HIRED': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-200'
      case 'WITHDRAWN': return 'bg-gray-500/10 text-gray-600 border-gray-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Applied'
      case 'UNDER_REVIEW': return 'Under Review'
      case 'INTERVIEW_SCHEDULED': return 'Interview'
      case 'INTERVIEW_COMPLETED': return 'Interview Done'
      case 'ACCEPTED': return 'Accepted'
      case 'HIRED': return 'Hired'
      case 'REJECTED': return 'Not Selected'
      case 'WITHDRAWN': return 'Withdrawn'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'UNDER_REVIEW':
        return <Clock4 className="h-4 w-4 text-blue-500" />
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_COMPLETED':
        return <Calendar className="h-4 w-4 text-purple-500" />
      case 'ACCEPTED':
      case 'HIRED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently'

    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
      return
    }

    switch (action) {
      case 'find-jobs':
        router.push('/portals/worker/jobs')
        break
      case 'view-applications':
        router.push('/portals/worker/applications')
        break
      case 'verify-profile':
      case 'view-profile':
        router.push('/portals/worker/verification')
        break
      case 'messages':
        router.push('/portals/worker/messages')
        break
    }
  }

  // Skeleton loading components
  const StatSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-2 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )

  const ActionSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-9 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <ActionSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header Section - Mobile Optimized */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2" style={{ borderColor: KAZIPERT_COLORS.primary }}>
              <AvatarFallback
                className="text-white font-semibold text-sm sm:text-base"
                style={{ backgroundColor: KAZIPERT_COLORS.primary }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[180px] sm:max-w-none">
              <h1 className="font-bold text-lg sm:text-xl truncate" style={{ color: KAZIPERT_COLORS.text }}>
                Welcome back, {user?.firstName}! 👋
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs sm:text-sm flex items-center gap-1 truncate" style={{ color: KAZIPERT_COLORS.textLight }}>
                  <User className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: KAZIPERT_COLORS.primary }} />
                  Domestic Worker
                </p>
                {profileComplete && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-200 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => router.push('/portals/worker/jobs')}
            style={{
              backgroundColor: KAZIPERT_COLORS.primary,
              color: 'white'
            }}
            className="hover:opacity-90 transition-opacity text-xs sm:text-sm"
          >
            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Find Jobs</span>
            <span className="sm:hidden">Jobs</span>
          </Button>
        </div>

        {/* Verification Banner - Show if not verified */}
        {!profileComplete && (
          <Card
            className="border-0 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${KAZIPERT_COLORS.primary}15 0%, ${KAZIPERT_COLORS.secondary}10 100%)`,
              border: `1px solid ${KAZIPERT_COLORS.primary}30`
            }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary + '20' }}
                  >
                    <AlertCircle className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.text }}>
                      Complete Your Verification
                    </h3>
                    <p className="text-xs sm:text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                      Verify your identity to get more job matches and increase hiring chances
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/portals/worker/verification')}
                  style={{
                    backgroundColor: KAZIPERT_COLORS.primary,
                    color: 'white'
                  }}
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Start Verification
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span style={{ color: KAZIPERT_COLORS.textLight }}>Progress</span>
                  <span style={{ color: KAZIPERT_COLORS.primary }}>{stats.profileStrength}%</span>
                </div>
                <Progress
                  value={stats.profileStrength}
                  className="h-2 bg-white/50"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
              onClick={() => handleQuickAction(stat.action, stat.route)}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{ color: stat.color }}
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs border-0"
                  style={{
                    backgroundColor: stat.bgColor,
                    color: stat.color
                  }}
                >
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <div
                  className="text-lg sm:text-2xl font-bold truncate"
                  style={{ color: KAZIPERT_COLORS.text }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs sm:text-sm font-medium truncate"
                  style={{ color: KAZIPERT_COLORS.text }}
                >
                  {stat.title}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: KAZIPERT_COLORS.textLight }}
                >
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-bold text-base sm:text-lg" style={{ color: KAZIPERT_COLORS.text }}>
              Quick Actions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              style={{ color: KAZIPERT_COLORS.primary }}
              className="text-xs sm:text-sm"
            >
              View all
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => handleQuickAction(action.action, action.route)}
                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group text-left"
              >
                <div
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3"
                  style={{ backgroundColor: action.bgColor }}
                >
                  <action.icon
                    className="h-4 w-4 sm:h-6 sm:w-6"
                    style={{ color: action.color }}
                  />
                </div>
                <div className="space-y-1">
                  <div
                    className="font-semibold text-sm sm:text-base group-hover:underline transition-colors truncate"
                    style={{ color: KAZIPERT_COLORS.text }}
                  >
                    {action.name}
                  </div>
                  <div
                    className="text-xs sm:text-sm truncate"
                    style={{ color: KAZIPERT_COLORS.textLight }}
                  >
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout for Main Content - Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Applications */}
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.text }}>
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  Recent Applications ({recentApplications.length})
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your most recent job applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {recentApplications.length > 0 ? (
                  recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/portals/worker/applications`)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
                          {getStatusIcon(application.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs sm:text-sm truncate" style={{ color: KAZIPERT_COLORS.text }}>
                            {application.job?.title || 'Household Position'}
                          </div>
                          <div className="text-xs truncate" style={{ color: KAZIPERT_COLORS.textLight }}>
                            {application.job?.employer?.companyName || 'Private Family'}
                          </div>
                          {application.expectedSalary && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              {application.expectedSalary} OMR
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <Badge className={cn("text-xs mb-1", getStatusColor(application.status))}>
                          {getStatusText(application.status)}
                        </Badge>
                        <div className="text-xs" style={{ color: KAZIPERT_COLORS.textLight }}>
                          {formatDate(application.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">No applications yet</p>
                    <Button
                      variant="outline"
                      className="mt-2 text-xs sm:text-sm"
                      onClick={() => router.push('/portals/worker/jobs')}
                    >
                      Find Jobs
                    </Button>
                  </div>
                )}
              </CardContent>
              {recentApplications.length > 0 && (
                <CardFooter className="pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-xs sm:text-sm"
                    style={{ color: KAZIPERT_COLORS.primary }}
                    onClick={() => router.push('/portals/worker/applications')}
                  >
                    <span>View All Applications</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Application Statistics */}
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.text }}>
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  Application Statistics
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your job application performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm" style={{ color: KAZIPERT_COLORS.text }}>Pending Review</span>
                  <span className="font-semibold text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.primary }}>{stats.pendingApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm" style={{ color: KAZIPERT_COLORS.text }}>Interviews</span>
                  <span className="font-semibold text-sm sm:text-base text-purple-600">{stats.interviewApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm" style={{ color: KAZIPERT_COLORS.text }}>Accepted</span>
                  <span className="font-semibold text-sm sm:text-base text-green-600">{stats.acceptedApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm" style={{ color: KAZIPERT_COLORS.text }}>Not Selected</span>
                  <span className="font-semibold text-sm sm:text-base text-red-600">{stats.rejectedApplications}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs sm:text-sm font-medium" style={{ color: KAZIPERT_COLORS.text }}>Total Applications</span>
                  <span className="font-bold text-base sm:text-lg" style={{ color: KAZIPERT_COLORS.primary }}>{stats.totalApplications}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Upcoming Interviews */}
            {upcomingInterviews.length > 0 && (
              <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.text }}>
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: KAZIPERT_COLORS.secondary }} />
                    Upcoming Interviews ({upcomingInterviews.length})
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your scheduled interviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div
                          className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: KAZIPERT_COLORS.secondary + '15' }}
                        >
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: KAZIPERT_COLORS.secondary }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs sm:text-sm truncate" style={{ color: KAZIPERT_COLORS.text }}>
                            {interview.job?.title || 'Household Position'}
                          </div>
                          <div className="text-xs truncate" style={{ color: KAZIPERT_COLORS.textLight }}>
                            {interview.job?.employer?.companyName || 'Private Family'}
                          </div>
                          {interview.interviewDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(interview.interviewDate).toLocaleDateString()}</span>
                              {interview.interviewTime && (
                                <>
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  <span>{interview.interviewTime}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 text-xs flex-shrink-0 ml-2">
                        Scheduled
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Profile Strength */}
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.text }}>
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  Profile Strength
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {profileComplete ? 'Your profile is complete!' : 'Complete your profile to get more job matches'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Profile Completion</span>
                    <span className="font-semibold">{stats.profileStrength}%</span>
                  </div>
                  <Progress value={stats.profileStrength} className="h-2" />
                </div>

                {!profileComplete && (
                  <>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Basic Information</span>
                        <Badge className={stats.profileStrength >= 30 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {stats.profileStrength >= 30 ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Identity Verification</span>
                        <Badge className={user.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {user.verified ? "Complete" : "Required"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Documents & Certificates</span>
                        <Badge className={stats.profileStrength >= 90 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {stats.profileStrength >= 90 ? "Complete" : "Missing"}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      className="w-full text-xs sm:text-sm"
                      onClick={() => router.push('/portals/worker/verification')}
                      style={{
                        backgroundColor: KAZIPERT_COLORS.primary,
                        color: 'white'
                      }}
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Complete Verification
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base" style={{ color: KAZIPERT_COLORS.text }}>
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: KAZIPERT_COLORS.secondary }} />
                  Quick Tips
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Tips to improve your job search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-blue-50">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-xs sm:text-sm text-blue-900">Complete Your Profile</div>
                    <div className="text-xs text-blue-700">Full profiles get 3x more views</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-green-50">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-xs sm:text-sm text-green-900">Apply Early</div>
                    <div className="text-xs text-green-700">Apply within 2 hours for best chances</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-purple-50">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-xs sm:text-sm text-purple-900">Respond Quickly</div>
                    <div className="text-xs text-purple-700">Reply to messages within 24 hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}