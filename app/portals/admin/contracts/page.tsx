"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  FileText,
  UserCheck,
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
  ChevronDown,
  Shield,
  Upload,
  Plane
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Types for Contracts
interface Contract {
  id: string
  contractNumber: string
  job: {
    id: string
    title: string
    employer: {
      id: string
      firstName: string
      lastName: string
      company: string
    }
  }
  employee: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  status: string
  startDate: string
  endDate: string
  salary: number
  salaryCurrency: string
  location: string
  createdAt: string
  signedAt: string | null
  duration: string
  benefits: string[]
  responsibilities: string[]
  pdfUrl?: string
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

// Status Badge Component for Contracts
const ContractStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    DRAFT: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock },
    PENDING_SIGNATURE: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertCircle },
    ACTIVE: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    COMPLETED: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
    TERMINATED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    EXPIRED: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Clock },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
  const IconComponent = config.icon

  const statusLabels = {
    DRAFT: "Draft",
    PENDING_SIGNATURE: "Pending Signature",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    TERMINATED: "Terminated",
    EXPIRED: "Expired"
  }

  // useEffect(() => { }, [status])  

  return (
    <Badge className={cn("flex items-center gap-1", config.color)}>
      <IconComponent className="h-3 w-3" />
      {statusLabels[status as keyof typeof statusLabels] || status}
    </Badge>
  )
}

// Duration Badge Component
const DurationBadge = ({ duration }: { duration: string }) => {
  const getColor = (duration: string) => {
    if (duration.includes('24')) return "bg-purple-100 text-purple-800 border-purple-200"
    if (duration.includes('12')) return "bg-indigo-100 text-indigo-800 border-indigo-200"
    if (duration.includes('6')) return "bg-cyan-100 text-cyan-800 border-cyan-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <Badge className={cn("text-xs", getColor(duration))}>
      {duration}
    </Badge>
  )
}

