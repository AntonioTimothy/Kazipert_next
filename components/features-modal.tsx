"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  FileText,
  Heart,
  Scale,
  DollarSign,
  Users,
  CheckCircle,
  Briefcase,
  Globe,
  Phone,
  Building,
  GraduationCap,
} from "lucide-react"

interface FeaturesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeaturesModal({ open, onOpenChange }: FeaturesModalProps) {
  const workerFeatures = [
    {
      icon: GraduationCap,
      title: "Pre-Departure Training",
      description: "Comprehensive digital training about working in Oman, cultural understanding, and your rights.",
    },
    {
      icon: Briefcase,
      title: "AI Job Matching",
      description: "Smart algorithm matches you with employers based on skills, experience, and preferences.",
    },
    {
      icon: FileText,
      title: "Certified Contracts",
      description: "Legal, attested contracts with clear terms, automatically registered with the Embassy.",
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "100% protected against financial claims, repatriation fees, and workplace incidents.",
    },
    {
      icon: Scale,
      title: "Legal Representation",
      description: "Premium legal consultancy and representation at no extra cost when you need it.",
    },
    {
      icon: Heart,
      title: "Medical & Wellness",
      description: "Access to healthcare services and mental wellness consultants throughout your contract.",
    },
    {
      icon: DollarSign,
      title: "Salary Tracking & M-Pesa",
      description: "Track your salary, send money home instantly via M-Pesa integration.",
    },
    {
      icon: Phone,
      title: "24/7 Emergency Support",
      description: "Round-the-clock helpline for emergencies, disputes, and any assistance you need.",
    },
  ]

  const employerFeatures = [
    {
      icon: Users,
      title: "Verified Worker Profiles",
      description: "Access pre-screened, KYC-verified domestic workers with complete background checks.",
    },
    {
      icon: CheckCircle,
      title: "AI Salary Calculator",
      description: "Fair compensation calculator based on job requirements, experience, and market rates.",
    },
    {
      icon: FileText,
      title: "Automated Visa Processing",
      description: "Streamlined visa applications, medical exams, and job clearance documentation.",
    },
    {
      icon: Shield,
      title: "Insurance Protection",
      description: "Comprehensive coverage for both employer and worker, reducing liability risks.",
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "Ensure full compliance with Oman labor laws and Kenya employment regulations.",
    },
    {
      icon: Building,
      title: "Contract Management",
      description: "Digital contract signing, attestation, and automatic Embassy registration.",
    },
    {
      icon: DollarSign,
      title: "Payment Tracking",
      description: "Transparent salary payment records and automated transfer documentation.",
    },
    {
      icon: Globe,
      title: "Cultural Training",
      description: "Learn about Kenyan culture, communication styles, and best practices for employers.",
    },
  ]

  const platformFeatures = [
    {
      icon: Shield,
      title: "Embassy Auto-Registration",
      description: "All workers automatically registered with Kenya Embassy in Oman for safety and compliance.",
    },
    {
      icon: CheckCircle,
      title: "Real-Time Data",
      description: "Live tracking of worker locations, contract status, and compliance for government oversight.",
    },
    {
      icon: Phone,
      title: "Integrated Services",
      description: "Legal, insurance, healthcare, banking (M-Pesa), taxi, and emergency services in one platform.",
    },
    {
      icon: Users,
      title: "Dispute Resolution",
      description: "Professional mediation and conflict resolution services to prevent escalation.",
    },
    {
      icon: Heart,
      title: "Proactive Monitoring",
      description: "AI-powered distress detection and wellness checks to identify issues early.",
    },
    {
      icon: GraduationCap,
      title: "Continuous Development",
      description: "Ongoing training, skill development, and career advancement opportunities.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kazipert Platform Features</DialogTitle>
          <DialogDescription>
            Comprehensive features designed for workers, employers, and the entire ecosystem
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="workers" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workers">For Workers</TabsTrigger>
            <TabsTrigger value="employers">For Employers</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
          </TabsList>

          <TabsContent value="workers" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {workerFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employers" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {employerFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                        <feature.icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="platform" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {platformFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                        <feature.icon className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
