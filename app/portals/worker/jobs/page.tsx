"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Briefcase,
  FileText,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Zap,
  Filter,
  Bookmark,
  Eye,
  Heart,
  Utensils,
  Car,
  Home as HomeIcon,
  Baby,
  Sprout,
  Shirt,
  Coffee,
  Dog,
  Sparkles,
  AlertCircle,
  User,
  Star,
  CheckCircle,
  Clock4,
  BookmarkCheck,
  MoreHorizontal,
  ChevronRight,
  Building,
  Award,
  Shield,
  GraduationCap,
  Users as UsersIcon,
  Crown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

// Enhanced domestic job listings with family size and kid information
const domesticJobs = [
  {
    id: "DOM001",
    title: "Live-in House Manager",
    employerName: "Sarah Johnson",
    location: "Westlands, Nairobi",
    salary: 35000,
    salaryDisplay: "KSh 25,000-35,000/month",
    type: "Full-time",
    status: "open",
    urgent: true,
    description: "Looking for a reliable house manager to oversee daily household operations. Must be organized and trustworthy with excellent communication skills.",
    contractTerms: ["Live-in position", "2-year contract", "30 days annual leave", "Medical cover", "Performance bonus"],
    requirements: ["5+ years experience", "Reference letters", "First Aid training", "Management skills"],
    category: "House Management",
    familySize: "large",
    hasKids: true,
    kidsAge: "5-12 years",
    postedDate: "2024-01-15",
    applications: 8,
    views: 145,
    employerRating: 4.8,
    employerReviews: 23,
    saved: false,
    applied: false,
    matchScore: 95
  },
  {
    id: "DOM002",
    title: "Professional Nanny",
    employerName: "James & Lisa",
    location: "Karen, Nairobi",
    salary: 28000,
    salaryDisplay: "KSh 20,000-28,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Caring nanny needed for two children aged 3 and 6. Must have childcare experience and genuine love for children. Educational background preferred.",
    contractTerms: ["Live-in preferred", "1-year contract", "Weekends off", "School holidays", "Travel opportunities"],
    requirements: ["Childcare experience", "CPR certified", "Early education background", "Patience"],
    category: "Childcare",
    familySize: "small",
    hasKids: true,
    kidsAge: "3-6 years",
    postedDate: "2024-01-14",
    applications: 12,
    views: 267,
    employerRating: 4.9,
    employerReviews: 45,
    saved: true,
    applied: false,
    matchScore: 88
  },
  {
    id: "DOM003",
    title: "Elderly Companion",
    employerName: "Margaret Wambui",
    location: "Runda, Nairobi",
    salary: 25000,
    salaryDisplay: "KSh 18,000-25,000/month",
    type: "Full-time",
    status: "open",
    urgent: true,
    description: "Compassionate companion needed for elderly gentleman. Light housekeeping and medication reminders. Must be patient and understanding.",
    contractTerms: ["Live-in available", "Flexible schedule", "Health insurance", "Transport allowance", "Accommodation"],
    requirements: ["Nursing background", "Patience & empathy", "Reference required", "First Aid knowledge"],
    category: "Elderly Care",
    familySize: "single",
    hasKids: false,
    kidsAge: "N/A",
    postedDate: "2024-01-16",
    applications: 5,
    views: 89,
    employerRating: 4.7,
    employerReviews: 12,
    saved: false,
    applied: false,
    matchScore: 92
  },
  {
    id: "DOM004",
    title: "Family Chef",
    employerName: "David Omondi",
    location: "Lavington, Nairobi",
    salary: 40000,
    salaryDisplay: "KSh 30,000-40,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Experienced chef needed for family of 4. Must prepare healthy meals and manage kitchen inventory. International cuisine knowledge preferred.",
    contractTerms: ["Live-out", "5-day week", "Food allowance", "Uniform provided", "Cooking budget"],
    requirements: ["Culinary training", "5+ years experience", "Menu planning", "Hygiëne certificate", "Creative cooking"],
    category: "Cooking",
    familySize: "medium",
    hasKids: true,
    kidsAge: "8-15 years",
    postedDate: "2024-01-13",
    applications: 15,
    views: 312,
    employerRating: 4.6,
    employerReviews: 34,
    saved: false,
    applied: true,
    matchScore: 78
  },
  {
    id: "DOM005",
    title: "Gardener & Handyman",
    employerName: "Grace Mwende",
    location: "Kitisuru, Nairobi",
    salary: 22000,
    salaryDisplay: "KSh 15,000-22,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Skilled gardener with basic handyman skills needed for large compound maintenance. Knowledge of tropical plants and irrigation systems required.",
    contractTerms: ["Live-out", "6-day week", "Tools provided", "Performance bonus", "Training opportunities"],
    requirements: ["Gardening experience", "Basic repairs", "Plant knowledge", "Physical fitness", "Landscaping skills"],
    category: "Gardening",
    familySize: "large",
    hasKids: true,
    kidsAge: "Teenagers",
    postedDate: "2024-01-12",
    applications: 7,
    views: 134,
    employerRating: 4.8,
    employerReviews: 28,
    saved: true,
    applied: false,
    matchScore: 85
  },
  {
    id: "DOM006",
    title: "Executive Housekeeper",
    employerName: "Michael & Partners",
    location: "Muthaiga, Nairobi",
    salary: 24000,
    salaryDisplay: "KSh 16,000-24,000/month",
    type: "Full-time",
    status: "open",
    urgent: true,
    description: "Detail-oriented housekeeper for 5-bedroom home. Must maintain high cleanliness standards and manage household supplies efficiently.",
    contractTerms: ["Live-in optional", "45 hours/week", "Accommodation", "Weekly off", "Uniform allowance"],
    requirements: ["3+ years experience", "Organization skills", "Reference required", "Attention to detail"],
    category: "Cleaning",
    familySize: "medium",
    hasKids: false,
    kidsAge: "N/A",
    postedDate: "2024-01-17",
    applications: 11,
    views: 198,
    employerRating: 4.5,
    employerReviews: 19,
    saved: false,
    applied: false,
    matchScore: 90
  },
  {
    id: "DOM007",
    title: "Pet Care Specialist",
    employerName: "Linda Wangari",
    location: "Kilimani, Nairobi",
    salary: 18000,
    salaryDisplay: "KSh 12,000-18,000/month",
    type: "Part-time",
    status: "open",
    urgent: false,
    description: "Animal lover needed to care for two dogs and one cat while family is at work. Must be reliable and have experience with pet care.",
    contractTerms: ["Part-time", "Flexible hours", "Pet supplies covered", "Weekend availability", "Vet visits"],
    requirements: ["Pet care experience", "Vet knowledge", "Reliable", "Love for animals", "Grooming skills"],
    category: "Pet Care",
    familySize: "small",
    hasKids: false,
    kidsAge: "N/A",
    postedDate: "2024-01-14",
    applications: 6,
    views: 87,
    employerRating: 4.9,
    employerReviews: 31,
    saved: false,
    applied: false,
    matchScore: 82
  },
  {
    id: "DOM008",
    title: "Personal Driver",
    employerName: "Ahmed Hassan",
    location: "Eastleigh, Nairobi",
    salary: 30000,
    salaryDisplay: "KSh 22,000-30,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Experienced driver needed for family transportation. Must have clean driving record and knowledge of Nairobi routes.",
    contractTerms: ["Live-out", "6-day week", "Fuel allowance", "Maintenance covered", "Insurance"],
    requirements: ["Valid license", "5+ years experience", "Defensive driving", "GPS knowledge", "Punctual"],
    category: "Driving",
    familySize: "large",
    hasKids: true,
    kidsAge: "Multiple ages",
    postedDate: "2024-01-15",
    applications: 9,
    views: 156,
    employerRating: 4.7,
    employerReviews: 22,
    saved: false,
    applied: true,
    matchScore: 75
  }
]

