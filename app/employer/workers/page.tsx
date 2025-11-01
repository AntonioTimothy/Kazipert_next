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
  Plus,
  Users,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { EmployerProfile } from "@/lib/mock-data"
import { mockWorkers } from "@/lib/mock-data"

export default function EmployerWorkersPage() {
  const router = useRouter()
  const [user, setUser] = useState<EmployerProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  if (!user) {
    return <div>Loading...</div>
  }

  const navigation = [
    { name: "Dashboard", href: "/employer/dashboard", icon: Home },
    { name: "My Profile", href: "/employer/profile", icon: User },
    { name: "Post Job", href: "/employer/post-job", icon: Plus },
    { name: "My Jobs", href: "/employer/jobs", icon: Briefcase },
    { name: "Find Workers", href: "/employer/workers", icon: Users },
    { name: "Contracts", href: "/employer/contracts", icon: FileText },
    { name: "Payments", href: "/employer/payments", icon: CreditCard },
    { name: "Services", href: "/employer/services", icon: Shield },
    { name: "Training", href: "/employer/training", icon: Video },
    { name: "Support", href: "/employer/support", icon: MessageSquare },
  ]

  const filteredWorkers = mockWorkers.filter(
    (worker) =>
      worker.kycStatus === "verified" &&
      (worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        worker.experience.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Workers</h1>
          <p className="text-muted-foreground">Browse verified workers ready for employment</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Search by name, skills, or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Workers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={worker.avatar || "/placeholder.svg"} alt={worker.name} />
                    <AvatarFallback className="text-xl">{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{worker.name}</CardTitle>
                    <CardDescription>
                      {worker.age} years • {worker.nationality}
                    </CardDescription>
                    <Badge variant="default" className="mt-2">
                      {worker.kycStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Experience</div>
                  <div className="mt-1 text-sm">{worker.experience}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Skills</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {worker.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{worker.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Languages</div>
                  <div className="mt-1 text-sm">{worker.languages.join(", ")}</div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{worker.preferredLocation}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">View Profile</Button>
                  <Button variant="outline">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredWorkers.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No workers found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
