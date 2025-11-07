"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Scale, 
  Shield, 
  Heart, 
  Brain, 
  Car, 
  Banknote, 
  Phone, 
  Camera, 
  Building2,
  ShoppingCart,
  DoorOpen,
  Zap,
  Star,
  CheckCircle,
  Crown
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any>(null)

  const services = [
    {
      icon: Scale,
      name: "Legal Consultation",
      description: "Expert legal advice for contracts and compliance",
      features: ["Contract review", "Dispute resolution", "Legal compliance", "Embassy liaison"],
      price: "Free",
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
      badge: "Enabled",
      status: "active",
      popular: false
    },
    {
      icon: Shield,
      name: "Insurance Coverage",
      description: "Health and travel insurance for workers",
      features: ["Health coverage", "Travel insurance", "Emergency medical", "Repatriation"],
      price: "Free",
      color: "from-green-500 to-green-600",
      iconColor: "text-green-600",
      badge: "Shopping",
      status: "shopping",
      popular: false
    },
    {
      icon: Heart,
      name: "Healthcare Services",
      description: "Medical exams and health certifications",
      features: ["Medical exams", "Health certificates", "Vaccinations", "Health monitoring"],
      price: "Free",
      color: "from-red-500 to-red-600",
      iconColor: "text-red-600",
      badge: "Shopping",
      status: "shopping",
      popular: false
    },
    {
      icon: Brain,
      name: "Mental Wellness",
      description: "Counseling and mental health support",
      features: ["Counseling sessions", "Stress management", "Cultural adjustment", "24/7 helpline"],
      price: "Free",
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-600",
      badge: "Enabled",
      status: "active",
      popular: true
    },
    {
      icon: Car,
      name: "Airport Taxi Service",
      description: "Reliable airport pickup and drop-off",
      features: ["Airport pickup", "Drop-off service", "Professional drivers", "Safe transport"],
      price: "Free",
      color: "from-amber-500 to-amber-600",
      iconColor: "text-amber-600",
      badge: "Shopping",
      status: "shopping",
      popular: false
    },
    {
      icon: Banknote,
      name: "Money Transfer",
      description: "Send money home quickly and securely",
      features: ["Instant transfers", "Low fees", "Secure transactions", "Mobile access"],
      price: "Free",
      color: "from-emerald-500 to-emerald-600",
      iconColor: "text-emerald-600",
      badge: "Shopping",
      status: "shopping",
      popular: false
    },
    {
      icon: Phone,
      name: "Emergency Helplines",
      description: "24/7 access to emergency services",
      features: ["24/7 availability", "Multi-language support", "Quick response", "Emergency coordination"],
      price: "Free",
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
      badge: "Enabled",
      status: "active",
      popular: true
    },
    {
      icon: Camera,
      name: "Professional Photography",
      description: "Photo services for documentation",
      features: ["Passport photos", "Profile pictures", "Document photos", "Quick turnaround"],
      price: "Free",
      color: "from-pink-500 to-pink-600",
      iconColor: "text-pink-600",
      badge: "Shopping",
      status: "shopping",
      popular: false
    },
    {
      icon: Building2,
      name: "Embassy Services",
      description: "Liaison with Kenyan and Omani embassies",
      features: ["Visa processing", "Document verification", "Embassy appointments", "Travel documents"],
      price: "Free",
      color: "from-indigo-500 to-indigo-600",
      iconColor: "text-indigo-600",
      badge: "Shopping",
      status: "shopping",
      popular: false
    },
    {
      icon: DoorOpen,
      name: "Door Visits",
      description: "In-person support and verification visits",
      features: ["Home visits", "Document verification", "Support sessions", "Progress checks"],
      price: "Free",
      color: "from-cyan-500 to-cyan-600",
      iconColor: "text-cyan-600",
      badge: "Available",
      status: "available",
      popular: false
    },
    {
      icon: ShoppingCart,
      name: "Shopping Assistance",
      description: "Help with purchases and deliveries",
      features: ["Grocery shopping", "Package delivery", "Price comparison", "Secure payments"],
      price: "Free",
      color: "from-violet-500 to-violet-600",
      iconColor: "text-violet-600",
      badge: "Shopping",
      status: "shopping",
      popular: true
    },
    {
      icon: Zap,
      name: "Quick Support",
      description: "Rapid response for urgent matters",
      features: ["Quick response", "Priority handling", "Direct contact", "Immediate assistance"],
      price: "Free",
      color: "from-rose-500 to-rose-600",
      iconColor: "text-rose-600",
      badge: "Enabled",
      status: "active",
      popular: false
    }
  ]

  const getStatusBadge = (status: string, badge: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          {badge}
        </Badge>
      case 'shopping':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
          <ShoppingCart className="h-3 w-3 mr-1" />
          {badge}
        </Badge>
      case 'available':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
          <DoorOpen className="h-3 w-3 mr-1" />
          {badge}
        </Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{badge}</Badge>
    }
  }

  const openServiceModal = (service: any) => {
    setSelectedService(service)
  }

  const closeServiceModal = () => {
    setSelectedService(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                <Crown className="h-3 w-3 mr-1" />
                All Services Free
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Complete Support Services
              </h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
                Access our comprehensive suite of free services designed to support workers and employers. 
                Legal, support, and wellness services are enabled by default.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 cursor-pointer group relative overflow-hidden"
                  onClick={() => openServiceModal(service)}
                >
                  {service.popular && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-amber-500 text-white border-0 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} shadow-lg`}>
                        <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                      </div>
                      {getStatusBadge(service.status, service.badge)}
                    </div>
                    <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {service.price}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Banner */}
        <section className="border-y border-border bg-gradient-to-r from-blue-50 to-green-50 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Legal & Support</h3>
                <p className="text-sm text-muted-foreground">Enabled by default for all users</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Wellness Services</h3>
                <p className="text-sm text-muted-foreground">Mental health support available</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                    <DoorOpen className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Door Visits</h3>
                <p className="text-sm text-muted-foreground">In-person support available</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-balance">Need Help With Services?</h2>
              <p className="mb-8 text-lg text-muted-foreground text-pretty leading-relaxed">
                Our support team is here to help you access and use our free services effectively.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button size="lg" variant="outline">
                  View All Features
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 max-w-md w-full">
            <Card className="border-0 shadow-2xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${selectedService.color}`} />
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedService.color} shadow-lg`}>
                    <selectedService.icon className={`h-6 w-6 ${selectedService.iconColor}`} />
                  </div>
                  <div className="flex gap-2">
                    {selectedService.popular && (
                      <Badge className="bg-amber-500 text-white border-0 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {getStatusBadge(selectedService.status, selectedService.badge)}
                  </div>
                </div>
                
                <CardTitle className="text-xl">{selectedService.name}</CardTitle>
                <CardDescription className="text-base">{selectedService.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-3 text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Features Included:
                  </h4>
                  <div className="grid gap-2">
                    {selectedService.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{selectedService.price}</div>
                    <div className="text-xs text-muted-foreground">No hidden fees</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={closeServiceModal}>
                      Close
                    </Button>
                    <Button className={`bg-gradient-to-r ${selectedService.color} text-white`}>
                      {selectedService.status === 'shopping' ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Get Service
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Access Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}