// Mock applications data
const userApplications = [
  {
    id: "APP001",
    jobId: "DOM004",
    jobTitle: "Family Chef",
    employerName: "David Omondi",
    status: "under_review",
    appliedDate: "2024-01-14",
    employerViewed: true,
    lastUpdate: "2024-01-15"
  },
  {
    id: "APP002",
    jobId: "DOM008",
    jobTitle: "Personal Driver",
    employerName: "Ahmed Hassan",
    status: "pending_details",
    appliedDate: "2024-01-13",
    employerViewed: false,
    lastUpdate: "2024-01-14"
  }
]

// Mock saved jobs
const savedJobs = domesticJobs.filter(job => job.saved)

// Filter options
const FILTER_OPTIONS = {
  ALL: "all",
  NO_KIDS: "no_kids",
  SMALL_FAMILY: "small_family",
  MEDIUM_FAMILY: "medium_family",
  LARGE_FAMILY: "large_family",
  LOWEST_PAY: "lowest_pay",
  HIGHEST_PAY: "highest_pay"
}

export default function WorkerJobsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("browse")
  const [jobs, setJobs] = useState(domesticJobs)
  const [savedJobsList, setSavedJobsList] = useState(savedJobs)
  const [applications, setApplications] = useState(userApplications)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS.ALL)
  const jobsPerPage = 6

  useEffect(() => {
    // Simulate API call with timeout
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

  // Filter jobs based on active filter
  const filteredJobs = jobs.filter(job => {
    switch (activeFilter) {
      case FILTER_OPTIONS.NO_KIDS:
        return !job.hasKids
      case FILTER_OPTIONS.SMALL_FAMILY:
        return job.familySize === "small"
      case FILTER_OPTIONS.MEDIUM_FAMILY:
        return job.familySize === "medium"
      case FILTER_OPTIONS.LARGE_FAMILY:
        return job.familySize === "large"
      case FILTER_OPTIONS.LOWEST_PAY:
        return job.salary <= 20000
      case FILTER_OPTIONS.HIGHEST_PAY:
        return job.salary >= 30000
      default:
        return true
    }
  })

  // Sort jobs for salary filters
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (activeFilter === FILTER_OPTIONS.LOWEST_PAY) {
      return a.salary - b.salary
    } else if (activeFilter === FILTER_OPTIONS.HIGHEST_PAY) {
      return b.salary - a.salary
    }
    return 0
  })

  // Simulate loading more jobs
  const loadMoreJobs = async () => {
    setIsLoadingMore(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCurrentPage(prev => prev + 1)
    setIsLoadingMore(false)
  }

  const handleApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId)
    if (job) {
      setApplications(prev => [...prev, {
        id: `APP${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        employerName: job.employerName,
        status: "pending_details",
        appliedDate: new Date().toISOString().split('T')[0],
        employerViewed: false,
        lastUpdate: new Date().toISOString().split('T')[0]
      }])
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j))
    }
  }

  const handleSaveJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ))
    setSavedJobsList(prev => {
      const job = jobs.find(j => j.id === jobId)
      if (!job) return prev
      if (job.saved) {
        return prev.filter(j => j.id !== jobId)
      } else {
        return [...prev, { ...job, saved: true }]
      }
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "House Management":
        return HomeIcon
      case "Childcare":
        return Baby
      case "Elderly Care":
        return Heart
      case "Cooking":
        return Utensils
      case "Gardening":
        return Sprout
      case "Cleaning":
        return Shirt
      case "Pet Care":
        return Dog
      case "Driving":
        return Car
      case "Laundry":
        return Sparkles
      default:
        return Briefcase
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under_review":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0"><Clock4 className="h-3 w-3 mr-1" />Under Review</Badge>
      case "pending_details":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0"><AlertCircle className="h-3 w-3 mr-1" />More Info Needed</Badge>
      case "accepted":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-0"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>
      default:
        return <Badge variant="secondary" className="border-0">Pending</Badge>
    }
  }

  const getFamilySizeIcon = (size: string) => {
    switch (size) {
      case "single":
        return <User className="h-4 w-4" />
      case "small":
        return <UsersIcon className="h-4 w-4" />
      case "medium":
        return <Users className="h-4 w-4" />
      case "large":
        return <Users className="h-4 w-4" />
      default:
        return <UsersIcon className="h-4 w-4" />
    }
  }

  const getFamilySizeColor = (size: string) => {
    switch (size) {
      case "single":
        return "text-gray-600 bg-gray-100"
      case "small":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-blue-600 bg-blue-100"
      case "large":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  // Skeleton loading component
  const JobCardSkeleton = () => (
    <Card className="border-0 shadow-lg animate-pulse bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-gray-200 rounded flex-1"></div>
        <div className="h-10 bg-gray-200 rounded w-10 ml-2"></div>
      </CardFooter>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-3 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          
          {/* Tabs Skeleton */}
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          
          {/* Jobs Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoadingSpinner />
  }

  const displayedJobs = sortedJobs.slice(0, currentPage * jobsPerPage)
  const hasMoreJobs = displayedJobs.length < sortedJobs.length

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        {/* <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Domestic Work Opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find the perfect household role that matches your skills and preferences
          </p>
        </div> */}

        {/* Filter Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Opportunities
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={activeFilter === FILTER_OPTIONS.ALL ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.ALL)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.ALL ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.ALL ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  All Jobs
                </Button>
                <Button
                  variant={activeFilter === FILTER_OPTIONS.NO_KIDS ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.NO_KIDS)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.NO_KIDS ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.NO_KIDS ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  No Kids
                </Button>
                <Button
                  variant={activeFilter === FILTER_OPTIONS.SMALL_FAMILY ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.SMALL_FAMILY)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.SMALL_FAMILY ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.SMALL_FAMILY ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Small Family
                </Button>
                <Button
                  variant={activeFilter === FILTER_OPTIONS.MEDIUM_FAMILY ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.MEDIUM_FAMILY)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.MEDIUM_FAMILY ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.MEDIUM_FAMILY ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Medium Family
                </Button>
                <Button
                  variant={activeFilter === FILTER_OPTIONS.LARGE_FAMILY ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.LARGE_FAMILY)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.LARGE_FAMILY ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.LARGE_FAMILY ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Large Family
                </Button>
                <Button
                  variant={activeFilter === FILTER_OPTIONS.LOWEST_PAY ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.LOWEST_PAY)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.LOWEST_PAY ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.LOWEST_PAY ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Lowest Pay
                </Button>
                <Button
                  variant={activeFilter === FILTER_OPTIONS.HIGHEST_PAY ? "default" : "outline"}
                  onClick={() => setActiveFilter(FILTER_OPTIONS.HIGHEST_PAY)}
                  className="rounded-xl"
                  style={{
                    backgroundColor: activeFilter === FILTER_OPTIONS.HIGHEST_PAY ? currentTheme.colors.primary : 'transparent',
                    color: activeFilter === FILTER_OPTIONS.HIGHEST_PAY ? currentTheme.colors.text : currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Highest Pay
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-0">
              <Briefcase className="h-4 w-4 mr-1" />
              {sortedJobs.length} Opportunities
            </Badge>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-card/80 backdrop-blur-sm rounded-2xl border">
            <TabsTrigger 
              value="browse" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              style={{
                backgroundColor: activeTab === "browse" ? currentTheme.colors.primary : 'transparent',
                color: activeTab === "browse" ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              style={{
                backgroundColor: activeTab === "applications" ? currentTheme.colors.primary : 'transparent',
                color: activeTab === "applications" ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              My Applications
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              style={{
                backgroundColor: activeTab === "pending" ? currentTheme.colors.primary : 'transparent',
                color: activeTab === "pending" ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Clock4 className="h-4 w-4 mr-2" />
              Pending Review
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              style={{
                backgroundColor: activeTab === "saved" ? currentTheme.colors.primary : 'transparent',
                color: activeTab === "saved" ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Saved Jobs
            </TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedJobs.map((job) => {
                const CategoryIcon = getCategoryIcon(job.category)
                return (
                  <Card key={job.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
                    {/* Match Score Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                        {job.matchScore}% Match
                      </Badge>
                    </div>

                    {/* Urgent Badge */}
                    {job.urgent && (
                      <div className="absolute top-4 left-4 z-10 animate-pulse">
                        <Badge variant="destructive" className="px-2 py-1 text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          URGENT
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                          <CategoryIcon className="h-7 w-7 text-primary" />
                        </div>
                        <Badge variant={job.urgent ? "destructive" : "secondary"} className="text-xs border-0">
                          {job.type}
                        </Badge>
                      </div>

                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {job.title}
                      </CardTitle>
                      
                      <CardDescription className="flex items-center gap-2 mt-3">
                        <Building className="h-4 w-4" />
                        <span className="font-medium text-card-foreground">{job.employerName}</span>
                        <div className="flex items-center gap-1 ml-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{job.employerRating}</span>
                          <span className="text-xs text-muted-foreground">({job.employerReviews})</span>
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      {/* Family Info */}
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className={cn("px-2 py-1 text-xs", getFamilySizeColor(job.familySize))}>
                          {getFamilySizeIcon(job.familySize)}
                          <span className="ml-1 capitalize">{job.familySize} Family</span>
                        </Badge>
                        {job.hasKids && (
                          <Badge variant="outline" className="px-2 py-1 text-xs bg-amber-100 text-amber-700 border-0">
                            <Baby className="h-3 w-3 mr-1" />
                            Kids: {job.kidsAge}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-card-foreground">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-bold text-green-600">{job.salaryDisplay}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applications} applied
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.views} views
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1 transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                        onClick={() => handleApply(job.id)}
                        disabled={job.applied}
                      >
                        {job.applied ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Briefcase className="h-4 w-4 mr-2" />
                            Apply Now
                          </>
                        )}
                      </Button>
                      <Button 
                        variant={job.saved ? "default" : "outline"}
                        size="icon"
                        className="transition-all duration-300 hover:scale-110 rounded-xl"
                        onClick={() => handleSaveJob(job.id)}
                        style={{
                          backgroundColor: job.saved ? currentTheme.colors.primary : 'transparent',
                          color: job.saved ? currentTheme.colors.text : currentTheme.colors.text,
                          borderColor: currentTheme.colors.border
                        }}
                      >
                        <Bookmark className={`h-4 w-4 ${job.saved ? 'fill-white' : ''}`} />
                      </Button>
                    </CardFooter>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                  </Card>
                )
              })}
            </div>

            {/* Load More Button */}
            {hasMoreJobs && (
              <div className="text-center">
                <Button 
                  onClick={loadMoreJobs} 
                  disabled={isLoadingMore}
                  variant="outline"
                  className="rounded-xl px-8 py-3 border-2 border-border hover:border-primary/50"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Jobs
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Empty State */}
            {sortedJobs.length === 0 && (
              <Card className="border-0 shadow-xl text-center bg-card/80 backdrop-blur-sm">
                <CardContent className="py-20">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mx-auto mb-6">
                    <Briefcase className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold text-card-foreground mb-3">No jobs found</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                    {activeFilter !== FILTER_OPTIONS.ALL ? "Try adjusting your filters to see more opportunities." : "Check back later for new domestic job opportunities."}
                  </p>
                  {activeFilter !== FILTER_OPTIONS.ALL && (
                    <Button 
                      variant="outline"
                      onClick={() => setActiveFilter(FILTER_OPTIONS.ALL)}
                      className="rounded-xl border-2 border-border px-6 py-3"
                    >
                      Show All Jobs
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications">
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-card-foreground mb-2">{application.jobTitle}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {application.employerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied {application.appliedDate}
                          </span>
                          <span className={`flex items-center gap-1 ${application.employerViewed ? 'text-green-600' : 'text-muted-foreground'}`}>
                            <Eye className="h-4 w-4" />
                            {application.employerViewed ? 'Viewed' : 'Not viewed'}
                          </span>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                      <Button variant="outline" className="rounded-xl border-border">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {applications.length === 0 && (
                <Card className="border-0 shadow-xl text-center bg-card/80 backdrop-blur-sm">
                  <CardContent className="py-16">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-card-foreground mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground mb-6">Start applying to jobs to see them here.</p>
                    <Button 
                      onClick={() => setActiveTab("browse")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3"
                    >
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Pending Review Tab */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {applications.filter(app => app.status === "pending_details").map((application) => (
                <Card key={application.id} className="border-2 border-amber-200 bg-amber-50/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <h3 className="text-xl font-semibold text-amber-800">{application.jobTitle}</h3>
                        </div>
                        <p className="text-amber-700 mb-4">
                          Additional information required to complete your application. Please provide the requested details to move forward.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-amber-600">
                          <span>Employer: {application.employerName}</span>
                          <span>Last updated: {application.lastUpdate}</span>
                        </div>
                      </div>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                        Provide Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {applications.filter(app => app.status === "pending_details").length === 0 && (
                <Card className="border-0 shadow-xl text-center bg-card/80 backdrop-blur-sm">
                  <CardContent className="py-16">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-card-foreground mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">No pending actions required on your applications.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {savedJobsList.map((job) => {
                const CategoryIcon = getCategoryIcon(job.category)
                return (
                  <Card key={job.id} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                          <CategoryIcon className="h-7 w-7 text-primary" />
                        </div>
                        <Button 
                          variant="default" 
                          size="icon"
                          className="bg-primary hover:bg-primary/90 rounded-xl"
                          onClick={() => handleSaveJob(job.id)}
                        >
                          <Bookmark className="h-4 w-4 fill-white" />
                        </Button>
                      </div>
                      <CardTitle className="text-xl leading-tight line-clamp-2">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-3">
                        <Building className="h-4 w-4" />
                        {job.employerName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {job.salaryDisplay}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
              {savedJobsList.length === 0 && (
                <Card className="border-0 shadow-xl text-center bg-card/80 backdrop-blur-sm col-span-full">
                  <CardContent className="py-16">
                    <BookmarkCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-card-foreground mb-2">No Saved Jobs</h3>
                    <p className="text-muted-foreground mb-6">Save jobs you're interested in to apply later.</p>
                    <Button 
                      onClick={() => setActiveTab("browse")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-3"
                    >
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Profile Verification Alert */}
        <Card className="border-2 border-primary/20 bg-primary/5 backdrop-blur-sm rounded-2xl">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-card-foreground mb-2">Boost Your Profile Visibility</h3>
              <p className="text-muted-foreground text-lg">
                Complete your profile verification to increase your chances of getting hired. Verified workers get 3x more responses from employers.
              </p>
            </div>
            <Button 
              onClick={() => router.push("/portals/worker/onboarding")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-3 text-lg"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}