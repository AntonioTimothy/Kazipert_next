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
  Clock as ClockIcon
} from "lucide-react"

export default function WorkerDashboard() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    }

    loadData()
  }, [router])

  // Mock data
  const dashboardData = {
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
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        action: "complete-profile"
      },
      {
        title: "Active Applications",
        value: "3",
        description: "Under review",
        icon: FileCheck,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        action: "view-applications"
      },
      {
        title: "Available Jobs",
        value: "24",
        description: "Matching your skills",
        icon: Target,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        action: "browse-jobs"
      },
      {
        title: "Next Payment",
        value: "$1,200",
        description: "Due in 5 days",
        icon: DollarSign,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        action: "view-payments"
      }
    ],

    quickActions: [
      {
        name: "Complete Profile",
        description: "Increase visibility",
        icon: User,
        action: "complete-profile",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        progress: 85,
        route: "/worker/profile"
      },
      {
        name: "Browse Jobs",
        description: "Find opportunities",
        icon: Search,
        action: "browse-jobs",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        route: "/worker/jobs"
      },
      {
        name: "My Training",
        description: "Skill development",
        icon: BookOpen,
        action: "training",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        route: "/worker/training"
      },
      {
        name: "Quick Support",
        description: "24/7 assistance",
        icon: Phone,
        action: "support",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        route: "/worker/support"
      }
    ],

    activeContract: {
      jobTitle: "Senior Caregiver",
      employerName: "Johnson Family",
      salary: "$1,200/month",
      duration: "6 months",
      location: "Nairobi, Kenya",
      status: "active",
      hoursPerWeek: "40 hours",
      accommodation: "Provided",
      meals: "Included"
    },

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
        color: "text-blue-500"
      },
      {
        name: "Legal Protection",
        description: "Contract support",
        active: true,
        icon: FileText,
        color: "text-green-500"
      },
      {
        name: "Emergency Support",
        description: "24/7 assistance",
        active: true,
        icon: Heart,
        color: "text-red-500"
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
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-200'
      case 'medium': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      default: return 'bg-blue-500/10 text-blue-600 border-blue-200'
    }
  }

  // Skeleton loading components
  const StatSkeleton = () => (
    <div className="bg-background rounded-2xl p-4 border border-border animate-pulse">
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
    <div className="bg-background rounded-2xl p-4 border border-border animate-pulse">
      <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  )

  const JobSkeleton = () => (
    <div className="bg-background rounded-2xl p-4 border border-border animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
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

          {/* Contract Skeleton */}
          <div className="bg-gray-200 rounded-2xl p-5 animate-pulse">
            <div className="space-y-4">
              <div className="h-5 bg-gray-300 rounded w-32"></div>
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs Skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <JobSkeleton key={i} />
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
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2" style={{ borderColor: currentTheme.colors.primary }}>
              <AvatarFallback 
                className="text-white font-semibold"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-lg" style={{ color: currentTheme.colors.text }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-sm flex items-center gap-1" style={{ color: currentTheme.colors.textLight }}>
                <BadgeCheck className="h-3 w-3 text-green-500" />
                Ready for new opportunities
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => router.push('/worker/jobs')}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Find Jobs
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {dashboardData.quickStats.map((stat, index) => (
            <div 
              key={stat.title}
              className="rounded-2xl p-4 border transition-all duration-300 cursor-pointer hover:scale-105"
              style={{
                backgroundColor: currentTheme.colors.backgroundLight,
                borderColor: currentTheme.colors.border
              }}
              onClick={() => handleQuickAction(stat.action)}
            >
              <div className="flex items-start justify-between mb-2">
                <div 
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                >
                  <stat.icon 
                    className="h-4 w-4" 
                    style={{ color: currentTheme.colors.primary }} 
                  />
                </div>
                <Badge 
                  variant="secondary" 
                  className="text-xs border-0"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '15',
                    color: currentTheme.colors.primary
                  }}
                >
                  +5%
                </Badge>
              </div>
              <div className="space-y-1">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-xs font-medium"
                  style={{ color: currentTheme.colors.textLight }}
                >
                  {stat.title}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.colors.textLight }}
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
            <h2 
              className="font-bold text-lg"
              style={{ color: currentTheme.colors.text }}
            >
              Quick Actions
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              style={{ color: currentTheme.colors.primary }}
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dashboardData.quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => handleQuickAction(action.action, action.route)}
                className="rounded-2xl p-4 border transition-all duration-300 hover:scale-105 group text-left"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div 
                  className="p-3 rounded-xl w-fit mb-3"
                  style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                >
                  <action.icon 
                    className="h-5 w-5" 
                    style={{ color: currentTheme.colors.primary }} 
                  />
                </div>
                <div className="space-y-1">
                  <div 
                    className="font-semibold group-hover:underline transition-colors"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {action.name}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    {action.description}
                  </div>
                </div>
                {action.progress && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: currentTheme.colors.textLight }}>Progress</span>
                      <span style={{ color: currentTheme.colors.primary }}>{action.progress}%</span>
                    </div>
                    <Progress 
                      value={action.progress} 
                      className="h-1"
                      style={{
                        backgroundColor: currentTheme.colors.backgroundLight
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current Contract */}
        <Card 
          className="border-0 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}20 0%, ${currentTheme.colors.accent}15 100%)`
          }}
        >
          <CardContent className="p-0">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge 
                    variant="secondary" 
                    className="mb-2 border-0"
                    style={{
                      backgroundColor: currentTheme.colors.primary + '20',
                      color: currentTheme.colors.primary
                    }}
                  >
                    Active Contract
                  </Badge>
                  <h3 
                    className="font-bold text-lg"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {dashboardData.activeContract.jobTitle}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    {dashboardData.activeContract.employerName}
                  </p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {dashboardData.activeContract.salary}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    {dashboardData.activeContract.duration}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                  <span style={{ color: currentTheme.colors.text }}>{dashboardData.activeContract.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                  <span style={{ color: currentTheme.colors.text }}>{dashboardData.activeContract.hoursPerWeek}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                  <span style={{ color: currentTheme.colors.text }}>{dashboardData.activeContract.accommodation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                  <span style={{ color: currentTheme.colors.text }}>{dashboardData.activeContract.meals}</span>
                </div>
              </div>
            </div>
            
            <div 
              className="px-5 py-3"
              style={{ backgroundColor: currentTheme.colors.primary + '10' }}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                style={{ color: currentTheme.colors.primary }}
                onClick={() => router.push('/worker/contracts')}
              >
                <span>View Contract Details</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="font-bold text-lg"
              style={{ color: currentTheme.colors.text }}
            >
              Recommended Jobs
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              style={{ color: currentTheme.colors.primary }}
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {dashboardData.recommendedJobs.map((job) => (
              <div 
                key={job.id}
                className="rounded-2xl p-4 border transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <Building2 className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div>
                      <h3 
                        className="font-semibold"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {job.title}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: currentTheme.colors.textLight }}
                      >
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
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-3 w-3" style={{ color: currentTheme.colors.textLight }} />
                    <span style={{ color: currentTheme.colors.textLight }}>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" style={{ color: currentTheme.colors.textLight }} />
                    <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-3 w-3" style={{ color: currentTheme.colors.textLight }} />
                    <span style={{ color: currentTheme.colors.textLight }}>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span style={{ color: currentTheme.colors.textLight }}>{job.matches}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div 
                    className="text-xs"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    Posted {job.posted}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => router.push(`/worker/jobs/${job.id}`)}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services & Benefits */}
        <Card 
          className="border-0"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
              Your Benefits
            </CardTitle>
            <CardDescription>
              Active services and protections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.services.map((service, index) => (
              <div 
                key={service.name}
                className="flex items-center justify-between p-3 rounded-xl transition-colors hover:scale-105"
                style={{
                  backgroundColor: currentTheme.colors.primary + '05',
                  border: `1px solid ${currentTheme.colors.primary}20`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                  >
                    <service.icon 
                      className="h-4 w-4" 
                      style={{ color: currentTheme.colors.primary }} 
                    />
                  </div>
                  <div>
                    <div 
                      className="font-medium"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {service.name}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: currentTheme.colors.textLight }}
                    >
                      {service.description}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="border-0"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  Active
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full justify-between"
              style={{ color: currentTheme.colors.primary }}
              onClick={() => router.push('/worker/services')}
            >
              <span>Manage All Services</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Earnings Summary */}
        <Card 
          className="border-0"
          style={{
            backgroundColor: currentTheme.colors.backgroundLight
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              Earnings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: currentTheme.colors.text }}
              >
                {dashboardData.totalEarnings}
              </div>
              <div 
                className="text-sm"
                style={{ color: currentTheme.colors.textLight }}
              >
                Total earnings to date
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {dashboardData.completedJobs}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.colors.textLight }}
                >
                  Jobs Done
                </div>
              </div>
              <div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {dashboardData.rating}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.colors.textLight }}
                >
                  Rating
                </div>
              </div>
              <div>
                <div 
                  className="text-lg font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  12
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.colors.textLight }}
                >
                  5★ Reviews
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => router.push('/worker/payments')}
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              <Wallet className="h-4 w-4 mr-2" />
              View Payment History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}