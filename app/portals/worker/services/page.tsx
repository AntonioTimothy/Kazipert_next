"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import {
  Scale, Shield, Heart, Brain, Car, Banknote, Phone, Camera, Building2,
  Users, Dumbbell, BookOpen, GraduationCap, PiggyBank, Clock, Zap,
  CheckCircle, Crown, Star, ArrowRight, Target, Sparkles, ShieldCheck
} from "lucide-react"

interface Service {
  id: string
  icon: any
  name: string
  description: string
  features: string[]
  price: string
  type: "free" | "premium" | "coming-soon"
  category: string
  enabled: boolean
  popular?: boolean
}

export default function ServicesPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [services, setServices] = useState<Service[]>([])
  const [enrolledServices, setEnrolledServices] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userData = sessionStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "EMPLOYEE") {
        router.push("/login")
        return
      }

      setUser(parsedUser)
      
      // Initialize services data
      const initialServices: Service[] = [
        {
          id: "legal",
          icon: Scale,
          name: "Legal Consultation",
          description: "Expert legal advice for contracts, disputes, and compliance with Kenyan and Omani labor laws",
          features: ["Contract review", "Dispute resolution", "Legal compliance", "Embassy liaison"],
          price: "Free",
          type: "free",
          category: "support",
          enabled: true
        },
        {
          id: "customer-care",
          icon: Phone,
          name: "24/7 Customer Care",
          description: "Round-the-clock support for all your questions and concerns",
          features: ["24/7 availability", "Multi-language support", "Quick response", "Emergency coordination"],
          price: "Free",
          type: "free",
          category: "support",
          enabled: true
        },
        {
          id: "wallet",
          icon: Banknote,
          name: "Digital Wallet Services",
          description: "Secure money management, transfers, and financial tracking",
          features: ["M-Pesa integration", "Low fees", "Secure transactions", "Mobile access"],
          price: "Free",
          type: "free",
          category: "financial",
          enabled: true
        },
        {
          id: "transport",
          icon: Car,
          name: "Smart Transport Service",
          description: "Reliable airport pickup and drop-off services with real-time tracking",
          features: ["Airport pickup", "Drop-off service", "Professional drivers", "Safe transport"],
          price: "$25/trip",
          type: "premium",
          category: "lifestyle",
          enabled: true
        },
        {
          id: "mental-health",
          icon: Brain,
          name: "Mental Wellness Support",
          description: "Professional counseling and mental health support with optional call services",
          features: ["Counseling sessions", "Stress management", "Cultural adjustment", "24/7 helpline"],
          price: "$40/session",
          type: "premium",
          category: "health",
          enabled: false
        },
        {
          id: "gym",
          icon: Dumbbell,
          name: "Fitness & Gym Access",
          description: "Access to partner gyms and fitness centers with personalized training",
          features: ["Gym access", "Personal training", "Fitness tracking", "Nutrition guidance"],
          price: "$20/month",
          type: "premium",
          category: "lifestyle",
          enabled: false,
          popular: true
        },
        {
          id: "language",
          icon: BookOpen,
          name: "Language Training",
          description: "Learn Arabic and other languages with certified instructors",
          features: ["Arabic lessons", "English improvement", "Cultural training", "Certification"],
          price: "$30/month",
          type: "premium",
          category: "education",
          enabled: false
        },
        {
          id: "sacco",
          icon: PiggyBank,
          name: "SACCO & Chama Services",
          description: "Join savings groups and merry-go-round investment opportunities",
          features: ["Group savings", "Investment opportunities", "Financial planning", "Emergency loans"],
          price: "Free + Premium",
          type: "free",
          category: "financial",
          enabled: false
        },
        {
          id: "insurance",
          icon: Shield,
          name: "Comprehensive Insurance",
          description: "Health, travel, and life insurance coverage for workers abroad",
          features: ["Health coverage", "Travel insurance", "Emergency medical", "Repatriation"],
          price: "$30/month",
          type: "premium",
          category: "health",
          enabled: false
        },
        {
          id: "healthcare",
          icon: Heart,
          name: "Healthcare Services",
          description: "Medical examinations, health certifications, and ongoing healthcare support",
          features: ["Medical exams", "Health certificates", "Vaccinations", "Health monitoring"],
          price: "$100/exam",
          type: "premium",
          category: "health",
          enabled: false
        },
        {
          id: "photography",
          icon: Camera,
          name: "Professional Photography",
          description: "Professional photo services for passport, visa, and profile documentation",
          features: ["Passport photos", "Profile pictures", "Document photos", "Quick turnaround"],
          price: "$15/session",
          type: "premium",
          category: "lifestyle",
          enabled: false
        },
        {
          id: "embassy",
          icon: Building2,
          name: "Embassy Services",
          description: "Direct liaison with Kenyan and Omani embassies for visa and documentation support",
          features: ["Visa processing", "Document verification", "Embassy appointments", "Travel documents"],
          price: "Varies",
          type: "premium",
          category: "support",
          enabled: false
        },
        {
          id: "career-coaching",
          icon: Target,
          name: "Career Advancement",
          description: "Professional development and career coaching services",
          features: ["Career planning", "Skill assessment", "Interview prep", "Promotion guidance"],
          price: "$50/session",
          type: "premium",
          category: "education",
          enabled: false,
          popular: true
        },
        {
          id: "community",
          icon: Users,
          name: "Worker Community",
          description: "Connect with other workers for support and networking",
          features: ["Community events", "Networking", "Peer support", "Social activities"],
          price: "Free",
          type: "free",
          category: "lifestyle",
          enabled: false
        },
        {
          id: "emergency",
          icon: ShieldCheck,
          name: "Emergency Response",
          description: "Immediate emergency assistance and crisis management",
          features: ["Emergency response", "Crisis management", "Family notification", "Legal aid"],
          price: "Free",
          type: "free",
          category: "support",
          enabled: true
        }
      ]

      setServices(initialServices)
      setEnrolledServices(initialServices.filter(s => s.enabled).map(s => s.id))
      setLoading(false)
    }

    loadData()
  }, [router])

  const categories = [
    { id: "all", name: "All Services", count: services.length },
    { id: "support", name: "Support", count: services.filter(s => s.category === 'support').length },
    { id: "financial", name: "Financial", count: services.filter(s => s.category === 'financial').length },
    { id: "health", name: "Health", count: services.filter(s => s.category === 'health').length },
    { id: "lifestyle", name: "Lifestyle", count: services.filter(s => s.category === 'lifestyle').length },
    { id: "education", name: "Education", count: services.filter(s => s.category === 'education').length }
  ]

  const filteredServices = activeTab === "all" 
    ? services 
    : services.filter(service => service.category === activeTab)

  const handleServiceToggle = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, enabled: !service.enabled }
        : service
    ))

    if (enrolledServices.includes(serviceId)) {
      setEnrolledServices(prev => prev.filter(id => id !== serviceId))
    } else {
      setEnrolledServices(prev => [...prev, serviceId])
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "free":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "premium":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "coming-soon":
        return "text-purple-600 bg-purple-500/10 border-purple-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "free":
        return <CheckCircle className="h-3 w-3" />
      case "premium":
        return <Crown className="h-3 w-3" />
      case "coming-soon":
        return <Clock className="h-3 w-3" />
      default:
        return <Star className="h-3 w-3" />
    }
  }

  // Skeleton loading components
  const ServiceCardSkeleton = () => (
    <div className="border-2 border-border/50 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  )

  const HeroSkeleton = () => (
    <div className="border-b border-border py-20 animate-pulse">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <HeroSkeleton />
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Categories Skeleton */}
          <div className="border-0 shadow-lg rounded-lg p-6 animate-pulse">
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          {/* Services Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      {/* Hero Section */}
      <section 
        className="border-b border-border py-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}08 0%, ${currentTheme.colors.accent}05 50%, ${currentTheme.colors.backgroundLight} 100%)`
        }}
      >
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-10"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-10"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
        
        {/* <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge 
              className="mb-6 bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-1"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Enhanced Services Portal
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Your Complete <span style={{ color: currentTheme.colors.primary }}>Support</span> Ecosystem
            </h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8">
              Access a comprehensive suite of services designed to support your journey abroad. 
              From essential free services to premium lifestyle enhancements, we've got you covered.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                {enrolledServices.length} Services Active
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Users className="h-3 w-3 mr-1" />
                Trusted by 10,000+ Workers
              </Badge>
            </div>
          </div>
        </div> */}




      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          {/* Categories Filter */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList 
                  className="grid w-full grid-cols-6 p-1 rounded-xl"
                  style={{
                    backgroundColor: currentTheme.colors.backgroundLight
                  }}
                >
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id}
                      className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
                      style={{
                        backgroundColor: activeTab === category.id ? currentTheme.colors.primary : 'transparent',
                        color: activeTab === category.id ? currentTheme.colors.text : currentTheme.colors.text
                      }}
                    >
                      {category.name}
                      <Badge 
                        variant="secondary" 
                        className="ml-1 text-xs"
                        style={{
                          backgroundColor: activeTab === category.id 
                            ? 'rgba(255,255,255,0.2)' 
                            : currentTheme.colors.primary + '15'
                        }}
                      >
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <Card 
                key={service.id}
                className={cn(
                  "group relative overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl",
                  service.enabled ? "border-primary/30" : "border-border/50",
                  service.popular && "ring-2 ring-yellow-400/30"
                )}
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                }}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-yellow-500 text-white border-0">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge 
                    variant="outline"
                    className={cn("text-xs", getTypeColor(service.type))}
                  >
                    {getTypeIcon(service.type)}
                    <span className="ml-1 capitalize">{service.type}</span>
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                    >
                      <service.icon 
                        className="h-6 w-6" 
                        style={{ color: currentTheme.colors.primary }} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {service.name}
                      </CardTitle>
                    </div>
                  </div>
                  
                  <CardDescription className="leading-relaxed line-clamp-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Key Features:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div 
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: currentTheme.colors.primary }}
                          />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-xs text-muted-foreground/70">
                          +{service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
                    <span className="text-sm font-medium">Price</span>
                    <span className="font-bold" style={{ color: currentTheme.colors.primary }}>
                      {service.price}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 pt-4">
                  {service.type === "coming-soon" ? (
                    <Button className="flex-1" variant="outline" disabled>
                      <Clock className="mr-2 h-4 w-4" />
                      Coming Soon
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="flex-1 transition-all duration-300 hover:scale-105"
                        variant={service.enabled ? "default" : "outline"}
                        onClick={() => handleServiceToggle(service.id)}
                        style={{
                          backgroundColor: service.enabled ? currentTheme.colors.primary : 'transparent',
                          color: service.enabled ? currentTheme.colors.text : currentTheme.colors.text,
                          borderColor: service.enabled ? currentTheme.colors.primary : currentTheme.colors.border
                        }}
                      >
                        {service.enabled ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Enable Service
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </CardFooter>

                {/* Hover Effect Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                />
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card 
            className="border-0 shadow-xl text-center relative overflow-hidden mt-12"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}08 0%, ${currentTheme.colors.accent}05 50%, ${currentTheme.colors.backgroundLight} 100%)`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <div 
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 opacity-10"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
            
            <CardContent className="pt-12 pb-8 relative z-10">
              <div className="max-w-2xl mx-auto">
                <ShieldCheck className="h-16 w-16 mx-auto mb-6" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                  Need Personalized Service Recommendations?
                </h3>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Our support team is here to help you select the perfect services for your unique needs and journey.
                </p>
                
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button 
                    size="lg" 
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Support
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    View Service Packages
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}