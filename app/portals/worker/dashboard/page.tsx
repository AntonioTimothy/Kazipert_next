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
  LucideIcon
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

export default function WorkerDashboard() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveContract, setHasActiveContract] = useState(false)

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
      if (parsedUser.role !== "EMPLOYEE") {
        router.push("/login")
        return
      }

      setUser(parsedUser)
      
      // Check if user has active contract (mock logic - replace with actual API call)
      const userHasActiveContract = parsedUser.kycVerified && Math.random() > 0.5
      setHasActiveContract(userHasActiveContract)
      
      setLoading(false)
    }

    loadData()
  }, [router])

  // Mock data for user WITHOUT active contract
  const jobSeekerData = {
    profileCompletion: 85,
    activeApplications: 3,
    availableJobs: 24,
    nextPayment: "$1,200",
    totalEarnings: "$8,450",
    rating: 4.8,
    completedJobs: 12,
    
    quickStats: [
      {
        title: "Profile Score",
        value: "85%",
        description: "Complete your profile",
        icon: User,
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        action: "complete-profile"
      },
      {
        title: "Active Applications",
        value: "3",
        description: "Under review",
        icon: FileCheck,
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        action: "view-applications"
      },
      {
        title: "Available Jobs",
        value: "24",
        description: "Matching your skills",
        icon: Target,
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        action: "browse-jobs"
      },
      {
        title: "Next Payment",
        value: "$1,200",
        description: "Due in 5 days",
        icon: DollarSign,
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        action: "view-payments"
      }
    ],

    quickActions: [
      {
        name: "Complete Profile",
        description: "Increase visibility",
        icon: User,
        action: "complete-profile",
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        progress: 85,
        route: "/worker/profile"
      },
      {
        name: "Browse Jobs",
        description: "Find opportunities",
        icon: Search,
        action: "browse-jobs",
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        route: "/worker/jobs"
      },
      {
        name: "My Training",
        description: "Skill development",
        icon: BookOpen,
        action: "training",
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        route: "/worker/training"
      },
      {
        name: "Quick Support",
        description: "24/7 assistance",
        icon: Phone,
        action: "support",
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        route: "/worker/support"
      }
    ],

    recommendedJobs: [
      {
        id: 1,
        title: "Domestic Worker",
        employerName: "Smith Residence",
        location: "Westlands, Nairobi",
        salary: "$800/month",
        type: "Full-time",
        posted: "2 days ago",
        matches: "95% match",
        urgency: "high"
      },
      {
        id: 2,
        title: "Childcare Specialist",
        employerName: "Davis Family",
        location: "Mombasa",
        salary: "$950/month",
        type: "Live-in",
        posted: "1 week ago",
        matches: "88% match",
        urgency: "medium"
      }
    ],

    services: [
      {
        name: "Health Insurance",
        description: "Medical coverage",
        active: true,
        icon: Shield,
        color: KAZIPERT_COLORS.primary
      },
      {
        name: "Legal Protection",
        description: "Contract support",
        active: true,
        icon: FileText,
        color: KAZIPERT_COLORS.accent
      },
      {
        name: "Emergency Support",
        description: "24/7 assistance",
        active: true,
        icon: Heart,
        color: KAZIPERT_COLORS.primary
      }
    ]
  }

  // Mock data for user WITH active contract
  const activeWorkerData = {
    activeContract: {
      jobTitle: "Senior Caregiver",
      employerName: "Johnson Family",
      salary: "$1,200/month",
      duration: "6 months",
      location: "Nairobi, Kenya",
      status: "active",
      hoursPerWeek: "40 hours",
      accommodation: "Provided",
      meals: "Included",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      employerRating: 4.9
    },

    contractStats: [
      {
        title: "Days Worked",
        value: "45",
        description: "This contract",
        icon: Calendar,
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`
      },
      {
        title: "Next Payment",
        value: "$1,200",
        description: "Due in 5 days",
        icon: DollarSign,
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`
      },
      {
        title: "Contract Days Left",
        value: "120",
        description: "Until completion",
        icon: Clock,
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`
      },
      {
        title: "Employer Rating",
        value: "4.9",
        description: "Out of 5",
        icon: Star,
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`
      }
    ],

    quickActions: [
      {
        name: "Contract Details",
        description: "View full agreement",
        icon: FileText,
        action: "contract-details",
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        route: "/worker/contracts"
      },
      {
        name: "My Wallet",
        description: "Payment history",
        icon: Wallet,
        action: "wallet",
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        route: "/worker/wallet"
      },
      {
        name: "Messages",
        description: "Contact employer",
        icon: MessageCircle,
        action: "messages",
        color: KAZIPERT_COLORS.primary,
        bgColor: `${KAZIPERT_COLORS.primary}15`,
        route: "/worker/messages"
      },
      {
        name: "Support Tickets",
        description: "Get help",
        icon: Ticket,
        action: "tickets",
        color: KAZIPERT_COLORS.accent,
        bgColor: `${KAZIPERT_COLORS.accent}15`,
        route: "/worker/support"
      }
    ],

    recentActivities: [
      {
        id: 1,
        title: "Payment Received",
        description: "Monthly salary",
        amount: "$1,200",
        date: "2 hours ago",
        type: "payment",
        icon: DollarSign
      },
      {
        id: 2,
        title: "Contract Updated",
        description: "Hours adjustment",
        amount: null,
        date: "1 day ago",
        type: "contract",
        icon: FileText
      },
      {
        id: 3,
        title: "New Message",
        description: "From employer",
        amount: null,
        date: "2 days ago",
        type: "message",
        icon: MessageCircle
      }
    ],

    upcomingTasks: [
      {
        id: 1,
        title: "Weekly Check-in",
        description: "With employer",
        date: "Tomorrow, 10:00 AM",
        type: "meeting",
        icon: Video
      },
      {
        id: 2,
        title: "Document Submission",
        description: "Monthly report",
        date: "In 3 days",
        type: "document",
        icon: FileSearch
      }
    ]
  }

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
      return
    }
    
    switch(action) {
      case 'complete-profile':
        router.push('/worker/profile')
        break
      case 'browse-jobs':
        router.push('/worker/jobs')
        break
      case 'view-applications':
        router.push('/worker/contracts')
        break
      case 'view-payments':
        router.push('/worker/payments')
        break
      case 'contract-details':
        router.push('/worker/contracts')
        break
      case 'wallet':
        router.push('/worker/wallet')
        break
      case 'messages':
        router.push('/worker/messages')
        break
      case 'tickets':
        router.push('/worker/support')
        break
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-200'
      case 'medium': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      default: return `${KAZIPERT_COLORS.primary}10 text-${KAZIPERT_COLORS.primary} border-${KAZIPERT_COLORS.primary}20`
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
        <div className="h-2 bg-gray-200 rounded w-full"></div>
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

  const currentData = hasActiveContract ? activeWorkerData : jobSeekerData

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
              <h1 className="font-bold text-xl text-gray-900">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  {hasActiveContract ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Active Contract • {currentData.activeContract.jobTitle}
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                      Ready for new opportunities
                    </>
                  )}
                </p>
                {user.kycVerified && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-200 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {!hasActiveContract && (
            <Button 
              size="sm" 
              onClick={() => router.push('/worker/jobs')}
              style={{
                backgroundColor: KAZIPERT_COLORS.primary,
                color: 'white'
              }}
              className="hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-1" />
              Find Jobs
            </Button>
          )}
        </div>

        {/* Status Banner */}
        {hasActiveContract && (
          <div 
            className="rounded-2xl p-4 border"
            style={{
              background: `linear-gradient(135deg, ${KAZIPERT_COLORS.primary}15 0%, ${KAZIPERT_COLORS.accent}10 100%)`,
              borderColor: KAZIPERT_COLORS.primary + '30'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: KAZIPERT_COLORS.primary + '20' }}
                >
                  <Briefcase className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Contract</h3>
                  <p className="text-sm text-gray-600">
                    You're currently employed with {currentData.activeContract.employerName}
                  </p>
                </div>
              </div>
              <Badge 
                style={{
                  backgroundColor: KAZIPERT_COLORS.primary + '20',
                  color: KAZIPERT_COLORS.primary
                }}
              >
                Active
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {(hasActiveContract ? currentData.contractStats : currentData.quickStats).map((stat, index) => (
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
                  +2%
                </Badge>
              </div>
              <div className="space-y-1">
                <div 
                  className="text-2xl font-bold text-gray-900"
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm font-medium text-gray-700"
                >
                  {stat.title}
                </div>
                <div 
                  className="text-xs text-gray-500"
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
            <h2 className="font-bold text-lg text-gray-900">
              {hasActiveContract ? "Quick Access" : "Quick Actions"}
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
            {currentData.quickActions.map((action) => (
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
                    className="font-semibold text-gray-900 group-hover:underline transition-colors"
                  >
                    {action.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {action.description}
                  </div>
                </div>
                {action.progress && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span style={{ color: KAZIPERT_COLORS.primary }}>{action.progress}%</span>
                    </div>
                    <Progress 
                      value={action.progress} 
                      className="h-2 bg-gray-100"
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Contract Details - Only for workers with contracts */}
        {hasActiveContract && (
          <>
            {/* Contract Overview */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader 
                className="pb-4"
                style={{
                  background: `linear-gradient(135deg, ${KAZIPERT_COLORS.primary} 0%, ${KAZIPERT_COLORS.accent} 100%)`
                }}
              >
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Current Contract
                </CardTitle>
                <CardDescription className="text-white/80">
                  {currentData.activeContract.jobTitle} • {currentData.activeContract.employerName}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium text-gray-900">{currentData.activeContract.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                      <div>
                        <div className="text-sm text-gray-500">Salary</div>
                        <div className="font-medium text-gray-900">{currentData.activeContract.salary}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-medium text-gray-900">{currentData.activeContract.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                      <div>
                        <div className="text-sm text-gray-500">Weekly Hours</div>
                        <div className="font-medium text-gray-900">{currentData.activeContract.hoursPerWeek}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-4">
                <Button 
                  className="w-full"
                  onClick={() => router.push('/worker/contracts')}
                  style={{
                    backgroundColor: KAZIPERT_COLORS.primary,
                    color: 'white'
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Contract Details
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Activities & Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <TrendingUp className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: KAZIPERT_COLORS.primary + '15' }}
                        >
                          <activity.icon className="h-4 w-4" style={{ color: KAZIPERT_COLORS.primary }} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-600">{activity.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <div className="font-semibold text-gray-900">{activity.amount}</div>
                        )}
                        <div className="text-xs text-gray-500">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Calendar className="h-5 w-5" style={{ color: KAZIPERT_COLORS.accent }} />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentData.upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: KAZIPERT_COLORS.accent + '15' }}
                        >
                          <task.icon className="h-4 w-4" style={{ color: KAZIPERT_COLORS.accent }} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-600">{task.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">{task.date}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Recommended Jobs - Only for job seekers */}
        {!hasActiveContract && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">
                Recommended Jobs
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
            
            <div className="space-y-4">
              {currentData.recommendedJobs.map((job) => (
                <div 
                  key={job.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: KAZIPERT_COLORS.primary + '15' }}
                      >
                        <Building2 className="h-6 w-6" style={{ color: KAZIPERT_COLORS.primary }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {job.employerName}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={cn("text-xs", getUrgencyColor(job.urgency))}
                    >
                      {job.urgency === 'high' ? 'Urgent' : 'New'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold" style={{ color: KAZIPERT_COLORS.primary }}>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-600">{job.matches}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Posted {job.posted}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => router.push(`/worker/jobs/${job.id}`)}
                      style={{
                        backgroundColor: KAZIPERT_COLORS.primary,
                        color: 'white'
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services & Benefits - For both user types */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <ShieldCheck className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Your Benefits & Services
            </CardTitle>
            <CardDescription>
              Active services and protections for your employment journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Health Insurance",
                  description: "Medical coverage",
                  icon: ShieldIcon,
                  active: true
                },
                {
                  name: "Legal Protection",
                  description: "Contract support",
                  icon: FileText,
                  active: true
                },
                {
                  name: "Emergency Support",
                  description: "24/7 assistance",
                  icon: HeartHandshake,
                  active: true
                },
                {
                  name: "Travel Assistance",
                  description: "Relocation support",
                  icon: Plane,
                  active: user.kycVerified
                }
              ].map((service, index) => (
                <div 
                  key={service.name}
                  className="bg-white p-4 rounded-xl border border-gray-200 text-center transition-all duration-300 hover:scale-105"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary + '15' }}
                  >
                    <service.icon className="h-6 w-6" style={{ color: KAZIPERT_COLORS.primary }} />
                  </div>
                  <div className="font-medium text-gray-900 mb-1">{service.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{service.description}</div>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      service.active 
                        ? "bg-green-500/10 text-green-600 border-green-200" 
                        : "bg-gray-500/10 text-gray-600 border-gray-200"
                    )}
                  >
                    {service.active ? "Active" : "Available"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card 
          className="border-0 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${KAZIPERT_COLORS.brown}10 0%, ${KAZIPERT_COLORS.primary}05 100%)`
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900">Resources & Support</CardTitle>
            <CardDescription>
              Tools and support to help you succeed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: "Training Center",
                  description: "Skill development courses",
                  icon: GraduationCap,
                  route: "/worker/training"
                },
                {
                  name: "Support Center",
                  description: "24/7 help available",
                  icon: Phone,
                  route: "/worker/support"
                },
                {
                  name: "Document Library",
                  description: "Important resources",
                  icon: FileSearch,
                  route: "/worker/documents"
                },
                {
                  name: "Community",
                  description: "Connect with others",
                  icon: Users,
                  route: "/worker/community"
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
                      <div className="font-medium text-gray-900 group-hover:underline">
                        {resource.name}
                      </div>
                      <div className="text-sm text-gray-600">
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