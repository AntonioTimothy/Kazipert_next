"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  Users,
  Briefcase,
  FileText,
  Shield,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { User } from "@/lib/mock-data"
import { mockWorkers, mockEmployers, mockJobs, mockContracts } from "@/lib/mock-data"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const navigation = [
    { name: "Home", href: "/admin/dashboard", icon: Home },
    { name: "Workers", href: "/admin/workers", icon: Users },
    { name: "Employers", href: "/admin/employers", icon: Briefcase },
    { name: "Contracts", href: "/admin/contracts", icon: FileText },
    { name: "Distress Reports", href: "/admin/distress", icon: AlertTriangle },
    { name: "Services", href: "/admin/services", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  // Calculate stats
  const pendingKYC = mockWorkers.filter((w) => w.kycStatus === "pending").length
  const verifiedUsers = [...mockWorkers, ...mockEmployers].filter((u) => u.kycStatus === "verified").length
  const activeJobs = mockJobs.filter((j) => j.status === "open").length
  const activeContracts = mockContracts.filter((c) => c.status === "signed" || c.status === "active").length

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Admin Dashboard
            <svg width="24" height="24" viewBox="0 0 100 100" className="animate-pulse">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
            </svg>
          </h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Pending KYC Alert */}
        {pendingKYC > 0 && (
          <Card className="border-accent bg-accent/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <AlertCircle className="h-8 w-8 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold">{pendingKYC} Pending KYC Verifications</h3>
                <p className="text-sm text-muted-foreground">Review and approve user verifications</p>
              </div>
              <Button asChild>
                <Link href="/admin/kyc">Review Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockWorkers.length + mockEmployers.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {mockWorkers.length} workers, {mockEmployers.length} employers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedUsers}</div>
              <p className="mt-2 text-xs text-muted-foreground">KYC approved accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="mt-2 text-xs text-muted-foreground">Currently open positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeContracts}</div>
              <p className="mt-2 text-xs text-muted-foreground">Signed agreements</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending KYC Verifications */}
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Verifications</CardTitle>
              <CardDescription>Users awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWorkers
                  .filter((w) => w.kycStatus === "pending")
                  .slice(0, 5)
                  .map((worker) => (
                    <div
                      key={worker.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={worker.avatar || "/placeholder.svg"} alt={worker.name} />
                          <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {worker.role} • {worker.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}

                {pendingKYC === 0 && (
                  <div className="py-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold">All Caught Up!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No pending verifications</p>
                  </div>
                )}

                {pendingKYC > 0 && (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/admin/kyc">View All Pending</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New worker registered</div>
                    <div className="text-xs text-muted-foreground">Grace Wanjiru joined the platform</div>
                    <div className="mt-1 text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                    <FileText className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Contract signed</div>
                    <div className="text-xs text-muted-foreground">Amina Hassan and Ahmed Al-Kindi</div>
                    <div className="mt-1 text-xs text-muted-foreground">5 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <Briefcase className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New job posted</div>
                    <div className="text-xs text-muted-foreground">Mohammed Al-Busaidi posted a position</div>
                    <div className="mt-1 text-xs text-muted-foreground">1 day ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">KYC approved</div>
                    <div className="text-xs text-muted-foreground">Fatima Mohamed verified</div>
                    <div className="mt-1 text-xs text-muted-foreground">2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
            <CardDescription>Overview of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Workers</span>
                  <Badge variant="secondary">{mockWorkers.length}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Verified
                    </span>
                    <span>{mockWorkers.filter((w) => w.kycStatus === "verified").length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-accent" />
                      Pending
                    </span>
                    <span>{mockWorkers.filter((w) => w.kycStatus === "pending").length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Employers</span>
                  <Badge variant="secondary">{mockEmployers.length}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Verified
                    </span>
                    <span>{mockEmployers.filter((e) => e.kycStatus === "verified").length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-secondary" />
                      Active Jobs
                    </span>
                    <span>{activeJobs}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contracts</span>
                  <Badge variant="secondary">{mockContracts.length}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Signed
                    </span>
                    <span>{mockContracts.filter((c) => c.status === "signed").length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-accent" />
                      Pending
                    </span>
                    <span>{mockContracts.filter((c) => c.status === "pending").length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
