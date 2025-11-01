import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, Shield, Users, Globe } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "We prioritize the safety and security of all workers and employers through rigorous KYC verification.",
    },
    {
      icon: Heart,
      title: "Transparency",
      description: "Complete transparency in all processes, from job posting to contract signing and payment.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community of workers and employers across borders.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting opportunities between Kenya and the Gulf region with local expertise.",
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
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">About Kazipert</h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Kazipert is a digital recruitment ecosystem designed to connect domestic workers from Kenya with
                employers in Oman and the Gulf region through a safe, transparent, and compliant platform.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    To create a fraud-free, traceable, and profitable ecosystem that ensures worker safety, employer
                    transparency, and full compliance with international labor laws. We aim to make the recruitment
                    process seamless, secure, and beneficial for all stakeholders.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <Eye className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    To become the leading digital platform for international domestic worker recruitment, setting the
                    standard for safety, transparency, and compliance in the industry. We envision a world where workers
                    and employers can connect with confidence and trust.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Values</h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                The principles that guide everything we do at Kazipert
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold">How We Work</h2>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">KYC Verification</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      All users undergo rigorous KYC verification including biometric authentication and OTP validation
                      to ensure authenticity and security.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 text-lg font-bold text-secondary">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Smart Matching</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      Our AI-powered system matches workers with employers based on skills, requirements, and
                      preferences for optimal compatibility.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Digital Contracts</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      Legally binding digital contracts with e-signatures ensure transparency and protection for both
                      parties throughout the employment period.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    4
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">End-to-End Support</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      From visa processing to airport pickup and ongoing support, we provide comprehensive services
                      throughout the entire employment journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
