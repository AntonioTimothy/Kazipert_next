"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import {
  User,
  Bell,
  Shield,
  Globe,
  Eye,
  Moon,
  Sun,
  Smartphone,
  Heart,
  Users,
  MapPin,
  Mail,
  Phone,
  Lock,
  Download,
  Key,
  MessageCircle,
  Video,
  Calendar,
  Clock,
  Zap,
  Crown,
  Star,
  CheckCircle,
  AlertTriangle,
  Settings,
  CreditCard,
  Building,
  Flag,
  Languages,
  Wifi,
  Battery,
  Volume2,
  EyeOff,
  ShieldCheck,
  FileText,
  QrCode,
  Scan,
  Trash2
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { currentTheme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  // Mock user data from KYC/onboarding
  const [kycData] = useState({
    personal: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+254 712 345678",
      nationality: "Kenyan",
      dateOfBirth: "1990-05-15",
      idNumber: "12345678",
      passportNumber: "AB123456",
      maritalStatus: "Single"
    },
    professional: {
      experience: "5+ years",
      specialization: "Childcare & Housekeeping",
      languages: ["English", "Swahili", "Basic Arabic"],
      certifications: ["First Aid Certified", "Childcare Training"],
      expectedSalary: "$500-700",
      preferredLocation: "Oman"
    },
    verification: {
      status: "verified",
      level: "advanced",
      verifiedAt: "2024-01-15",
      nextReview: "2025-01-15"
    }
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    jobAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
    messageTones: true,
    vibration: true
  })

  // Privacy & Security
  const [privacy, setPrivacy] = useState({
    biometricAuth: false,
    autoLogout: true,
    twoFactorAuth: false,
    sessionTimeout: "30 minutes",
    dataSharing: false,
    activityLogs: true
  })

  // Emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "Sarah Johnson", relationship: "Sister", phone: "+254 712 345678", primary: true },
    { id: 2, name: "David Kim", relationship: "Friend", phone: "+254 723 456789", primary: false },
    { id: 3, name: "Police Emergency", relationship: "Emergency", phone: "999", primary: false }
  ])

  // App preferences
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "english",
    timezone: "Africa/Nairobi",
    currency: "USD",
    fontSize: "medium",
    reduceMotion: false,
    highContrast: false
  })

  // Quick actions
  const [quickActions, setQuickActions] = useState({
    quickSupport: true,
    emergencySOS: true,
    locationSharing: false,
    backupContacts: true
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleAddEmergencyContact = () => {
    const newContact = {
      id: emergencyContacts.length + 1,
      name: "",
      relationship: "",
      phone: "",
      primary: false
    }
    setEmergencyContacts([...emergencyContacts, newContact])
  }

  const handleRemoveEmergencyContact = (id: number) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id))
  }

  const handleUpdateEmergencyContact = (id: number, field: string, value: string) => {
    setEmergencyContacts(emergencyContacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ))
  }

  const setPrimaryContact = (id: number) => {
    setEmergencyContacts(emergencyContacts.map(contact => ({
      ...contact,
      primary: contact.id === id
    })))
  }

  const handleExportData = () => {
    // Simulate data export
    alert("Your data export has been started. You will receive an email with download link.")
  }

  // Skeleton loading components
  const SettingsCardSkeleton = () => (
    <div className="border-2 border-border/50 rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  )

  const ProfileSkeleton = () => (
    <div className="border-2 border-border/50 rounded-lg p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
          
          {/* Tabs Skeleton */}
          <div className="border-0 shadow-lg rounded-lg p-6 animate-pulse">
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <ProfileSkeleton />
            <div className="space-y-6">
              <SettingsCardSkeleton />
              <SettingsCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <Settings className="h-6 w-6 md:h-8 md:w-8" style={{ color: currentTheme.colors.primary }} />
              Account Settings
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              Manage your preferences, security, and account settings
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            <ShieldCheck className="h-3 w-3 mr-1" />
            KYC Verified
          </Badge>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-5 p-1 rounded-lg bg-muted/50"
              >
                <TabsTrigger 
                  value="profile" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'profile' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'profile' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <User className="h-3 w-3 mr-1" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'notifications' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'notifications' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'security' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'security' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'emergency' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'emergency' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Emergency
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'preferences' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'preferences' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab - Display Only KYC Data */}
              <TabsContent value="profile" className="space-y-6 p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Profile Overview */}
                  <Card className="border-0 shadow-sm lg:col-span-1">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div 
                            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          >
                            {kycData.personal.firstName.charAt(0)}{kycData.personal.lastName.charAt(0)}
                          </div>
                          <Badge className="absolute -bottom-2 -right-2 bg-green-500 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{kycData.personal.firstName} {kycData.personal.lastName}</h3>
                        <p className="text-muted-foreground mb-4">{kycData.personal.nationality}</p>
                        
                        <div className="space-y-2 text-sm text-left">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{kycData.personal.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{kycData.personal.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{kycData.personal.dateOfBirth}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* KYC Information - Display Only */}
                  <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle>KYC Information</CardTitle>
                      <CardDescription>Your verified identification details (read-only)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Personal Information
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm text-muted-foreground">Full Name</label>
                            <div className="font-medium">{kycData.personal.firstName} {kycData.personal.lastName}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Date of Birth</label>
                            <div className="font-medium">{kycData.personal.dateOfBirth}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Nationality</label>
                            <div className="font-medium">{kycData.personal.nationality}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Marital Status</label>
                            <div className="font-medium">{kycData.personal.maritalStatus}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">ID Number</label>
                            <div className="font-medium">{kycData.personal.idNumber}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Passport Number</label>
                            <div className="font-medium">{kycData.personal.passportNumber}</div>
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Professional Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm text-muted-foreground">Experience</label>
                            <div className="font-medium">{kycData.professional.experience}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Specialization</label>
                            <div className="font-medium">{kycData.professional.specialization}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Languages</label>
                            <div className="font-medium">{kycData.professional.languages.join(", ")}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Preferred Location</label>
                            <div className="font-medium">{kycData.professional.preferredLocation}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-sm text-muted-foreground">Certifications</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {kycData.professional.certifications.map((cert, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Verification Status
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm text-muted-foreground">Status</label>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500 text-white border-0">
                                {kycData.verification.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Verification Level</label>
                            <div className="font-medium capitalize">{kycData.verification.level}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Verified On</label>
                            <div className="font-medium">{kycData.verification.verifiedAt}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Next Review</label>
                            <div className="font-medium">{kycData.verification.nextReview}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Communication Notifications */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Communication
                      </CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notifications).slice(0, 6).map(([key, value]) => (
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
                            onCheckedChange={(checked) => setNotifications({...notifications, [key]: checked})}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Alert Preferences */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Alert Preferences
                      </CardTitle>
                      <CardDescription>Configure your alert settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notifications).slice(6).map(([key, value]) => (
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
                            onCheckedChange={(checked) => setNotifications({...notifications, [key]: checked})}
                          />
                        </div>
                      ))}
                      
                      {/* Sound & Vibration */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-medium text-sm">Notification Sound</div>
                            <div className="text-xs text-muted-foreground">Customize alert tones</div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Volume2 className="h-4 w-4 mr-2" />
                            Change
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Security Settings */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Protect your account and data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(privacy).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {typeof value === 'boolean' ? (value ? "Enabled" : "Disabled") : value}
                            </div>
                          </div>
                          {typeof value === 'boolean' ? (
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) => setPrivacy({...privacy, [key]: checked})}
                            />
                          ) : (
                            <Select value={value} onValueChange={(newValue) => setPrivacy({...privacy, [key]: newValue})}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15 minutes">15 min</SelectItem>
                                <SelectItem value="30 minutes">30 min</SelectItem>
                                <SelectItem value="1 hour">1 hour</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>Emergency and safety features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(quickActions).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {value ? "Active" : "Inactive"}
                            </div>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => setQuickActions({...quickActions, [key]: checked})}
                          />
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t space-y-3">
                        <Button className="w-full" variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        <Button className="w-full" variant="outline">
                          <QrCode className="h-4 w-4 mr-2" />
                          Setup 2FA
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Scan className="h-4 w-4 mr-2" />
                          Login Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Emergency Tab */}
              <TabsContent value="emergency" className="space-y-6 p-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Emergency Contacts
                    </CardTitle>
                    <CardDescription>Manage your emergency contact list</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <div 
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          >
                            {contact.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {contact.relationship} • {contact.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.primary ? (
                            <Badge className="bg-green-500 text-white border-0">
                              Primary
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryContact(contact.id)}
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEmergencyContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={handleAddEmergencyContact} className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Add Emergency Contact
                    </Button>
                  </CardContent>
                </Card>

                {/* Emergency Services */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Emergency Services</CardTitle>
                    <CardDescription>Quick access to emergency services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button variant="outline" className="justify-start">
                        <Phone className="h-4 w-4 mr-2 text-red-500" />
                        Police Emergency
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        Medical Emergency
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Shield className="h-4 w-4 mr-2 text-red-500" />
                        Kazipert Emergency
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Building className="h-4 w-4 mr-2 text-red-500" />
                        Embassy Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* App Preferences */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        App Preferences
                      </CardTitle>
                      <CardDescription>Customize your app experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Theme</label>
                        <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Language</label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="swahili">Swahili</SelectItem>
                            <SelectItem value="arabic">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Currency</label>
                        <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="KES">KES (KSh)</SelectItem>
                            <SelectItem value="OMR">OMR (﷼)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">Reduce Motion</div>
                          <div className="text-xs text-muted-foreground">Minimize animations</div>
                        </div>
                        <Switch
                          checked={preferences.reduceMotion}
                          onCheckedChange={(checked) => setPreferences({...preferences, reduceMotion: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">High Contrast</div>
                          <div className="text-xs text-muted-foreground">Increase visibility</div>
                        </div>
                        <Switch
                          checked={preferences.highContrast}
                          onCheckedChange={(checked) => setPreferences({...preferences, highContrast: checked})}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Management */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Data Management
                      </CardTitle>
                      <CardDescription>Manage your account data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        View Privacy Policy
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Data Sharing Settings
                      </Button>
                      
                      <div className="pt-4 border-t">
                        <div className="space-y-3">
                          <div className="text-sm">
                            <div className="font-medium">Account Status</div>
                            <div className="text-muted-foreground">Active • Verified</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Member Since</div>
                            <div className="text-muted-foreground">January 2024</div>
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Last Login</div>
                            <div className="text-muted-foreground">Today, 14:30</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}