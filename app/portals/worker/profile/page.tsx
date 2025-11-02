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
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { WorkerProfile } from "@/lib/mock-data"

export default function WorkerProfilePage() {
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
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and documents</p>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Badge variant={user.kycStatus === "verified" ? "default" : "secondary"}>
                    {user.kycStatus === "verified" ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>

              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Age</div>
                <div className="mt-1">{user.age} years</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Nationality</div>
                <div className="mt-1">{user.nationality}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Experience</div>
                <div className="mt-1">{user.experience}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Education</div>
                <div className="mt-1">{user.education}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Availability</div>
                <div className="mt-1">{user.availability}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Preferred Location</div>
                <div className="mt-1">{user.preferredLocation}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Salary Expectation</div>
                <div className="mt-1">{user.salaryExpectation}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Languages */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your professional capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
              <CardDescription>Languages you can speak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((language, index) => (
                  <Badge key={index} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Required documents for employment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  {user.documents.passport ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">Passport</div>
                    <div className="text-xs text-muted-foreground">Valid travel document</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {user.documents.passport ? "View" : "Upload"}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  {user.documents.certificate ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">Training Certificate</div>
                    <div className="text-xs text-muted-foreground">Professional qualifications</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {user.documents.certificate ? "View" : "Upload"}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  {user.documents.medicalReport ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">Medical Report</div>
                    <div className="text-xs text-muted-foreground">Health examination results</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {user.documents.medicalReport ? "View" : "Upload"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
