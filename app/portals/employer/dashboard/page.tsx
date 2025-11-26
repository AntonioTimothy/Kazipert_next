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
import { jobService } from "@/lib/services/jobService"
import {
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  MapPin,
  Send,
  Video,
  MessageSquare,
  User,
  FileCheck,
  Target,
  Shield,
  Heart,
  Zap,
  Sparkles,
  TrendingUp,
  Calendar,
  Award,
  Wallet,
  CheckCircle,
  Star,
  Users,
  Building,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Home,
  Utensils,
  ShieldCheck,
  BadgeCheck,
  Coins,
  Building2,
  Eye,
  Search,
  BookOpen,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  CreditCard,
  MessageCircle,
  Ticket,
  Settings,
  Bell,
  FileSearch,
  HeartHandshake,
  Plane,
  GraduationCap,
  Shield as ShieldIcon,
  LucideIcon,
  UserPlus,
  BarChart3,
  Settings as SettingsIcon,
  Download,
  Upload,
  HeartPulse,
  ShieldOff,
  Crown,
  Zap as ZapIcon,
  Target as TargetIcon,
  Users as UsersIcon,
  Home as HomeIcon,
  Baby,
  Dog,
  Car,
  Wifi,
  UtensilsCrossed,
  Shirt,
  Scissors,
  TrendingDown,
  AlertCircle,
  Clock3,
  UserCheck,
  FileWarning,
  CalendarDays,
  DollarSign as DollarIcon,
  Percent,
  BarChart4
} from "lucide-react"

// Define color scheme
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

