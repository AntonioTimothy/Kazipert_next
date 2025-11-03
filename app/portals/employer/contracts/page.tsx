"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import {
  FileText,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Download,
  Eye,
  MessageCircle,
  Phone,
  Video,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Shield,
  Heart,
  Briefcase,
  Home,
  Utensils,
  Wifi,
  Car,
  Plane,
  Gift,
  Coffee,
  BookOpen,
  Music,
  Dumbbell,
  Palette,
  Languages,
  Baby,
  Dog,
  Cat,
  Sprout,
  Trophy,
  Award,
  Target,
  BarChart3,
  PieChart,
  FileSearch,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Clock as ClockIcon,
  UserCheck,
  FileCheck,
  CalendarDays,
  Banknote,
  Building,
  Mail,
  PhoneCall,
  MapPin as MapPinIcon,
  HeartHandshake,
  Handshake,
  Signature,
  Scale,
  Gavel,
  FileDigit,
  QRCode,
  Scan
} from "lucide-react"

export default function EmployerContractsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")

  // Mock contract data
  const [contracts, setContracts] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    pendingContracts: 0,
    completedContracts: 0
  })

  // Sample contract for demonstration
  const sampleContract = {
    id: "CT-2024-001",
    employee: {
      name: "Sarah Johnson",
      role: "Senior Domestic Worker",
      avatar: "/avatars/sarah.jpg",
      nationality: "Kenyan",
      age: 28,
      rating: 4.8,
      completedJobs: 15,
      languages: ["English", "Swahili", "Basic Arabic"],
      skills: ["Childcare", "Cooking", "Cleaning", "First Aid"]
    },
    job: {
      title: "Live-in Domestic Worker",
      type: "Full-time",
      location: "Al Khuwair, Muscat",
      duration: "12 months",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      salary: "$800/month",
      accommodation: "Provided",
      meals: "Included",
      workingHours: "45 hours/week",
      vacation: "30 days/year"
    },
    status: "draft",
    progress: 35,
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    nextAction: "Send to employee for review",
    milestones: [
      { name: "Draft Created", completed: true, date: "2024-01-15" },
      { name: "Under Review", completed: true, date: "2024-01-18" },
      { name: "Employee Review", completed: false, date: "Pending" },
      { name: "Signatures", completed: false, date: "Pending" },
      { name: "Active", completed: false, date: "Pending" }
    ],
    documents: [
      { name: "Employment Contract", type: "pdf", uploaded: "2024-01-15" },
      { name: "Job Description", type: "doc", uploaded: "2024-01-15" },
      { name: "House Rules", type: "pdf", uploaded: "2024-01-16" }
    ],
    terms: {
      probationPeriod: "3 months",
      noticePeriod: "30 days",
      overtimePolicy: "Paid overtime after 45 hours",
      benefits: ["Health Insurance", "Annual Flight", "30 Days Vacation"],
      responsibilities: [
        "House cleaning and maintenance",
        "Cooking daily meals",
        "Childcare and supervision",
        "Grocery shopping",
        "Laundry and ironing"
      ]
    }
  }

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
      
      // For demo purposes, we'll show empty contracts with the sample
      setContracts([]) // Empty array to show "no employees" state
      
      setStats({
        totalContracts: 0,
        activeContracts: 0,
        pendingContracts: 0,
        completedContracts: 0
      })
      
      setLoading(false)
    }

    loadData()
  }, [router])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200'
      case 'draft': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'completed': return 'bg-purple-500/10 text-purple-600 border-purple-200'
      case 'expired': return 'bg-gray-500/10 text-gray-600 border-gray-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <ClockIcon className="h-4 w-4" />
      case 'draft': return <FileText className="h-4 w-4" />
      case 'completed': return <Trophy className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleCreateContract = () => {
    router.push('/employer/jobs/create')
  }

  const handleViewSample = () => {
    // Show sample contract details
    setContracts([sampleContract])
    setStats({
      totalContracts: 1,
      activeContracts: 0,
      pendingContracts: 1,
      completedContracts: 0
    })
  }

  // Skeleton loading components
  const ContractCardSkeleton = () => (
    <div className="border-2 border-border/50 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 rounded w-full"></div>
        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  )

  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-background rounded-2xl p-4 border border-border animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Stats Skeleton */}
          <StatsSkeleton />
          
          {/* Tabs Skeleton */}
          <div className="border-0 rounded-lg p-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <ContractCardSkeleton />
              <ContractCardSkeleton />
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
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <FileText className="h-6 w-6 md:h-8 md:w-8" style={{ color: currentTheme.colors.primary }} />
              Employment Contracts
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              Manage your domestic worker contracts and agreements
            </p>
          </div>
          <Button 
            onClick={handleCreateContract}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Stats Overview */}
        {contracts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                  >
                    <FileText className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalContracts}</div>
                    <div className="text-sm text-muted-foreground">Total Contracts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: currentTheme.colors.accent + '15' }}
                  >
                    <UserCheck className="h-5 w-5" style={{ color: currentTheme.colors.accent }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.activeContracts}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: '#f59e0b' + '15' }}
                  >
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.pendingContracts}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: '#8b5cf6' + '15' }}
                  >
                    <Trophy className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.completedContracts}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Empty State with Creative Design */
          <Card 
            className="border-0 text-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}08 0%, ${currentTheme.colors.accent}05 100%)`
            }}
          >
            <CardContent className="p-12">
              <div className="max-w-md mx-auto">
                {/* Animated Icons */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <div 
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{ backgroundColor: currentTheme.colors.primary + '20' }}
                    ></div>
                    <div 
                      className="absolute inset-2 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.colors.primary + '30' }}
                    >
                      <Users className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-2 left-1/4">
                    <FileText className="h-6 w-6 text-blue-400 animate-bounce" />
                  </div>
                  <div className="absolute top-4 right-1/4">
                    <Search className="h-5 w-5 text-green-400 animate-bounce delay-75" />
                  </div>
                  <div className="absolute bottom-2 left-1/3">
                    <Handshake className="h-5 w-5 text-purple-400 animate-bounce delay-150" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                  No Employees Onboarded Yet
                </h2>
                
                <p className="text-lg mb-2" style={{ color: currentTheme.colors.textLight }}>
                  📝 Post your first job to find the perfect domestic worker
                </p>
                
                <p className="text-sm mb-8" style={{ color: currentTheme.colors.textLight }}>
                  Create detailed job posts to attract qualified candidates and start building your team
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={handleCreateContract}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Post Your First Job
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleViewSample}
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View Sample Contract
                  </Button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <FileDigit className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <h4 className="font-semibold mb-2">Digital Contracts</h4>
                    <p className="text-sm text-muted-foreground">
                      Legally binding e-signatures
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.colors.accent + '15' }}
                    >
                      <Shield className="h-6 w-6" style={{ color: currentTheme.colors.accent }} />
                    </div>
                    <h4 className="font-semibold mb-2">Secure & Compliant</h4>
                    <p className="text-sm text-muted-foreground">
                      Omani labor law compliant
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div 
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: '#10b981' + '15' }}
                    >
                      <Zap className="h-6 w-6 text-green-500" />
                    </div>
                    <h4 className="font-semibold mb-2">Quick Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Ready in minutes, not days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contracts List */}
        {contracts.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 p-1 rounded-lg bg-muted/50 m-6 mb-0">
                  <TabsTrigger value="all" className="rounded-md text-sm">
                    All Contracts
                  </TabsTrigger>
                  <TabsTrigger value="active" className="rounded-md text-sm">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-md text-sm">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="rounded-md text-sm">
                    Draft
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="rounded-md text-sm">
                    Completed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-6 p-6">
                  {contracts.map((contract) => (
                    <Card key={contract.id} className="border-0 shadow-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          {/* Contract Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-14 w-14 border-2" style={{ borderColor: currentTheme.colors.primary }}>
                                <AvatarFallback 
                                  className="text-white font-semibold"
                                  style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                  {contract.employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                                    {contract.employee.name}
                                  </h3>
                                  <Badge className={cn("flex items-center gap-1", getStatusColor(contract.status))}>
                                    {getStatusIcon(contract.status)}
                                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-1">{contract.job.title}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{contract.job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>
                                      {contract.job.salary}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{contract.job.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Contract Progress</span>
                              <span style={{ color: currentTheme.colors.primary }}>{contract.progress}%</span>
                            </div>
                            <Progress 
                              value={contract.progress} 
                              className="h-2"
                              style={{
                                backgroundColor: currentTheme.colors.backgroundLight
                              }}
                            />
                          </div>

                          {/* Milestones */}
                          <div className="grid grid-cols-5 gap-2 mb-6">
                            {contract.milestones.map((milestone: any, index: number) => (
                              <div key={index} className="text-center">
                                <div 
                                  className={cn(
                                    "w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm",
                                    milestone.completed 
                                      ? "bg-green-500" 
                                      : "bg-gray-300"
                                  )}
                                >
                                  {milestone.completed ? "✓" : index + 1}
                                </div>
                                <div className="text-xs font-medium mb-1">{milestone.name}</div>
                                <div className="text-xs text-muted-foreground">{milestone.date}</div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>

                        {/* Contract Footer */}
                        <div 
                          className="px-6 py-4 border-t"
                          style={{ 
                            backgroundColor: currentTheme.colors.primary + '08',
                            borderColor: currentTheme.colors.border
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              Contract ID: {contract.id} • Created: {contract.createdAt}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Next:</span>
                              <span className="text-sm font-medium">{contract.nextAction}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats for Sample Contract */}
        {contracts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileSearch className="h-4 w-4" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{sampleContract.job.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{sampleContract.job.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Probation</span>
                  <span className="font-medium">{sampleContract.terms.probationPeriod}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Banknote className="h-4 w-4" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Salary</span>
                  <span className="font-medium text-green-600">{sampleContract.job.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accommodation</span>
                  <span className="font-medium">{sampleContract.job.accommodation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meals</span>
                  <span className="font-medium">{sampleContract.job.meals}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4" />
                  Employee Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500 mb-2">{sampleContract.employee.rating}/5</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(sampleContract.employee.rating) 
                            ? "text-amber-500 fill-amber-500" 
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {sampleContract.employee.completedJobs} jobs completed
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}