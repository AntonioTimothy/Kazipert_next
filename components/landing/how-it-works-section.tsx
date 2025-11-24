"use client"

import { UserPlus, Search, FileSignature, Plane } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function HowItWorksSection() {
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

  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up and complete your profile with KYC verification for security and trust.",
      color: "#117c82",
    },
    {
      icon: Search,
      title: "Find Your Match",
      description: "Browse opportunities or let our AI match you with the perfect employer or worker.",
      color: "#117c82",
    },
    {
      icon: FileSignature,
      title: "Sign Contract",
      description: "Review and digitally sign your employment contract with legal protection.",
      color: "#FDB913",
    },
    {
      icon: Plane,
      title: "Start Your Journey",
      description: "Complete visa processing, medical exams, and travel arrangements with our support.",
      color: "#FDB913",
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-white py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mx-auto mb-10 md:mb-12 max-w-3xl text-center">
          <h2
            className={`mb-3 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            How <span className="text-[#117c82]">Kazipert</span> Works
          </h2>
          <p
            className={`text-sm md:text-base text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Four simple steps to connect workers and employers in a safe, transparent process.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-[#117c82] to-[#FDB913] lg:block opacity-20" />
              )}

              <div className="relative flex flex-col items-center text-center group">
                {/* Step icon */}
                <div
                  className="mb-3 flex h-20 w-20 items-center justify-center rounded-full relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="h-8 w-8" style={{ color: step.color }} />
                  <div
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>

                <h3 className="mb-2 text-base md:text-lg font-bold">{step.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
