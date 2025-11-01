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
  AlertTriangle,
  Upload,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockIssueReports } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

export default function WorkerReportIssue() {
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

  const navigationdds = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Report Issue", href: "/worker/report-issue", icon: AlertTriangle },
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


  const userReports = mockIssueReports.filter((r) => r.reporterId === user.id)

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 100 100" className="animate-pulse">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
            </svg>
            <AlertTriangle className="absolute inset-0 m-auto h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Report an Issue</h1>
            <p className="text-muted-foreground">We're here to help resolve any problems you're facing</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit New Report</CardTitle>
              <CardDescription>Provide details about the issue you're experiencing</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="contract">Contract Dispute</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="safety">Safety Concern</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Brief description of the issue" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible about the issue..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="attachments" type="file" multiple />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload any relevant documents, screenshots, or evidence
                  </p>
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Previous Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Your Previous Reports</CardTitle>
              <CardDescription>Track the status of your submitted issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReports.length > 0 ? (
                  userReports.map((report) => (
                    <div key={report.id} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{report.subject}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                        </div>
                        <Badge
                          variant={
                            report.status === "resolved"
                              ? "default"
                              : report.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {report.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="capitalize">{report.category}</span>
                        <span>•</span>
                        <span className="capitalize">{report.priority} priority</span>
                        <span>•</span>
                        <span>{report.createdDate}</span>
                      </div>
                      {report.resolvedDate && (
                        <div className="text-xs text-green-600">Resolved on {report.resolvedDate}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <AlertTriangle className="mx-auto h-12 w-12 opacity-50 mb-2" />
                    <p>No reports submitted yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <div className="font-semibold">Kenyan Embassy (Oman)</div>
                <div className="text-sm text-muted-foreground">+968 2469 5900</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold">Kazipert 24/7 Hotline</div>
                <div className="text-sm text-muted-foreground">+254 700 000 000</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold">Oman Police Emergency</div>
                <div className="text-sm text-muted-foreground">9999</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