export default function EmployerDashboard() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  // Real data states
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    reviewedApplications: 0,
    acceptedApplications: 0,
    totalViews: 0,
    totalSpent: 0,
    avgSalary: 0,
    interviewRate: 0
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
      if (parsedUser.role !== "EMPLOYER") {
        router.push("/login")
        return
      }

      setUser(parsedUser)

      try {
        // Load all jobs for stats
        const [activeJobs, draftJobs, closedJobs, allApplications] = await Promise.all([
          jobService.getJobs({ role: 'employer', status: 'ACTIVE' }),
          jobService.getJobs({ role: 'employer', status: 'DRAFT' }),
          jobService.getJobs({ role: 'employer', status: 'CLOSED' }),
          jobService.getApplications({ role: 'employer' })
        ])

        const allJobs = [
          ...(activeJobs.jobs || []),
          ...(draftJobs.jobs || []),
          ...(closedJobs.jobs || [])
        ]

        setJobs(allJobs)
        setApplications(allApplications || [])

        // Calculate stats
        const totalViews = allJobs.reduce((sum, job) => sum + (job._count?.views || 0), 0)
        const totalSpent = allJobs.reduce((sum, job) => sum + (job.salary || 0), 0)
        const avgSalary = allJobs.length > 0 ? totalSpent / allJobs.length : 0

        const pendingApplications = allApplications.filter(app => app.status === 'PENDING').length
        const reviewedApplications = allApplications.filter(app => app.status === 'UNDER_REVIEW').length
        const acceptedApplications = allApplications.filter(app => app.status === 'ACCEPTED').length
        const interviewRate = allApplications.length > 0 ? (reviewedApplications / allApplications.length) * 100 : 0

        setStats({
          totalJobs: allJobs.length,
          activeJobs: activeJobs.jobs?.length || 0,
          draftJobs: draftJobs.jobs?.length || 0,
          closedJobs: closedJobs.jobs?.length || 0,
          totalApplications: allApplications.length,
          pendingApplications,
          reviewedApplications,
          acceptedApplications,
          totalViews,
          totalSpent,
          avgSalary,
          interviewRate
        })

        // Mock profile completion check
        const isProfileComplete = parsedUser.onboardingCompleted || Math.random() > 0.3
        setProfileComplete(isProfileComplete)

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Set default empty data
        setJobs([])
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Get recent applications (last 5)
  const recentApplications = applications.slice(0, 5)

  // Get active employees (accepted applications)
  const activeEmployees = applications.filter(app => app.status === 'ACCEPTED')

  // Get upcoming interviews (applications under review)
  const upcomingInterviews = applications.filter(app => app.status === 'UNDER_REVIEW').slice(0, 3)

  // Quick stats for dashboard
  const quickStats = [
    {
      title: "Active Jobs",
      value: stats.activeJobs.toString(),
      description: "Live postings",
      icon: Briefcase,
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      trend: stats.activeJobs > 0 ? "+" + Math.floor(stats.activeJobs * 0.5) : "0",
      route: "/employer/jobs?tab=posted"
    },
    {
      title: "Applications",
      value: stats.totalApplications.toString(),
      description: "Total received",
      icon: FileText,
      color: KAZIPERT_COLORS.accent,
      bgColor: `${KAZIPERT_COLORS.accent}15`,
      trend: stats.totalApplications > 0 ? "+" + Math.floor(stats.totalApplications * 0.3) : "0",
      route: "/employer/applications"
    },
    {
      title: "Interviews",
      value: stats.reviewedApplications.toString(),
      description: "Scheduled",
      icon: Calendar,
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      trend: stats.reviewedApplications > 0 ? "+" + Math.floor(stats.reviewedApplications * 0.4) : "0",
      route: "/employer/applications"
    },
    {
      title: "Active Staff",
      value: activeEmployees.length.toString(),
      description: "Current employees",
      icon: Users,
      color: KAZIPERT_COLORS.accent,
      bgColor: `${KAZIPERT_COLORS.accent}15`,
      trend: activeEmployees.length > 0 ? "+" + activeEmployees.length : "0",
      route: "/employer/employees"
    }
  ]

  // Performance metrics
  const performanceMetrics = [
    {
      name: "Application Rate",
      value: stats.totalJobs > 0 ? (stats.totalApplications / stats.totalJobs).toFixed(1) : "0",
      description: "Apps per job",
      icon: TrendingUp,
      color: stats.totalApplications / stats.totalJobs > 2 ? "text-green-600" : "text-amber-600",
      change: "+12%"
    },
    {
      name: "Interview Rate",
      value: `${Math.round(stats.interviewRate)}%`,
      description: "Of applications",
      icon: UserCheck,
      color: stats.interviewRate > 30 ? "text-green-600" : "text-amber-600",
      change: "+5%"
    },
    {
      name: "Avg. Salary",
      value: `${Math.round(stats.avgSalary)} OMR`,
      description: "Per month",
      icon: DollarIcon,
      color: "text-blue-600",
      change: stats.avgSalary > 300 ? "+8%" : "-2%"
    },
    {
      name: "Job Views",
      value: stats.totalViews.toString(),
      description: "Total impressions",
      icon: Eye,
      color: "text-purple-600",
      change: stats.totalViews > 50 ? "+15%" : "-5%"
    }
  ]

  const quickActions = [
    {
      name: "Post New Job",
      description: "Find domestic help",
      icon: Plus,
      action: "post-job",
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      route: "/employer/jobs/create"
    },
    {
      name: "View Applications",
      description: "Review candidates",
      icon: FileCheck,
      action: "view-applications",
      color: KAZIPERT_COLORS.accent,
      bgColor: `${KAZIPERT_COLORS.accent}15`,
      route: "/employer/applications"
    },
    {
      name: "Employee Management",
      description: "Manage current staff",
      icon: Users,
      action: "manage-employees",
      color: KAZIPERT_COLORS.primary,
      bgColor: `${KAZIPERT_COLORS.primary}15`,
      route: "/employer/employees"
    },
    {
      name: "Payment History",
      description: "View transactions",
      icon: Wallet,
      action: "payments",
      color: KAZIPERT_COLORS.accent,
      bgColor: `${KAZIPERT_COLORS.accent}15`,
      route: "/employer/payments"
    }
  ]

  const kazipertServices = [
    {
      name: "Premium Recruitment",
      description: "Priority candidate access",
      active: true,
      icon: Crown,
      color: KAZIPERT_COLORS.primary,
      status: "active"
    },
    {
      name: "Legal Support",
      description: "Contract and visa assistance",
      active: true,
      icon: ShieldCheck,
      color: KAZIPERT_COLORS.accent,
      status: "active"
    },
    {
      name: "Health Insurance",
      description: "Employee medical coverage",
      active: false,
      icon: HeartPulse,
      color: KAZIPERT_COLORS.primary,
      status: "available"
    },
    {
      name: "Replacement Guarantee",
      description: "90-day replacement period",
      active: true,
      icon: ZapIcon,
      color: KAZIPERT_COLORS.accent,
      status: "active"
    }
  ]

  const domesticWorkerCategories = [
    {
      name: "Housekeeper",
      icon: HomeIcon,
      count: 45,
      popular: true
    },
    {
      name: "Nanny",
      icon: Baby,
      count: 32,
      popular: true
    },
    {
      name: "Cook",
      icon: UtensilsCrossed,
      count: 28,
      popular: false
    },
    {
      name: "Driver",
      icon: Car,
      count: 19,
      popular: false
    },
    {
      name: "Elderly Care",
      icon: Heart,
      count: 15,
      popular: true
    },
    {
      name: "Gardener",
      icon: Trees,
      count: 12,
      popular: false
    }
  ]

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
      return
    }

    switch (action) {
      case 'post-job':
        router.push('/employer/jobs/create')
        break
      case 'view-applications':
        router.push('/employer/applications')
        break
      case 'manage-employees':
        router.push('/employer/employees')
        break
      case 'payments':
        router.push('/employer/payments')
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'UNDER_REVIEW': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'ACCEPTED': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-200'
      case 'WITHDRAWN': return 'bg-gray-500/10 text-gray-600 border-gray-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'New'
      case 'UNDER_REVIEW': return 'Interview'
      case 'ACCEPTED': return 'Hired'
      case 'REJECTED': return 'Rejected'
      case 'WITHDRAWN': return 'Withdrawn'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
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
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2" style={{ borderColor: KAZIPERT_COLORS.primary }}>
              <AvatarFallback
                className="text-white font-semibold"
                style={{ backgroundColor: KAZIPERT_COLORS.primary }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-xl" style={{ color: KAZIPERT_COLORS.text }}>
                Welcome back, {user?.firstName}! 👋
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm flex items-center gap-1" style={{ color: KAZIPERT_COLORS.textLight }}>
                  <Building2 className="h-4 w-4" style={{ color: KAZIPERT_COLORS.primary }} />
                  Employer • {user?.city || 'Muscat, Oman'}
                </p>
                {profileComplete && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-200 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Profile Complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => router.push('/employer/jobs/create')}
            style={{
              backgroundColor: KAZIPERT_COLORS.primary,
              color: 'white'
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-1" />
            Post Job
          </Button>
        </div>

        {/* Verification Banner - Show if user is not verified */}
        {!user.verified && (
          <Card
            className="border-0 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${KAZIPERT_COLORS.primary} 0%, ${KAZIPERT_COLORS.accent} 100%)`,
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl bg-white/20 backdrop-blur-sm"
                  >
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1">
                      Verify Your Account
                    </h3>
                    <p className="text-white/90 text-sm">
                      Complete verification to post jobs and access all employer features. Quick and secure process.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/portals/employer/verification')}
                  className="bg-white hover:bg-white/90 font-bold shadow-lg"
                  style={{
                    color: KAZIPERT_COLORS.primary
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Completion Banner */}
        {!profileComplete && (
          <Card
            className="border-0 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${KAZIPERT_COLORS.primary}15 0%, ${KAZIPERT_COLORS.accent}10 100%)`,
              border: `1px solid ${KAZIPERT_COLORS.primary}30`
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary + '20' }}
                  >
                    <User className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: KAZIPERT_COLORS.text }}>
                      Complete Your Employer Profile
                    </h3>
                    <p className="text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                      Finish setting up your profile to access all features and find the perfect domestic help
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/portals/employer/verification')}
                  style={{
                    backgroundColor: KAZIPERT_COLORS.primary,
                    color: 'white'
                  }}
                >
                  Complete Profile
                </Button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: KAZIPERT_COLORS.textLight }}>Progress</span>
                  <span style={{ color: KAZIPERT_COLORS.primary }}>65%</span>
                </div>
                <Progress
                  value={65}
                  className="h-2 bg-white/50"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-4 border border-gray-200 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
              onClick={() => handleQuickAction(stat.action, stat.route)}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon
                    className="h-5 w-5"
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
                  className="text-2xl font-bold"
                  style={{ color: KAZIPERT_COLORS.text }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: KAZIPERT_COLORS.text }}
                >
                  {stat.title}
                </div>
                <div
                  className="text-xs"
                  style={{ color: KAZIPERT_COLORS.textLight }}
                >
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg" style={{ color: KAZIPERT_COLORS.text }}>
              Quick Actions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              style={{ color: KAZIPERT_COLORS.primary }}
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => handleQuickAction(action.action, action.route)}
                className="bg-white rounded-2xl p-4 border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group text-left"
              >
                <div
                  className="p-3 rounded-xl w-fit mb-3"
                  style={{ backgroundColor: action.bgColor }}
                >
                  <action.icon
                    className="h-6 w-6"
                    style={{ color: action.color }}
                  />
                </div>
                <div className="space-y-1">
                  <div
                    className="font-semibold group-hover:underline transition-colors"
                    style={{ color: KAZIPERT_COLORS.text }}
                  >
                    {action.name}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: KAZIPERT_COLORS.textLight }}
                  >
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Active Employees */}
            {activeEmployees.length > 0 && (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                    <Users className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                    Active Employees ({activeEmployees.length})
                  </CardTitle>
                  <CardDescription>
                    Currently working in your household
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeEmployees.slice(0, 3).map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback
                            className="text-white text-sm"
                            style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                          >
                            {employee.employee?.firstName?.charAt(0)}{employee.employee?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium" style={{ color: KAZIPERT_COLORS.text }}>
                            {employee.employee?.firstName} {employee.employee?.lastName}
                          </div>
                          <div className="text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                            {employee.job?.title} • Hired {formatDate(employee.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold" style={{ color: KAZIPERT_COLORS.primary }}>
                          {employee.expectedSalary || employee.job?.salary} OMR
                        </div>
                        <Badge className="bg-green-500/10 text-green-600 border-green-200 text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    style={{ color: KAZIPERT_COLORS.primary }}
                    onClick={() => router.push('/employer/employees')}
                  >
                    <span>Manage All Employees</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Recent Applications */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                  <UserPlus className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  Recent Applications ({recentApplications.length})
                </CardTitle>
                <CardDescription>
                  New candidates for your positions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentApplications.length > 0 ? (
                  recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/employer/applications`)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className="text-white text-xs"
                            style={{ backgroundColor: KAZIPERT_COLORS.accent }}
                          >
                            {application.employee?.firstName?.charAt(0)}{application.employee?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-medium text-sm" style={{ color: KAZIPERT_COLORS.text }}>
                            {application.employee?.firstName} {application.employee?.lastName}
                          </div>
                          <div className="text-xs" style={{ color: KAZIPERT_COLORS.textLight }}>
                            {application.job?.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
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
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No applications yet</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => router.push('/employer/jobs/create')}
                    >
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </CardContent>
              {recentApplications.length > 0 && (
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    style={{ color: KAZIPERT_COLORS.primary }}
                    onClick={() => router.push('/employer/applications')}
                  >
                    <span>View All Applications</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            {upcomingInterviews.length > 0 && (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                    <Calendar className="h-5 w-5" style={{ color: KAZIPERT_COLORS.accent }} />
                    Upcoming Interviews ({upcomingInterviews.length})
                  </CardTitle>
                  <CardDescription>
                    Scheduled candidate interviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: KAZIPERT_COLORS.accent + '15' }}
                        >
                          <Video className="h-4 w-4" style={{ color: KAZIPERT_COLORS.accent }} />
                        </div>
                        <div>
                          <div className="font-medium text-sm" style={{ color: KAZIPERT_COLORS.text }}>
                            {interview.employee?.firstName} {interview.employee?.lastName}
                          </div>
                          <div className="text-xs" style={{ color: KAZIPERT_COLORS.textLight }}>
                            {interview.job?.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 text-xs">
                          Scheduled
                        </Badge>
                        <div className="text-xs mt-1" style={{ color: KAZIPERT_COLORS.textLight }}>
                          To be scheduled
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Job Status Overview */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                  <Briefcase className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  Job Status Overview
                </CardTitle>
                <CardDescription>
                  Your job postings at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: KAZIPERT_COLORS.text }}>Active Jobs</span>
                  <span className="font-semibold" style={{ color: KAZIPERT_COLORS.primary }}>{stats.activeJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: KAZIPERT_COLORS.text }}>Draft Jobs</span>
                  <span className="font-semibold text-amber-600">{stats.draftJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: KAZIPERT_COLORS.text }}>Closed Jobs</span>
                  <span className="font-semibold text-gray-600">{stats.closedJobs}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium" style={{ color: KAZIPERT_COLORS.text }}>Total Jobs</span>
                  <span className="font-bold text-lg" style={{ color: KAZIPERT_COLORS.primary }}>{stats.totalJobs}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  style={{ color: KAZIPERT_COLORS.primary }}
                  onClick={() => router.push('/employer/jobs')}
                >
                  <span>Manage All Jobs</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Kazipert Services */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                  <ShieldCheck className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                  Your Kazipert Services
                </CardTitle>
                <CardDescription>
                  Active and available services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {kazipertServices.map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: service.color + '15' }}
                      >
                        <service.icon className="h-4 w-4" style={{ color: service.color }} />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: KAZIPERT_COLORS.text }}>
                          {service.name}
                        </div>
                        <div className="text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                          {service.description}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        service.status === 'active'
                          ? "bg-green-500/10 text-green-600 border-green-200"
                          : "bg-blue-500/10 text-blue-600 border-blue-200"
                      )}
                    >
                      {service.status === 'active' ? 'Active' : 'Available'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  style={{ color: KAZIPERT_COLORS.primary }}
                  onClick={() => router.push('/employer/services')}
                >
                  <span>Explore All Services</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>


      </div>
    </div>
  )
}

// Missing icon component
const Trees = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 17h12M8 21h12M8 13h12M4 17h.01M4 21h.01M4 13h.01M4 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z" />
  </svg>
)