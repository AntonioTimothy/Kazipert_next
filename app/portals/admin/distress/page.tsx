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
  AlertTriangle,
  Shield,
  Settings,
  BarChart3,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock distress reports data
const mockDistressReports = [
  {
    id: "DR001",
    workerId: "W001",
    workerName: "Jane Wanjiku",
    employerId: "E001",
    employerName: "Al-Rashid Family",
    type: "Salary Dispute",
    priority: "high",
    status: "open",
    description: "Salary payment delayed for 2 months. Employer not responding to requests.",
    reportedDate: "2025-01-15",
    location: "Muscat, Oman",
  },
  {
    id: "DR002",
    workerId: "W002",
    workerName: "Mary Akinyi",
    employerId: "E002",
    employerName: "Al-Balushi Residence",
    type: "Working Conditions",
    priority: "critical",
    status: "investigating",
    description: "Unsafe working conditions reported. Worker requesting immediate intervention.",
    reportedDate: "2025-01-18",
    location: "Salalah, Oman",
  },
  {
    id: "DR003",
    workerId: "W003",
    workerName: "Grace Njeri",
    employerId: "E003",
    employerName: "Al-Hinai Family",
    type: "Contract Violation",
    priority: "medium",
    status: "resolved",
    description: "Working hours exceeded contract terms. Issue resolved through mediation.",
    reportedDate: "2025-01-10",
    resolvedDate: "2025-01-20",
    location: "Muscat, Oman",
  },
  {
    id: "DR004",
    workerId: "W004",
    workerName: "Lucy Muthoni",
    employerId: "E004",
    employerName: "Al-Lawati Household",
    type: "Harassment",
    priority: "critical",
    status: "open",
    description: "Worker reports verbal harassment. Requesting legal intervention.",
    reportedDate: "2025-01-22",
    location: "Nizwa, Oman",
  },
  {
    id: "DR005",
    workerId: "W005",
    workerName: "Sarah Wambui",
    employerId: "E005",
    employerName: "Al-Kindi Family",
    type: "Medical Emergency",
    priority: "critical",
    status: "investigating",
    description: "Worker fell ill, employer refusing medical treatment. Emergency response needed.",
    reportedDate: "2025-01-23",
    location: "Sohar, Oman",
  },
]

export default function AdminDistressPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [actionNotes, setActionNotes] = useState("")

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "investigating":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const criticalReports = mockDistressReports.filter((r) => r.priority === "critical" && r.status !== "resolved")
  const openReports = mockDistressReports.filter((r) => r.status === "open")
  const investigatingReports = mockDistressReports.filter((r) => r.status === "investigating")
  const resolvedReports = mockDistressReports.filter((r) => r.status === "resolved")

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header with animated triangles */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Distress Reports
              <svg width="24" height="24" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--destructive))" />
              </svg>
            </h1>
            <p className="text-muted-foreground">Monitor and respond to worker distress reports</p>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalReports.length > 0 && (
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts Requiring Immediate Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-start justify-between rounded-lg border border-destructive/30 bg-card p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{report.type}</Badge>
                        <span className="text-sm font-semibold">{report.workerName}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {report.location} • Reported: {report.reportedDate}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={() => setSelectedReport(report)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Take Action
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Distress Report Details</DialogTitle>
                          <DialogDescription>Review and take action on this report</DialogDescription>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <Label className="text-xs text-muted-foreground">Report ID</Label>
                                <p className="font-medium">{selectedReport.id}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Priority</Label>
                                <Badge variant={getPriorityColor(selectedReport.priority)} className="mt-1">
                                  {selectedReport.priority}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Worker</Label>
                                <p className="font-medium">{selectedReport.workerName}</p>
                                <p className="text-xs text-muted-foreground">{selectedReport.workerId}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Employer</Label>
                                <p className="font-medium">{selectedReport.employerName}</p>
                                <p className="text-xs text-muted-foreground">{selectedReport.employerId}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Type</Label>
                                <p className="font-medium">{selectedReport.type}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Location</Label>
                                <p className="font-medium">{selectedReport.location}</p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-muted-foreground">Description</Label>
                              <p className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                                {selectedReport.description}
                              </p>
                            </div>

                            <div>
                              <Label htmlFor="action-notes">Action Notes</Label>
                              <Textarea
                                id="action-notes"
                                placeholder="Enter your action plan and notes..."
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                className="mt-2"
                                rows={4}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button className="flex-1 bg-primary">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Start Investigation
                              </Button>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Escalate to Embassy
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDistressReports.length}</div>
              <p className="text-xs text-muted-foreground">All time reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{openReports.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Investigating</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{investigatingReports.length}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{resolvedReports.length}</div>
              <p className="text-xs text-muted-foreground">Successfully closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Distress Reports</CardTitle>
            <CardDescription>Comprehensive view of all worker distress reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="investigating">Investigating</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDistressReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.workerName}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(report.priority)}>{report.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(report.status)}
                              <span className="capitalize">{report.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{report.reportedDate}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Distress Report Details</DialogTitle>
                                  <DialogDescription>Review and take action on this report</DialogDescription>
                                </DialogHeader>
                                {selectedReport && (
                                  <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Report ID</Label>
                                        <p className="font-medium">{selectedReport.id}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Priority</Label>
                                        <Badge variant={getPriorityColor(selectedReport.priority)} className="mt-1">
                                          {selectedReport.priority}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Worker</Label>
                                        <p className="font-medium">{selectedReport.workerName}</p>
                                        <p className="text-xs text-muted-foreground">{selectedReport.workerId}</p>
                                      </div>
                                      <div>
                                        <Label className="text-xs text-muted-foreground">Employer</Label>
                                        <p className="font-medium">{selectedReport.employerName}</p>
                                        <p className="text-xs text-muted-foreground">{selectedReport.employerId}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="text-xs text-muted-foreground">Description</Label>
                                      <p className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                                        {selectedReport.description}
                                      </p>
                                    </div>

                                    <div>
                                      <Label htmlFor="action-notes">Action Notes</Label>
                                      <Textarea
                                        id="action-notes"
                                        placeholder="Enter your action plan and notes..."
                                        value={actionNotes}
                                        onChange={(e) => setActionNotes(e.target.value)}
                                        className="mt-2"
                                        rows={4}
                                      />
                                    </div>

                                    <div className="flex gap-2">
                                      <Button className="flex-1 bg-primary">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Start Investigation
                                      </Button>
                                      <Button variant="outline" className="flex-1 bg-transparent">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Escalate to Embassy
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="open" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {openReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.workerName}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(report.priority)}>{report.priority}</Badge>
                          </TableCell>
                          <TableCell>{report.reportedDate}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="investigating" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investigatingReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.workerName}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(report.priority)}>{report.priority}</Badge>
                          </TableCell>
                          <TableCell>{report.reportedDate}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="resolved" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead>Resolved</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resolvedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.workerName}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.reportedDate}</TableCell>
                          <TableCell>{report.resolvedDate}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
