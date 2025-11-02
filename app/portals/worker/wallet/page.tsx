"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  Download,
  Filter,
  Calendar,
  Search,
  Wallet,
  Banknote,
  Building,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import type { WorkerProfile } from "@/lib/mock-data"

// Mock data for wallet
const walletData = {
  balance: 45250.75,
  currency: "KSh",
  accountNumber: "254712345678",
  bankName: "Kazipert Wallet",
  transactions: [
    {
      id: "TX001",
      type: "credit",
      amount: 30000,
      description: "Salary Payment - Al Noor Family",
      date: "2024-01-15",
      time: "09:30 AM",
      status: "completed",
      reference: "SAL-2024-001"
    },
    {
      id: "TX002",
      type: "debit",
      amount: 5000,
      description: "Transfer to M-Pesa - 0712345678",
      date: "2024-01-16",
      time: "02:15 PM",
      status: "completed",
      reference: "MPESA-001"
    },
    {
      id: "TX003",
      type: "debit",
      amount: 2500,
      description: "Service Fee - Insurance Premium",
      date: "2024-01-17",
      time: "10:00 AM",
      status: "completed",
      reference: "FEE-INS-001"
    },
    {
      id: "TX004",
      type: "credit",
      amount: 15000,
      description: "Bonus Payment - Excellent Service",
      date: "2024-01-18",
      time: "11:45 AM",
      status: "completed",
      reference: "BNS-2024-001"
    },
    {
      id: "TX005",
      type: "debit",
      amount: 3000,
      description: "Withdrawal - ATM CBD Branch",
      date: "2024-01-19",
      time: "04:20 PM",
      status: "pending",
      reference: "ATM-456789"
    }
  ],
  scheduledTransfers: [
    {
      id: "ST001",
      to: "M-Pesa - 0712345678",
      amount: 10000,
      schedule: "Monthly",
      nextDate: "2024-02-01",
      status: "active"
    }
  ],
  linkedAccounts: [
    {
      id: "ACC001",
      type: "mpesa",
      number: "0712345678",
      name: "Personal M-Pesa",
      isDefault: true
    },
    {
      id: "ACC002",
      type: "bank",
      number: "1234567890",
      name: "KCB Bank Account",
      isDefault: false
    }
  ]
}

