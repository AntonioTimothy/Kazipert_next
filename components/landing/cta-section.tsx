"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Award } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#117c82] via-[#117c82]/95 to-[#117c82]/90 py-14 md:py-18">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Background employee image */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/employee5.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-5 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Ready to Start Your <span className="text-[#FDB913]">Safe Journey</span>?
          </h2>
          <p className="mb-8 text-sm md:text-base text-white/90 leading-relaxed max-w-2xl mx-auto">
            Join thousands of workers and employers who trust Kazipert for safe, transparent, and successful employment connections.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row mb-10">
            <Button
              size="lg"
              asChild
              className="group bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 text-base px-8 py-6"
            >
              <Link href="/signup" className="flex items-center justify-center">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 text-base px-8 py-6"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Shield className="h-7 w-7 text-[#FDB913]" />
              <div className="text-white font-semibold text-sm">No Hidden Fees</div>
              <div className="text-white/70 text-xs">Transparent pricing</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Users className="h-7 w-7 text-[#FDB913]" />
              <div className="text-white font-semibold text-sm">Verified Platform</div>
              <div className="text-white/70 text-xs">Secure & trusted</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Award className="h-7 w-7 text-[#FDB913]" />
              <div className="text-white font-semibold text-sm">24/7 Support</div>
              <div className="text-white/70 text-xs">Always here to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
