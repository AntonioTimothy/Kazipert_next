"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  Star,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Zap,
  Search,
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
  Wifi,
  Sparkles,
  AlertCircle,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import type { WorkerProfile } from "@/lib/mock-data"

// Creative domestic job listings
const domesticJobs = [
  {
    id: "DOM001",
    title: "Live-in House Manager",
    employerName: "Sarah",
    location: "Westlands",
    salary: "KSh 25,000-35,000/month",
    type: "Full-time",
    status: "open",
    urgent: true,
    description: "Looking for a reliable house manager to oversee daily household operations. Must be organized and trustworthy.",
    contractTerms: ["Live-in position", "2-year contract", "30 days annual leave", "Medical cover"],
    requirements: ["5+ years experience", "Reference letters", "First Aid training"],
    category: "House Management",
    postedDate: "2024-01-15",
    applications: 8,
    views: 45,
    employerRating: 4.8
  },
  {
    id: "DOM002",
    title: "Professional Nanny",
    employerName: "James",
    location: "Karen",
    salary: "KSh 20,000-28,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Caring nanny needed for two children aged 3 and 6. Must have childcare experience and love for children.",
    contractTerms: ["Live-in preferred", "1-year contract", "Weekends off", "School holidays"],
    requirements: ["Childcare experience", "CPR certified", "Early education background"],
    category: "Childcare",
    postedDate: "2024-01-14",
    applications: 12,
    views: 67,
    employerRating: 4.9
  },
  {
    id: "DOM003",
    title: "Elderly Companion",
    employerName: "Margaret",
    location: "Runda",
    salary: "KSh 18,000-25,000/month",
    type: "Full-time",
    status: "open",
    urgent: true,
    description: "Compassionate companion needed for elderly gentleman. Light housekeeping and medication reminders.",
    contractTerms: ["Live-in available", "Flexible schedule", "Health insurance", "Transport allowance"],
    requirements: ["Nursing background", "Patience & empathy", "Reference required"],
    category: "Elderly Care",
    postedDate: "2024-01-16",
    applications: 5,
    views: 32,
    employerRating: 4.7
  },
  {
    id: "DOM004",
    title: "Family Chef",
    employerName: "David",
    location: "Lavington",
    salary: "KSh 30,000-40,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Experienced chef needed for family of 4. Must prepare healthy meals and manage kitchen inventory.",
    contractTerms: ["Live-out", "5-day week", "Food allowance", "Uniform provided"],
    requirements: ["Culinary training", "5+ years experience", "Menu planning", "Hygiëne certificate"],
    category: "Cooking",
    postedDate: "2024-01-13",
    applications: 15,
    views: 89,
    employerRating: 4.6
  },
  {
    id: "DOM005",
    title: "Gardener & Handyman",
    employerName: "Grace",
    location: "Kitisuru",
    salary: "KSh 15,000-22,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Skilled gardener with basic handyman skills needed for large compound maintenance.",
    contractTerms: ["Live-out", "6-day week", "Tools provided", "Performance bonus"],
    requirements: ["Gardening experience", "Basic repairs", "Plant knowledge", "Physical fitness"],
    category: "Gardening",
    postedDate: "2024-01-12",
    applications: 7,
    views: 41,
    employerRating: 4.8
  },
  {
    id: "DOM006",
    title: "Housekeeper",
    employerName: "Michael",
    location: "Muthaiga",
    salary: "KSh 16,000-24,000/month",
    type: "Full-time",
    status: "open",
    urgent: true,
    description: "Detail-oriented housekeeper for 5-bedroom home. Must maintain high cleanliness standards.",
    contractTerms: ["Live-in optional", "45 hours/week", "Accommodation", "Weekly off"],
    requirements: ["3+ years experience", "Organization skills", "Reference required"],
    category: "Cleaning",
    postedDate: "2024-01-17",
    applications: 11,
    views: 53,
    employerRating: 4.5
  },
  {
    id: "DOM007",
    title: "Pet Care Specialist",
    employerName: "Linda",
    location: "Kilimani",
    salary: "KSh 12,000-18,000/month",
    type: "Part-time",
    status: "open",
    urgent: false,
    description: "Animal lover needed to care for two dogs and one cat while family is at work.",
    contractTerms: ["Part-time", "Flexible hours", "Pet supplies covered", "Weekend availability"],
    requirements: ["Pet care experience", "Vet knowledge", "Reliable", "Love for animals"],
    category: "Pet Care",
    postedDate: "2024-01-14",
    applications: 6,
    views: 28,
    employerRating: 4.9
  },
  
  {
    id: "DOM009",
    title: "Laundry Specialist",
    employerName: "Elizabeth",
    location: "South B",
    salary: "KSh 14,000-20,000/month",
    type: "Full-time",
    status: "open",
    urgent: false,
    description: "Experienced laundry person needed for family laundry including delicate fabrics.",
    contractTerms: ["Live-out", "6-day week", "Equipment provided", "Annual bonus"],
    requirements: ["Laundry experience", "Fabric care knowledge", "Attention to detail"],
    category: "Laundry",
    postedDate: "2024-01-15",
    applications: 4,
    views: 23,
    employerRating: 4.6
  }
]

