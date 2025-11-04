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
  Scissors
} from "lucide-react"

// Define color scheme
const KAZIPERT_COLORS = {
  primary: '#117c82',    // Teal - Main brand color
  secondary: '#117c82',  // Same teal but used sparingly
  accent: '#6c71b5',     // Purple accent for highlights
  brown: '#8B7355',      // Professional brown for backgrounds
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
  const [hasActiveEmployees, setHasActiveEmployees] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
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
      
      // Mock profile completion check (replace with actual logic)
      const isProfileComplete = parsedUser.onboardingCompleted || Math.random() > 0.3
      setProfileComplete(isProfileComplete)
      
      // Mock active employees check
      const hasEmployees = Math.random() > 0.5
      setHasActiveEmployees(hasEmployees)
      
      setLoading(false)
    }

    loadData()
  }, [router])

  // Mock data for employer dashboard
  const employerData = {
    profileCompletion: 65,
    activeJobs: 2,
    totalApplications: 24,
    interviewsScheduled: 3,
    activeEmployees: hasActiveEmployees ? 1 : 0,
    totalSpent: "$4,800",
    satisfactionRating: 4.9,
    
    quickStats: [
      {
        title: "Active Jobs",
        value: "2",
        description: "Posted positions",
        icon: Briefcase,
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        trend: "+1"
      },
      {
        title: "Applications",
        value: "24",
        description: "Total received",
        icon: FileText,
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        trend: "+8"
      },
      {
        title: "Interviews",
        value: "3",
        description: "Scheduled",
        icon: Calendar,
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        trend: "+2"
      },
      {
        title: "Active Staff",
        value: hasActiveEmployees ? "1" : "0",
        description: "Current employees",
        icon: Users,
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        trend: hasActiveEmployees ? "+1" : "0"
      }
    ],

    quickActions: [
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
    ],

    activeEmployees: hasActiveEmployees ? [
      {
        id: 1,
        name: "Aisha Mohamed",
        position: "Domestic Worker",
        startDate: "2024-01-15",
        salary: "$800/month",
        status: "active",
        rating: 4.8,
        nextPayment: "2024-03-01",
        avatar: "/avatars/aisha.jpg"
      }
    ] : [],

    recentApplications: [
      {
        id: 1,
        name: "Fatima Hassan",
        position: "Housekeeper",
        appliedDate: "2 hours ago",
        status: "new",
        match: "92%",
        location: "Kenya",
        experience: "3 years",
        salaryExpectation: "$700"
      },
      {
        id: 2,
        name: "John Kamau",
        position: "Driver & Gardener",
        appliedDate: "5 hours ago",
        status: "reviewed",
        match: "88%",
        location: "Kenya",
        experience: "5 years",
        salaryExpectation: "$900"
      },
      {
        id: 3,
        name: "Mary Wanjiku",
        position: "Nanny",
        appliedDate: "1 day ago",
        status: "shortlisted",
        match: "95%",
        location: "Kenya",
        experience: "4 years",
        salaryExpectation: "$750"
      }
    ],

    upcomingTasks: [
      {
        id: 1,
        title: "Interview with Sarah",
        description: "Video call for nanny position",
        date: "Today, 3:00 PM",
        type: "interview",
        priority: "high"
      },
      {
        id: 2,
        title: "Contract Renewal",
        description: "Aisha's contract ends in 2 weeks",
        date: "In 3 days",
        type: "contract",
        priority: "medium"
      },
      {
        id: 3,
        title: "Payment Processing",
        description: "Monthly salary for staff",
        date: "March 1, 2024",
        type: "payment",
        priority: "high"
      }
    ],

    kazipertServices: [
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
    ],

    domesticWorkerCategories: [
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
  }

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
      return
    }
    
    switch(action) {
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
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'reviewed': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'shortlisted': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500/10 text-red-600'
      case 'medium': return 'bg-orange-500/10 text-orange-600'
      default: return 'bg-blue-500/10 text-blue-600'
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
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2" style={{ borderColor: KAZIPERT_COLORS.primary }}>
              <AvatarFallback 
                className="text-white font-semibold"
                style={{ backgroundColor: KAZIPERT_COLORS.primary }}
              >
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-xl" style={{ color: KAZIPERT_COLORS.text }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm flex items-center gap-1" style={{ color: KAZIPERT_COLORS.textLight }}>
                  <Building2 className="h-4 w-4" style={{ color: KAZIPERT_COLORS.primary }} />
                  Employer • Muscat, Oman
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
                  onClick={() => router.push('/portals/employer/onboarding')}
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
                  <span style={{ color: KAZIPERT_COLORS.primary }}>{employerData.profileCompletion}%</span>
                </div>
                <Progress 
                  value={employerData.profileCompletion} 
                  className="h-2 bg-white/50"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {employerData.quickStats.map((stat, index) => (
            <div 
              key={stat.title}
              className="bg-white rounded-2xl p-4 border border-gray-200 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
              onClick={() => handleQuickAction(stat.action)}
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
            {employerData.quickActions.map((action) => (
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
            {hasActiveEmployees && (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                    <Users className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                    Active Employees
                  </CardTitle>
                  <CardDescription>
                    Currently working in your household
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {employerData.activeEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback 
                            className="text-white text-sm"
                            style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                          >
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium" style={{ color: KAZIPERT_COLORS.text }}>
                            {employee.name}
                          </div>
                          <div className="text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                            {employee.position} • Started {employee.startDate}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold" style={{ color: KAZIPERT_COLORS.primary }}>
                          {employee.salary}
                        </div>
                        <div className="flex items-center gap-1 text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                          <Star className="h-3 w-3 text-amber-500" />
                          {employee.rating}
                        </div>
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
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  New candidates for your positions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {employerData.recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className="font-medium" style={{ color: KAZIPERT_COLORS.text }}>
                          {application.name}
                        </div>
                        <div className="text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                          {application.position} • {application.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={cn("text-xs mb-1", getStatusColor(application.status))}>
                        {application.status}
                      </Badge>
                      <div className="text-sm font-semibold" style={{ color: KAZIPERT_COLORS.primary }}>
                        {application.match}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
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
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
                  <Calendar className="h-5 w-5" style={{ color: KAZIPERT_COLORS.accent }} />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>
                  Important dates and reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {employerData.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: KAZIPERT_COLORS.accent + '15' }}
                      >
                        <Calendar className="h-4 w-4" style={{ color: KAZIPERT_COLORS.accent }} />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: KAZIPERT_COLORS.text }}>
                          {task.title}
                        </div>
                        <div className="text-sm" style={{ color: KAZIPERT_COLORS.textLight }}>
                          {task.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                      <div className="text-sm mt-1" style={{ color: KAZIPERT_COLORS.textLight }}>
                        {task.date}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
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
                {employerData.kazipertServices.map((service, index) => (
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

        {/* Domestic Worker Categories */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2" style={{ color: KAZIPERT_COLORS.text }}>
              <TargetIcon className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Popular Domestic Worker Categories
            </CardTitle>
            <CardDescription>
              Find the perfect help for your household needs in Oman
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {employerData.domesticWorkerCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => router.push(`/employer/jobs?category=${category.name.toLowerCase()}`)}
                  className="bg-white p-4 rounded-xl border border-gray-200 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary + '15' }}
                  >
                    <category.icon className="h-6 w-6" style={{ color: KAZIPERT_COLORS.primary }} />
                  </div>
                  <div className="font-medium text-sm mb-1" style={{ color: KAZIPERT_COLORS.text }}>
                    {category.name}
                  </div>
                  <div className="text-xs" style={{ color: KAZIPERT_COLORS.textLight }}>
                    {category.count} available
                  </div>
                  {category.popular && (
                    <Badge className="mt-1 text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                      Popular
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card 
          className="border-0 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${KAZIPERT_COLORS.brown}10 0%, ${KAZIPERT_COLORS.primary}05 100%)`
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle style={{ color: KAZIPERT_COLORS.text }}>Support & Resources</CardTitle>
            <CardDescription>
              Everything you need to manage your household staff in Oman
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Oman Labor Law Guide",
                  description: "Understand local regulations",
                  icon: FileText,
                  route: "/employer/resources/labor-law"
                },
                {
                  name: "Visa Processing",
                  description: "Step-by-step guidance",
                  icon: Plane,
                  route: "/employer/resources/visa"
                },
                {
                  name: "Contract Templates",
                  description: "Legal document templates",
                  icon: FileSearch,
                  route: "/employer/resources/contracts"
                },
                {
                  name: "24/7 Support",
                  description: "Get help anytime",
                  icon: Phone,
                  route: "/employer/support"
                }
              ].map((resource, index) => (
                <button
                  key={resource.name}
                  onClick={() => router.push(resource.route)}
                  className="bg-white p-4 rounded-xl border border-gray-200 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: KAZIPERT_COLORS.primary + '15' }}
                    >
                      <resource.icon className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                    </div>
                    <div>
                      <div 
                        className="font-medium group-hover:underline"
                        style={{ color: KAZIPERT_COLORS.text }}
                      >
                        {resource.name}
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: KAZIPERT_COLORS.textLight }}
                      >
                        {resource.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Missing icon component
const Trees = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 17h12M8 21h12M8 13h12M4 17h.01M4 21h.01M4 13h.01M4 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z"/>
  </svg>
)