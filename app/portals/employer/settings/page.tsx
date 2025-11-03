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
  Trash2,
  Plus,
  Wallet,
  Banknote,
  Receipt,
  Building2,
  Briefcase,
  DollarSign,
  ShieldAlert,
  FileSearch,
  BadgeCheck,
  Coins,
  ScanEye
} from "lucide-react"

export default function EmployerSettingsPage() {
  const router = useRouter()
  const { currentTheme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  // Mock employer data
  const [employerData] = useState({
    company: {
      name: "Al Harthy Group",
      type: "Family Household",
      registrationNumber: "OM123456789",
      establishmentDate: "2018-03-15",
      industry: "Domestic Services",
      size: "Large Family",
      description: "Seeking reliable domestic staff for our family home in Muscat"
    },
    contact: {
      primaryContact: "Ahmed Al Harthy",
      email: "ahmed@alharthy-group.com",
      phone: "+968 1234 5678",
      address: "Al Khuwair, Muscat, Oman",
      emergencyContact: "+968 9876 5432"
    },
    verification: {
      status: "verified",
      level: "premium",
      verifiedAt: "2024-01-20",
      nextReview: "2025-01-20",
      documents: ["Trade License", "ID Copy", "Address Proof"]
    }
  })

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "visa",
      last4: "4235",
      expiry: "12/25",
      holderName: "AHMED AL HARTHY",
      isDefault: true,
      brand: "Visa"
    },
    {
      id: 2,
      type: "mastercard",
      last4: "5689",
      expiry: "08/24",
      holderName: "AHMED AL HARTHY",
      isDefault: false,
      brand: "Mastercard"
    }
  ])

  // New card form state
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
    saveAsDefault: false
  })

  // Billing preferences
  const [billingPreferences, setBillingPreferences] = useState({
    autoTopUp: true,
    lowBalanceAlert: true,
    receiptEmails: true,
    taxInvoices: true,
    paymentReminders: true,
    subscriptionAlerts: true
  })

  // Subscription details
  const [subscription, setSubscription] = useState({
    plan: "Premium",
    status: "active",
    nextBilling: "2024-02-20",
    price: "$99/month",
    features: ["Up to 10 Job Posts", "Priority Support", "Advanced Screening", "Background Checks"]
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: true,
    jobAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
    applicantNotifications: true,
    contractUpdates: true,
    weeklyReports: true,
    marketingEmails: false
  })

  // Security settings
  const [security, setSecurity] = useState({
    biometricAuth: true,
    autoLogout: true,
    twoFactorAuth: false,
    sessionTimeout: "30 minutes",
    dataSharing: false,
    activityLogs: true
  })

  // App preferences
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "english",
    timezone: "Asia/Muscat",
    currency: "USD",
    fontSize: "medium",
    reduceMotion: false,
    highContrast: false
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
      if (parsedUser.role !== "EMPLOYER") {
        router.push("/login")
        return
      }

      setUser(parsedUser)
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleAddPaymentMethod = () => {
    if (newCard.cardNumber && newCard.expiryDate && newCard.cvv && newCard.holderName) {
      const newPaymentMethod = {
        id: paymentMethods.length + 1,
        type: newCard.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
        last4: newCard.cardNumber.slice(-4),
        expiry: newCard.expiryDate,
        holderName: newCard.holderName.toUpperCase(),
        isDefault: newCard.saveAsDefault || paymentMethods.length === 0,
        brand: newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
      }

      if (newCard.saveAsDefault) {
        setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: false })))
      }

      setPaymentMethods([...paymentMethods, newPaymentMethod])
      setNewCard({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        holderName: "",
        saveAsDefault: false
      })
    }
  }

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id))
  }

  const setDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })))
  }

  const handleExportData = () => {
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
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
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
              Employer Settings
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              Manage your company profile, payments, and preferences
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Premium Employer
          </Badge>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 p-1 rounded-lg bg-muted/50">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'profile' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'profile' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="payments" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'payments' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'payments' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Payments
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'billing' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'billing' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Receipt className="h-3 w-3 mr-1" />
                  Billing
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
                  Alerts
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

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Company Overview */}
                  <Card className="border-0 shadow-sm lg:col-span-1">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div 
                            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          >
                            {employerData.company.name.split(' ').map(word => word[0]).join('')}
                          </div>
                          <Badge className="absolute -bottom-2 -right-2 bg-amber-500 border-0">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{employerData.company.name}</h3>
                        <p className="text-muted-foreground mb-4">{employerData.company.type}</p>
                        
                        <div className="space-y-2 text-sm text-left">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{employerData.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{employerData.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{employerData.contact.address}</span>
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

                  {/* Company Information */}
                  <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>Your verified business details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Company Details */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Company Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm text-muted-foreground">Company Name</label>
                            <div className="font-medium">{employerData.company.name}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Registration Number</label>
                            <div className="font-medium">{employerData.company.registrationNumber}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Establishment Date</label>
                            <div className="font-medium">{employerData.company.establishmentDate}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Industry</label>
                            <div className="font-medium">{employerData.company.industry}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Company Size</label>
                            <div className="font-medium">{employerData.company.size}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Company Type</label>
                            <div className="font-medium">{employerData.company.type}</div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Contact Information
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm text-muted-foreground">Primary Contact</label>
                            <div className="font-medium">{employerData.contact.primaryContact}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Emergency Contact</label>
                            <div className="font-medium">{employerData.contact.emergencyContact}</div>
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
                                {employerData.verification.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Verification Level</label>
                            <div className="font-medium capitalize">{employerData.verification.level}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Verified On</label>
                            <div className="font-medium">{employerData.verification.verifiedAt}</div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Next Review</label>
                            <div className="font-medium">{employerData.verification.nextReview}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="text-sm text-muted-foreground">Verified Documents</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {employerData.verification.documents.map((doc, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-6 p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Current Payment Methods */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Methods
                      </CardTitle>
                      <CardDescription>Manage your saved payment methods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`h-10 w-14 rounded-md flex items-center justify-center ${
                              method.type === 'visa' ? 'bg-blue-500' : 'bg-red-500'
                            }`}>
                              {method.type === 'visa' ? (
                                <div className="text-white font-bold text-xs">VISA</div>
                              ) : (
                                <div className="text-white font-bold text-xs">MC</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{method.brand} •••• {method.last4}</div>
                              <div className="text-sm text-muted-foreground">
                                Expires {method.expiry} • {method.holderName}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault ? (
                              <Badge className="bg-green-500 text-white border-0">
                                Default
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDefaultPaymentMethod(method.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Add New Payment Method */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add New Card
                      </CardTitle>
                      <CardDescription>Add a new Visa or Mastercard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Card Number</label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Expiry Date</label>
                          <Input
                            placeholder="MM/YY"
                            value={newCard.expiryDate}
                            onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">CVV</label>
                          <Input
                            placeholder="123"
                            value={newCard.cvv}
                            onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cardholder Name</label>
                        <Input
                          placeholder="AHMED AL HARTHY"
                          value={newCard.holderName}
                          onChange={(e) => setNewCard({...newCard, holderName: e.target.value.toUpperCase()})}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newCard.saveAsDefault}
                          onCheckedChange={(checked) => setNewCard({...newCard, saveAsDefault: checked})}
                        />
                        <label className="text-sm font-medium">Set as default payment method</label>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleAddPaymentMethod}
                        disabled={!newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.holderName}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 p-3 border rounded-lg bg-green-50">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Your payment info is securely encrypted</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Security */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" />
                      Payment Security
                    </CardTitle>
                    <CardDescription>Additional security measures for your payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <ScanEye className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">3D Secure</div>
                          <div className="text-sm text-muted-foreground">Enabled</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <FileSearch className="h-8 w-8 text-green-500" />
                        <div>
                          <div className="font-medium">Transaction Monitoring</div>
                          <div className="text-sm text-muted-foreground">Active</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <BadgeCheck className="h-8 w-8 text-purple-500" />
                        <div>
                          <div className="font-medium">PCI DSS Compliant</div>
                          <div className="text-sm text-muted-foreground">Level 1</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6 p-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Subscription Plan */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Subscription Plan
                      </CardTitle>
                      <CardDescription>Your current subscription details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">{subscription.plan}</div>
                          <div className="text-muted-foreground">{subscription.price}</div>
                        </div>
                        <Badge className="bg-green-500 text-white border-0">
                          {subscription.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Next Billing Date</span>
                          <span className="font-medium">{subscription.nextBilling}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Billing Cycle</span>
                          <span className="font-medium">Monthly</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Plan Features</h4>
                        <div className="space-y-2">
                          {subscription.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Change Plan
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Cancel Subscription
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Billing Preferences */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Billing Preferences
                      </CardTitle>
                      <CardDescription>Manage your billing settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(billingPreferences).map(([key, value]) => (
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
                            onCheckedChange={(checked) => setBillingPreferences({...billingPreferences, [key]: checked})}
                          />
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoices
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Billing History
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Coins className="h-4 w-4 mr-2" />
                          Tax Documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your last 5 transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 1, date: "2024-01-15", description: "Premium Subscription", amount: "$99.00", status: "Completed" },
                        { id: 2, date: "2024-01-10", description: "Background Check", amount: "$29.00", status: "Completed" },
                        { id: 3, date: "2024-01-05", description: "Priority Listing", amount: "$49.00", status: "Completed" },
                        { id: 4, date: "2024-01-01", description: "Premium Subscription", amount: "$99.00", status: "Completed" },
                        { id: 5, date: "2023-12-25", description: "Verification Service", amount: "$19.00", status: "Completed" }
                      ].map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">{transaction.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{transaction.amount}</div>
                            <Badge variant="secondary" className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Job & Applicant Alerts
                      </CardTitle>
                      <CardDescription>Stay updated on your job posts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notifications).slice(0, 5).map(([key, value]) => (
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

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Financial & System Alerts
                      </CardTitle>
                      <CardDescription>Payment and system notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notifications).slice(5).map(([key, value]) => (
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
                </div>
              </TabsContent>

              {/* Security Tab - Similar to employee but with employer context */}
              <TabsContent value="security" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Protect your employer account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(security).map(([key, value]) => (
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
                              onCheckedChange={(checked) => setSecurity({...security, [key]: checked})}
                            />
                          ) : (
                            <Select value={value} onValueChange={(newValue) => setSecurity({...security, [key]: newValue})}>
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

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>Account security features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full" variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button className="w-full" variant="outline">
                        <QrCode className="h-4 w-4 mr-2" />
                        Setup Two-Factor Auth
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Scan className="h-4 w-4 mr-2" />
                        View Login Activity
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Team Access
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Preferences Tab - Similar to employee */}
              <TabsContent value="preferences" className="space-y-6 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        App Preferences
                      </CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Theme</label>
                        <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
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
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Data Management
                      </CardTitle>
                      <CardDescription>Manage your company data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Company Data
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
                            <div className="text-muted-foreground">Active • Premium</div>
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