"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Shield,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  UserCog
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Types
interface User {
  id: string
  email: string
  phone: string | null
  fullName: string | null
  firstName: string | null
  lastName: string | null
  role: string
  adminStatus: string | null
  verified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  country: string | null
  company: string | null
  createdAt: string
  lastLogin: string | null
  profile: any
  kycDetails: any
  onboardingProgress: any
  stats: {
    jobsPosted: number
    applications: number
  }
}

interface UsersResponse {
  users: User[]
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

// Status Badge Component
const StatusBadge = ({ status, verified }: { status: string | null; verified: boolean }) => {
  if (status === 'SUSPENDED') {
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
        <Ban className="h-3 w-3 mr-1" />
        Suspended
      </Badge>
    )
  }

  if (status === 'ACTIVE' && verified) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    )
  }

  if (!verified || status === 'PENDING') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
        <Clock className="h-3 w-3 mr-1" />
        Pending Verification
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-gray-600">
      <AlertCircle className="h-3 w-3 mr-1" />
      Inactive
    </Badge>
  )
}

// Role Badge Component
const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig = {
    ADMIN: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Shield },
    SUPER_ADMIN: { color: "bg-red-100 text-red-800 border-red-200", icon: Shield },
    EMPLOYER: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Building },
    EMPLOYEE: { color: "bg-green-100 text-green-800 border-green-200", icon: UserCheck },
    HOSPITAL_ADMIN: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: UserCog },
    PHOTO_STUDIO_ADMIN: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: UserCog },
    EMBASSY_ADMIN: { color: "bg-cyan-100 text-cyan-800 border-cyan-200", icon: UserCog },
  }

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.EMPLOYEE
  const IconComponent = config.icon

  return (
    <Badge className={cn("flex items-center gap-1", config.color)}>
      <IconComponent className="h-3 w-3" />
      {role.replace('_', ' ')}
    </Badge>
  )
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    total: 0,
    employers: 0,
    employees: 0,
    admins: 0,
    active: 0,
    pending: 0,
    suspended: 0
  })
  const [filters, setFilters] = useState({
    role: 'all',
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Check authentication and fetch users
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
    fetchUsers()
  }, [router])

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers()
  }, [filters, pagination.page])

  const fetchUsers = async () => {
    try {
      setRefreshing(true)
      const params = new URLSearchParams({
        role: filters.role,
        status: filters.status,
        search: filters.search,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data: UsersResponse = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setPagination(data.pagination)
        calculateStats(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const calculateStats = (usersData: User[]) => {
    const stats = {
      total: usersData.length,
      employers: usersData.filter(u => u.role === 'EMPLOYER').length,
      employees: usersData.filter(u => u.role === 'EMPLOYEE').length,
      admins: usersData.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length,
      active: usersData.filter(u => u.adminStatus === 'ACTIVE' && u.verified).length,
      pending: usersData.filter(u => !u.verified || u.adminStatus === 'PENDING').length,
      suspended: usersData.filter(u => u.adminStatus === 'SUSPENDED').length
    }
    setStats(stats)
  }

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminStatus: newStatus,
          verified: newStatus === 'ACTIVE'
        })
      })

      if (response.ok) {
        // Refresh users list
        fetchUsers()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleExportData = () => {
    // Simulate export functionality
    alert("Exporting users data...")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
                <Users className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                  Users Management
                </h1>
                <p className="text-muted-foreground">Manage all Kazipert users, roles, and permissions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Users</div>
              <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                <AnimatedCounter value={stats.total} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border-l-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: KAZIPERT_COLORS.primary }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                    <AnimatedCounter value={stats.total} />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${KAZIPERT_COLORS.primary}15` }}>
                  <Users className="h-6 w-6" style={{ color: KAZIPERT_COLORS.primary }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={stats.employers} />
                  </div>
                  <div className="text-sm text-muted-foreground">Employers</div>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedCounter value={stats.employees} />
                  </div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    <AnimatedCounter value={stats.admins} />
                  </div>
                  <div className="text-sm text-muted-foreground">Admins</div>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-5 w-5 text-green-500" />
                User Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Active Users</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{stats.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending Verification</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{stats.pending}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Suspended</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">{stats.suspended}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Filter className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                Quick Actions & Filters
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={fetchUsers} disabled={refreshing}>
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
                    placeholder="Search users by name, email, or phone..."
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="EMPLOYER">Employers</SelectItem>
                    <SelectItem value="EMPLOYEE">Employees</SelectItem>
                    <SelectItem value="ADMIN">Admins</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Verification</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  {pagination.total} users found • Page {pagination.page} of {pagination.pages}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {users.length} users
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Information</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                            >
                              {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          {user.country && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.country}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                        {user.company && user.role === 'EMPLOYER' && (
                          <div className="text-xs text-muted-foreground mt-1">{user.company}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.adminStatus} verified={user.verified} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {user.emailVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-xs">Email</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {user.phoneVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-xs">Phone</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                        {user.lastLogin && (
                          <div className="text-xs text-muted-foreground">
                            Last login: {formatDate(user.lastLogin)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user)
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
                                Edit User
                              </DropdownMenuItem>
                              {user.adminStatus !== 'ACTIVE' && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, 'ACTIVE')}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {user.adminStatus !== 'SUSPENDED' && (
                                <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, 'SUSPENDED')}>
                                  <Ban className="h-4 w-4 mr-2 text-red-500" />
                                  Suspend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <UserX className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              User Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive view of user information and account status
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                >
                  {selectedUser.firstName?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedUser.fullName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'No Name'}
                  </h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RoleBadge role={selectedUser.role} />
                    <StatusBadge status={selectedUser.adminStatus} verified={selectedUser.verified} />
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">{selectedUser.email}</span>
                        {selectedUser.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span className="font-medium">{selectedUser.phone}</span>
                          {selectedUser.phoneVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    )}
                    {selectedUser.country && (
                      <div>
                        <div className="text-xs text-muted-foreground">Country</div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedUser.country}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Member Since</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(selectedUser.createdAt)}</span>
                      </div>
                    </div>
                    {selectedUser.lastLogin && (
                      <div>
                        <div className="text-xs text-muted-foreground">Last Login</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(selectedUser.lastLogin)}</span>
                        </div>
                      </div>
                    )}
                    {selectedUser.company && (
                      <div>
                        <div className="text-xs text-muted-foreground">Company</div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{selectedUser.company}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats & Actions */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Jobs Posted</span>
                        <Badge>{selectedUser.stats.jobsPosted}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Applications</span>
                        <Badge>{selectedUser.stats.applications}</Badge>
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
                      {selectedUser.adminStatus !== 'ACTIVE' && (
                        <Button 
                          className="w-full justify-start bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(selectedUser.id, 'ACTIVE')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate User
                        </Button>
                      )}
                      {selectedUser.adminStatus !== 'SUSPENDED' && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={() => handleStatusUpdate(selectedUser.id, 'SUSPENDED')}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend User
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