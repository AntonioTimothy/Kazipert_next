"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WorkerProfile } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { transactionService } from "@/lib/services/apiServices"

export default function WorkerPaymentHistory() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker" && parsedUser.role !== "EMPLOYEE") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchTransactions()
  }, [router])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getTransactions('all')
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

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

  const salaryPayments = transactions.filter(t => t.type === 'SALARY_PAYMENT')
  const otherTransactions = transactions.filter(t => t.type !== 'SALARY_PAYMENT')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "paid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "PENDING":
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "FAILED":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 100 100" className="animate-pulse">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
            </svg>
            <Clock className="absolute inset-0 m-auto h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Payment History</h1>
            <p className="text-muted-foreground">Track all your incoming and outgoing payments</p>
          </div>
        </div>

        <Tabs defaultValue="salary" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="salary">Salary Payments</TabsTrigger>
            <TabsTrigger value="mpesa">Other Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="salary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Payment History</CardTitle>
                <CardDescription>All salary payments from your employer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : salaryPayments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No salary payments yet
                  </div>
                ) : salaryPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                        <ArrowDownRight className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Salary Payment</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.description || 'Monthly Salary'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        +{payment.currency} {payment.amount}
                      </div>
                      <Badge
                        variant={payment.status === "COMPLETED" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mpesa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Other Transactions</CardTitle>
                <CardDescription>Withdrawals, fees, and other payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : otherTransactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No other transactions yet
                  </div>
                ) : otherTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowUpRight className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <div className="font-semibold">{transaction.type.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.description || 'Transaction'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        -{transaction.currency} {transaction.amount}
                      </div>
                      <Badge
                        variant={transaction.status === "COMPLETED" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}