export default function WorkerJobsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

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
    setLoading(false)
  }, [router])

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Applications", href: "/worker/contracts", icon: FileText },
    { name: "Wallet", href: "/worker/payments", icon: CreditCard },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Reviews", href: "/worker/reviews", icon: Star },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const filteredJobs = domesticJobs.filter(
    (job) =>
      job.status === "open" &&
      (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleApply = (jobId: string) => {
    alert("Kindly verify your account first to apply for jobs. You'll be redirected to complete your profile.")
    router.push("/worker/onboarding")
  }

  const handleSaveJob = (jobId: string) => {
    alert("Job saved to your favorites! Complete your profile to start applying.")
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

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Find Domestic Jobs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover perfect household opportunities that match your skills and experience
          </p>
        </div>

        {/* Search and Stats Section */}
        <Card 
          className="border-0 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}05 0%, ${currentTheme.colors.backgroundLight} 100%)`
          }}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, location, employer, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.backgroundLight
                  }}
                />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Badge 
                  variant="secondary"
                  className="px-3 py-1"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '15'
                  }}
                >
                  <Briefcase className="h-3 w-3 mr-1" />
                  {filteredJobs.length} Jobs
                </Badge>
                <Badge 
                  variant="secondary"
                  className="px-3 py-1"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '15'
                  }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {filteredJobs.filter(job => job.urgent).length} Urgent
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => {
            const CategoryIcon = getCategoryIcon(job.category)
            return (
              <Card 
                key={job.id}
                className={cn(
                  "group relative overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl",
                  job.urgent 
                    ? "border-red-200 hover:border-red-300" 
                    : "border-border/50 hover:border-primary/30"
                )}
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                }}
              >
                {/* Urgent Badge */}
                {job.urgent && (
                  <div 
                    className="absolute top-4 right-4 z-10 animate-pulse"
                    style={{ color: currentTheme.colors.error }}
                  >
                    <Zap className="h-5 w-5" />
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <CategoryIcon className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <Badge 
                      variant={job.urgent ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {job.urgent ? "URGENT" : job.type}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                  
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <User className="h-3 w-3" />
                    Employer: {job.employerName}
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{job.employerRating}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Location & Salary */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-green-600">{job.salary}</span>
                    </div>
                  </div>

                  {/* Contract Terms */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Contract Terms:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {job.contractTerms.slice(0, 2).map((term, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: currentTheme.colors.primary + '30',
                            color: currentTheme.colors.text
                          }}
                        >
                          {term}
                        </Badge>
                      ))}
                      {job.contractTerms.length > 2 && (
                        <Badge 
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: currentTheme.colors.primary + '30',
                            color: currentTheme.colors.text
                          }}
                        >
                          +{job.contractTerms.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Job Stats */}
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
                    className="flex-1 transition-all duration-300 hover:scale-105"
                    onClick={() => handleApply(job.id)}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="transition-all duration-300 hover:scale-110"
                    onClick={() => handleSaveJob(job.id)}
                    style={{
                      borderColor: currentTheme.colors.primary + '30'
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </CardFooter>

                {/* Hover Effect Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                />
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <Card className="border-0 shadow-lg text-center">
            <CardContent className="py-16">
              <div 
                className="flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-4"
                style={{ backgroundColor: currentTheme.colors.primary + '15' }}
              >
                <Briefcase className="h-10 w-10" style={{ color: currentTheme.colors.primary }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery ? "Try adjusting your search criteria or browse all available domestic jobs." : "No domestic jobs available at the moment. Check back later for new opportunities."}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  style={{
                    borderColor: currentTheme.colors.primary + '30'
                  }}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile Verification Alert */}
        <Card 
          className="border-2 border-amber-200 bg-amber-50/50 backdrop-blur-sm"
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: currentTheme.colors.primary + '20' }}
            >
              <AlertCircle className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">Verify Your Profile to Apply</h3>
              <p className="text-sm text-amber-700 mt-1">
                Complete your profile verification to start applying for domestic jobs. Employers prefer verified workers.
              </p>
            </div>
            <Button 
              onClick={() => router.push("/worker/onboarding")}
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              Verify Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}