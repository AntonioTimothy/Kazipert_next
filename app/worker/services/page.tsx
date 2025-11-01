"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import {
  Home,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  Star,
  
  Smartphone,
  Scale,
  Users,
  Headphones,
  Zap,
  BookOpen,
  GraduationCap,
  Heart,
  Plane,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Crown,
  Sparkles,
  Bookmark,
  Target,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import type { WorkerProfile } from "@/lib/mock-data"

// Services data
const servicesData = {
  activeSubscriptions: [
    {
      id: "SUB001",
      name: "Basic Insurance",
      description: "Health and accident coverage",
      icon: Shield,
      status: "active",
      renewalDate: "2024-02-15",
      price: "KSh 1,500/month"
    },
    {
      id: "SUB002",
      name: "Legal Assistance",
      description: "Contract review and legal advice",
      icon: Scale,
      status: "active",
      renewalDate: "2024-03-01",
      price: "KSh 2,000/month"
    }
  ],
  availableServices: [
    {
      id: "SRV001",
      name: "Sohar Bank Integration",
      description: "Seamlessly connect your Omani bank account for direct salary deposits and easy fund management",
      icon: Scale,
      category: "financial",
      status: "available",
      price: "Free",
      features: ["Instant account linking", "Direct salary deposit", "Zero maintenance fees", "24/7 access"],
      action: "link_bank",
      popular: true
    },
    {
      id: "SRV002",
      name: "M-Pesa Transfer Service",
      description: "Quick and secure money transfers to your M-Pesa account with competitive exchange rates",
      icon: Smartphone,
      category: "financial",
      status: "available",
      price: "0.5% fee",
      features: ["Instant transfers", "Best exchange rates", "Transaction history", "SMS notifications"],
      action: "setup_mpesa",
      popular: true
    },
    {
      id: "SRV003",
      name: "Legal Protection Plan",
      description: "Comprehensive legal support for contract disputes, employment issues, and legal consultations",
      icon: Scale,
      category: "legal",
      status: "available",
      price: "KSh 2,500/month",
      features: ["24/7 lawyer access", "Contract review", "Dispute resolution", "Document preparation"],
      action: "subscribe_legal",
      popular: false
    },
    {
      id: "SRV004",
      name: "Premium Insurance",
      description: "Enhanced health, travel, and accident insurance coverage while working abroad",
      icon: ShieldCheck,
      category: "insurance",
      status: "available",
      price: "KSh 3,000/month",
      features: ["Medical coverage", "Travel insurance", "Accident protection", "Emergency evacuation"],
      action: "subscribe_insurance",
      popular: true
    },
    {
      id: "SRV005",
      name: "Live Support Pro",
      description: "Priority access to our 24/7 support team for immediate assistance with any issues",
      icon: Headphones,
      category: "support",
      status: "available",
      price: "KSh 500/month",
      features: ["Priority queue", "24/7 availability", "Multi-language support", "Quick resolution"],
      action: "subscribe_support",
      popular: false
    },
    {
      id: "SRV006",
      name: "Skill Development",
      description: "Access to exclusive training programs and certification courses to enhance your employability",
      icon: GraduationCap,
      category: "training",
      status: "available",
      price: "KSh 1,000/month",
      features: ["Online courses", "Certifications", "Skill assessment", "Career guidance"],
      action: "subscribe_training",
      popular: false
    },
    {
      id: "SRV007",
      name: "Emergency Assistance",
      description: "Immediate help in case of emergencies including medical, travel, and security situations",
      icon: Zap,
      category: "emergency",
      status: "available",
      price: "KSh 1,800/month",
      features: ["24/7 emergency line", "Medical coordination", "Travel assistance", "Family support"],
      action: "subscribe_emergency",
      popular: true
    },
    {
      id: "SRV008",
      name: "Document Verification",
      description: "Professional verification and notarization of your documents for employment purposes",
      icon: Bookmark,
      category: "document",
      status: "available",
      price: "KSh 800/document",
      features: ["Fast processing", "Digital copies", "Government compliance", "International recognition"],
      action: "verify_documents",
      popular: false
    }
  ],
  recommendedServices: [
    {
      id: "REC001",
      name: "Career Advancement Package",
      description: "Complete package including training, certification, and career counseling",
      icon: Crown,
      savings: "Save 20%",
      originalPrice: "KSh 6,500",
      currentPrice: "KSh 5,200"
    },
    {
      id: "REC002",
      name: "Family Support Plan",
      description: "Extend your benefits to family members with comprehensive coverage",
      icon: Users,
      savings: "Family discount",
      originalPrice: "KSh 8,000",
      currentPrice: "KSh 6,000"
    }
  ]
}

