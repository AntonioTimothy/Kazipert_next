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
  MessageSquare,
  Video,
  Award,
  Download,
  Share2,
  CheckCircle,
  Calendar,
  ExternalLink,
  Star,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { WorkerProfile } from "@/lib/mock-data"

interface Certificate {
  id: string
  title: string
  issueDate: string
  courseTitle: string
  instructor: string
  score: number
  certificateNumber: string
}

const certificates: Certificate[] = [
  {
    id: "1",
    title: "Introduction to Gulf Culture & Customs",
    issueDate: "2024-12-15",
    courseTitle: "Introduction to Gulf Culture & Customs",
    instructor: "Dr. Fatima Al-Rashid",
    score: 95,
    certificateNumber: "KP-2024-001234",
  },
  {
    id: "2",
    title: "Your Rights & Legal Protection",
    issueDate: "2024-12-20",
    courseTitle: "Your Rights & Legal Protection",
    instructor: "Advocate Jane Mwangi",
    score: 98,
    certificateNumber: "KP-2024-001235",
  },
]

export default function WorkerCertificatesPage() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)

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
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <LoadingSpinner />
  }
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

  

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              My Certificates
              <svg width="24" height="24" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" />
              </svg>
            </h1>
            <p className="text-muted-foreground">Your earned certificates and achievements</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/worker/training">
              <Video className="mr-2 h-4 w-4" />
              Back to Training
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
              <p className="mt-2 text-xs text-muted-foreground">Courses completed</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(certificates.reduce((acc, c) => acc + c.score, 0) / certificates.length)}%
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Latest Certificate</CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(certificates[certificates.length - 1].issueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Most recent achievement</p>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <div className="space-y-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-2 border-accent/20 hover:border-accent/40 transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Certificate Visual */}
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-48 h-32 rounded-lg border-4 border-accent/30 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern
                              id={`cert-${cert.id}`}
                              x="0"
                              y="0"
                              width="50"
                              height="50"
                              patternUnits="userSpaceOnUse"
                            >
                              <polygon points="25,5 45,45 5,45" fill="hsl(var(--accent))" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#cert-${cert.id})`} />
                        </svg>
                      </div>
                      <Award className="h-12 w-12 text-accent mb-2 relative z-10" />
                      <div className="text-xs font-bold text-center relative z-10">CERTIFICATE</div>
                      <div className="text-xs text-muted-foreground relative z-10">{cert.score}%</div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground">Instructor: {cert.instructor}</p>
                        </div>
                        <Badge className="bg-primary">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Issue Date</div>
                        <div className="font-medium">
                          {new Date(cert.issueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Score</div>
                        <div className="font-medium text-accent">{cert.score}%</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-muted-foreground">Certificate Number</div>
                        <div className="font-medium font-mono text-xs">{cert.certificateNumber}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-accent hover:bg-accent/90">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          <CardContent className="pt-6 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-accent" />
            <h3 className="text-2xl font-bold mb-2">Keep Learning!</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Complete more courses to earn additional certificates and boost your profile. Employers love to see
              continuous learning and professional development.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link href="/worker/training">
                <Video className="mr-2 h-5 w-5" />
                Browse More Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
