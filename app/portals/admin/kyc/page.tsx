"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { Home, Users, Briefcase, FileText, Shield, Settings, BarChart3, CheckCircle, XCircle, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { User } from "@/lib/mock-data"
import { mockWorkers, mockEmployers } from "@/lib/mock-data"

export default function AdminKYCPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

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
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "KYC Verification", href: "/admin/kyc", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Contracts", href: "/admin/contracts", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const allUsers = [...mockWorkers, ...mockEmployers]
  const pendingUsers = allUsers.filter((u) => u.kycStatus === "pending")
  const verifiedUsers = allUsers.filter((u) => u.kycStatus === "verified")
  const rejectedUsers = allUsers.filter((u) => u.kycStatus === "rejected")

  const renderUserCard = (user: any) => (
    <Card key={user.id} className="transition-all hover:border-primary/50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
                <Badge
                  variant={
                    user.kycStatus === "verified"
                      ? "default"
                      : user.kycStatus === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {user.kycStatus}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            {user.kycStatus === "pending" && (
              <>
                <Button size="sm" variant="default">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>

        {user.role === "worker" && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Age:</span> {user.age} years
              </div>
              <div>
                <span className="text-muted-foreground">Nationality:</span> {user.nationality}
              </div>
              <div>
                <span className="text-muted-foreground">Experience:</span> {user.experience}
              </div>
              <div>
                <span className="text-muted-foreground">Education:</span> {user.education}
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-2 text-sm font-medium">Documents:</div>
              <div className="flex gap-2">
                <Badge variant={user.documents.passport ? "default" : "secondary"}>
                  {user.documents.passport ? "✓" : "✗"} Passport
                </Badge>
                <Badge variant={user.documents.certificate ? "default" : "secondary"}>
                  {user.documents.certificate ? "✓" : "✗"} Certificate
                </Badge>
                <Badge variant={user.documents.medicalReport ? "default" : "secondary"}>
                  {user.documents.medicalReport ? "✓" : "✗"} Medical
                </Badge>
              </div>
            </div>
          </div>
        )}

        {user.role === "employer" && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Company:</span> {user.company}
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span> {user.location}, {user.country}
              </div>
              <div>
                <span className="text-muted-foreground">Family Size:</span> {user.familySize}
              </div>
              <div>
                <span className="text-muted-foreground">House Type:</span> {user.houseType}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          <p className="text-muted-foreground">Review and approve user verifications</p>
        </div>

        {/* Stats */}
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedUsers.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Approved users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedUsers.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
            <TabsTrigger value="verified">Verified ({verifiedUsers.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedUsers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingUsers.length > 0 ? (
              pendingUsers.map(renderUserCard)
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No Pending Verifications</h3>
                  <p className="mt-2 text-sm text-muted-foreground">All users have been reviewed</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            {verifiedUsers.map(renderUserCard)}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedUsers.length > 0 ? (
              rejectedUsers.map(renderUserCard)
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No Rejected Users</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No applications have been declined</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}
