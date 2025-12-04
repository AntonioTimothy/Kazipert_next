"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Users, 
  TrendingUp,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Building,
  UserCheck,
  BadgeCheck,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Enhanced mock data
const mockWorkers = [
  {
    id: "W001",
    name: "Jane Wanjiku",
    email: "jane.w@example.com",
    phone: "+968 1234 5678",
    role: "worker",
    kycStatus: "pending",
    avatar: "/placeholder.svg",
    age: 28,
    nationality: "Kenyan",
    experience: "3 years domestic work",
    education: "Secondary School",
    documents: {
      passport: true,
      certificate: true,
      medicalReport: false,
      visa: true,
      contract: false
    },
    submittedDate: "2025-01-20",
    lastUpdated: "2 hours ago",
    location: "Muscat, Oman"
  },
  {
    id: "W002",
    name: "Mary Akinyi",
    email: "mary.a@example.com",
    phone: "+968 2345 6789",
    role: "worker",
    kycStatus: "pending",
    avatar: "/placeholder.svg",
    age: 32,
    nationality: "Kenyan",
    experience: "5 years childcare",
    education: "College Certificate",
    documents: {
      passport: true,
      certificate: true,
      medicalReport: true,
      visa: true,
      contract: true
    },
    submittedDate: "2025-01-22",
    lastUpdated: "1 hour ago",
    location: "Salalah, Oman"
  }
]

