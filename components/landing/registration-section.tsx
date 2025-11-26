"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { Shield, FileCheck, Plane, CreditCard, Users, Headphones } from "lucide-react"
import { useRouter } from "next/navigation"

export function RegistrationSection() {
  const router = useRouter()

  const images = [
    "/employee1.jpg",
    "/employee2.jpg",
    "/employee3.jpg",
    "/employee4.jpg",
    "/employee5.jpg",
    "/employee6.jpg",
    "/employee7.jpg",
  ]

  const features = [
    {
      icon: Shield,
      title: "KYC Verification",
      description: "Biometric verification and OTP validation ensure authentic, verified users on both sides.",
      color: "#117c82"
    },
    {
      icon: FileCheck,
      title: "Digital Contracts",
      description: "Legally binding digital contracts with e-signatures for complete transparency and security.",
      color: "#117c82"
    },
    {
      icon: Plane,
      title: "Visa & Travel Support",
      description: "End-to-end visa processing, medical exams, and travel arrangements handled seamlessly.",
      color: "#117c82"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Bank-verified payment confirmations and easy money transfers through M-Pesa integration.",
      color: "#FDB913"
    },
    {
      icon: Users,
      title: "Smart Matching",
      description: "AI-powered matching system connects workers with employers based on skills and requirements.",
      color: "#117c82"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock support with legal, insurance, and mental wellness services available.",
      color: "#FDB913"
    },
  ]

  return (
    <section className="relative bg-white pt-8 md:pt-12 lg:pt-14 pb-12 md:pb-16 overflow-hidden">

      {/* TRIANGLE BG */}
      <div className="pointer-events-none absolute left-1/2 top-40 -translate-x-1/2 w-[520px] h-[520px] md:w-[700px] md:h-[700px] opacity-15 -z-10">
        <svg viewBox="0 0 500 500" className="absolute w-full h-full rotate-180">
          <polygon points="250,0 500,500 0,500" fill="#117c82" />
        </svg>
      </div>

      {/* TRAPEZIUM */}
      <div className="pointer-events-none absolute top-[420px] left-1/2 -translate-x-1/2 w-[1000px] h-[300px] md:w-[1500px] opacity-20 -z-10">
        <svg viewBox="0 0 1200 400" className="absolute w-full h-full">
          <polygon points="200,0 1000,0 1200,400 0,400" fill="#0F8A8D" />
        </svg>
      </div>

      {/* LIGHT TEXTURE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/icons-bg.svg')] bg-center bg-repeat" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* IMAGE SLIDER */}
        <div className="w-full rounded-xl overflow-hidden mb-8 md:mb-10">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2200, disableOnInteraction: false }}
            loop
            slidesPerView={1}
            spaceBetween={12}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 12 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
            }}
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-56 md:h-64 lg:h-72 relative rounded-lg overflow-hidden">
                  <Image src={src} alt={`Employee ${idx + 1}`} fill className="object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* TEXT */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#625F8D] mb-3">
            Finally, it's here!
          </h2>

          <p className="text-base md:text-lg leading-relaxed text-gray-600">
            The name Kazipert is inspired by two meaningful words:
            <span className="text-[#117c82] font-semibold"> Kazi</span>,
            meaning “job” in Swahili, and
            <span className="text-[#117c82] font-semibold"> expert</span>.
            We infuse local cultural expertise into domestic work abroad,
            addressing longstanding challenges in the sector with a primary
            focus on the Middle East.
          </p>
        </div>

        {/* FEATURES SLIDER */}
        <div className="mb-6">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            slidesPerView={1}
            spaceBetween={12}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <SwiperSlide key={i}>
                  <div className="h-full flex items-stretch">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-12 w-12 rounded-lg flex items-center justify-center shadow-sm"
                          style={{ background: `${f.color}22` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: f.color }} />
                        </div>

                        <h3 className="text-lg font-extrabold text-gray-900">
                          {f.title}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 grow leading-relaxed">
                        {f.description}
                      </p>

                      {/* UPDATED BUTTON */}
                      <div className="mt-2">
                        <button
                          onClick={() => router.push("/about-us")}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-sm"
                          style={{
                            background: f.color,
                            color: f.color === "#FDB913" ? "#1f1f1f" : "#fff",
                          }}
                        >
                          Learn more
                        </button>
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

      </div>
    </section>
  )
}
