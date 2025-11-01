import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Phone, Globe, Building2, Scale, Heart } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const resources = [
    {
      icon: FileText,
      title: "Documentation",
      description: "Guides, manuals, and documentation for workers and employers",
      links: [
        { name: "Worker Handbook", href: "#" },
        { name: "Employer Guide", href: "#" },
        { name: "Contract Templates", href: "#" },
        { name: "FAQ", href: "#" },
      ],
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      description: "Important helplines and emergency services",
      links: [
        { name: "Kenya Emergency: 999", href: "tel:999" },
        { name: "Oman Emergency: 9999", href: "tel:9999" },
        { name: "Kazipert Support: +254 700 000 000", href: "tel:+254700000000" },
        { name: "Mental Health Helpline", href: "#" },
      ],
    },
    {
      icon: Building2,
      title: "Embassy Information",
      description: "Contact details for embassies and consulates",
      links: [
        { name: "Kenyan Embassy in Oman", href: "#" },
        { name: "Omani Embassy in Kenya", href: "#" },
        { name: "Ministry of Labor Kenya", href: "#" },
        { name: "Ministry of Labor Oman", href: "#" },
      ],
    },
    {
      icon: Scale,
      title: "Legal Resources",
      description: "Information about labor laws and worker rights",
      links: [
        { name: "Kenyan Labor Laws", href: "#" },
        { name: "Omani Labor Laws", href: "#" },
        { name: "Worker Rights Guide", href: "#" },
        { name: "Legal Aid Services", href: "#" },
      ],
    },
    {
      icon: Globe,
      title: "Cultural Resources",
      description: "Learn about Kenyan and Omani culture and customs",
      links: [
        { name: "About Kenya", href: "#" },
        { name: "About Oman", href: "#" },
        { name: "Cultural Etiquette", href: "#" },
        { name: "Language Resources", href: "#" },
      ],
    },
    {
      icon: Heart,
      title: "Support Services",
      description: "Access to healthcare, counseling, and support",
      links: [
        { name: "Healthcare Providers", href: "#" },
        { name: "Mental Wellness", href: "#" },
        { name: "Financial Services", href: "#" },
        { name: "Community Support", href: "#" },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-accent/5 to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">Resources & Support</h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Access important information, emergency contacts, legal resources, and support services. Everything you
                need for a successful employment journey.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource, index) => (
                <Card key={index} className="transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <resource.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="text-sm text-primary hover:underline flex items-center gap-2"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Important Links */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-3xl font-bold">Important Links</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="mb-4 font-semibold">Government Portals</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          eCitizen Kenya Portal
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Oman Government Portal
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Ministry of Foreign Affairs Kenya
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Ministry of Foreign Affairs Oman
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="mb-4 font-semibold">Partner Services</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Insurance Providers
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Legal Consultants
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Healthcare Facilities
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-primary hover:underline">
                          Training Institutes
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-balance">Need More Help?</h2>
              <p className="mb-8 text-lg text-muted-foreground text-pretty leading-relaxed">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
