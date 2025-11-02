"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  Plus,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { EmployerProfile } from "@/lib/mock-data"
import { mockJobs, mockContracts, mockWorkers } from "@/lib/mock-data"

export default function EmployerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<EmployerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "employer") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  // const navigation = [
  //   { name: "Home", href: "/employer/dashboard", icon: Home },
  //   { name: "My Profile", href: "/employer/profile", icon: User },
  //   { name: "Post Job", href: "/employer/post-job", icon: Plus },
  //   { name: "My Jobs", href: "/employer/jobs", icon: Briefcase },
  //   { name: "Find Workers", href: "/employer/workers", icon: Users },
  //   { name: "Contracts", href: "/employer/contracts", icon: FileText },
  //   { name: "Payments", href: "/employer/payments", icon: CreditCard },
  //   { name: "Services", href: "/employer/services", icon: Shield },
  //   { name: "Training", href: "/employer/training", icon: Video },
  //   { name: "Support", href: "/employer/support", icon: MessageSquare },
  // ]

  // Get employer's jobs and contracts
  const employerJobs = mockJobs.filter((j) => j.employerId === user.id)
  const employerContracts = mockContracts.filter((c) => c.employerId === user.id)
  const activeJobs = employerJobs.filter((j) => j.status === "open")

  return (
    <PortalLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Welcome back, {user.name.split(" ")[0]}!
              <svg width="24" height="24" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
              </svg>
            </h1>
            <p className="text-muted-foreground">Manage your job postings and find the perfect workers</p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/employer/post-job">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Currently hiring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employerContracts.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Workers interested</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employerContracts.filter((c) => c.status === "signed" || c.status === "active").length}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Signed agreements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockWorkers.filter((w) => w.kycStatus === "verified").length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Verified and ready</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Active Job Postings</CardTitle>
              <CardDescription>Your current open positions</CardDescription>
            </CardHeader>
            <CardContent>
              {activeJobs.length > 0 ? (
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.location}, {job.country}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Badge variant="secondary">{job.salary}</Badge>
                            <Badge>{job.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          View Applications
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/employer/jobs">View All Jobs</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No Active Jobs</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Post your first job to start finding workers</p>
                  <Button className="mt-4" asChild>
                    <Link href="/employer/post-job">Post a Job</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Workers interested in your positions</CardDescription>
            </CardHeader>
            <CardContent>
              {employerContracts.length > 0 ? (
                <div className="space-y-4">
                  {employerContracts.slice(0, 3).map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{contract.workerName}</h3>
                        <p className="text-sm text-muted-foreground">{contract.jobTitle}</p>
                        <Badge variant="secondary" className="mt-2">
                          {contract.status}
                        </Badge>
                      </div>
                      <Button size="sm">Review</Button>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/employer/contracts">View All Applications</Link>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No Applications Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Applications will appear here once workers apply</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Workers */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Workers</CardTitle>
            <CardDescription>Verified workers matching your requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockWorkers.slice(0, 3).map((worker) => (
                <div key={worker.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {worker.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{worker.name}</h3>
                      <p className="text-sm text-muted-foreground">{worker.experience}</p>
                      <Badge variant="secondary" className="mt-2">
                        {worker.kycStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {worker.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href={`/employer/workers/${worker.id}`}>View Profile</Link>
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-4 w-full bg-transparent" asChild>
              <Link href="/employer/workers">Browse All Workers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
