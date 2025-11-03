"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import {
  CreditCard,
  Wallet,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Share2,
  Eye,
  MoreHorizontal,
  Building,
  User,
  Send,
  QrCode,
  Shield,
  Lock,
  Zap,
  TrendingUp,
  BarChart3,
  Receipt,
  Banknote,
  Coins,
  PiggyBank,
  Smartphone,
  Mail,
  Phone,
  MessageCircle,
  ArrowUpRight,
  ChevronRight,
  Crown,
  Sparkles,
  Target,
  Users,
  Briefcase
} from "lucide-react"

export default function EmployerPaymentsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddPayment, setShowAddPayment] = useState(false)

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

  // Mock data
  const paymentData = {
    hasContracts: false, // Set to true to see transaction view
    balance: 0,
    upcomingPayments: 0,
    totalSpent: 0,
    
    paymentMethods: [
      {
        id: "1",
        type: "card",
        name: "Visa ending in 4242",
        lastFour: "4242",
        expiry: "12/25",
        isDefault: true,
        brand: "visa"
      },
      {
        id: "2", 
        type: "bank",
        name: "Bank of Oman",
        lastFour: "7890",
        isDefault: false,
        brand: "bank"
      }
    ],
    
    transactions: [
      {
        id: "1",
        amount: 320,
        currency: "OMR",
        description: "Salary - Sarah Johnson",
        date: "2024-01-15",
        status: "completed",
        type: "salary",
        workerName: "Sarah Johnson",
        workerRole: "House Manager"
      },
      {
        id: "2",
        amount: 280,
        currency: "OMR", 
        description: "Salary - Maria Rodriguez",
        date: "2024-01-15",
        status: "completed",
        type: "salary",
        workerName: "Maria Rodriguez",
        workerRole: "Childcare Specialist"
      },
      {
        id: "3",
        amount: 50,
        currency: "OMR",
        description: "Service Fee - Kazipert",
        date: "2024-01-14",
        status: "completed",
        type: "fee",
        workerName: "Kazipert Platform",
        workerRole: "Service Fee"
      }
    ],
    
    upcoming: [
      {
        id: "upc-1",
        amount: 320,
        currency: "OMR",
        description: "Upcoming Salary - Sarah Johnson",
        dueDate: "2024-02-15",
        workerName: "Sarah Johnson",
        workerRole: "House Manager"
      },
      {
        id: "upc-2",
        amount: 280,
        currency: "OMR",
        description: "Upcoming Salary - Maria Rodriguez", 
        dueDate: "2024-02-15",
        workerName: "Maria Rodriguez",
        workerRole: "Childcare Specialist"
      }
    ]
  }

  const quickActions = [
    {
      name: "Post New Job",
      description: "Find your perfect help",
      icon: Briefcase,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      route: "/employer/post-job"
    },
    {
      name: "Browse Workers",
      description: "Verified candidates",
      icon: Users,
      color: "text-green-500", 
      bgColor: "bg-green-500/10",
      route: "/employer/workers"
    },
    {
      name: "Add Payment Method",
      description: "Secure your payments",
      icon: CreditCard,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      action: "add-payment"
    },
    {
      name: "Get Support",
      description: "24/7 assistance",
      icon: MessageCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10", 
      route: "/employer/support"
    }
  ]

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
      return
    }
    
    switch(action) {
      case 'add-payment':
        setShowAddPayment(true)
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200'
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'salary': return <User className="h-4 w-4" />
      case 'fee': return <Receipt className="h-4 w-4" />
      case 'refund': return <ArrowUpRight className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  // Skeleton loading components
  const StatSkeleton = () => (
    <div className="bg-background rounded-2xl p-4 border border-border animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-2 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )

  const ActionSkeleton = () => (
    <div className="bg-background rounded-2xl p-4 border border-border animate-pulse">
      <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(3)].map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>

          {/* Quick Actions Skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <ActionSkeleton key={i} />
              ))}
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
              <Wallet className="h-6 w-6 md:h-8 md:w-8" style={{ color: currentTheme.colors.primary }} />
              Payments & Billing
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              Manage your payments, view transactions, and handle billing
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowAddPayment(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {/* No Contracts State */}
        {!paymentData.hasContracts && (
          <Card 
            className="border-0 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.accent}10 50%, ${currentTheme.colors.backgroundLight} 100%)`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <div 
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 opacity-10"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
            
            <CardContent className="pt-16 pb-12 relative z-10">
              <div className="max-w-2xl mx-auto">
                <div 
                  className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: currentTheme.colors.primary + '20' }}
                >
                  <Users className="h-10 w-10" style={{ color: currentTheme.colors.primary }} />
                </div>
                
                <h2 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                  No Active Contracts Yet
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Start your journey by posting a job and finding the perfect household help. 
                  Once you hire through Kazipert, you'll be able to manage all payments securely here.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    onClick={() => router.push('/employer/post-job')}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    Post Your First Job
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => router.push('/employer/workers')}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Browse Workers
                  </Button>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {[
                    {
                      icon: Shield,
                      title: "Secure Payments",
                      description: "Bank-level security for all transactions"
                    },
                    {
                      icon: Zap,
                      title: "Instant Processing", 
                      description: "Quick and reliable payment processing"
                    },
                    {
                      icon: Receipt,
                      title: "Detailed Records",
                      description: "Complete transaction history and receipts"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                      >
                        <benefit.icon className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                      </div>
                      <h4 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* With Contracts State */}
        {paymentData.hasContracts && (
          <>
            {/* Quick Stats */}
            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Current Balance",
                  value: `${paymentData.balance} OMR`,
                  description: "Available for payments",
                  icon: Wallet,
                  color: "text-blue-500",
                  trend: "+0 OMR"
                },
                {
                  title: "Upcoming Payments", 
                  value: `${paymentData.upcomingPayments} OMR`,
                  description: "Due next month",
                  icon: Calendar,
                  color: "text-amber-500",
                  trend: "2 payments"
                },
                {
                  title: "Total Spent",
                  value: `${paymentData.totalSpent} OMR`,
                  description: "All time payments",
                  icon: BarChart3,
                  color: "text-green-500",
                  trend: "This month"
                }
              ].map((stat, index) => (
                <div 
                  key={stat.title}
                  className="rounded-2xl p-4 border transition-all duration-300"
                  style={{
                    backgroundColor: currentTheme.colors.backgroundLight,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div 
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <stat.icon className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs border-0"
                      style={{
                        backgroundColor: currentTheme.colors.primary + '15',
                        color: currentTheme.colors.primary
                      }}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-xs font-medium"
                      style={{ color: currentTheme.colors.textLight }}
                    >
                      {stat.title}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: currentTheme.colors.textLight }}
                    >
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="font-bold text-lg"
                  style={{ color: currentTheme.colors.text }}
                >
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => handleQuickAction(action.action, action.route)}
                    className="rounded-2xl p-4 border transition-all duration-300 hover:scale-105 group text-left"
                    style={{
                      backgroundColor: currentTheme.colors.backgroundLight,
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    <div 
                      className="p-3 rounded-xl w-fit mb-3"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <action.icon className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div className="space-y-1">
                      <div 
                        className="font-semibold group-hover:underline transition-colors"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {action.name}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: currentTheme.colors.textLight }}
                      >
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Tabs */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList 
                    className="grid w-full grid-cols-3 p-1 rounded-lg bg-muted/50"
                  >
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-md text-sm"
                      style={{ 
                        backgroundColor: activeTab === 'overview' ? currentTheme.colors.primary : 'transparent',
                        color: activeTab === 'overview' ? currentTheme.colors.text : 'inherit'
                      }}
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="transactions" 
                      className="rounded-md text-sm"
                      style={{ 
                        backgroundColor: activeTab === 'transactions' ? currentTheme.colors.primary : 'transparent',
                        color: activeTab === 'transactions' ? currentTheme.colors.text : 'inherit'
                      }}
                    >
                      <Receipt className="h-3 w-3 mr-1" />
                      Transactions
                    </TabsTrigger>
                    <TabsTrigger 
                      value="methods" 
                      className="rounded-md text-sm"
                      style={{ 
                        backgroundColor: activeTab === 'methods' ? currentTheme.colors.primary : 'transparent',
                        color: activeTab === 'methods' ? currentTheme.colors.text : 'inherit'
                      }}
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      Payment Methods
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Upcoming Payments */}
                      <Card className="border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                            Upcoming Payments
                          </CardTitle>
                          <CardDescription>
                            Scheduled payments for next month
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {paymentData.upcoming.map((payment) => (
                            <div 
                              key={payment.id}
                              className="flex items-center justify-between p-3 rounded-xl"
                              style={{
                                backgroundColor: currentTheme.colors.primary + '05',
                                border: `1px solid ${currentTheme.colors.primary}20`
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                                >
                                  <User className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                                </div>
                                <div>
                                  <div className="font-medium">{payment.workerName}</div>
                                  <div className="text-sm text-muted-foreground">{payment.workerRole}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold" style={{ color: currentTheme.colors.primary }}>
                                  {payment.amount} {payment.currency}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Due {new Date(payment.dueDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Payment Methods Summary */}
                      <Card className="border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                            Payment Methods
                          </CardTitle>
                          <CardDescription>
                            Your saved payment methods
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {paymentData.paymentMethods.map((method) => (
                            <div 
                              key={method.id}
                              className="flex items-center justify-between p-3 rounded-xl"
                              style={{
                                backgroundColor: currentTheme.colors.primary + '05',
                                border: `1px solid ${currentTheme.colors.primary}20`
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                                >
                                  <CreditCard className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                                </div>
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {method.type === 'card' ? `Expires ${method.expiry}` : 'Bank Account'}
                                  </div>
                                </div>
                              </div>
                              {method.isDefault && (
                                <Badge 
                                  variant="secondary"
                                  style={{
                                    backgroundColor: currentTheme.colors.primary + '20',
                                    color: currentTheme.colors.primary
                                  }}
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                          ))}
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowAddPayment(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Method
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Transactions Tab */}
                  <TabsContent value="transactions" className="space-y-4 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Transaction History</h3>
                        <p className="text-muted-foreground">All your payment records</p>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {paymentData.transactions.map((transaction) => (
                        <div 
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: currentTheme.colors.backgroundLight,
                            borderColor: currentTheme.colors.border
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                            >
                              {getTypeIcon(transaction.type)}
                            </div>
                            <div>
                              <div className="font-semibold">{transaction.description}</div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.workerName} • {new Date(transaction.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div 
                              className="font-semibold text-lg"
                              style={{ color: currentTheme.colors.primary }}
                            >
                              {transaction.amount} {transaction.currency}
                            </div>
                            <Badge className={cn("text-xs mt-1", getStatusColor(transaction.status))}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Payment Methods Tab */}
                  <TabsContent value="methods" className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Payment Methods</h3>
                        <p className="text-muted-foreground">Manage your payment options</p>
                      </div>
                      <Button 
                        onClick={() => setShowAddPayment(true)}
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Method
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {paymentData.paymentMethods.map((method) => (
                        <Card 
                          key={method.id}
                          className="border-0 transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: currentTheme.colors.backgroundLight
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                                >
                                  <CreditCard className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                                </div>
                                <div>
                                  <div className="font-semibold">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {method.type === 'card' ? `Card • Expires ${method.expiry}` : 'Bank Account'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {method.isDefault && (
                                  <Badge 
                                    variant="secondary"
                                    style={{
                                      backgroundColor: currentTheme.colors.primary + '20',
                                      color: currentTheme.colors.primary
                                    }}
                                  >
                                    Default
                                  </Badge>
                                )}
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}

        {/* Add Payment Method Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div 
              className="bg-background rounded-2xl w-full max-w-md"
              style={{ border: `1px solid ${currentTheme.colors.border}` }}
            >
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Add Payment Method</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddPayment(false)}>✕</Button>
                </div>
                <p className="text-muted-foreground">
                  Securely add a new payment method
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <Input placeholder="123" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cardholder Name</label>
                  <Input placeholder="John Doe" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="default" className="rounded" />
                  <label htmlFor="default" className="text-sm">Set as default payment method</label>
                </div>
              </div>
              
              <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddPayment(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Add Securely
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  Your payment information is encrypted and secure
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}