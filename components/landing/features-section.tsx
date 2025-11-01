"use client"

import { Shield, FileCheck, Plane, CreditCard, Users, HeadphonesIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Shield,
      title: "KYC Verification",
      description: "Biometric verification and OTP validation ensure authentic, verified users on both sides.",
    },
    {
      icon: FileCheck,
      title: "Digital Contracts",
      description: "Legally binding digital contracts with e-signatures for complete transparency and security.",
    },
    {
      icon: Plane,
      title: "Visa & Travel Support",
      description: "End-to-end visa processing, medical exams, and travel arrangements handled seamlessly.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Bank-verified payment confirmations and easy money transfers through M-Pesa integration.",
    },
    {
      icon: Users,
      title: "Smart Matching",
      description: "AI-powered matching system connects workers with employers based on skills and requirements.",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock support with legal, insurance, and mental wellness services available.",
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated triangles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 animate-float">
          <svg width="50" height="50" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.1" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: "1s" }}>
          <svg width="60" height="60" viewBox="0 0 100 100" className="rotate-180">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.15" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float" style={{ animationDelay: "0.5s" }}>
          <svg width="40" height="40" viewBox="0 0 100 100" className="rotate-90">
            <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.12" />
          </svg>
        </div>
      </div>

      <div className="container relative">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2
            className={`mb-4 text-3xl font-bold tracking-tight md:text-4xl text-balance transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Everything You Need for Safe Employment
          </h2>
          <p
            className={`text-lg text-muted-foreground text-pretty leading-relaxed transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Our comprehensive platform provides all the tools and services needed for a secure and successful employment
            journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-border/50 transition-all duration-700 hover:border-primary/50 hover:shadow-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
