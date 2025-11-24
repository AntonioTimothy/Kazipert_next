"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function TestimonialsSection() {
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

  const testimonials = [
    {
      name: "Amina Hassan",
      role: "Domestic Worker",
      location: "Muscat, Oman",
      avatar: "/employee1.jpg",
      content:
        "Kazipert made my dream of working abroad a reality. The process was smooth, transparent, and I felt supported every step of the way.",
      rating: 5,
    },
    {
      name: "Grace Wanjiru",
      role: "House Manager",
      location: "Dubai, UAE",
      avatar: "/employee2.jpg",
      content:
        "The legal protection and insurance coverage gave me peace of mind. Kazipert truly cares about worker safety and fair treatment.",
      rating: 5,
    },
    {
      name: "Fatuma Mohamed",
      role: "Caregiver",
      location: "Doha, Qatar",
      avatar: "/employee3.jpg",
      content:
        "I saved over 80% on agency fees and found a verified employer through Kazipert. The training videos helped me prepare perfectly.",
      rating: 5,
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-12 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto mb-10 md:mb-12 max-w-3xl text-center">
          <h2
            className={`mb-3 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Trusted Across <span className="text-[#117c82]">Kenya and the Gulf</span>
          </h2>
          <p
            className={`text-sm md:text-base text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Hear from workers and employers who have successfully connected through Kazipert.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`group border-2 border-gray-200 hover:border-[#117c82]/50 transition-all duration-500 hover:shadow-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              <CardContent className="pt-5 pb-5">
                {/* Quote Icon and Rating */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-9 w-9 rounded-full bg-[#117c82]/10 flex items-center justify-center">
                    <Quote className="h-4 w-4 text-[#117c82]" />
                  </div>
                  {/* Rating */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#FDB913] text-[#FDB913]" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="mb-4 text-sm leading-relaxed text-gray-700 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-[#117c82]/20">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