export default function AdminContractsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [refreshing, setRefreshing] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [ticketData, setTicketData] = useState({
    airline: '',
    flightNumber: '',
    price: '',
    departureDate: '',
    arrivalDate: ''
  })

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
    loadContracts()
  }, [router])

  // Load contracts when filters change
  useEffect(() => {
    if (!loading) {
      setPagination(prev => ({ ...prev, page: 1 }))
      loadContracts()
    }
  }, [filters, loading])

  const loadContracts = async () => {
    setRefreshing(true)

    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: filters.status === 'all' ? '' : filters.status,
        search: filters.search
      }).toString()

      const response = await fetch(`/api/admin/contracts?${queryParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      setContracts(data.contracts)
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }))
    } catch (error) {
      console.error('Error fetching contracts:', error)
      // setContracts([]) // Optionally clear contracts on error
    } finally {
      setRefreshing(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    // useEffect will trigger loadContracts
  }

  const handleExportData = () => {
    alert("Exporting contracts data...")
  }

  const handleDownloadPDF = (contract: Contract) => {
    const url = contract.pdfUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("PDF not available for this contract.");
    }
  }

  const handleUploadTicket = async () => {
    if (!selectedContract) return

    setUploading(true)
    try {
      // In a real app, we would upload the file to storage here
      // For MVP, we'll simulate a file URL
      const mockFileUrl = `https://example.com/tickets/${selectedContract.id}.pdf`

      const response = await fetch('/api/flight-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: selectedContract.id,
          fileUrl: mockFileUrl,
          ...ticketData
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Flight ticket uploaded successfully",
        })
        setIsUploadDialogOpen(false)
        // Reset form
        setTicketData({
          airline: '',
          flightNumber: '',
          price: '',
          departureDate: '',
          arrivalDate: ''
        })
      } else {
        throw new Error('Failed to upload ticket')
      }
    } catch (error) {
      console.error('Error uploading ticket:', error)
      toast({
        title: "Error",
        description: "Failed to upload flight ticket",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
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
                <FileText className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                  Contracts Management
                </h1>
                <p className="text-muted-foreground">Manage and monitor all employment contracts</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Contracts</div>
              <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                {safePagination.total}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:block">{user?.name || user?.firstName || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/admin/jobs')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Jobs
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

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {contracts.filter(c => c.status === 'ACTIVE').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Contracts</div>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-yellow-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {contracts.filter(c => c.status === 'PENDING_SIGNATURE').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Signature</div>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {contracts.filter(c => c.status === 'COMPLETED').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-red-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {contracts.filter(c => c.status === 'TERMINATED').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Terminated</div>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Filter className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Filters & Actions
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadContracts} disabled={refreshing}>
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
                  placeholder="Search contracts by number, job, employer, or employee..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING_SIGNATURE">Pending Signature</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contracts Table */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Contracts</CardTitle>
                <CardDescription>
                  {safePagination.total} contracts found • Page {safePagination.page} of {safePagination.pages}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {contracts.length} contracts
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Details</TableHead>
                    <TableHead>Job & Employer</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Duration & Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{contract.contractNumber}</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {contract.job.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {contract.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm line-clamp-1">
                            {contract.job.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {contract.job.employer.company}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contract.job.employer.firstName} {contract.job.employer.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {contract.employee.firstName} {contract.employee.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contract.employee.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contract.employee.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-sm flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            {formatCurrency(contract.salary, contract.salaryCurrency)}
                          </div>
                          <div className="flex items-center gap-1">
                            <DurationBadge duration={contract.duration} />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contract.benefits.length} benefits
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ContractStatusBadge status={contract.status} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">Start: {formatDate(contract.startDate)}</div>
                          <div className="text-sm">End: {formatDate(contract.endDate)}</div>
                          <div className="text-xs text-muted-foreground">
                            Signed: {contract.signedAt ? formatDate(contract.signedAt) : 'Not signed'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedContract(contract)
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
                                Edit Contract
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadPDF(contract)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                View Compliance
                              </DropdownMenuItem>
                              {contract.status === 'PENDING_SIGNATURE' && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Signed
                                </DropdownMenuItem>
                              )}
                              {contract.status === 'ACTIVE' && (
                                <>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedContract(contract)
                                    setIsUploadDialogOpen(true)
                                  }}>
                                    <Plane className="h-4 w-4 mr-2" />
                                    Upload Ticket
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Terminate Contract
                                  </DropdownMenuItem>
                                </>
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
            {contracts.length === 0 && !refreshing && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No contracts found</h3>
                <p className="text-muted-foreground mt-2">
                  {filters.search || filters.status !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No contracts have been created yet.'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {safePagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((safePagination.page - 1) * safePagination.limit) + 1} to {Math.min(safePagination.page * safePagination.limit, safePagination.total)} of {safePagination.total} contracts
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

      {/* Contract Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Contract Details - {selectedContract?.contractNumber}
            </DialogTitle>
            <DialogDescription>
              Comprehensive view of employment contract information
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              {/* Contract Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                >
                  <FileText className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedContract.contractNumber}</h3>
                  <p className="text-muted-foreground">{selectedContract.job.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ContractStatusBadge status={selectedContract.status} />
                    <DurationBadge duration={selectedContract.duration} />
                  </div>
                </div>
              </div>

              {/* Parties Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Employer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Company</div>
                      <div className="font-medium">{selectedContract.job.employer.company}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Contact Person</div>
                      <div className="font-medium">
                        {selectedContract.job.employer.firstName} {selectedContract.job.employer.lastName}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Job Position</div>
                      <div className="font-medium">{selectedContract.job.title}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Employee Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Name</div>
                      <div className="font-medium">
                        {selectedContract.employee.firstName} {selectedContract.employee.lastName}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="font-medium">{selectedContract.employee.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="font-medium">{selectedContract.employee.phone}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contract Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contract Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                      <div className="font-medium">{selectedContract.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Start Date</div>
                      <div className="font-medium">{formatDate(selectedContract.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">End Date</div>
                      <div className="font-medium">{formatDate(selectedContract.endDate)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedContract.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Compensation & Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Monthly Salary</div>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(selectedContract.salary, selectedContract.salaryCurrency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Benefits</div>
                      <div className="space-y-1 mt-1">
                        {selectedContract.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contract Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full" onClick={() => handleDownloadPDF(selectedContract)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Contract
                    </Button>
                    {selectedContract.status === 'PENDING_SIGNATURE' && (
                      <Button className="w-full col-span-2 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Signed
                      </Button>
                    )}
                    {selectedContract.status === 'ACTIVE' && (
                      <Button variant="destructive" className="w-full col-span-2">
                        <XCircle className="h-4 w-4 mr-2" />
                        Terminate Contract
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Upload Ticket Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Flight Ticket</DialogTitle>
            <DialogDescription>
              Upload flight ticket details for Contract #{selectedContract?.contractNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Airline</div>
                <Input
                  value={ticketData.airline}
                  onChange={(e) => setTicketData({ ...ticketData, airline: e.target.value })}
                  placeholder="e.g. Oman Air"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Flight Number</div>
                <Input
                  value={ticketData.flightNumber}
                  onChange={(e) => setTicketData({ ...ticketData, flightNumber: e.target.value })}
                  placeholder="e.g. WY123"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Departure Date</div>
                <Input
                  type="datetime-local"
                  value={ticketData.departureDate}
                  onChange={(e) => setTicketData({ ...ticketData, departureDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Arrival Date</div>
                <Input
                  type="datetime-local"
                  value={ticketData.arrivalDate}
                  onChange={(e) => setTicketData({ ...ticketData, arrivalDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Ticket Price (OMR)</div>
              <Input
                type="number"
                value={ticketData.price}
                onChange={(e) => setTicketData({ ...ticketData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Ticket File (PDF)</div>
              <Input type="file" accept=".pdf" />
              <p className="text-xs text-muted-foreground">Upload the ticket PDF file</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadTicket} disabled={uploading}>
              {uploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Ticket
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
