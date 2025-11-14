"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  UserCheck,
  Clock4,
  Zap,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Enhanced mock distress reports data with more realistic fields
const mockDistressReports = [
  {
    id: "DR001",
    workerId: "W001",
    workerName: "Jane Wanjiku",
    employerId: "E001",
    employerName: "Al-Rashid Family",
    type: "Salary Dispute",
    priority: "critical",
    status: "open",
    description: "Salary payment delayed for 2 months. Employer not responding to requests. Worker facing financial hardship and unable to send money to family.",
    reportedDate: "2025-01-15",
    location: "Muscat, Oman",
    contact: "+968 1234 5678",
    lastUpdated: "2 hours ago",
    responseTime: "12 hours",
    assignedAgent: "Not assigned",
    escalationLevel: 3,
    riskScore: 92,
    followUps: 2,
    attachments: 1,
    category: "Financial"
  },
  {
    id: "DR002",
    workerId: "W002",
    workerName: "Mary Akinyi",
    employerId: "E002",
    employerName: "Al-Balushi Residence",
    type: "Working Conditions",
    priority: "critical",
    status: "investigating",
    description: "Unsafe working conditions reported. Worker requesting immediate intervention. No proper safety equipment provided.",
    reportedDate: "2025-01-18",
    location: "Salalah, Oman",
    contact: "+968 2345 6789",
    lastUpdated: "30 minutes ago",
    responseTime: "4 hours",
    assignedAgent: "Agent Sarah",
    escalationLevel: 2,
    riskScore: 88,
    followUps: 3,
    attachments: 0,
    category: "Safety"
  },
  {
    id: "DR003",
    workerId: "W003",
    workerName: "Grace Njeri",
    employerId: "E003",
    employerName: "Al-Hinai Family",
    type: "Contract Violation",
    priority: "high",
    status: "resolved",
    description: "Working hours exceeded contract terms. Issue resolved through mediation and employer agreement.",
    reportedDate: "2025-01-10",
    resolvedDate: "2025-01-20",
    location: "Muscat, Oman",
    contact: "+968 3456 7890",
    lastUpdated: "3 days ago",
    responseTime: "2 hours",
    assignedAgent: "Agent David",
    escalationLevel: 1,
    riskScore: 65,
    followUps: 5,
    attachments: 2,
    category: "Contract"
  },
  {
    id: "DR004",
    workerId: "W004",
    workerName: "Lucy Muthoni",
    employerId: "E004",
    employerName: "Al-Lawati Household",
    type: "Harassment",
    priority: "critical",
    status: "open",
    description: "Worker reports verbal harassment and intimidation. Requesting legal intervention and possible relocation.",
    reportedDate: "2025-01-22",
    location: "Nizwa, Oman",
    contact: "+968 4567 8901",
    lastUpdated: "1 hour ago",
    responseTime: "6 hours",
    assignedAgent: "Not assigned",
    escalationLevel: 3,
    riskScore: 95,
    followUps: 1,
    attachments: 0,
    category: "Harassment"
  },
  {
    id: "DR005",
    workerId: "W005",
    workerName: "Sarah Wambui",
    employerId: "E005",
    employerName: "Al-Kindi Family",
    type: "Medical Emergency",
    priority: "critical",
    status: "investigating",
    description: "Worker fell ill, employer refusing medical treatment. Emergency response needed immediately.",
    reportedDate: "2025-01-23",
    location: "Sohar, Oman",
    contact: "+968 5678 9012",
    lastUpdated: "15 minutes ago",
    responseTime: "1 hour",
    assignedAgent: "Agent Mike",
    escalationLevel: 3,
    riskScore: 98,
    followUps: 0,
    attachments: 1,
    category: "Medical"
  },
  {
    id: "DR006",
    workerId: "W006",
    workerName: "Esther Achieng",
    employerId: "E006",
    employerName: "Al-Maskari Company",
    type: "Accommodation",
    priority: "medium",
    status: "open",
    description: "Poor living conditions in provided accommodation. No proper sanitation facilities.",
    reportedDate: "2025-01-21",
    location: "Muscat, Oman",
    contact: "+968 6789 0123",
    lastUpdated: "5 hours ago",
    responseTime: "24 hours",
    assignedAgent: "Not assigned",
    escalationLevel: 1,
    riskScore: 45,
    followUps: 1,
    attachments: 3,
    category: "Accommodation"
  }
]

