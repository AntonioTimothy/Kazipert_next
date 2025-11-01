"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ProfileData {
  id: string
  email: string
  phone?: string
  fullName?: string
  firstName?: string
  lastName?: string
  company?: string
  profile?: {
    bio?: string
    avatar?: string
  }
}

export function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    bio: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          company: data.company || "",
          bio: data.profile?.bio || ""
        })
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        fetchProfile()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-amber-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f5c849] mx-auto"></div>
            <p className="text-amber-600 mt-2">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
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
            <AvatarImage src={profile?.profile?.avatar || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback className="bg-[#f5c849] text-amber-900 text-xl font-bold">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" className="border-amber-200">Change Avatar</Button>
            <p className="text-sm text-amber-600 mt-2">JPG, GIF or PNG. Max size 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="profileFirstName">First Name</Label>
            <Input 
              id="profileFirstName" 
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="bg-amber-50/50 border-amber-200" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileLastName">Last Name</Label>
            <Input 
              id="profileLastName" 
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="bg-amber-50/50 border-amber-200" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileEmail">Email</Label>
            <Input 
              id="profileEmail" 
              type="email" 
              value={profile?.email || ""} 
              disabled
              className="bg-amber-50/50 border-amber-200" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePhone">Phone</Label>
            <Input 
              id="profilePhone" 
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-amber-50/50 border-amber-200" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileCompany">Company</Label>
            <Input 
              id="profileCompany" 
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="bg-amber-50/50 border-amber-200" 
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profileBio">Bio</Label>
            <Textarea
              id="profileBio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5c849]/30"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-amber-200">Cancel</Button>
          <Button 
            className="bg-[#f5c849] hover:bg-amber-500 text-amber-900"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}