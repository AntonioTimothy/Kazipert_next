"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Download,
  Filter,
  Calendar,
  Wallet,
  Banknote,
  Building,
  Smartphone,
  ShieldCheck,
  BarChart3,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  CreditCard,
  History,
  AlertCircle,
  QrCode,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

// Enhanced mock data for Oman domestic worker wallet
const walletData = {
  balance: 0,
  currency: "OMR",
  accountNumber: "OMN123456789",
  bankName: "Bank Muscat",
  availableBalance: 0,
  lockedBalance: 0,
  transactions: [
    {
      id: "TX001",
      type: "credit",
      amount: 200,
      description: "Salary - Al Harthy Family",
      date: "2024-01-15",
      time: "09:30 AM",
      status: "completed",
      reference: "SAL-ALH-001",
      category: "salary"
    },
    {
      id: "TX002",
      type: "debit",
      amount: 25,
      description: "Registration Fee - Kazipert",
      date: "2024-01-16",
      time: "02:15 PM",
      status: "completed",
      reference: "FEE-REG-001",
      category: "fee"
    },
    {
      id: "TX003",
      type: "debit",
      amount: 15,
      description: "Insurance Premium - Monthly",
      date: "2024-01-17",
      time: "10:00 AM",
      status: "completed",
      reference: "INS-MON-001",
      category: "insurance"
    },
    {
      id: "TX004",
      type: "credit",
      amount: 50,
      description: "Bonus - Excellent Service",
      date: "2024-01-18",
      time: "11:45 AM",
      status: "completed",
      reference: "BNS-EXT-001",
      category: "bonus"
    },
    {
      id: "TX005",
      type: "debit",
      amount: 100,
      description: "Bank Transfer - Family Support",
      date: "2024-01-19",
      time: "04:20 PM",
      status: "pending",
      reference: "TRF-FAM-001",
      category: "transfer"
    },
    {
      id: "TX006",
      type: "credit",
      amount: 180,
      description: "Salary - Al Harthy Family",
      date: "2024-02-01",
      time: "09:30 AM",
      status: "completed",
      reference: "SAL-ALH-002",
      category: "salary"
    },
    {
      id: "TX007",
      type: "debit",
      amount: 30,
      description: "Mobile Top-up - Omantel",
      date: "2024-02-02",
      time: "03:45 PM",
      status: "completed",
      reference: "TOP-OMN-001",
      category: "utility"
    },
    {
      id: "TX008",
      type: "credit",
      amount: 200,
      description: "Salary - Al Harthy Family",
      date: "2024-02-15",
      time: "09:30 AM",
      status: "completed",
      reference: "SAL-ALH-003",
      category: "salary"
    },
    {
      id: "TX009",
      type: "debit",
      amount: 45,
      description: "Service Charge - Monthly",
      date: "2024-02-16",
      time: "11:00 AM",
      status: "completed",
      reference: "FEE-SVC-001",
      category: "fee"
    }
  ],
  quickActions: [
    {
      name: "Send Money",
      description: "Transfer to bank",
      icon: Send,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      name: "Pay Bills",
      description: "Utilities & services",
      icon: CreditCard,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      name: "View Statement",
      description: "Transaction history",
      icon: History,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      name: "Help & Support",
      description: "Get assistance",
      icon: ShieldCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    }
  ]
}

