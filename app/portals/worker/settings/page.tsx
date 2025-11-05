"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/ThemeContext"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Crown,
  Mail,
  Phone,
  MapPin,
  Download,
  Key,
  Eye,
  Home
} from "lucide-react"

export default function EmployerSettingsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Domestic employer data
  const [employerData, setEmployerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    householdType: "",
    verification: {
      status: "pending",
      level: "basic"
    }
  })

  const [notifications, setNotifications] = useState({
    applicantAlerts: true,
    messageNotifications: true,
    paymentReminders: true,
    securityAlerts: true
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    autoLogout: true
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Get user data from session storage
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

      // Load employer profile data
      const employerInfo = sessionStorage.getItem("employerProfile") || localStorage.getItem("employerProfile")
      
      if (employerInfo) {
        const parsedEmployer = JSON.parse(employerInfo)
        setEmployerData(parsedEmployer)
      } else {
        // Use basic user data
        setEmployerData({
          name: parsedUser.name || "Employer",
          email: parsedUser.email,
          phone: parsedUser.phone || "+968 XXX XXXX",
          address: parsedUser.address || "Muscat, Oman",
          householdType: parsedUser.householdType || "Family",
          verification: {
            status: parsedUser.verified ? "verified" : "pending",
            level: parsedUser.premium ? "premium" : "basic"
          }
        })
      }

      // Load preferences
      const savedNotifications = localStorage.getItem("employerNotifications")
      const savedSecurity = localStorage.getItem("employerSecurity")

      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }
      if (savedSecurity) {
        setSecurity(JSON.parse(savedSecurity))
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleNotificationChange = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    localStorage.setItem("employerNotifications", JSON.stringify(updated))
  }

  const handleSecurityChange = (key: string, value: boolean) => {
    const updated = { ...security, [key]: value }
    setSecurity(updated)
    localStorage.setItem("employerSecurity", JSON.stringify(updated))
  }

  const handleExportData = () => {
    const exportData = {
      user,
      employerData,
      notifications,
      security,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kazipert-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.colors.background }}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Settings className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          {employerData.verification.level === "premium" && (
            <Badge variant="secondary" className="px-3 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        {/* Profile Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your household employer profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <div className="font-medium">{employerData.name}</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Household Type</label>
                <div className="font-medium">{employerData.householdType}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{employerData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employerData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{employerData.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Verification Status</div>
                <div className="text-sm text-muted-foreground">
                  {employerData.verification.status === "verified" ? "Identity verified" : "Verification pending"}
                </div>
              </div>
              <Badge className={
                employerData.verification.status === "verified" 
                  ? "bg-green-500 text-white border-0" 
                  : "bg-yellow-500 text-white border-0"
              }>
                {employerData.verification.status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {value ? "Enabled" : "Disabled"}
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Protect your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(security).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {value ? "Enabled" : "Disabled"}
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleSecurityChange(key, checked)}
                />
              </div>
            ))}
            
            <div className="pt-4 border-t space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Login Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold capitalize">{employerData.verification.level} Plan</div>
                <div className="text-muted-foreground">
                  {employerData.verification.level === "premium" ? "$99/month" : "Free plan"}
                </div>
              </div>
              <Badge className={
                employerData.verification.level === "premium" 
                  ? "bg-amber-500 text-white border-0" 
                  : "bg-gray-500 text-white border-0"
              }>
                {employerData.verification.level.toUpperCase()}
              </Badge>
            </div>

            {employerData.verification.level === "basic" && (
              <Button className="w-full">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  )
}