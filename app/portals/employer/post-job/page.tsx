"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { Home, User, Briefcase, FileText, CreditCard, Shield, Video, MessageSquare, Plus, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EmployerProfile } from "@/lib/mock-data"

export default function PostJobPage() {
  const router = useRouter()
  const [user, setUser] = useState<EmployerProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to jobs page
    router.push("/employer/jobs")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  // const navigation = [
  //   { name: "Dashboard", href: "/employer/dashboard", icon: Home },
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

  return (
    <PortalLayout  user={user}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">Create a job posting to find the perfect worker</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide information about the position you're offering</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" placeholder="e.g., Domestic Worker - Full Time" required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., Muscat" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (per month)</Label>
                  <Input id="salary" placeholder="e.g., $450" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g.,&#10;5+ years experience&#10;Cooking skills&#10;English speaking"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  placeholder="e.g.,&#10;Accommodation provided&#10;Health insurance&#10;Annual leave"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-4 rounded-lg border border-border p-4">
                <h3 className="font-semibold">Household Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="familySize">Family Size</Label>
                    <Input id="familySize" type="number" placeholder="e.g., 5" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="houseType">House Type</Label>
                    <Input id="houseType" placeholder="e.g., Villa, Apartment" required />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Posting Job..." : "Post Job"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
