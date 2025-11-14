"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Users,
  UserCheck,
  UserX,
  Building,
  Shield,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Ban,
  Eye,
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Types
interface AnalyticsData {
  overview: {
    totalUsers: number
    totalEmployers: number
    totalEmployees: number
    totalAdmins: number
    activeUsers: number
    pendingUsers: number
    suspendedUsers: number
    verifiedUsers: number
    verificationRate: number
  }
  trends: {
    todayRegistrations: number
    weekRegistrations: number
    monthRegistrations: number
    registrationData: Array<{ date: string; count: number }>
    growthRate: number
  }
  distribution: {
    roles: Array<{ role: string; count: number }>
    verification: {
      emailVerified: number
      phoneVerified: number
      fullyVerified: number
    }
  }
  timestamp: string
}

// Color constants
const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82', 
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1500, className = "" }: { value: number; duration?: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <span className={cn("font-bold", className)}>
      {displayValue.toLocaleString()}
    </span>
  )
}

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  onClick,
  color = KAZIPERT_COLORS.primary 
}: { 
  title: string
  value: number
  icon: any
  description: string
  trend?: number
  onClick?: () => void
  color?: string
}) => {
  const isPositive = trend && trend >= 0
  
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4",
        onClick && "hover:scale-105 transform transition-transform"
      )}
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold" style={{ color }}>
                <AnimatedCounter value={value} />
              </h3>
              {trend !== undefined && (
                <Badge 
                  variant={isPositive ? "default" : "destructive"} 
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}
                >
                  {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          </div>
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mini Chart Component for registration trends
const MiniChart = ({ data }: { data: Array<{ date: string; count: number }> }) => {
  const maxValue = Math.max(...data.map(d => d.count))
  
  return (
    <div className="flex items-end justify-between h-12 gap-1">
      {data.slice(-7).map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full rounded-t transition-all hover:opacity-80"
            style={{ 
              backgroundColor: KAZIPERT_COLORS.primary,
              height: `${maxValue > 0 ? (item.count / maxValue) * 30 : 0}px`
            }}
            title={`${item.date}: ${item.count} users`}
          ></div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(item.date).getDate()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  // Check authentication and fetch analytics
  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!['ADMIN', 'SUPER_ADMIN'].includes(parsedUser.role)) {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchAnalytics()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleExportData = () => {
    // Simulate export functionality
    alert("Exporting analytics data...")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg" style={{ backgroundColor: `${KAZIPERT_COLORS.primary}15` }}>
                <BarChart3 className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                  Users Analytics
                </h1>
                <p className="text-muted-foreground">Comprehensive overview of user statistics and trends</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-sm font-medium">
                {analytics ? formatDate(analytics.timestamp) : 'Loading...'}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden sm:block">{user?.name || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/login')}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Dashboard Overview</h2>
            <p className="text-muted-foreground">Real-time user statistics and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAnalytics} disabled={refreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => router.push('/admin/users')}
              style={{ backgroundColor: KAZIPERT_COLORS.primary }}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </div>
        </div>

        {/* Main Stats Grid */}
        {analytics && (
          <>
            {/* Overview Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={analytics.overview.totalUsers}
                icon={Users}
                description="All registered users"
                trend={analytics.trends.growthRate}
                onClick={() => router.push('/admin/users')}
                color={KAZIPERT_COLORS.primary}
              />
              
              <StatCard
                title="Active Users"
                value={analytics.overview.activeUsers}
                icon={UserCheck}
                description="Verified and active accounts"
                onClick={() => router.push('/admin/users?status=active')}
                color="#10b981"
              />
              
              <StatCard
                title="Pending Verification"
                value={analytics.overview.pendingUsers}
                icon={Clock}
                description="Awaiting verification"
                onClick={() => router.push('/admin/users?status=pending')}
                color="#f59e0b"
              />
              
              <StatCard
                title="Suspended"
                value={analytics.overview.suspendedUsers}
                icon={UserX}
                description="Suspended accounts"
                onClick={() => router.push('/admin/users?status=suspended')}
                color="#ef4444"
              />
            </div>

            {/* Role Distribution */}
            <div className="grid gap-6 lg:grid-cols-3">
              <StatCard
                title="Employers"
                value={analytics.overview.totalEmployers}
                icon={Building}
                description="Business accounts"
                onClick={() => router.push('/admin/users?role=EMPLOYER')}
                color="#3b82f6"
              />
              
              <StatCard
                title="Employees"
                value={analytics.overview.totalEmployees}
                icon={UserCheck}
                description="Worker accounts"
                onClick={() => router.push('/admin/users?role=EMPLOYEE')}
                color="#10b981"
              />
              
              <StatCard
                title="Admins"
                value={analytics.overview.totalAdmins}
                icon={Shield}
                description="Administrative accounts"
                onClick={() => router.push('/admin/users?role=ADMIN')}
                color="#8b5cf6"
              />
            </div>

            {/* Trends and Additional Stats */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Registration Trends */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Registration Trends
                  </CardTitle>
                  <CardDescription>User registrations over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <MiniChart data={analytics.trends.registrationData} />
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.trends.todayRegistrations}
                        </div>
                        <div className="text-xs text-muted-foreground">Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analytics.trends.weekRegistrations}
                        </div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {analytics.trends.monthRegistrations}
                        </div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Stats */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Verification Status
                  </CardTitle>
                  <CardDescription>Account verification progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Email Verified</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{analytics.distribution.verification.emailVerified}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((analytics.distribution.verification.emailVerified / analytics.overview.totalUsers) * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Phone Verified</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{analytics.distribution.verification.phoneVerified}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((analytics.distribution.verification.phoneVerified / analytics.overview.totalUsers) * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Fully Verified</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{analytics.distribution.verification.fullyVerified}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((analytics.distribution.verification.fullyVerified / analytics.overview.totalUsers) * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Overall Verification Rate</span>
                        <Badge className="bg-green-100 text-green-800">
                          {analytics.overview.verificationRate}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => router.push('/admin/users?status=pending')}
                  >
                    <Clock className="h-6 w-6 text-yellow-500" />
                    <span>Review Pending</span>
                    <Badge variant="outline" className="mt-1">
                      {analytics.overview.pendingUsers}
                    </Badge>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => router.push('/admin/users?status=suspended')}
                  >
                    <Ban className="h-6 w-6 text-red-500" />
                    <span>Manage Suspended</span>
                    <Badge variant="outline" className="mt-1">
                      {analytics.overview.suspendedUsers}
                    </Badge>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => router.push('/admin/users?role=EMPLOYER')}
                  >
                    <Building className="h-6 w-6 text-blue-500" />
                    <span>Employer Accounts</span>
                    <Badge variant="outline" className="mt-1">
                      {analytics.overview.totalEmployers}
                    </Badge>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex flex-col gap-2"
                    onClick={() => router.push('/admin/users?role=EMPLOYEE')}
                  >
                    <UserCheck className="h-6 w-6 text-green-500" />
                    <span>Employee Accounts</span>
                    <Badge variant="outline" className="mt-1">
                      {analytics.overview.totalEmployees}
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Loading State */}
        {!analytics && !loading && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Loading Analytics</h3>
            <p className="text-muted-foreground mt-2">Gathering user statistics...</p>
          </div>
        )}
      </div>
    </div>
  )
}