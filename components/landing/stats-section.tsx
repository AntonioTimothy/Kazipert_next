"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, Users, Award, Globe2 } from "lucide-react"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({ workers: 0, employers: 0, success: 0, countries: 0 })
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

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = duration / steps

    const targets = { workers: 10000, employers: 5000, success: 98, countries: 50 }
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        workers: Math.floor(targets.workers * progress),
        employers: Math.floor(targets.employers * progress),
        success: Math.floor(targets.success * progress),
        countries: Math.floor(targets.countries * progress),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts(targets)
      }
    }, increment)

    return () => clearInterval(timer)
  }, [isVisible])

  const stats = [
    {
      icon: Users,
      value: `${counts.workers.toLocaleString()}+`,
      label: "Active Workers",
      gradient: "from-[#117c82] to-[#0d9ea6]",
      bgGradient: "from-[#117c82]/10 to-[#0d9ea6]/5"
    },
    {
      icon: Globe2,
      value: `${counts.employers.toLocaleString()}+`,
      label: "Verified Employers",
      gradient: "from-[#0d9ea6] to-[#117c82]",
      bgGradient: "from-[#0d9ea6]/10 to-[#117c82]/5"
    },
    {
      icon: TrendingUp,
      value: `${counts.success}%`,
      label: "Success Rate",
      gradient: "from-[#FDB913] to-[#f5a623]",
      bgGradient: "from-[#FDB913]/10 to-[#f5a623]/5"
    },
    {
      icon: Award,
      value: `${counts.countries}+`,
      label: "Partner Services",
      gradient: "from-[#f5a623] to-[#FDB913]",
      bgGradient: "from-[#f5a623]/10 to-[#FDB913]/5"
    },
  ]

  return (
    <section ref={sectionRef} className="relative border-y-4 border-[#FDB913]/20 bg-gradient-to-r from-white via-gray-50 to-white py-16 md:py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#117c82]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FDB913]/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent p-8 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient Border on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10`} />
              <div className="absolute inset-[2px] bg-white rounded-2xl -z-10" />

              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-100 group-hover:opacity-0 transition-opacity duration-300 rounded-2xl`} />

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div
                  className={`h-16 w-16 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div
                  className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent transition-colors duration-300`}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-700">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
