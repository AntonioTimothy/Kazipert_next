// app/dashboard/settings/page.tsx
"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Settings,
  Shield,
  Lock,
  Bell,
  Mail,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Key,
  Building,
  Camera,
  Flag,
  BarChart3,
  Users,
  FileText,
  Globe,
  Palette,
  Database,
  Cpu,
  Zap,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Languages,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare,
  Home,
  Briefcase,
  AlertTriangle,
  

} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for navigation
const navigation = [
  { name: "Home", href: "/admin/dashboard", icon: Home },
  { name: "Workers", href: "/admin/workers", icon: Users },
  { name: "Employers", href: "/admin/employers", icon: Briefcase },
  { name: "Contracts", href: "/admin/contracts", icon: FileText },
  { name: "Distress Reports", href: "/admin/distress", icon: AlertTriangle },
  { name: "Services", href: "/admin/services", icon: Shield },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

// Mock user data
const user = {
  name: "Admin User",
  email: "admin@kazipert.com",
  role: "super_admin",
  verified: true,
  avatar: "/placeholder.svg"
}

// Mock data for admins
const mockAdmins = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@kazipert.com",
    role: "super_admin",
    status: "active",
    avatar: "/placeholder.svg",
    lastActive: "2 hours ago",
    permissions: ["all"],
    department: "Kazipert Management"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@medicare.com",
    role: "hospital_admin",
    status: "active",
    avatar: "/placeholder.svg",
    lastActive: "5 minutes ago",
    permissions: ["medical_records", "user_updates"],
    department: "Medicare Hospital"
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@prophotos.com",
    role: "photo_studio_admin",
    status: "pending",
    avatar: "/placeholder.svg",
    lastActive: "1 day ago",
    permissions: ["photo_uploads", "photo_approvals"],
    department: "Pro Photos Studio"
  },
  {
    id: 4,
    name: "Aisha Mohamed",
    email: "aisha.mohamed@embassy.gov",
    role: "embassy_admin",
    status: "active",
    avatar: "/placeholder.svg",
    lastActive: "30 minutes ago",
    permissions: ["analytics", "reports"],
    department: "Tanzania Embassy"
  }
]

const userRoles = [
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Full system access and management",
    icon: Shield,
    color: "bg-red-100 text-red-700"
  },
  {
    value: "hospital_admin",
    label: "Hospital Admin",
    description: "Manage medical records and certifications",
    icon: Building,
    color: "bg-blue-100 text-blue-700"
  },
  {
    value: "photo_studio_admin",
    label: "Photo Studio Admin",
    description: "Upload and manage professional photos",
    icon: Camera,
    color: "bg-purple-100 text-purple-700"
  },
  {
    value: "embassy_admin",
    label: "Embassy Admin",
    description: "View analytics and system reports",
    icon: Flag,
    color: "bg-green-100 text-green-700"
  },
  {
    value: "custom",
    label: "Custom Role",
    description: "Create custom permissions",
    icon: Settings,
    color: "bg-amber-100 text-amber-700"
  }
]

