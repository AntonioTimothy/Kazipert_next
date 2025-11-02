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
  Download,
  Eye,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockPayslips } from "@/lib/mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function WorkerPayslips() {
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

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Payslips", href: "/worker/payslips", icon: FileText },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const userPayslips = mockPayslips.filter((p) => p.workerId === user.id)

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header with yellow triangle accent */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 100 100" className="animate-pulse">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
            </svg>
            <FileText className="absolute inset-0 m-auto h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Payslips</h1>
            <p className="text-muted-foreground">View and download your salary payslips</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-accent" />
                Total Earned (2025)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${userPayslips.reduce((sum, p) => sum + p.netSalary, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across {userPayslips.length} months</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Latest Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${userPayslips[0]?.netSalary || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userPayslips[0]?.month} {userPayslips[0]?.year}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                Available Payslips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPayslips.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to download</p>
            </CardContent>
          </Card>
        </div>

        {/* Payslips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payslip History</CardTitle>
            <CardDescription>View and download your monthly payslips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">
                        {payslip.month} {payslip.year}
                      </TableCell>
                      <TableCell>
                        {payslip.currency} {payslip.basicSalary}
                      </TableCell>
                      <TableCell className="text-green-600">
                        +{payslip.currency} {payslip.allowances}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -{payslip.currency} {payslip.deductions}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {payslip.currency} {payslip.netSalary}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{payslip.generatedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 bg-transparent">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="h-8 bg-accent hover:bg-accent/90">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
