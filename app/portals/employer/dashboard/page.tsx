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
  Users,
  FileText,
  DollarSign,
  Clock,
  MapPin,
  Plus,
  Search,
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
  Building,
  ArrowUpRight,
  ChevronRight,
  Home,
  ShieldCheck,
  BadgeCheck,
  Coins,
  Building2,
  Eye,
  BookOpen,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  UserCheck,
  Download,
  Upload,
  Settings
} from "lucide-react"

export default function EmployerDashboard() {
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
      if (parsedUser.role !== "EMPLOYER") {
        router.push("/login")
        return
      }

      setUser(parsedUser)
      setLoading(false)
    }

    loadData()
  }, [router])

  // Mock data for employer
  const dashboardData = {
    profileCompletion: 75,
    activeJobs: 3,
    totalApplications: 24,
    activeContracts: 2,
    availableWorkers: 156,
    
    quickStats: [
      {
        title: "Active Jobs",
        value: "3",
        description: "Currently hiring",
        icon: Briefcase,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        action: "view-jobs"
      },
      {
        title: "Applications",
        value: "24",
        description: "New applicants",
        icon: Users,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        action: "view-applications"
      },
      {
        title: "Active Workers",
        value: "2",
        description: "Currently employed",
        icon: UserCheck,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        action: "view-contracts"
      },
      {
        title: "Profile Score",
        value: "75%",
        description: "Complete your profile",
        icon: User,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        action: "complete-profile"
      }
    ],

    quickActions: [
      {
        name: "Post New Job",
        description: "Find perfect help",
        icon: Plus,
        action: "post-job",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        route: "/employer/post-job"
      },
      {
        name: "Browse Workers",
        description: "Verified candidates",
        icon: Search,
        action: "browse-workers",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        route: "/employer/workers"
      },
      {
        name: "Manage Contracts",
        description: "Active agreements",
        icon: FileText,
        action: "manage-contracts",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        route: "/employer/contracts"
      },
      {
        name: "Support",
        description: "24/7 assistance",
        icon: Phone,
        action: "support",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        route: "/employer/support"
      }
    ],

    activeWorkers: [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "House Manager",
        salary: "$800/month",
        startDate: "2024-01-15",
        location: "Nairobi, Kenya",
        status: "active",
        performance: "Excellent",
        nextPayment: "2024-02-15"
      },
      {
        id: 2,
        name: "Maria Rodriguez",
        role: "Childcare Specialist",
        salary: "$700/month",
        startDate: "2024-01-20",
        location: "Nairobi, Kenya",
        status: "active",
        performance: "Good",
        nextPayment: "2024-02-20"
      }
    ],

    recentApplications: [
      {
        id: 1,
        workerName: "Grace Mwangi",
        jobTitle: "Domestic Worker",
        appliedDate: "2 hours ago",
        experience: "3+ years",
        location: "Nairobi",
        salary: "$600/month",
        status: "new",
        match: "95%"
      },
      {
        id: 2,
        workerName: "Fatima Hassan",
        jobTitle: "Cook & Cleaner",
        appliedDate: "5 hours ago",
        experience: "5+ years",
        location: "Mombasa",
        salary: "$650/month",
        status: "new",
        match: "88%"
      },
      {
        id: 3,
        workerName: "Esther Kamau",
        jobTitle: "Elderly Care",
        appliedDate: "1 day ago",
        experience: "4+ years",
        location: "Nakuru",
        salary: "$700/month",
        status: "reviewed",
        match: "92%"
      }
    ],

    recommendedWorkers: [
      {
        id: 1,
        name: "Grace Mwangi",
        experience: "3+ years experience",
        skills: ["Housekeeping", "Cooking", "Childcare"],
        location: "Nairobi, Kenya",
        rating: 4.8,
        salary: "$600-700",
        verified: true,
        available: "Immediately"
      },
      {
        id: 2,
        name: "Fatima Hassan",
        experience: "5+ years experience",
        skills: ["Cooking", "Cleaning", "Laundry"],
        location: "Mombasa, Kenya",
        rating: 4.9,
        salary: "$650-750",
        verified: true,
        available: "2 weeks"
      }
    ],

    services: [
      {
        name: "Worker Insurance",
        description: "Health & accident coverage",
        active: true,
        icon: Shield,
        color: "text-blue-500"
      },
      {
        name: "Legal Support",
        description: "Contract management",
        active: true,
        icon: FileText,
        color: "text-green-500"
      },
      {
        name: "Emergency Backup",
        description: "Replacement workers",
        active: false,
        icon: Users,
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
      case 'post-job':
        router.push('/employer/post-job')
        break
      case 'browse-workers':
        router.push('/employer/workers')
        break
      case 'manage-contracts':
        router.push('/employer/contracts')
        break
      case 'view-jobs':
        router.push('/employer/jobs')
        break
      case 'view-applications':
        router.push('/employer/contracts')
        break
      case 'complete-profile':
        router.push('/employer/profile')
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'reviewed': return 'bg-purple-500/10 text-purple-600 border-purple-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
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
      </div>
    </div>
  )

  const WorkerSkeleton = () => (
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

          {/* Active Workers Skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <WorkerSkeleton key={i} />
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
                Ready to find your perfect help
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => router.push('/employer/post-job')}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Post Job
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
                  +2
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
              </button>
            ))}
          </div>
        </div>

        {/* Active Workers */}
        <Card 
          className="border-0 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}20 0%, ${currentTheme.colors.accent}15 100%)`
          }}
        >
          <CardContent className="p-0">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge 
                    variant="secondary" 
                    className="mb-2 border-0"
                    style={{
                      backgroundColor: currentTheme.colors.primary + '20',
                      color: currentTheme.colors.primary
                    }}
                  >
                    Active Team
                  </Badge>
                  <h3 
                    className="font-bold text-lg"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Your Current Help
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    {dashboardData.activeWorkers.length} active workers
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {dashboardData.activeWorkers.map((worker) => (
                  <div 
                    key={worker.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      backgroundColor: currentTheme.colors.primary + '10'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      >
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <div 
                          className="font-semibold"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {worker.name}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: currentTheme.colors.textLight }}
                        >
                          {worker.role} • {worker.salary}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className="text-xs"
                      style={{
                        backgroundColor: currentTheme.colors.primary + '20',
                        color: currentTheme.colors.primary
                      }}
                    >
                      {worker.performance}
                    </Badge>
                  </div>
                ))}
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
                onClick={() => router.push('/employer/contracts')}
              >
                <span>Manage All Workers</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="font-bold text-lg"
              style={{ color: currentTheme.colors.text }}
            >
              Recent Applications
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
            {dashboardData.recentApplications.map((application) => (
              <div 
                key={application.id}
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
                      <User className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div>
                      <h3 
                        className="font-semibold"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {application.workerName}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: currentTheme.colors.textLight }}
                      >
                        {application.jobTitle} • {application.experience}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={cn("text-xs", getStatusColor(application.status))}
                  >
                    {application.status === 'new' ? 'New' : 'Reviewed'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-3 w-3" style={{ color: currentTheme.colors.textLight }} />
                    <span style={{ color: currentTheme.colors.textLight }}>{application.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" style={{ color: currentTheme.colors.textLight }} />
                    <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>{application.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-3 w-3" style={{ color: currentTheme.colors.textLight }} />
                    <span style={{ color: currentTheme.colors.textLight }}>{application.appliedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span style={{ color: currentTheme.colors.textLight }}>{application.match} match</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ 
                      borderColor: currentTheme.colors.primary,
                      color: currentTheme.colors.primary
                    }}
                  >
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => router.push(`/employer/contracts/${application.id}`)}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Workers */}
        <Card 
          className="border-0"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
              Recommended Workers
            </CardTitle>
            <CardDescription>
              Top candidates matching your preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recommendedWorkers.map((worker) => (
              <div 
                key={worker.id}
                className="flex items-center justify-between p-4 rounded-xl transition-colors hover:scale-105"
                style={{
                  backgroundColor: currentTheme.colors.primary + '05',
                  border: `1px solid ${currentTheme.colors.primary}20`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                  >
                    <User className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div>
                    <div 
                      className="font-semibold"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {worker.name}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textLight }}
                    >
                      {worker.experience}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.skills.slice(0, 2).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs"
                          style={{
                            borderColor: currentTheme.colors.primary,
                            color: currentTheme.colors.primary
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="font-semibold"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    {worker.salary}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    {worker.available}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full justify-between"
              style={{ color: currentTheme.colors.primary }}
              onClick={() => router.push('/employer/workers')}
            >
              <span>Browse All Workers</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Employer Services */}
        <Card 
          className="border-0"
          style={{
            backgroundColor: currentTheme.colors.backgroundLight
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
              Employer Services
            </CardTitle>
            <CardDescription>
              Protect your home and simplify management
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
                    backgroundColor: service.active 
                      ? currentTheme.colors.primary + '20'
                      : currentTheme.colors.textLight + '20',
                    color: service.active 
                      ? currentTheme.colors.primary
                      : currentTheme.colors.textLight
                  }}
                >
                  {service.active ? 'Active' : 'Available'}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => router.push('/employer/services')}
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Services
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}