"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Star, Quote } from "lucide-react"

export function EmployeeShowcaseSection() {
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

    const employees = [
        {
            name: "Amina Hassan",
            role: "Domestic Worker",
            location: "Oman",
            image: "/employee1.jpg",
            testimonial: "Kazipert helped me find a safe job with fair pay. My family is so proud!",
            rating: 5
        },
        {
            name: "Grace Wanjiru",
            role: "House Manager",
            location: "UAE",
            image: "/employee2.jpg",
            testimonial: "The legal protection and insurance gave me peace of mind throughout my journey.",
            rating: 5
        },
        {
            name: "Fatuma Mohamed",
            role: "Caregiver",
            location: "Qatar",
            image: "/employee3.jpg",
            testimonial: "I saved so much on agency fees and got a verified employer. Best decision ever!",
            rating: 5
        },
        {
            name: "Jane Achieng",
            role: "Nanny",
            location: "Saudi Arabia",
            image: "/employee4.jpg",
            testimonial: "The 24/7 family contact feature means everything to me. Thank you Kazipert!",
            rating: 5
        },
        {
            name: "Mary Njeri",
            role: "Cook",
            location: "Oman",
            image: "/employee5.jpg",
            testimonial: "Professional platform with real support. I felt safe every step of the way.",
            rating: 5
        },
        {
            name: "Sarah Muthoni",
            role: "Housekeeper",
            location: "UAE",
            image: "/employee6.jpg",
            testimonial: "Kazipert made my dream of working abroad a reality. Highly recommended!",
            rating: 5
        },
        {
            name: "Zainab Ali",
            role: "Domestic Worker",
            location: "Qatar",
            image: "/employee7.jpg",
            testimonial: "Fair salary, verified employer, and legal protection - everything I needed!",
            rating: 5
        }
    ]

    return (
        <section ref={sectionRef} className="relative py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container px-4 md:px-6">
                <div className="mx-auto mb-10 md:mb-12 max-w-3xl text-center">
                    <h2
                        className={`mb-3 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        Meet Our <span className="text-[#117c82]">Success Stories</span>
                    </h2>
                    <p
                        className={`text-sm md:text-base text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        Real workers who found safe, fair employment abroad through Kazipert.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
                    {employees.map((employee, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#117c82]/50 transition-all duration-500 hover:shadow-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: `${index * 100 + 200}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={employee.image}
                                    alt={employee.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                {/* Location Badge */}
                                <div className="absolute top-3 right-3 bg-[#FDB913] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                    {employee.location}
                                </div>

                                {/* Quote Icon */}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                                    <Quote className="h-3.5 w-3.5 text-[#117c82]" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-base font-bold text-gray-900 mb-0.5">{employee.name}</h3>
                                <p className="text-xs text-[#117c82] font-semibold mb-2">{employee.role}</p>

                                {/* Rating */}
                                <div className="flex gap-0.5 mb-2">
                                    {[...Array(employee.rating)].map((_, i) => (
                                        <Star key={i} className="h-3.5 w-3.5 fill-[#FDB913] text-[#FDB913]" />
                                    ))}
                                </div>

                                {/* Testimonial */}
                                <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-3">
                                    "{employee.testimonial}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
