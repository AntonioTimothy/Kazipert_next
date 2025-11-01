"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { Home, User, Briefcase, FileText, CreditCard, Shield, Video, MessageSquare, Check, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockSubscriptions } from "@/lib/mock-data"

export default function WorkerSubscriptions() {
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
    { name: "Subscriptions", href: "/worker/subscriptions", icon: Crown },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const userSubscriptions = mockSubscriptions.filter((s) => s.userId === user.id)

  const subscriptionPlans = [
    {
      type: "insurance",
      name: "Health & Travel Insurance",
      description: "Comprehensive coverage for health emergencies and travel",
      features: [
        "Medical emergency coverage up to $50,000",
        "Travel insurance",
        "Repatriation coverage",
        "24/7 emergency hotline",
      ],
      monthlyPrice: 30,
      annualPrice: 300,
    },
    {
      type: "legal",
      name: "Legal Protection Service",
      description: "Expert legal support for contracts and disputes",
      features: [
        "Contract review and advice",
        "Legal consultation (2 hours/month)",
        "Dispute resolution support",
        "Embassy liaison assistance",
      ],
      monthlyPrice: 25,
      annualPrice: 250,
    },
    {
      type: "medical",
      name: "Medical Cover",
      description: "Regular health checkups and medical certifications",
      features: ["Annual medical examination", "Health certificates", "Vaccination records", "Mental wellness support"],
      monthlyPrice: 20,
      annualPrice: 200,
    },
  ]

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 100 100" className="animate-pulse">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
            </svg>
            <Crown className="absolute inset-0 m-auto h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Subscriptions</h1>
            <p className="text-muted-foreground">Manage your service subscriptions and billing</p>
          </div>
        </div>

        {/* Active Subscriptions Summary */}
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
            <CardDescription>Your current active services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSubscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <div className="font-semibold capitalize">{sub.serviceType} Service</div>
                    <div className="text-sm text-muted-foreground">
                      {sub.plan} plan • ${sub.amount}/{sub.plan === "monthly" ? "mo" : "yr"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Renews on {sub.endDate}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Auto-renew</span>
                      <Switch checked={sub.autoRenew} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const isActive = userSubscriptions.some((s) => s.serviceType === plan.type && s.status === "active")
              return (
                <Card key={plan.type} className={isActive ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    {isActive && (
                      <Badge className="w-fit mb-2" variant="default">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-3xl font-bold">${plan.monthlyPrice}</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        or ${plan.annualPrice}/year (save ${plan.monthlyPrice * 12 - plan.annualPrice})
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isActive ? (
                      <Button variant="outline" className="w-full bg-transparent">
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button className="w-full bg-accent hover:bg-accent/90">Subscribe Now</Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