export default function WorkerServicesPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

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

  const categories = [
    { id: "all", name: "All Services", icon: Sparkles, count: servicesData.availableServices.length },
    { id: "financial", name: "Financial", icon: Sparkles, count: servicesData.availableServices.filter(s => s.category === 'financial').length },
    { id: "legal", name: "Legal", icon: Scale, count: servicesData.availableServices.filter(s => s.category === 'legal').length },
    { id: "insurance", name: "Insurance", icon: ShieldCheck, count: servicesData.availableServices.filter(s => s.category === 'insurance').length },
    { id: "support", name: "Support", icon: Headphones, count: servicesData.availableServices.filter(s => s.category === 'support').length },
    { id: "training", name: "Training", icon: GraduationCap, count: servicesData.availableServices.filter(s => s.category === 'training').length }
  ]

  const handleServiceAction = (service: any) => {
    // Check if user profile is complete (you can define your own criteria)
    const isProfileComplete = user?.documents?.passport && user?.documents?.certificate && user?.documents?.medicalReport
    
    if (!isProfileComplete) {
      toast.error("Profile Incomplete", {
        description: "Please complete your profile verification to access this service.",
        action: {
          label: "Complete Now",
          onClick: () => router.push("/worker/onboarding")
        },
        duration: 5000,
      })
      return
    }

    // Handle different service actions
    switch(service.action) {
      case 'link_bank':
        toast.success("Bank Linking", {
          description: "Redirecting to Sohar Bank integration...",
        })
        // Implement bank linking logic
        break
      case 'setup_mpesa':
        toast.success("M-Pesa Setup", {
          description: "Setting up your M-Pesa transfer service...",
        })
        // Implement M-Pesa setup logic
        break
      case 'subscribe_legal':
        toast.success("Legal Service", {
          description: "Subscribing to Legal Protection Plan...",
        })
        // Implement subscription logic
        break
      default:
        toast.info("Service Access", {
          description: `Accessing ${service.name}...`,
        })
    }
  }

  const filteredServices = activeCategory === "all" 
    ? servicesData.availableServices 
    : servicesData.availableServices.filter(service => service.category === activeCategory)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Enhance Your Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access premium services designed to support your employment journey and financial growth
          </p>
        </div>

        {/* Active Subscriptions */}
        {servicesData.activeSubscriptions.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Active Subscriptions
              </CardTitle>
              <CardDescription>Services you're currently subscribed to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {servicesData.activeSubscriptions.map((subscription) => {
                  const IconComponent = subscription.icon
                  return (
                    <div 
                      key={subscription.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                          <IconComponent className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{subscription.name}</p>
                          <p className="text-sm text-muted-foreground">{subscription.description}</p>
                          <p className="text-xs text-green-600 mt-1">
                            Renews on {new Date(subscription.renewalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Active
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "flex items-center gap-2 transition-all duration-300",
                      activeCategory === category.id && "shadow-md"
                    )}
                    onClick={() => setActiveCategory(category.id)}
                    style={
                      activeCategory === category.id 
                        ? {
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.text
                          }
                        : {
                            borderColor: currentTheme.colors.primary + '30'
                          }
                    }
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.name}
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs"
                      style={{
                        backgroundColor: activeCategory === category.id 
                          ? 'rgba(255,255,255,0.2)' 
                          : currentTheme.colors.primary + '15'
                      }}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => {
            const IconComponent = service.icon
            return (
              <Card 
                key={service.id}
                className={cn(
                  "group relative overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl",
                  service.popular ? "border-amber-200 hover:border-amber-300" : "border-border/50 hover:border-primary/30"
                )}
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                }}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div 
                    className="absolute top-4 right-4 z-10"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    <Crown className="h-5 w-5" />
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs font-normal"
                      style={{
                        backgroundColor: currentTheme.colors.primary + '15'
                      }}
                    >
                      {service.price}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {service.name}
                  </CardTitle>
                  
                  <CardDescription className="mt-2 line-clamp-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Includes:
                    </h4>
                    <div className="space-y-1">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      service.status === 'available' 
                        ? "text-green-600 border-green-300 bg-green-500/10"
                        : "text-amber-600 border-amber-300 bg-amber-500/10"
                    )}
                  >
                    {service.status === 'available' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Coming Soon
                      </>
                    )}
                  </Badge>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full transition-all duration-300 hover:scale-105 group"
                    onClick={() => handleServiceAction(service)}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    {service.action.includes('subscribe') ? 'Subscribe Now' : 'Get Started'}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>

                {/* Hover Effect Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                />
              </Card>
            )
          })}
        </div>

        {/* Recommended Packages */}
        <Card 
          className="border-0 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}05 0%, ${currentTheme.colors.backgroundLight} 50%, ${currentTheme.colors.background} 100%)`
          }}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Recommended Packages
            </CardTitle>
            <CardDescription>Save more with our bundled service packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {servicesData.recommendedServices.map((packageItem) => {
                const IconComponent = packageItem.icon
                return (
                  <div 
                    key={packageItem.id}
                    className="flex flex-col p-6 rounded-xl border-2 border-amber-200 bg-amber-50/50 hover:border-amber-300 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                        <IconComponent className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{packageItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{packageItem.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-amber-600">{packageItem.currentPrice}</span>
                          <span className="text-sm text-muted-foreground line-through">{packageItem.originalPrice}</span>
                        </div>
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-300">
                          {packageItem.savings}
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => toast.info("Package Selection", {
                          description: `Selected ${packageItem.name} package`
                        })}
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        Select Package
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Need Help Choosing?
            </CardTitle>
            <CardDescription>Our support team is here to help you select the best services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Phone,
                  title: "Call Support",
                  description: "24/7 helpline",
                  contact: "+254 700 000000",
                  action: () => toast.info("Call Support", { description: "Connecting you to our support team..." })
                },
                {
                  icon: Mail,
                  title: "Email Support",
                  description: "Detailed assistance",
                  contact: "support@kazipert.com",
                  action: () => toast.info("Email Support", { description: "Opening your email client..." })
                },
                {
                  icon: MessageSquare,
                  title: "Live Chat",
                  description: "Instant messaging",
                  contact: "Available 24/7",
                  action: () => toast.info("Live Chat", { description: "Opening chat window..." })
                }
              ].map((support) => {
                const IconComponent = support.icon
                return (
                  <Button
                    key={support.title}
                    variant="outline"
                    className="h-auto flex-col gap-3 p-6 border-2 border-border/30 hover:border-primary/30 hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm"
                    onClick={support.action}
                  >
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{support.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{support.description}</div>
                      <div className="text-xs font-medium mt-2">{support.contact}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}