const permissionGroups = [
  {
    category: "User Management",
    permissions: [
      { id: "view_users", label: "View Users", description: "Can view all users" },
      { id: "edit_users", label: "Edit Users", description: "Can modify user information" },
      { id: "create_users", label: "Create Users", description: "Can create new users" },
      { id: "delete_users", label: "Delete Users", description: "Can remove users" }
    ]
  },
  {
    category: "Medical Records",
    permissions: [
      { id: "view_medical", label: "View Medical Records", description: "Can view medical records" },
      { id: "update_medical", label: "Update Medical Records", description: "Can update medical information" },
      { id: "approve_medical", label: "Approve Medical", description: "Can approve medical certifications" }
    ]
  },
  {
    category: "Photo Management",
    permissions: [
      { id: "upload_photos", label: "Upload Photos", description: "Can upload professional photos" },
      { id: "approve_photos", label: "Approve Photos", description: "Can approve/reject photos" },
      { id: "manage_gallery", label: "Manage Gallery", description: "Can organize photo gallery" }
    ]
  },
  {
    category: "Analytics & Reports",
    permissions: [
      { id: "view_analytics", label: "View Analytics", description: "Can access analytics dashboard" },
      { id: "generate_reports", label: "Generate Reports", description: "Can create system reports" },
      { id: "export_data", label: "Export Data", description: "Can export system data" }
    ]
  },
  {
    category: "System Settings",
    permissions: [
      { id: "manage_admins", label: "Manage Admins", description: "Can add/remove administrators" },
      { id: "system_config", label: "System Configuration", description: "Can modify system settings" },
      { id: "audit_logs", label: "View Audit Logs", description: "Can access system audit logs" }
    ]
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("access")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [newAdmin, setNewAdmin] = useState({
    step: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    customPermissions: [] as string[]
  })
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("USD")

  const filteredAdmins = mockAdmins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || admin.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string) => {
    const roleConfig = userRoles.find(r => r.value === role)
    if (!roleConfig) return null
    
    const Icon = roleConfig.icon
    return (
      <Badge className={cn("flex items-center gap-1", roleConfig.color)}>
        <Icon className="h-3 w-3" />
        {roleConfig.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>
    }
    return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>
  }

  const handlePermissionToggle = (permissionId: string) => {
    setNewAdmin(prev => ({
      ...prev,
      customPermissions: prev.customPermissions.includes(permissionId)
        ? prev.customPermissions.filter(p => p !== permissionId)
        : [...prev.customPermissions, permissionId]
    }))
  }

  const EnhancedStepper = () => {
    const steps = [
      { number: 1, title: "Personal Info", description: "Basic information", icon: User },
      { number: 2, title: "Company Details", description: "Partner organization", icon: Building },
      { number: 3, title: "Role Setup", description: "Access levels", icon: Shield },
      { number: 4, title: "Confirmation", description: "Review details", icon: CheckCircle }
    ]

    return (
      <div className="relative mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = newAdmin.step > step.number
            const isCurrent = newAdmin.step === step.number
            
            return (
              <div key={step.number} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center text-center min-w-[100px]">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 font-semibold transition-all duration-500 relative z-10",
                    isCompleted && "bg-green-500 border-green-500 text-white scale-110 shadow-lg",
                    isCurrent && "bg-[#f5c849] border-[#f5c849] text-amber-900 scale-110 shadow-lg",
                    !isCompleted && !isCurrent && "border-amber-200 bg-amber-50 text-amber-400"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <StepIcon className={cn("h-5 w-5", isCurrent ? "text-amber-900" : "text-amber-400")} />
                    )}
                    <div className={cn(
                      "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                      isCompleted && "bg-green-600 text-white",
                      isCurrent && "bg-amber-600 text-white",
                      !isCompleted && !isCurrent && "bg-amber-200 text-amber-600"
                    )}>
                      {step.number}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={cn(
                      "text-sm font-semibold transition-colors",
                      isCompleted && "text-green-700",
                      isCurrent && "text-amber-900",
                      !isCompleted && !isCurrent && "text-amber-500"
                    )}>
                      {step.title}
                    </div>
                    <div className={cn(
                      "text-xs transition-colors hidden sm:block",
                      isCompleted && "text-green-600",
                      isCurrent && "text-amber-600",
                      !isCompleted && !isCurrent && "text-amber-400"
                    )}>
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "hidden sm:block flex-1 h-1 mx-4 transition-all duration-500",
                    isCompleted ? "bg-green-400" : "bg-amber-200"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">Settings</h1>
            <p className="text-amber-600 mt-1">Manage your account and system preferences</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-amber-50/50 rounded-2xl">
            <TabsTrigger value="access" className="flex items-center gap-2 data-[state=active]:bg-[#f5c849] rounded-xl py-3">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Access</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-[#f5c849] rounded-xl py-3">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-[#f5c849] rounded-xl py-3">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2 data-[state=active]:bg-[#f5c849] rounded-xl py-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          {/* Access Control Tab */}
          <TabsContent value="access" className="space-y-6">
            <Card className="border-amber-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-amber-900 flex items-center gap-2">
                      <Shield className="h-6 w-6" />
                      Admin Management
                    </CardTitle>
                    <CardDescription>
                      Manage system administrators and their permissions
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#f5c849] hover:bg-amber-500 text-amber-900 font-semibold shadow-md w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-amber-900 flex items-center gap-2 text-xl">
                          <User className="h-6 w-6" />
                          Add New Administrator
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Create a new administrator account with specific permissions and access levels.
                        </DialogDescription>
                      </DialogHeader>

                      <EnhancedStepper />

                      {newAdmin.step === 1 && (
                        <div className="space-y-6 p-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <Label htmlFor="firstName" className="text-amber-900 font-medium">First Name</Label>
                              <Input
                                id="firstName"
                                placeholder="Enter first name"
                                value={newAdmin.firstName}
                                onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                                className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="lastName" className="text-amber-900 font-medium">Last Name</Label>
                              <Input
                                id="lastName"
                                placeholder="Enter last name"
                                value={newAdmin.lastName}
                                onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                                className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="email" className="text-amber-900 font-medium">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email address"
                              value={newAdmin.email}
                              onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                              className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="phone" className="text-amber-900 font-medium">Phone Number</Label>
                            <Input
                              id="phone"
                              placeholder="Enter phone number"
                              value={newAdmin.phone}
                              onChange={(e) => setNewAdmin(prev => ({ ...prev, phone: e.target.value }))}
                              className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                            />
                          </div>
                        </div>
                      )}

                      {newAdmin.step === 2 && (
                        <div className="space-y-6 p-2">
                          <div className="space-y-3">
                            <Label htmlFor="company" className="text-amber-900 font-medium">Company/Organization</Label>
                            <Input
                              id="company"
                              placeholder="Enter company or organization name"
                              value={newAdmin.company}
                              onChange={(e) => setNewAdmin(prev => ({ ...prev, company: e.target.value }))}
                              className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                            />
                            <p className="text-sm text-amber-600">
                              Partner organization this admin will represent (e.g., Hospital, Photo Studio, Embassy)
                            </p>
                          </div>
                        </div>
                      )}

                      {newAdmin.step === 3 && (
                        <div className="space-y-6 p-2">
                          <div className="space-y-4">
                            <Label className="text-amber-900 font-medium text-lg">Select Role Type</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {userRoles.map((role) => (
                                <div
                                  key={role.value}
                                  className={cn(
                                    "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                                    newAdmin.role === role.value
                                      ? "border-[#f5c849] bg-amber-50/70 shadow-md scale-105"
                                      : "border-amber-200 hover:border-amber-300 bg-white"
                                  )}
                                  onClick={() => setNewAdmin(prev => ({ ...prev, role: role.value }))}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn("p-3 rounded-xl", role.color)}>
                                      <role.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-amber-900">{role.label}</div>
                                      <div className="text-xs text-amber-600 mt-1">{role.description}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {newAdmin.role === "custom" && (
                            <div className="space-y-4">
                              <Label className="text-amber-900 font-medium text-lg">Custom Permissions</Label>
                              <div className="space-y-4 max-h-60 overflow-y-auto">
                                {permissionGroups.map((group) => (
                                  <Card key={group.category} className="border-amber-200">
                                    <CardHeader className="py-4 bg-amber-50/50">
                                      <CardTitle className="text-sm text-amber-900">{group.category}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 py-4">
                                      {group.permissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center justify-between py-3 border-b border-amber-100 last:border-b-0">
                                          <div className="flex-1">
                                            <div className="font-medium text-amber-900">{permission.label}</div>
                                            <div className="text-xs text-amber-600">{permission.description}</div>
                                          </div>
                                          <Switch
                                            checked={newAdmin.customPermissions.includes(permission.id)}
                                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                                          />
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {newAdmin.step === 4 && (
                        <div className="space-y-6 p-2">
                          <Card className="bg-green-50 border-green-200">
                            <CardHeader className="bg-green-100/50">
                              <CardTitle className="text-green-900 flex items-center gap-2 text-lg">
                                <CheckCircle className="h-5 w-5" />
                                Ready to Create Account
                              </CardTitle>
                              <CardDescription className="text-green-700">
                                The administrator will receive login instructions via email.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 py-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex justify-between">
                                  <span className="text-amber-600 font-medium">Name:</span>
                                  <span className="font-semibold text-amber-900">{newAdmin.firstName} {newAdmin.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-600 font-medium">Email:</span>
                                  <span className="font-semibold text-amber-900">{newAdmin.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-600 font-medium">Company:</span>
                                  <span className="font-semibold text-amber-900">{newAdmin.company}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-amber-600 font-medium">Role:</span>
                                  <span className="font-semibold text-amber-900">
                                    {userRoles.find(r => r.value === newAdmin.role)?.label}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-blue-900">Login Instructions</p>
                                <p className="text-sm text-blue-700 mt-1">
                                  The new administrator will receive an email with login credentials and setup instructions at <strong>{newAdmin.email}</strong>.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                        <Button
                          variant="outline"
                          disabled={newAdmin.step === 1}
                          onClick={() => setNewAdmin(prev => ({ ...prev, step: prev.step - 1 }))}
                          className="w-full sm:w-auto border-amber-200 text-amber-700"
                        >
                          Previous
                        </Button>
                        <Button
                          className="bg-[#f5c849] hover:bg-amber-500 text-amber-900 font-semibold w-full sm:w-auto"
                          onClick={() => {
                            if (newAdmin.step < 4) {
                              setNewAdmin(prev => ({ ...prev, step: prev.step + 1 }))
                            } else {
                              console.log("Creating admin:", newAdmin)
                            }
                          }}
                        >
                          {newAdmin.step === 4 ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Create Admin Account
                            </>
                          ) : (
                            "Next Step"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                  <div className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                    <Input
                      placeholder="Search admins..."
                      className="pl-10 bg-amber-50/50 border-amber-200 h-11"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full sm:w-40 bg-amber-50/50 border-amber-200 h-11">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {userRoles.map(role => (
                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Admins List */}
                <div className="space-y-4">
                  {filteredAdmins.map((admin) => (
                    <div key={admin.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-amber-200/50 rounded-xl hover:bg-amber-50/30 transition-all duration-200 gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-amber-200">
                          <AvatarImage src={admin.avatar} alt={admin.name} />
                          <AvatarFallback className="bg-[#f5c849] text-amber-900 font-semibold">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-amber-900 text-lg">{admin.name}</h3>
                            {getStatusBadge(admin.status)}
                          </div>
                          <p className="text-amber-600 text-sm mb-2">{admin.email}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            {getRoleBadge(admin.role)}
                            <span className="text-xs text-amber-500">Company: {admin.department}</span>
                            <span className="text-xs text-amber-500 hidden sm:inline">• Last active: {admin.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-amber-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-20 w-20 ring-4 ring-amber-200">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="bg-[#f5c849] text-amber-900 text-xl font-bold">AU</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="border-amber-200">Change Avatar</Button>
                    <p className="text-sm text-amber-600 mt-2">JPG, GIF or PNG. Max size 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profileFirstName">First Name</Label>
                    <Input id="profileFirstName" defaultValue="Admin" className="bg-amber-50/50 border-amber-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileLastName">Last Name</Label>
                    <Input id="profileLastName" defaultValue="User" className="bg-amber-50/50 border-amber-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input id="profileEmail" type="email" defaultValue="admin@kazipert.com" className="bg-amber-50/50 border-amber-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePhone">Phone</Label>
                    <Input id="profilePhone" defaultValue="+255 123 456 789" className="bg-amber-50/50 border-amber-200" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="profileBio">Bio</Label>
                    <Textarea
                      id="profileBio"
                      rows={3}
                      className="w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5c849]/30"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="border-amber-200">Cancel</Button>
                  <Button className="bg-[#f5c849] hover:bg-amber-500 text-amber-900">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-amber-200/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Lock className="h-6 w-6" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input id="currentPassword" type="password" className="bg-amber-50/50 border-amber-200 pr-10" />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input id="newPassword" type="password" className="bg-amber-50/50 border-amber-200 pr-10" />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input id="confirmPassword" type="password" className="bg-amber-50/50 border-amber-200 pr-10" />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-amber-900">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
                    <div>
                      <div className="font-medium text-amber-900">2FA Status</div>
                      <div className="text-sm text-amber-600">Add an extra layer of security to your account</div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#f5c849] hover:bg-amber-500 text-amber-900">Update Security</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appearance Settings */}
              <Card className="border-amber-200/50 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                  <CardTitle className="text-amber-900 flex items-center gap-2">
                    <Palette className="h-6 w-6" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-amber-900 font-medium">Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "light", label: "Light", icon: Sun, description: "Light theme" },
                        { value: "dark", label: "Dark", icon: Moon, description: "Dark theme" },
                        { value: "auto", label: "Auto", icon: Monitor, description: "System preference" }
                      ].map((item) => {
                        const Icon = item.icon
                        return (
                          <div
                            key={item.value}
                            className={cn(
                              "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 text-center",
                              theme === item.value
                                ? "border-[#f5c849] bg-amber-50/50"
                                : "border-amber-200 hover:border-amber-300"
                            )}
                            onClick={() => setTheme(item.value)}
                          >
                            <Icon className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                            <div className="font-medium text-amber-900">{item.label}</div>
                            <div className="text-xs text-amber-600">{item.description}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-amber-900 font-medium">Language & Region</Label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="bg-amber-50/50 border-amber-200">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="sw">Swahili</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="bg-amber-50/50 border-amber-200">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="TZS">TZS (TSh)</SelectItem>
                            <SelectItem value="OMR">OMR (﷼)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-amber-200/50 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                  <CardTitle className="text-amber-900 flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {[
                    { title: "Email Notifications", description: "Receive notifications via email", icon: Mail },
                    { title: "Push Notifications", description: "Receive push notifications on your device", icon: Smartphone },
                    { title: "SMS Alerts", description: "Get important updates via SMS", icon: MessageSquare },
                    { title: "System Updates", description: "Notifications about system maintenance", icon: Zap },
                    { title: "Security Alerts", description: "Alerts about security activities", icon: Shield }
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-amber-600" />
                          <div>
                            <div className="font-medium text-amber-900">{item.title}</div>
                            <div className="text-sm text-amber-600">{item.description}</div>
                          </div>
                        </div>
                        <Switch defaultChecked={index < 2} />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Business Settings */}
              <Card className="border-amber-200/50 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                  <CardTitle className="text-amber-900 flex items-center gap-2">
                    <Building className="h-6 w-6" />
                    Business Settings
                  </CardTitle>
                  <CardDescription>
                    Configure business-related preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-amber-900 font-medium">Default Settings</Label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">Default Working Hours</Label>
                        <Input id="workingHours" defaultValue="9:00 AM - 5:00 PM" className="bg-amber-50/50 border-amber-200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="east-africa">
                          <SelectTrigger className="bg-amber-50/50 border-amber-200">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="east-africa">East Africa Time (EAT)</SelectItem>
                            <SelectItem value="gulf">Gulf Standard Time (GST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Information */}
              <Card className="border-amber-200/50 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
                  <CardTitle className="text-amber-900 flex items-center gap-2">
                    <Cpu className="h-6 w-6" />
                    System Information
                  </CardTitle>
                  <CardDescription>
                    System status and technical details
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-amber-600">Version</div>
                      <div className="font-medium text-amber-900">v2.1.0</div>
                    </div>
                    <div>
                      <div className="text-amber-600">Last Updated</div>
                      <div className="font-medium text-amber-900">2024-01-15</div>
                    </div>
                    <div>
                      <div className="text-amber-600">Database</div>
                      <div className="font-medium text-amber-900">PostgreSQL 14</div>
                    </div>
                    <div>
                      <div className="text-amber-600">Uptime</div>
                      <div className="font-medium text-amber-900">99.8%</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full border-amber-200">
                      <Database className="h-4 w-4 mr-2" />
                      System Diagnostics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}