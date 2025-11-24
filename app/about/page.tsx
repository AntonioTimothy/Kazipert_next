import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { Shield, Users, Award, Heart, Globe2, TrendingUp, CheckCircle2, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Worker protection and legal compliance are our top priorities",
      gradient: "from-[#117c82] to-[#0d9ea6]"
    },
    {
      icon: Heart,
      title: "Empathy & Care",
      description: "We understand the challenges workers face and provide comprehensive support",
      gradient: "from-[#FDB913] to-[#f5a623]"
    },
    {
      icon: Users,
      title: "Trust & Transparency",
      description: "Building trust through verified employers and transparent processes",
      gradient: "from-[#117c82] to-[#0d9ea6]"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the highest quality service and support",
      gradient: "from-[#FDB913] to-[#f5a623]"
    }
  ]

  const milestones = [
    { year: "2023", title: "Platform Launch", description: "Kazipert goes live", color: "#117c82" },
    { year: "2024", title: "10,000+ Workers", description: "Reached major milestone", color: "#FDB913" },
    { year: "2024", title: "Embassy Partnerships", description: "Official verification", color: "#117c82" },
    { year: "2025", title: "Global Expansion", description: "Expanding to new markets", color: "#FDB913" }
  ]

  const team = [
    { name: "Leadership Team", count: "15+", icon: Target },
    { name: "Support Staff", count: "50+", icon: Users },
    { name: "Legal Experts", count: "20+", icon: Shield },
    { name: "Tech Team", count: "30+", icon: Zap }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#117c82] via-[#0d9ea6] to-[#117c82] py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#FDB913]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container relative px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <Globe2 className="h-4 w-4" />
                <span className="text-sm font-bold">About Kazipert</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Revolutionizing Domestic Worker Employment Worldwide
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                The world's first comprehensive platform dedicated to protecting domestic workers seeking employment abroad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-bold">
                  <Link href="/signup">Join Kazipert</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white/10">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#117c82]/10 to-[#FDB913]/10 rounded-full border border-[#117c82]/20">
                  <Target className="h-4 w-4 text-[#117c82]" />
                  <span className="text-sm font-bold text-[#117c82]">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  Empowering Workers, Protecting Rights
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission is to create a safe, transparent, and fair ecosystem for domestic workers seeking employment abroad. We bridge the gap between skilled workers and verified employers while ensuring comprehensive legal protection, insurance coverage, and ongoing support.
                </p>
                <div className="space-y-3">
                  {[
                    "Eliminate exploitation and unfair practices",
                    "Provide affordable access to international employment",
                    "Ensure legal protection and worker rights",
                    "Build trust through verification and transparency"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#117c82] flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/employee5.jpg"
                    alt="Our mission"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#FDB913] to-[#f5a623] rounded-2xl p-6 shadow-2xl">
                  <div className="text-4xl font-extrabold text-white">10K+</div>
                  <div className="text-sm text-white/90 font-semibold">Lives Changed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600">
                The principles that guide everything we do at Kazipert
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10`} />
                  <div className="absolute inset-[2px] bg-white rounded-2xl -z-10" />

                  <div className="relative space-y-4">
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600">
                Key milestones in the Kazipert story
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="text-4xl font-extrabold mb-2" style={{ color: milestone.color }}>
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#117c82] to-[#FDB913]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-[#117c82] to-[#0d9ea6]">
          <div className="container px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Our Team
              </h2>
              <p className="text-lg text-white/90">
                Dedicated professionals working to make a difference
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {team.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-8 text-center hover:bg-white/20 transition-all hover:-translate-y-2">
                  <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-2">{item.count}</div>
                  <div className="text-sm text-white/90 font-semibold">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                Ready to Join Us?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Be part of the revolution in domestic worker employment
              </p>
              <Button size="lg" asChild className="bg-gradient-to-r from-[#117c82] to-[#0d9ea6] hover:from-[#0d9ea6] hover:to-[#117c82] text-white font-bold shadow-xl text-lg px-10 py-7">
                <Link href="/signup">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
