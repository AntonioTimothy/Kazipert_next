import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, Shield, Heart, Brain, Car, Banknote, Phone, Camera, Building2 } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Scale,
      name: "Legal Consultation",
      description: "Expert legal advice for contracts, disputes, and compliance with Kenyan and Omani labor laws",
      features: ["Contract review", "Dispute resolution", "Legal compliance", "Embassy liaison"],
      price: "$50/consultation",
      color: "primary",
    },
    {
      icon: Shield,
      name: "Insurance Coverage",
      description: "Comprehensive health and travel insurance for workers during employment abroad",
      features: ["Health coverage", "Travel insurance", "Emergency medical", "Repatriation"],
      price: "$30/month",
      color: "secondary",
    },
    {
      icon: Heart,
      name: "Healthcare Services",
      description: "Medical examinations, health certifications, and ongoing healthcare support",
      features: ["Medical exams", "Health certificates", "Vaccinations", "Health monitoring"],
      price: "$100/exam",
      color: "accent",
    },
    {
      icon: Brain,
      name: "Mental Wellness",
      description: "Professional counseling and mental health support services for workers abroad",
      features: ["Counseling sessions", "Stress management", "Cultural adjustment", "24/7 helpline"],
      price: "$40/session",
      color: "primary",
    },
    {
      icon: Car,
      name: "Airport Taxi Service",
      description: "Reliable airport pickup and drop-off services in Kenya and Oman",
      features: ["Airport pickup", "Drop-off service", "Professional drivers", "Safe transport"],
      price: "$25/trip",
      color: "secondary",
    },
    {
      icon: Banknote,
      name: "Money Transfer (M-Pesa)",
      description: "Send money home quickly and securely through M-Pesa integration",
      features: ["Instant transfers", "Low fees", "Secure transactions", "Mobile access"],
      price: "2% fee",
      color: "accent",
    },
    {
      icon: Phone,
      name: "Emergency Helplines",
      description: "24/7 access to emergency services including police, fire, and medical assistance",
      features: ["24/7 availability", "Multi-language support", "Quick response", "Emergency coordination"],
      price: "Free",
      color: "primary",
    },
    {
      icon: Camera,
      name: "Professional Photography",
      description: "Professional photo services for passport, visa, and profile documentation",
      features: ["Passport photos", "Profile pictures", "Document photos", "Quick turnaround"],
      price: "$15/session",
      color: "secondary",
    },
    {
      icon: Building2,
      name: "Embassy Services",
      description: "Direct liaison with Kenyan and Omani embassies for visa and documentation support",
      features: ["Visa processing", "Document verification", "Embassy appointments", "Travel documents"],
      price: "Varies",
      color: "accent",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">
                Integrated Services for Your Journey
              </h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Access a comprehensive suite of services designed to support workers and employers throughout the
                employment process. From legal support to healthcare, we've got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Card key={index} className="transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription className="leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Features:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary">{service.price}</Badge>
                      <Button size="sm">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-balance">Need Help Choosing Services?</h2>
              <p className="mb-8 text-lg text-muted-foreground text-pretty leading-relaxed">
                Our support team is here to help you select the right services for your needs.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Access Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