const mockEmployers = [
  {
    id: "E001",
    name: "Ahmed Al-Rashid",
    email: "ahmed@alrashid.com",
    phone: "+968 3456 7890",
    role: "employer",
    kycStatus: "pending",
    avatar: "/placeholder.svg",
    company: "Al-Rashid Family",
    location: "Al Khuwair",
    country: "Oman",
    familySize: 6,
    houseType: "Villa",
    documents: {
      idCopy: true,
      residenceProof: true,
      familyCard: false,
      contract: true
    },
    submittedDate: "2025-01-21",
    lastUpdated: "30 minutes ago"
  },
  {
    id: "E002",
    name: "Fatima Al-Balushi",
    email: "fatima@albalushi.com",
    phone: "+968 4567 8901",
    role: "employer",
    kycStatus: "verified",
    avatar: "/placeholder.svg",
    company: "Al-Balushi Residence",
    location: "Shatti Al-Qurum",
    country: "Oman",
    familySize: 4,
    houseType: "Apartment",
    documents: {
      idCopy: true,
      residenceProof: true,
      familyCard: true,
      contract: true
    },
    submittedDate: "2025-01-15",
    lastUpdated: "3 days ago"
  }
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

export default function AdminKYCPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [verificationNotes, setVerificationNotes] = useState("")

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

  const allUsers = [...mockWorkers, ...mockEmployers]
  const pendingUsers = allUsers.filter((u) => u.kycStatus === "pending")
  const verifiedUsers = allUsers.filter((u) => u.kycStatus === "verified")
  const rejectedUsers = allUsers.filter((u) => u.kycStatus === "rejected")

  const stats = {
    total: allUsers.length,
    pending: pendingUsers.length,
    verified: verifiedUsers.length,
    rejected: rejectedUsers.length,
    completionRate: Math.round((verifiedUsers.length / allUsers.length) * 100),
    avgProcessingTime: "2.3 days"
  }

  const filteredPendingUsers = pendingUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  )

  const getDocumentCompletion = (user: any) => {
    const documents = Object.values(user.documents)
    const completed = documents.filter(Boolean).length
    const total = documents.length
    return Math.round((completed / total) * 100)
  }

  const handleApprove = (userId: string) => {
    // In a real app, this would make an API call
    console.log(`Approving user ${userId}`)
  }

  const handleReject = (userId: string) => {
    // In a real app, this would make an API call
    console.log(`Rejecting user ${userId}`)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading KYC Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  KYC Verification Center
                </h1>
                <p className="text-muted-foreground">Review and verify user identities and documents</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Pending Review</div>
              <div className="text-2xl font-bold text-orange-600">
                <AnimatedCounter value={stats.pending} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={stats.total} />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <Progress value={100} className="h-1 mt-2 bg-blue-200" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-orange-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    <AnimatedCounter value={stats.pending} />
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <Progress value={(stats.pending / stats.total) * 100} className="h-1 mt-2 bg-orange-200" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedCounter value={stats.verified} />
                  </div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <Progress value={(stats.verified / stats.total) * 100} className="h-1 mt-2 bg-green-200" />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-red-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    <AnimatedCounter value={stats.rejected} />
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <Progress value={(stats.rejected / stats.total) * 100} className="h-1 mt-2 bg-red-200" />
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Verification Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                  <Progress value={stats.completionRate} className="h-2 mt-2 bg-green-200" />
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats.avgProcessingTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                  <Progress value={75} className="h-2 mt-2 bg-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Bulk Approve
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Verification Interface */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>KYC Verification Queue</CardTitle>
                <CardDescription>Review and verify user applications</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Badge variant="outline" className="text-sm">
                  {filteredPendingUsers.length} to review
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingUsers.length})
                </TabsTrigger>
                <TabsTrigger value="verified" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Verified ({verifiedUsers.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Rejected ({rejectedUsers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6 space-y-4">
                {filteredPendingUsers.length > 0 ? (
                  filteredPendingUsers.map((user) => (
                    <Card key={user.id} className="transition-all hover:shadow-md border-l-4 border-l-orange-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-16 w-16 border-2 border-orange-200">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-lg bg-orange-100 text-orange-600">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <Badge variant="outline" className="capitalize">
                                  {user.role}
                                </Badge>
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-600">
                                  Pending Review
                                </Badge>
                              </div>
                              
                              <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3 mb-3">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span>{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{user.location}</span>
                                </div>
                              </div>

                              {/* Document Progress */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Document Completion</span>
                                  <span className="font-medium">{getDocumentCompletion(user)}%</span>
                                </div>
                                <Progress value={getDocumentCompletion(user)} className="h-2 bg-gray-200" />
                              </div>

                              {/* User Specific Details */}
                              {user.role === "worker" && (
                                <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
                                  <div>
                                    <span className="text-muted-foreground">Age:</span> {user.age} years
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Nationality:</span> {user.nationality}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Experience:</span> {user.experience}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Education:</span> {user.education}
                                  </div>
                                </div>
                              )}

                              {user.role === "employer" && (
                                <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
                                  <div className="flex items-center gap-2">
                                    <Building className="h-3 w-3 text-muted-foreground" />
                                    <span>{user.company ?? "—"}</span>
                                  </div>
                                  {/** Note: familySize and houseType are not part of the current User schema; removed to prevent runtime/TS errors. */}
                                </div>
                              )}

                              {/* Documents Status */}
                              <div className="mt-3">
                                <div className="text-sm font-medium mb-2">Documents Status:</div>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(user.documents).map(([doc, status]) => (
                                    <Badge 
                                      key={doc} 
                                      variant={status ? "default" : "secondary"}
                                      className={cn(
                                        "capitalize",
                                        status ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
                                      )}
                                    >
                                      {status ? "✓" : "✗"} {doc.replace(/([A-Z])/g, ' $1').trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-blue-500" />
                                    KYC Verification - {selectedUser?.name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete verification process for this user
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-6">
                                    {/* Verification interface would go here */}
                                    <div className="text-center py-8 text-muted-foreground">
                                      Detailed verification interface with document previews
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleApprove(user.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(user.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Submitted: {user.submittedDate}
                            </div>
                            <div>Last updated: {user.lastUpdated}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ID: {user.id}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <BadgeCheck className="mx-auto h-16 w-16 text-green-500/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground mb-4">No pending KYC verifications at the moment.</p>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Completed Reports
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="verified" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verified Users</h3>
                  <p>View all successfully verified user accounts</p>
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-16 w-16 text-red-500/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Rejected Applications</h3>
                  <p>Review declined KYC applications</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}