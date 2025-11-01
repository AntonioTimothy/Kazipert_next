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
import { mockSalaryPayments, mockMpesaTransactions } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WorkerPaymentHistory() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)

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
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const navigationdsds = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Payment History", href: "/worker/payment-history", icon: Clock },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

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


  const userSalaryPayments = mockSalaryPayments.filter((p) => p.workerId === user.id)
  const userMpesaTransactions = mockMpesaTransactions.filter((t) => t.workerId === user.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
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
            <TabsTrigger value="mpesa">M-Pesa Transfers</TabsTrigger>
          </TabsList>

          <TabsContent value="salary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salary Payment History</CardTitle>
                <CardDescription>All salary payments from your employer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userSalaryPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                        <ArrowDownRight className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Salary Payment - {payment.month}</div>
                        <div className="text-sm text-muted-foreground">From {payment.employerName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {payment.paidDate || "Pending"} • {payment.method.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        +{payment.currency} {payment.amount}
                      </div>
                      <Badge
                        variant={
                          payment.status === "paid"
                            ? "default"
                            : payment.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
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
                <CardTitle>M-Pesa Transfer History</CardTitle>
                <CardDescription>Money sent home to family and friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userMpesaTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowUpRight className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Sent to {transaction.recipient}</div>
                        <div className="text-sm text-muted-foreground">{transaction.recipientPhone}</div>
                        <div className="text-xs text-muted-foreground mt-1">{transaction.transactionDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">-${transaction.amount}</div>
                      <div className="text-xs text-muted-foreground">Fee: ${transaction.fee}</div>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
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