// Mock data for additional features
const mockAgents = ["Agent Sarah", "Agent David", "Agent Mike", "Agent Lisa", "Agent John"]
const mockCategories = ["Financial", "Safety", "Contract", "Harassment", "Medical", "Accommodation", "Legal", "Other"]
const mockResponseTimes = [
  { hour: "00", reports: 2, avgTime: "3.2h" },
  { hour: "04", reports: 1, avgTime: "2.8h" },
  { hour: "08", reports: 5, avgTime: "1.5h" },
  { hour: "12", reports: 8, avgTime: "2.1h" },
  { hour: "16", reports: 6, avgTime: "3.4h" },
  { hour: "20", reports: 3, avgTime: "4.2h" }
]

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

// Risk Score Indicator
const RiskScore = ({ score }: { score: number }) => {
  let color = "text-green-500"
  if (score >= 80) color = "text-red-500"
  else if (score >= 60) color = "text-yellow-500"
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className={cn("h-2 rounded-full", {
            "bg-red-500": score >= 80,
            "bg-yellow-500": score >= 60 && score < 80,
            "bg-green-500": score < 60
          })}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <span className={cn("text-sm font-medium", color)}>{score}</span>
    </div>
  )
}

export default function AdminDistressPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [actionNotes, setActionNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "ADMIN") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      case "investigating":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "resolved":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "investigating":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleExportData = () => {
    // Simulate export functionality
    alert("Exporting distress reports data...")
  }

  // Filter reports based on search and filters
  const filteredReports = mockDistressReports.filter(report => {
    const matchesSearch = 
      report.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const criticalReports = mockDistressReports.filter((r) => r.priority === "critical" && r.status !== "resolved")
  const openReports = mockDistressReports.filter((r) => r.status === "open")
  const investigatingReports = mockDistressReports.filter((r) => r.status === "investigating")
  const resolvedReports = mockDistressReports.filter((r) => r.status === "resolved")

  const stats = {
    total: mockDistressReports.length,
    critical: criticalReports.length,
    open: openReports.length,
    investigating: investigatingReports.length,
    resolved: resolvedReports.length,
    responseRate: 87,
    avgResponseTime: "4.2 hours",
    avgRiskScore: Math.round(mockDistressReports.reduce((acc, r) => acc + r.riskScore, 0) / mockDistressReports.length),
    unassigned: mockDistressReports.filter(r => r.assignedAgent === "Not assigned").length
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with User Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Distress Reports Center
                </h1>
                <p className="text-muted-foreground">Monitor and respond to worker emergency reports in real-time</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Active Cases</div>
              <div className="text-2xl font-bold text-red-600">
                <AnimatedCounter value={stats.critical} />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden sm:block">{user?.name || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

        {/* Critical Alerts Banner */}
        {criticalReports.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 shadow-lg animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 animate-bounce" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 dark:text-red-400">
                    {criticalReports.length} Critical Alert{criticalReports.length > 1 ? 's' : ''} Requiring Immediate Attention
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Emergency situations that need urgent intervention
                  </p>
                </div>
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  URGENT
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={stats.total} />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Reports</div>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <Progress value={100} className="h-1 mt-2 bg-blue-200" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    <AnimatedCounter value={stats.critical} />
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Cases</div>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <Progress value={(stats.critical / stats.total) * 100} className="h-1 mt-2 bg-red-200" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    <AnimatedCounter value={stats.unassigned} />
                  </div>
                  <div className="text-sm text-muted-foreground">Unassigned</div>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <UserCheck className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <Progress value={(stats.unassigned / stats.total) * 100} className="h-1 mt-2 bg-yellow-200" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.avgRiskScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Risk Score</div>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <Progress value={stats.avgRiskScore} className="h-1 mt-2 bg-purple-200" />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Performance Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Response Performance
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.responseRate}%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                  <Progress value={stats.responseRate} className="h-2 mt-2 bg-green-200" />
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.avgResponseTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  <Progress value={75} className="h-2 mt-2 bg-blue-200" />
                </div>
              </div>
              
              {/* Response Time Chart */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Response Time by Hour</h4>
                <div className="flex items-end justify-between h-20 gap-1">
                  {mockResponseTimes.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${(parseFloat(item.avgTime) / 6) * 40}px` }}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-1">{item.hour}:00</div>
                      <div className="text-xs font-medium">{item.avgTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-red-500 hover:bg-red-600 text-white">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Protocol
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Embassy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Agent
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Alert
                </Button>
              </div>
              
              {/* Recent Activity */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>New critical report</span>
                    <span className="text-muted-foreground">2m ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Case DR004 assigned</span>
                    <span className="text-muted-foreground">15m ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Case DR003 resolved</span>
                    <span className="text-muted-foreground">1h ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Reports Table with Search and Filters */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Distress Reports</CardTitle>
                <CardDescription>Comprehensive view of all worker distress reports and their status</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredReports.length} reports
                </Badge>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                </Button>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by ID, worker name, or type..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="open">Open ({openReports.length})</TabsTrigger>
                <TabsTrigger value="investigating">Investigating ({investigatingReports.length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({resolvedReports.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Details</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{report.id}</span>
                                <Badge variant={getPriorityColor(report.priority)} className="text-xs">
                                  {report.priority}
                                </Badge>
                              </div>
                              <div className="font-medium">{report.workerName}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {report.location}
                              </div>
                              <div className="text-xs text-muted-foreground">{report.type}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getPriorityColor(report.priority)} 
                              className={cn(
                                report.priority === "critical" && "animate-pulse"
                              )}
                            >
                              {report.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <RiskScore score={report.riskScore} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(report.status)}
                              <Badge variant="outline" className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{report.responseTime}</div>
                            <div className="text-xs text-muted-foreground">Last: {report.lastUpdated}</div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "text-sm",
                              report.assignedAgent === "Not assigned" && "text-muted-foreground italic"
                            )}>
                              {report.assignedAgent}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedReport(report)
                                  setIsDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                                  <DropdownMenuItem>Escalate Case</DropdownMenuItem>
                                  <DropdownMenuItem>Add Note</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Mark Urgent</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Filtered tabs content would go here */}
              <TabsContent value="open" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Open reports table view
                </div>
              </TabsContent>

              <TabsContent value="investigating" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Investigating reports table view
                </div>
              </TabsContent>

              <TabsContent value="resolved" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Resolved reports table view
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Report Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Distress Report Details - {selectedReport?.id}
            </DialogTitle>
            <DialogDescription>
              Review and take action on this emergency report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Header with critical info */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-red-700 dark:text-red-300 font-medium">Priority</div>
                    <Badge variant="destructive" className="mt-1 text-base">
                      {selectedReport.priority.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Risk Score</div>
                    <div className="font-bold text-red-600">{selectedReport.riskScore}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Response Time</div>
                    <div className="font-bold text-green-600">{selectedReport.responseTime}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Escalation Level</div>
                    <div className="font-bold text-orange-600">Level {selectedReport.escalationLevel}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Worker and Employer Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      Worker Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Name</div>
                      <div className="font-medium">{selectedReport.workerName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Worker ID</div>
                      <div className="font-mono text-sm">{selectedReport.workerId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Contact</div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">{selectedReport.contact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      Employer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Employer</div>
                      <div className="font-medium">{selectedReport.employerName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Employer ID</div>
                      <div className="font-mono text-sm">{selectedReport.employerId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedReport.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Report Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Incident Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Issue Type</Label>
                      <div className="font-medium">{selectedReport.type}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <div>
                        <Badge variant="outline">{selectedReport.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <div className="mt-2 rounded-lg border bg-muted/30 p-4 text-sm">
                      {selectedReport.description}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Reported Date</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{selectedReport.reportedDate}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Assigned Agent</Label>
                      <div className={cn(
                        "font-medium",
                        selectedReport.assignedAgent === "Not assigned" && "text-muted-foreground italic"
                      )}>
                        {selectedReport.assignedAgent}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Follow-ups</Label>
                      <div className="font-medium">{selectedReport.followUps}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Take Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="action-notes">Action Notes & Plan</Label>
                    <Textarea
                      id="action-notes"
                      placeholder="Enter detailed action plan, notes, and next steps..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button className="flex-1 bg-red-500 hover:bg-red-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Emergency Response
                    </Button>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Start Investigation
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Parties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              // Handle save action
              setIsDialogOpen(false)
            }}>
              Save Actions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}