export default function WorkerWalletPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [transferAmount, setTransferAmount] = useState("")
  const [mpesaNumber, setMpesaNumber] = useState("0712345678")
  const [isTransferring, setIsTransferring] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Applications", href: "/worker/contracts", icon: FileText },
    { name: "Wallet", href: "/worker/payments", icon: CreditCard },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Reviews", href: "/worker/reviews", icon: Star },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const handleTransfer = () => {
    if (!transferAmount || !mpesaNumber) {
      alert("Please enter amount and M-Pesa number")
      return
    }

    setIsTransferring(true)
    // Simulate API call
    setTimeout(() => {
      alert(`Transfer of KSh ${transferAmount} to ${mpesaNumber} initiated successfully!`)
      setTransferAmount("")
      setIsTransferring(false)
    }, 2000)
  }

  const quickActions = [
    {
      name: "Send to M-Pesa",
      description: "Instant transfer",
      icon: Send,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      action: () => setActiveTab("transfer")
    },
    {
      name: "Add Money",
      description: "Bank transfer",
      icon: Plus,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      action: () => setActiveTab("transfer")
    },
    {
      name: "Pay Bills",
      description: "Utilities & more",
      icon: Receipt,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      action: () => alert("Bill payment feature coming soon!")
    },
    {
      name: "Withdraw",
      description: "ATM withdrawal",
      icon: Download,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      action: () => alert("ATM withdrawal feature coming soon!")
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <MoreHorizontal className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "pending":
        return "text-amber-600 bg-amber-500/10 border-amber-500/20"
      case "failed":
        return "text-red-600 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Wallet className="h-8 w-8 text-primary" />
              My Wallet
            </h1>
            <p className="text-muted-foreground mt-2">Manage your earnings and transfers securely</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary"
              className="px-3 py-1"
              style={{
                backgroundColor: currentTheme.colors.primary + '15'
              }}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="border-primary/30 hover:bg-primary/10"
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-2">{showBalance ? "Hide" : "Show"} Balance</span>
            </Button>
          </div>
        </div>

        {/* Main Wallet Card */}
        <Card 
          className="border-0 shadow-2xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.backgroundLight} 50%, ${currentTheme.colors.background} 100%)`
          }}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-10"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-10"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
          
          <CardHeader className="relative z-10">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-4xl font-bold flex items-center gap-3">
              {showBalance ? (
                <>
                  <span style={{ color: currentTheme.colors.text }}>
                    {walletData.currency} {walletData.balance.toLocaleString()}
                  </span>
                  <Badge 
                    variant="secondary"
                    className="text-sm"
                    style={{
                      backgroundColor: currentTheme.colors.primary + '20'
                    }}
                  >
                    Available
                  </Badge>
                </>
              ) : (
                <span className="text-2xl">••••••</span>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-semibold">{walletData.accountNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-semibold">{walletData.bankName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-semibold">Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Button
              key={action.name}
              variant="outline"
              className="h-20 flex-col gap-2 border-2 border-border/30 hover:border-primary/30 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm"
              onClick={action.action}
            >
              <div className={cn("p-2 rounded-lg", action.bgColor)}>
                <action.icon className={cn("h-5 w-5", action.color)} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">{action.name}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList 
            className="grid w-full grid-cols-4 p-1 rounded-xl"
            style={{
              backgroundColor: currentTheme.colors.backgroundLight
            }}
          >
            <TabsTrigger 
              value="overview"
              className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'overview' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'overview' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transfer"
              className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'transfer' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'transfer' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Transfer
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'transactions' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'transactions' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="accounts"
              className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'accounts' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'accounts' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Building className="h-4 w-4 mr-2" />
              Accounts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Transactions Preview */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest transactions in your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {walletData.transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          transaction.type === 'credit' ? "bg-green-500/10" : "bg-red-500/10"
                        )}>
                          {transaction.type === 'credit' ? 
                            <ArrowDownLeft className="h-5 w-5 text-green-500" /> : 
                            <ArrowUpRight className="h-5 w-5 text-red-500" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date} • {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          transaction.type === 'credit' ? "text-green-600" : "text-red-600"
                        )}>
                          {transaction.type === 'credit' ? '+' : '-'}KSh {transaction.amount.toLocaleString()}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs mt-1", getStatusColor(transaction.status))}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10"
                    onClick={() => setActiveTab("transactions")}
                  >
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>

              {/* Scheduled Transfers */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Scheduled Transfers
                  </CardTitle>
                  <CardDescription>Automated payments setup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {walletData.scheduledTransfers.map((transfer) => (
                    <div key={transfer.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                          <Send className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">To: {transfer.to}</p>
                          <p className="text-xs text-muted-foreground">
                            {transfer.schedule} • Next: {transfer.nextDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          -KSh {transfer.amount.toLocaleString()}
                        </p>
                        <Badge 
                          variant="outline" 
                          className="text-xs mt-1 text-green-600 bg-green-500/10 border-green-500/20"
                        >
                          {transfer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Transfer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Security Features */}
            {/* // Security Features Section - Corrected Code */}
<Card className="border-0 shadow-lg">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <ShieldCheck className="h-5 w-5 text-primary" />
      Security Features
    </CardTitle>
    <CardDescription>Keep your wallet secure with these features</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        { name: "Secure Login", icon: Shield, description: "End to End encryption" },
        { name: "2FA Enabled", icon: Zap, description: "Two-factor authentication" },
        { name: "Transaction PIN", icon: Lock, description: "Secure PIN required" },
        { name: "Activity Alerts", icon: Bell, description: "Real-time notifications" }
      ].map((feature) => {
        const IconComponent = feature.icon; // Store the icon component in a variable
        return (
          <div 
            key={feature.name}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/30"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
            }}
          >
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: currentTheme.colors.primary + '15' }}
            >
              {/* <IconComponent className="h-5 w-5" style={{ color: currentTheme.colors.primary }} /> */}
            </div>
            <div>
              <p className="font-semibold text-sm">{feature.name}</p>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quick Transfer */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Quick Transfer
                  </CardTitle>
                  <CardDescription>Send money instantly to M-Pesa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">M-Pesa Number</label>
                      <Input
                        placeholder="07XXXXXXXX"
                        value={mpesaNumber}
                        onChange={(e) => setMpesaNumber(e.target.value)}
                        className="border-2 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amount (KSh)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="border-2 border-border/50 focus:border-primary/50 text-lg font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[1000, 2000, 5000, 10000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setTransferAmount(amount.toString())}
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        {amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={handleTransfer}
                    disabled={isTransferring}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    {isTransferring ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Transfer Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Transfer Options */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Transfer Options
                  </CardTitle>
                  <CardDescription>Choose your preferred transfer method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "M-Pesa Instant",
                      description: "Transfer to mobile money",
                      fee: "KSh 0",
                      time: "Instant",
                      icon: Smartphone,
                      color: "text-green-500"
                    },
                    {
                      name: "Bank Transfer",
                      description: "Send to any bank account",
                      fee: "KSh 50",
                      time: "1-2 hours",
                      icon: Building,
                      color: "text-blue-500"
                    },
                    {
                      name: "Oman Net",
                      description: "International transfer",
                      fee: "KSh 200",
                      time: "24-48 hours",
                      icon: Globe,
                      color: "text-purple-500"
                    },
                    {
                      name: "CyberSource",
                      description: "Secure online payments",
                      fee: "2.5%",
                      time: "Instant",
                      icon: ShieldCheck,
                      color: "text-orange-500"
                    }
                  ].map((option) => (
                    <div 
                      key={option.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/30 cursor-pointer hover:border-primary/30 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <option.icon className={cn("h-5 w-5", option.color)} />
                        </div>
                        <div>
                          <p className="font-semibold">{option.name}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Fee: {option.fee}</p>
                        <p className="text-xs text-muted-foreground">{option.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Transaction History
                </CardTitle>
                <CardDescription>All your wallet transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {walletData.transactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                      }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full",
                          transaction.type === 'credit' ? "bg-green-500/10" : "bg-red-500/10"
                        )}>
                          {transaction.type === 'credit' ? 
                            <ArrowDownLeft className="h-6 w-6 text-green-500" /> : 
                            <ArrowUpRight className="h-6 w-6 text-red-500" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Ref: {transaction.reference} • {transaction.date} {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-lg font-bold",
                          transaction.type === 'credit' ? "text-green-600" : "text-red-600"
                        )}>
                          {transaction.type === 'credit' ? '+' : '-'}KSh {transaction.amount.toLocaleString()}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn("mt-2", getStatusColor(transaction.status))}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">{transaction.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  <Download className="h-4 w-4 mr-2" />
                  Export Statement
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Linked Accounts
                </CardTitle>
                <CardDescription>Manage your connected payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {walletData.linkedAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {account.type === 'mpesa' ? 
                          <Smartphone className="h-6 w-6 text-primary" /> : 
                          <Building className="h-6 w-6 text-primary" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold">{account.name}</p>
                        <p className="text-sm text-muted-foreground">{account.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {account.isDefault && (
                        <Badge 
                          variant="secondary"
                          style={{
                            backgroundColor: currentTheme.colors.primary + '15'
                          }}
                        >
                          Default
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/10 border-2 border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Link New Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}