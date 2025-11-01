"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, CheckCircle, User, Building, Shield, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

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
    icon: User,
    color: "bg-purple-100 text-purple-700"
  },
  {
    value: "embassy_admin",
    label: "Embassy Admin",
    description: "View analytics and system reports",
    icon: User,
    color: "bg-green-100 text-green-700"
  },
  {
    value: "custom",
    label: "Custom Role",
    description: "Create custom permissions",
    icon: Shield,
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
  }
]

interface AddAdminDialogProps {
  onAdminAdded: () => void
}

export function AddAdminDialog({ onAdminAdded }: AddAdminDialogProps) {
  const [open, setOpen] = useState(false)
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
  const { toast } = useToast()

  const createAdmin = async () => {
    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: result.message,
        })
        setNewAdmin({
          step: 1,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          role: "",
          customPermissions: []
        })
        setOpen(false)
        onAdminAdded()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create admin')
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create admin account",
        variant: "destructive"
      })
    }
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

  const handlePermissionToggle = (permissionId: string) => {
    setNewAdmin(prev => ({
      ...prev,
      customPermissions: prev.customPermissions.includes(permissionId)
        ? prev.customPermissions.filter(p => p !== permissionId)
        : [...prev.customPermissions, permissionId]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                <Label htmlFor="firstName" className="text-amber-900 font-medium">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-amber-900 font-medium">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-amber-900 font-medium">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                required
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
              <Label htmlFor="company" className="text-amber-900 font-medium">Company/Organization *</Label>
              <Input
                id="company"
                placeholder="Enter company or organization name"
                value={newAdmin.company}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, company: e.target.value }))}
                className="bg-amber-50/50 border-amber-200 h-12 text-lg"
                required
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
              <Label className="text-amber-900 font-medium text-lg">Select Role Type *</Label>
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
                <Label className="text-amber-900 font-medium text-lg">Custom Permissions *</Label>
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
                    They will be required to change their password on first login.
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
                createAdmin()
              }
            }}
            disabled={
              (newAdmin.step === 1 && (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email)) ||
              (newAdmin.step === 2 && !newAdmin.company) ||
              (newAdmin.step === 3 && !newAdmin.role) ||
              (newAdmin.step === 3 && newAdmin.role === 'custom' && newAdmin.customPermissions.length === 0)
            }
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
  )
}