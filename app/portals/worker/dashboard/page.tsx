// app/portals/worker/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePortalUser } from "../../layout"
import { LoadingSpinner } from "@/components/loading-spinner"
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
  Rocket,
  TrendingUp,
  Calendar,
  Award,
  Wallet,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Building,
  Navigation,
  Phone,
  Mail,
  Download,
  Share2,
  Eye,
  BookOpen,
  Headphones,
  ShieldCheck,
  BadgeCheck,
  Crown,
  Gem,
  Coins,
  Banknote,
  CreditCard,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Clock4,
  MapPin as MapPinIcon,
  Building2,
  GraduationCap,
  Languages,
  
  HeartHandshake,
  Globe,
  Plane,
  Car,
  Home,
  Wifi,
  Utensils
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

export default function WorkerDashboard() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const { user } = usePortalUser()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  // Mock data - replace with actual API calls
  const userData = {
    profileCompletion: 85,
    activeApplications: 3,
    availableJobs: 24,
    nextPayment: "$1,200",
    totalEarnings: "$8,450",
    rating: 4.8,
    completedJobs: 12,
    activeContract: {
      jobTitle: "Senior Caregiver",
      employerName: "Johnson Family",
      salary: "$1,200/month",
      duration: "6 months",
      startDate: "2024-01-15",
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
        country: "Kenya",
        salary: "$800/month",
        status: "open",
        type: "Full-time",
        posted: "2 days ago",
        urgency: "high",
        matches: "95% match"
      },
      {
        id: 2,
        title: "Childcare Specialist",
        employerName: "Davis Family",
        location: "Mombasa",
        country: "Kenya",
        salary: "$950/month",
        status: "open",
        type: "Live-in",
        posted: "1 week ago",
        urgency: "medium",
        matches: "88% match"
      },
      {
        id: 3,
        title: "Elderly Companion",
        employerName: "Wilson Home",
        location: "Nakuru",
        country: "Kenya",
        salary: "$700/month",
        status: "open",
        type: "Part-time",
        posted: "3 days ago",
        urgency: "high",
        matches: "92% match"
      }
    ],
    quickStats: [
      {
        title: "Profile Score",
        value: "85%",
        description: "Excellent visibility",
        icon: User,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        trend: "+5%"
      },
      {
        title: "Active Applications",
        value: "3",
        description: "Under review",
        icon: FileCheck,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        trend: "+2"
      },
      {
        title: "Available Jobs",
        value: "24",
        description: "Matching your profile",
        icon: Target,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        trend: "+8"
      },
      {
        title: "Next Payment",
        value: "$1,200",
        description: "Due in 5 days",
        icon: DollarSign,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        trend: "On track"
      }
    ],
    quickActions: [
      {
        name: "Find Jobs",
        description: "Browse opportunities",
        icon: Briefcase,
        action: "find-jobs",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        route: "/portals/worker/jobs"
      },
      {
        name: "Quick Cashout",
        description: "Instant M-Pesa",
        icon: Send,
        action: "withdraw",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        route: "/portals/worker/payments"
      },
      {
        name: "My Training",
        description: "Skill up now",
        icon: Video,
        action: "training",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        route: "/portals/worker/training"
      },
      {
        name: "24/7 Support",
        description: "Get help anytime",
        icon: MessageSquare,
        action: "support",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        route: "/portals/worker/support"
      }
    ],
    services: [
      {
        name: "Health Insurance",
        description: "Medical coverage",
        active: true,
        icon: Shield,
        color: "text-blue-500",
        status: "Active",
        renewal: "2024-12-01"
      },
      {
        name: "Legal Protection",
        description: "Contract support",
        active: true,
        icon: FileText,
        color: "text-green-500",
        status: "Active",
        renewal: "2024-12-01"
      },
      {
        name: "Emergency Support",
        description: "24/7 assistance",
        active: true,
        icon: Heart,
        color: "text-red-500",
        status: "Active",
        renewal: "2024-12-01"
      }
    ]
  }

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
      return
    }
    
    switch(action) {
      case 'find-jobs':
        router.push('/portals/worker/jobs')
        break
      case 'withdraw':
        router.push('/portals/worker/payments?action=withdraw')
        break
      case 'training':
        router.push('/portals/worker/training')
        break
      case 'support':
        router.push('/portals/worker/support')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pb-20">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <BadgeCheck className="h-3 w-3 text-green-500" />
                  Ready for new opportunities
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
              onClick={() => router.push('/portals/worker/jobs')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Find Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {userData.quickStats.map((stat, index) => (
            <div 
              key={stat.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-0">
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs font-medium text-gray-600">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Quick Actions</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {userData.quickActions.map((action) => (
              <button
                key={action.name}
                onClick={() => handleQuickAction(action.action, action.route)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group text-left"
              >
                <div className={cn("p-3 rounded-xl w-fit mb-3", action.bgColor)}>
                  <action.icon className={cn("h-5 w-5", action.color)} />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.name}
                  </div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Contract */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 mb-2">
                    Active Contract
                  </Badge>
                  <h3 className="font-bold text-lg">{userData.activeContract.jobTitle}</h3>
                  <p className="text-blue-100 text-sm">{userData.activeContract.employerName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{userData.activeContract.salary}</div>
                  <div className="text-blue-100 text-sm">{userData.activeContract.duration}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-200" />
                  <span>{userData.activeContract.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span>{userData.activeContract.hoursPerWeek}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-200" />
                  <span>{userData.activeContract.accommodation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-blue-200" />
                  <span>{userData.activeContract.meals}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 px-5 py-3">
              <Button 
                variant="ghost" 
                className="w-full text-white hover:bg-white/20 justify-between"
                onClick={() => router.push('/portals/worker/contracts')}
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
            <h2 className="font-bold text-lg text-gray-900">Recommended Jobs</h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {userData.recommendedJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.employerName}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-xs", getUrgencyColor(job.urgency))}>
                    {job.urgency === 'high' ? 'Urgent' : 'New'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-3 w-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-semibold text-green-600">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock4 className="h-3 w-3" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-amber-500" />
                    <span>{job.matches}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Posted {job.posted}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push(`/portals/worker/jobs/${job.id}`)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services & Benefits */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5" />
              Your Benefits
            </CardTitle>
            <CardDescription className="text-slate-300">
              Active services and protections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userData.services.map((service, index) => (
              <div 
                key={service.name}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", service.color.replace('text-', 'bg-') + '/10')}>
                    <service.icon className={cn("h-4 w-4", service.color)} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-xs text-slate-300">{service.description}</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-0">
                  {service.status}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-white hover:bg-white/10 justify-between"
              onClick={() => router.push('/portals/worker/services')}
            >
              <span>Manage All Services</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Earnings Summary */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              Earnings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">{userData.totalEarnings}</div>
              <div className="text-sm text-gray-600">Total earnings to date</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{userData.completedJobs}</div>
                <div className="text-xs text-gray-600">Jobs Done</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{userData.rating}</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-600">5★ Reviews</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              onClick={() => router.push('/portals/worker/payments')}
            >
              <Wallet className="h-4 w-4 mr-2" />
              View Payment History
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Bottom Navigation for Mobile */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 p-3 z-50">
        <div className="grid grid-cols-4 gap-2">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1 text-blue-600">
            <Home className="h-4 w-4" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1 text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs">Jobs</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1 text-gray-600">
            <FileText className="h-4 w-4" />
            <span className="text-xs">Contracts</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1 text-gray-600">
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div> */}
    </div>
  )
}