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
  Trash2,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockPaymentCards } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WorkerPaymentCards() {
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

  const navigatiodsdsn = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Payment Cards", href: "/worker/payment-cards", icon: CreditCard },
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
  

  const userCards = mockPaymentCards.filter((c) => c.userId === user.id)

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      default:
        return "💳"
    }
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg width="32" height="32" viewBox="0 0 100 100" className="animate-pulse">
                <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
              </svg>
              <CreditCard className="absolute inset-0 m-auto h-4 w-4 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Payment Cards</h1>
              <p className="text-muted-foreground">Manage your payment methods</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Card</DialogTitle>
                <DialogDescription>Enter your card details to add a new payment method</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input id="cardHolder" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  Add Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Saved Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {userCards.map((card) => (
            <Card key={card.id} className={card.isDefault ? "border-2 border-accent" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCardIcon(card.cardType)}</span>
                    <div>
                      <CardTitle className="text-lg capitalize">{card.cardType}</CardTitle>
                      <CardDescription>{card.cardNumber}</CardDescription>
                    </div>
                  </div>
                  {card.isDefault && (
                    <Badge variant="default" className="bg-accent">
                      <Star className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card Holder:</span>
                    <span className="font-medium">{card.cardHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{card.expiryDate}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {!card.isDefault && (
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Secure Payment Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and securely stored. We use industry-standard security measures to
              protect your financial data. Your card details are never shared with third parties.
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
