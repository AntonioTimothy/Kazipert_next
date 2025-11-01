"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  Send,
  Receipt,
  AlertTriangle,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Award,
  Zap,
  Bell,
  FileCheck,
  BadgeCheck,
  Sparkles,
  Rocket,
  Target,
  BarChart3,
  Heart,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockJobs, mockContracts } from "@/lib/mock-data"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

export default function WorkerDashboard() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    
    // Show profile prompt if profile completion is low
    const completion = calculateProfileCompletion(parsedUser)
    if (completion < 70) {
      setShowProfilePrompt(true)
    }
    
    setLoading(false)
  }, [router])

  const calculateProfileCompletion = (user: WorkerProfile) => {
    return Math.round(
      ((user.documents.passport ? 1 : 0) +
        (user.documents.certificate ? 1 : 0) +
        (user.documents.medicalReport ? 1 : 0) +
        (user.subscriptions.insurance ? 1 : 0) +
        (user.subscriptions.legal ? 1 : 0) +
        (user.subscriptions.medical ? 1 : 0)) *
        (100 / 6),
    )
  }

  const handleQuickAction = (action: string) => {
    const completion = user ? calculateProfileCompletion(user) : 0
    if (completion < 70) {
      alert("Kindly complete your profile to access this feature. You'll be redirected to the onboarding page.")
      router.push("/worker/onboarding")
      return
    }
    
    // Handle actual action based on the type
    switch(action) {
      case 'apply':
        router.push("/worker/jobs")
        break
      case 'withdraw':
        router.push("/worker/payment-history?action=withdraw")
        break
      case 'training':
        router.push("/worker/training")
        break
      case 'support':
        router.push("/worker/support")
        break
    }
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  

  const userContract = mockContracts.find((c) => c.workerId === user.id)
  const profileCompletion = calculateProfileCompletion(user)
  const availableJobs = mockJobs.filter((j) => j.status === "open")
  const recommendedJobs = availableJobs.slice(0, 3)

  // Quick stats data
  const quickStats = [
    {
      title: "Profile Score",
      value: `${profileCompletion}%`,
      description: "Completion status",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Applications",
      value: userContract ? "1" : "0",
      description: userContract ? "Contract active" : "No applications",
      icon: FileCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Available Jobs",
      value: availableJobs.length.toString(),
      description: "Matching your skills",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Next Payment",
      value: userContract ? userContract.salary : "$0",
      description: userContract ? "Due soon" : "No contract",
      icon: DollarSign,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ]

  const quickActions = [
    {
      name: "Apply for Jobs",
      description: "Find and apply to matching positions",
      icon: Briefcase,
      action: "apply",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      name: "Quick Withdraw",
      description: "Send funds to M-Pesa instantly",
      icon: Send,
      action: "withdraw",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      name: "Skill Training",
      description: "Enhance your qualifications",
      icon: Video,
      action: "training",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      name: "Get Support",
      description: "24/7 customer service",
      icon: MessageSquare,
      action: "support",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ]

  return (
    <PortalLayout  user={user}>
      <div className="space-y-6">
        {/* Welcome Header with Profile Prompt */}
        <div className="relative">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Welcome back, {user.name.split(" ")[0]}!
                </h1>
                <div className="relative">
                  <Rocket className="h-6 w-6 text-primary animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                </div>
              </div>
              <p className="text-muted-foreground text-lg">Here's your employment journey overview</p>
              
              {/* Profile Completion Alert */}
              {profileCompletion < 70 && (
                <div 
                  className="mt-4 p-4 rounded-xl border-2 backdrop-blur-sm animate-pulse"
                  style={{
                    borderColor: currentTheme.colors.primary + '40',
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}08, ${currentTheme.colors.primary}15)`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: currentTheme.colors.primary + '20' }}
                    >
                      <Sparkles className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">Complete Your Profile to Get Hired!</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {100 - profileCompletion}% remaining. Employers are 3x more likely to hire complete profiles.
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => router.push("/worker/onboarding")}
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.text
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Complete Now
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                asChild 
                className="shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.text
                }}
              >
                <Link href="/worker/payment-history">
                  <Wallet className="mr-2 h-4 w-4" />
                  View Balance
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/10 bg-transparent shadow-sm"
                onClick={() => handleQuickAction('withdraw')}
              >
                <Send className="mr-2 h-4 w-4" />
                Quick Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
              }}
            >
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6 opacity-10"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                  {stat.value}
                </div>
                <Progress 
                  value={profileCompletion} 
                  className="mt-2" 
                  style={{
                    backgroundColor: currentTheme.colors.backgroundLight,
                    color: currentTheme.colors.primary
                  }}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current Contract Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Current Contract
              </CardTitle>
              <CardDescription>Your active employment contract details</CardDescription>
            </CardHeader>
            <CardContent>
              {userContract ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{userContract.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">{userContract.employerName}</p>
                    </div>
                    <Badge 
                      variant="default"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.text
                      }}
                    >
                      {userContract.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>Salary:</span>
                      </div>
                      <span className="font-medium">{userContract.salary}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Duration:</span>
                      </div>
                      <span className="font-medium">{userContract.duration}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Start Date:</span>
                      </div>
                      <span className="font-medium">{userContract.startDate}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>Location:</span>
                      </div>
                      <span className="font-medium">{userContract.location}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                    asChild
                  >
                    <Link href="/worker/contracts">
                      <FileText className="mr-2 h-4 w-4" />
                      View Contract Details
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Active Contract</h3>
                  <p className="text-muted-foreground mb-4">Start browsing jobs to find your perfect match</p>
                  <Button 
                    onClick={() => handleQuickAction('apply')}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Available Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services & Subscriptions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                My Services
              </CardTitle>
              <CardDescription>Active subscriptions and coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Insurance Coverage",
                    description: "Health & Travel Protection",
                    active: user.subscriptions.insurance,
                    icon: Shield,
                    color: "text-blue-500"
                  },
                  {
                    name: "Legal Support",
                    description: "Contract & Legal Assistance",
                    active: user.subscriptions.legal,
                    icon: FileText,
                    color: "text-green-500"
                  },
                  {
                    name: "Medical Cover",
                    description: "Health Examinations & Care",
                    active: user.subscriptions.medical,
                    icon: Heart,
                    color: "text-red-500"
                  }
                ].map((service, index) => (
                  <div 
                    key={service.name}
                    className="flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:scale-105 border border-border/50"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                      >
                        <service.icon className={cn("h-6 w-6", service.color)} />
                      </div>
                      <div>
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-xs text-muted-foreground">{service.description}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={service.active ? "default" : "secondary"}
                      style={service.active ? {
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.text
                      } : {}}
                    >
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/10 bg-transparent"
                  asChild
                >
                  <Link href="/worker/services">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage All Services
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <Card 
          className="border-0 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}05 0%, ${currentTheme.colors.backgroundLight} 50%, ${currentTheme.colors.background} 100%)`
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used features for instant access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="outline"
                  className="h-24 flex-col gap-3 border-2 border-border/30 hover:border-primary/30 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <div className={cn("p-3 rounded-xl", action.bgColor)}>
                    <action.icon className={cn("h-6 w-6", action.color)} />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recommended For You
            </CardTitle>
            <CardDescription>Jobs matching your skills and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div 
                  key={job.id}
                  className="flex items-start justify-between rounded-xl p-4 transition-all duration-300 hover:scale-105 border border-border/50"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div 
                        className="flex h-12 w-12 items-center justify-center rounded-xl mt-1"
                        style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                      >
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.employerName} • {job.location}, {job.country}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                          >
                            {job.salary}
                          </Badge>
                          <Badge variant="outline">{job.status}</Badge>
                          <Badge variant="outline">{job.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('apply')}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full border-primary/30 hover:bg-primary/10 bg-transparent"
                onClick={() => handleQuickAction('apply')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                View All Job Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}