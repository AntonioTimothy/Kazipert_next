"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AddAdminDialog } from "./add-admin-dialog"
import { cn } from "@/lib/utils"

interface Admin {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatar: string
  lastActive: string
  permissions: string[]
  department: string
}

const userRoles = [
  {
    value: "super_admin",
    label: "Super Admin",
    color: "bg-red-100 text-red-700"
  },
  {
    value: "hospital_admin",
    label: "Hospital Admin",
    color: "bg-blue-100 text-blue-700"
  },
  {
    value: "photo_studio_admin",
    label: "Photo Studio Admin",
    color: "bg-purple-100 text-purple-700"
  },
  {
    value: "embassy_admin",
    label: "Embassy Admin",
    color: "bg-green-100 text-green-700"
  },
  {
    value: "admin",
    label: "Admin",
    color: "bg-amber-100 text-amber-700"
  }
]

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchAdmins()
  }, [searchTerm, selectedRole])

  const fetchAdmins = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedRole !== 'all') params.append('role', selectedRole)
      
      const response = await fetch(`/api/admins?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      } else {
        throw new Error('Failed to fetch admins')
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast({
        title: "Error",
        description: "Failed to load admins",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return
    
    try {
      const response = await fetch(`/api/admin/${adminId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin deleted successfully",
        })
        fetchAdmins()
      } else {
        throw new Error('Failed to delete admin')
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      toast({
        title: "Error",
        description: "Failed to delete admin",
        variant: "destructive"
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = userRoles.find(r => r.value === role)
    if (!roleConfig) return null
    
    return (
      <Badge className={cn("flex items-center gap-1", roleConfig.color)}>
        {roleConfig.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-700">Active</Badge>
    }
    return <Badge variant="outline">Pending</Badge>
  }

  return (
    <Card className="border-amber-200/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-amber-900">
              Admin Management
            </CardTitle>
            <CardDescription>
              Manage system administrators and their permissions
            </CardDescription>
          </div>
          <AddAdminDialog onAdminAdded={fetchAdmins} />
        </div>
      </CardHeader>
      <CardContent className="p-6">
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

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5c849] mx-auto"></div>
              <p className="text-amber-600 mt-2">Loading admins...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-amber-600">No admins found.</p>
            </div>
          ) : (
            admins.map((admin) => (
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => deleteAdmin(admin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}