export default function WorkerWalletPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [transferAmount, setTransferAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [visibleTransactions, setVisibleTransactions] = useState(4)
  const [showAllTransactions, setShowAllTransactions] = useState(false)

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

  const handleTransfer = async () => {
    if (!transferAmount || !recipient) {
      alert("Please enter amount and recipient details")
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert(`Transfer of OMR ${transferAmount} to ${recipient} initiated successfully!`)
    setTransferAmount("")
    setRecipient("")
    setIsProcessing(false)
  }

  const loadMoreTransactions = () => {
    setVisibleTransactions(prev => prev + 4)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case "pending":
        return <Clock className="h-3 w-3 text-amber-500" />
      case "failed":
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <MoreHorizontal className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-500/10"
      case "pending":
        return "text-amber-600 bg-amber-500/10"
      case "failed":
        return "text-red-600 bg-red-500/10"
      default:
        return "text-gray-600 bg-gray-500/10"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "salary":
        return "text-green-600 bg-green-500/10"
      case "bonus":
        return "text-blue-600 bg-blue-500/10"
      case "fee":
        return "text-red-600 bg-red-500/10"
      case "insurance":
        return "text-purple-600 bg-purple-500/10"
      case "transfer":
        return "text-orange-600 bg-orange-500/10"
      case "utility":
        return "text-cyan-600 bg-cyan-500/10"
      default:
        return "text-gray-600 bg-gray-500/10"
    }
  }

  const filteredTransactions = walletData.transactions.filter(transaction => 
    filterCategory === "all" || transaction.category === filterCategory
  )

  const displayedTransactions = showAllTransactions 
    ? filteredTransactions 
    : filteredTransactions.slice(0, visibleTransactions)

  // Skeleton loading component
  const TransactionSkeleton = () => (
    <div className="flex items-center justify-between p-3 border-b border-border/30 animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-32"></div>
          <div className="h-2 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Balance Card Skeleton */}
          <div className="h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          {/* Transactions Skeleton */}
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <TransactionSkeleton key={i} />
            ))}
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
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Wallet className="h-6 w-6 md:h-8 md:w-8" style={{ color: currentTheme.colors.primary }} />
              My Wallet
            </h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">Manage your salary and transactions</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary"
              className="px-2 py-1 text-xs border-0"
              style={{
                backgroundColor: currentTheme.colors.primary + '15',
                color: currentTheme.colors.primary
              }}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-xs md:text-sm"
              style={{
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            >
              {showBalance ? <EyeOff className="h-3 w-3 md:h-4 md:w-4" /> : <Eye className="h-3 w-3 md:h-4 md:w-4" />}
              <span className="ml-1 md:ml-2">{showBalance ? "Hide" : "Show"}</span>
            </Button>
          </div>
        </div>

        {/* ATM-Style Balance Card */}
        <Card 
          className="border-0 shadow-2xl relative overflow-hidden min-h-[180px] md:min-h-[200px]"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}20 0%, ${currentTheme.colors.primary}10 50%, ${currentTheme.colors.card} 100%)`,
            border: `2px solid ${currentTheme.colors.primary}30`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          <CardContent className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">Available Balance</p>
                  <p className="text-lg md:text-xl text-muted-foreground">{walletData.bankName} • {walletData.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-muted-foreground">As of {new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="mb-2">
                  <p className="text-sm md:text-base text-muted-foreground font-medium">TOTAL BALANCE</p>
                </div>
                <div className={cn(
                  "text-3xl md:text-5xl font-bold font-mono tracking-tight transition-all duration-300",
                  showBalance ? "text-gray-800" : "text-gray-400"
                )}>
                  {showBalance ? (
                    <span style={{ color: currentTheme.colors.text }}>
                      {walletData.currency} {walletData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="tracking-widest">•••••••</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 text-xs md:text-sm text-muted-foreground">
                <span>Salary Account</span>
                <span>Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Enhanced for Mobile */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {walletData.quickActions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="h-16 md:h-20 flex flex-col gap-1 border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm rounded-xl p-2"
              onClick={() => {
                if (action.name === "Send Money") setActiveTab("transfer")
                else if (action.name === "View Statement") setActiveTab("statement")
              }}
            >
              <div className={cn("p-1 md:p-2 rounded-lg", action.bgColor)}>
                <action.icon className={cn("h-4 w-4 md:h-5 md:w-5", action.color)} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-xs md:text-sm leading-tight">{action.name}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground leading-tight mt-0.5">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Main Tabs - Mobile Optimized */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList 
            className="grid w-full grid-cols-3 p-1 rounded-lg md:rounded-xl bg-card/80 backdrop-blur-sm border text-xs md:text-sm"
          >
            <TabsTrigger 
              value="overview"
              className="rounded-md md:rounded-lg data-[state=active]:shadow-sm transition-all duration-300 py-2"
              style={{
                backgroundColor: activeTab === 'overview' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'overview' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transfer"
              className="rounded-md md:rounded-lg data-[state=active]:shadow-sm transition-all duration-300 py-2"
              style={{
                backgroundColor: activeTab === 'transfer' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'transfer' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Send className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Transfer
            </TabsTrigger>
            <TabsTrigger 
              value="statement"
              className="rounded-md md:rounded-lg data-[state=active]:shadow-sm transition-all duration-300 py-2"
              style={{
                backgroundColor: activeTab === 'statement' ? currentTheme.colors.primary : 'transparent',
                color: activeTab === 'statement' ? currentTheme.colors.text : currentTheme.colors.text
              }}
            >
              <Receipt className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Statement
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Recent Transactions */}
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <History className="h-4 w-4 md:h-5 md:w-5" style={{ color: currentTheme.colors.primary }} />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm">Latest transactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  {walletData.transactions.slice(0, 4).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-border/30 last:border-b-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={cn(
                          "flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded flex-shrink-0",
                          transaction.type === 'credit' ? "bg-green-500/10" : "bg-red-500/10"
                        )}>
                          {transaction.type === 'credit' ? 
                            <ArrowDownLeft className="h-3 w-3 md:h-4 md:w-4 text-green-500" /> : 
                            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {transaction.date} • {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className={cn(
                          "font-semibold text-sm whitespace-nowrap",
                          transaction.type === 'credit' ? "text-green-600" : "text-red-600"
                        )}>
                          {transaction.type === 'credit' ? '+' : '-'}{walletData.currency} {transaction.amount}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs border-0 px-1 py-0", getStatusColor(transaction.status))}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10 text-sm py-2"
                    onClick={() => setActiveTab("statement")}
                  >
                    View Full Statement
                  </Button>
                </CardFooter>
              </Card>

              {/* Account Information */}
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-4 w-4 md:h-5 md:w-5" style={{ color: currentTheme.colors.primary }} />
                    Account Details
                  </CardTitle>
                  <CardDescription className="text-sm">Banking information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded bg-primary/5">
                      <span className="text-sm text-muted-foreground">Bank</span>
                      <span className="font-semibold text-sm">{walletData.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-primary/5">
                      <span className="text-sm text-muted-foreground">Account No.</span>
                      <span className="font-semibold text-sm">{walletData.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-primary/5">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="font-semibold text-sm">Salary</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-primary/5">
                      <span className="text-sm text-muted-foreground">Currency</span>
                      <span className="font-semibold text-sm">OMR</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded border border-amber-200 bg-amber-50/50 text-xs">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-800">Oman Banking Requirement</p>
                        <p className="text-amber-700 mt-1">
                          All domestic workers must maintain an active bank account in Oman.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer" className="space-y-4">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Send className="h-4 w-4 md:h-5 md:w-5" style={{ color: currentTheme.colors.primary }} />
                  Send Money
                </CardTitle>
                <CardDescription className="text-sm">Transfer to bank account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recipient Bank</label>
                    <select 
                      className="w-full p-2 md:p-3 border border-border rounded-lg focus:border-primary/50 bg-background text-sm"
                      onChange={(e) => setRecipient("")}
                    >
                      <option value="bank">Bank Muscat</option>
                      <option value="other">Other Omani Bank</option>
                      <option value="international">International Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Account Number</label>
                    <Input
                      placeholder="Enter recipient account number"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="border border-border focus:border-primary/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount (OMR)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="border border-border focus:border-primary/50 font-semibold text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setTransferAmount(amount.toString())}
                      className="border-primary/30 hover:bg-primary/10 text-xs py-1 h-8"
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full text-sm py-2"
                  onClick={handleTransfer}
                  disabled={isProcessing}
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.text
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-current mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      Transfer Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Statement Tab - Excel-like Design */}
          
          <TabsContent value="statement" className="space-y-4">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Receipt className="h-4 w-4 md:h-5 md:w-5" style={{ color: currentTheme.colors.primary }} />
                      Account Statement
                    </CardTitle>
                    <CardDescription className="text-sm">Transaction history</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      className="p-2 border border-border rounded bg-background text-xs"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="salary">Salary</option>
                      <option value="bonus">Bonus</option>
                      <option value="fee">Fees</option>
                      <option value="insurance">Insurance</option>
                      <option value="transfer">Transfers</option>
                      <option value="utility">Utilities</option>
                    </select>
                    <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-xs py-1 h-8">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Excel-like Header */}
                <div className="grid grid-cols-12 gap-2 p-3 border-b border-border/30 bg-muted/30 text-xs font-medium text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-center">Type</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Excel-like Rows */}
                <div className="max-h-96 overflow-y-auto">
                  {displayedTransactions.map((transaction, index) => (
                    <div 
                      key={transaction.id}
                      className={cn(
                        "grid grid-cols-12 gap-2 p-3 border-b border-border/30 text-sm hover:bg-primary/5 transition-colors",
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      )}
                    >
                      <div className="col-span-5 min-w-0">
                        <div className="font-medium truncate">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {transaction.date} • {transaction.reference}
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs border-0 capitalize", getCategoryColor(transaction.category))}
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <div className={cn(
                        "col-span-2 text-right font-mono text-sm",
                        transaction.type === 'credit' ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.type === 'credit' ? '+' : '-'}{walletData.currency} {transaction.amount}
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs border-0", getStatusColor(transaction.status))}
                        >
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 hidden sm:inline">{transaction.status}</span>
                        </Badge>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          transaction.type === 'credit' ? "bg-green-500" : "bg-red-500"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 pt-3">
                {!showAllTransactions && filteredTransactions.length > visibleTransactions && (
                  <Button 
                    variant="outline" 
                    onClick={loadMoreTransactions}
                    className="w-full border-primary/30 hover:bg-primary/10 text-sm py-2"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Load More ({filteredTransactions.length - visibleTransactions} remaining)
                  </Button>
                )}
                
                {filteredTransactions.length > 4 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAllTransactions(!showAllTransactions)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showAllTransactions ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show All {filteredTransactions.length} Transactions
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}