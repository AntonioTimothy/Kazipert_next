"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Types based on your schema
interface Job {
  id: string
  title: string
  type: string
  status: string
  category: string
  employer: {
    id: string
    firstName: string
    lastName: string
    company: string
  }
  salary: number
  salaryCurrency: string
  location: string
  city: string
  createdAt: string
  postedAt: string | null
  applicationsCount: number
  viewsCount: number
  familyMembers: number
  childrenCount: number
  experienceRequired: string
  accommodation: string
}

interface JobsResponse {
  jobs: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
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

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    DRAFT: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock },
    ACTIVE: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    CLOSED: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
    EXPIRED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
  const IconComponent = config.icon

  return (
    <Badge className={cn("flex items-center gap-1", config.color)}>
      <IconComponent className="h-3 w-3" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  )
}

// Type Badge Component
const TypeBadge = ({ type }: { type: string }) => {
  const typeConfig = {
    FULL_TIME: { color: "bg-purple-100 text-purple-800 border-purple-200" },
    PART_TIME: { color: "bg-orange-100 text-orange-800 border-orange-200" },
    LIVE_OUT: { color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
    FLEXIBLE: { color: "bg-pink-100 text-pink-800 border-pink-200" },
  }

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.FULL_TIME

  return (
    <Badge className={cn("text-xs", config.color)}>
      {type.replace('_', ' ')}
    </Badge>
  )
}

export default function AdminJobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [refreshing, setRefreshing] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Check authentication
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
    setLoading(false)
    fetchJobs()
  }, [router])

  // Fetch jobs when filters change
  useEffect(() => {
    if (!loading) {
      setPagination(prev => ({ ...prev, page: 1 }))
      fetchJobs()
    }
  }, [filters, loading])

  const fetchJobs = async () => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams({
        status: filters.status,
        type: filters.type,
        search: filters.search,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      const response = await fetch(`/api/admin/jobs?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data: JobsResponse = await response.json()

      if (response.ok) {
        setJobs(data.jobs)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // For demo purposes, set mock data if API fails
      setJobs(mockJobs)
      setPagination({
        page: 1,
        limit: 20,
        total: mockJobs.length,
        pages: Math.ceil(mockJobs.length / 20)
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    setTimeout(() => {
      fetchJobs()
    }, 0)
  }

  const handleExportData = () => {
    alert("Exporting jobs data...")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Safe pagination values
  const safePagination = {
    total: pagination?.total || 0,
    page: pagination?.page || 1,
    pages: pagination?.pages || 0,
    limit: pagination?.limit || 20
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
                <Briefcase className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                  Jobs Management
                </h1>
                <p className="text-muted-foreground">Manage and monitor all job postings on Kazipert</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Jobs</div>
              <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                {safePagination.total}
              </div>
            </div>
           
          </div>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Filter className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Filters & Actions
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchJobs} disabled={refreshing}>
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, employer, or location..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="LIVE_OUT">Live Out</SelectItem>
                  <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Job Postings</CardTitle>
                <CardDescription>
                  {safePagination.total} jobs found • Page {safePagination.page} of {safePagination.pages}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {jobs.length} jobs
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Details</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm line-clamp-1">{job.title}</span>
                            <TypeBadge type={job.type} />
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.category || 'General Help'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Family: {job.familyMembers} • Children: {job.childrenCount}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {job.employer.company || `${job.employer.firstName} ${job.employer.lastName}`}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {job.employer.firstName} {job.employer.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {job.city}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-sm flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            {formatCurrency(job.salary, job.salaryCurrency)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.experienceRequired?.replace(/_/g, ' ').toLowerCase()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.accommodation?.replace(/_/g, ' ').toLowerCase()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-center">
                          <div className="font-semibold text-sm">{job.applicationsCount}</div>
                          <div className="text-xs text-muted-foreground">Applications</div>
                          <div className="text-xs text-muted-foreground">{job.viewsCount} views</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={job.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(job.postedAt || job.createdAt)}</div>
                        <div className="text-xs text-muted-foreground">
                          Created: {formatDate(job.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(job)
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
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                View Applications
                              </DropdownMenuItem>
                              {job.status === 'ACTIVE' && (
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Close Job
                                </DropdownMenuItem>
                              )}
                              {job.status === 'DRAFT' && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Job
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty State */}
            {jobs.length === 0 && !refreshing && (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No jobs found</h3>
                <p className="text-muted-foreground mt-2">
                  {filters.search || filters.status !== 'all' || filters.type !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No jobs have been posted yet.'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {safePagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((safePagination.page - 1) * safePagination.limit) + 1} to {Math.min(safePagination.page * safePagination.limit, safePagination.total)} of {safePagination.total} jobs
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(safePagination.page - 1)}
                    disabled={safePagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(safePagination.page + 1)}
                    disabled={safePagination.page === safePagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Job Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive view of job posting information
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6">
              {/* Job Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                >
                  <Briefcase className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
                  <p className="text-muted-foreground">{selectedJob.employer.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedJob.status} />
                    <TypeBadge type={selectedJob.type} />
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div className="font-medium">{selectedJob.category || 'General Help'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Experience Required</div>
                      <div className="font-medium">{selectedJob.experienceRequired?.replace(/_/g, ' ')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Accommodation</div>
                      <div className="font-medium">{selectedJob.accommodation?.replace(/_/g, ' ')}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Family Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Family Members</div>
                      <div className="font-medium">{selectedJob.familyMembers} people</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Children</div>
                      <div className="font-medium">{selectedJob.childrenCount} children</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedJob.city}, {selectedJob.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats & Actions */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Job Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Applications</span>
                        <Badge variant="outline">{selectedJob.applicationsCount}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Views</span>
                        <Badge variant="outline">{selectedJob.viewsCount}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Salary</span>
                        <Badge variant="secondary">
                          {formatCurrency(selectedJob.salary, selectedJob.salaryCurrency)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        View Applications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Job
                      </Button>
                      {selectedJob.status === 'ACTIVE' && (
                        <Button variant="destructive" className="w-full justify-start">
                          <XCircle className="h-4 w-4 mr-2" />
                          Close Job
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: "JOB001",
    title: "Live-in House Manager",
    type: "FULL_TIME",
    status: "ACTIVE",
    category: "HOUSE_MANAGER",
    employer: {
      id: "E001",
      firstName: "Ahmed",
      lastName: "Al-Rashid",
      company: "Al-Rashid Family"
    },
    salary: 100,
    salaryCurrency: "OMR",
    location: "Muscat Hills",
    city: "Muscat",
    createdAt: "2025-01-15",
    postedAt: "2025-01-16",
    applicationsCount: 12,
    viewsCount: 45,
    familyMembers: 6,
    childrenCount: 3,
    experienceRequired: "THREE_TO_FIVE_YEARS",
    accommodation: "PROVIDED"
  },
  {
    id: "JOB002",
    title: "Elderly Care Specialist",
    type: "FULL_TIME",
    status: "ACTIVE",
    category: "ELDERLY_CARE",
    employer: {
      id: "E002",
      firstName: "Fatima",
      lastName: "Al-Balushi",
      company: "Al-Balushi Residence"
    },
    salary: 500,
    salaryCurrency: "OMR",
    location: "Al Khuwair",
    city: "Muscat",
    createdAt: "2025-01-18",
    postedAt: "2025-01-19",
    applicationsCount: 8,
    viewsCount: 32,
    familyMembers: 3,
    childrenCount: 0,
    experienceRequired: "FIVE_PLUS_YEARS",
    accommodation: "NOT_PROVIDED"
  },
  {
    id: "JOB003",
    title: "Child Care Expert",
    type: "FULL_TIME",
    status: "DRAFT",
    category: "CHILD_CARE",
    employer: {
      id: "E003",
      firstName: "Khalid",
      lastName: "Al-Hinai",
      company: "Al-Hinai Family"
    },
    salary: 150,
    salaryCurrency: "OMR",
    location: "Shatti Al Qurum",
    city: "Muscat",
    createdAt: "2025-01-20",
    postedAt: null,
    applicationsCount: 0,
    viewsCount: 5,
    familyMembers: 4,
    childrenCount: 2,
    experienceRequired: "ONE_TO_TWO_YEARS",
    accommodation: "SHARED"
  },
  {
    id: "JOB004",
    title: "Professional Cook",
    type: "FULL_TIME",
    status: "CLOSED",
    category: "COOKING_SPECIALIST",
    employer: {
      id: "E004",
      firstName: "Maryam",
      lastName: "Al-Lawati",
      company: "Al-Lawati Household"
    },
    salary: 100,
    salaryCurrency: "OMR",
    location: "Al Ghubra",
    city: "Muscat",
    createdAt: "2025-01-10",
    postedAt: "2025-01-11",
    applicationsCount: 25,
    viewsCount: 89,
    familyMembers: 5,
    childrenCount: 3,
    experienceRequired: "FIVE_PLUS_YEARS",
    accommodation: "PROVIDED"
  },
  {
    id: "JOB005",
    title: "General House Help",
    type: "FULL_TIME",
    status: "EXPIRED",
    category: "GENERAL_HOUSE_HELP",
    employer: {
      id: "E005",
      firstName: "Omar",
      lastName: "Al-Kindi",
      company: "Al-Kindi Family"
    },
    salary: 130,
    salaryCurrency: "OMR",
    location: "Al Seeb",
    city: "Muscat",
    createdAt: "2024-12-15",
    postedAt: "2024-12-16",
    applicationsCount: 15,
    viewsCount: 67,
    familyMembers: 4,
    childrenCount: 1,
    experienceRequired: "NO_EXPERIENCE",
    accommodation: "NOT_PROVIDED"
  }
]