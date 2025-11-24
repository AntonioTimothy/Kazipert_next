import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { Play, BookOpen, Award, Clock, Users, CheckCircle2, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TrainingPage() {
  const categories = [
    {
      title: "Essential Skills",
      icon: BookOpen,
      gradient: "from-[#117c82] to-[#0d9ea6]",
      courses: 12,
      duration: "24 hours"
    },
    {
      title: "Language Training",
      icon: Users,
      gradient: "from-[#FDB913] to-[#f5a623]",
      courses: 8,
      duration: "16 hours"
    },
    {
      title: "Safety & Rights",
      icon: Award,
      gradient: "from-[#117c82] to-[#0d9ea6]",
      courses: 6,
      duration: "12 hours"
    },
    {
      title: "Cultural Awareness",
      icon: Star,
      gradient: "from-[#FDB913] to-[#f5a623]",
      courses: 10,
      duration: "20 hours"
    }
  ]

  const featuredCourses = [
    {
      title: "Professional Housekeeping",
      image: "/professional-housekeeping.jpg",
      duration: "4 hours",
      lessons: 12,
      level: "Beginner",
      rating: 4.9,
      students: 2500
    },
    {
      title: "Arabic Language Basics",
      image: "/arabic-language-learning.jpg",
      duration: "6 hours",
      lessons: 18,
      level: "Beginner",
      rating: 4.8,
      students: 3200
    },
    {
      title: "Emergency Safety Procedures",
      image: "/emergency-safety-procedures.jpg",
      duration: "2 hours",
      lessons: 8,
      level: "All Levels",
      rating: 5.0,
      students: 4100
    },
    {
      title: "Effective Communication",
      image: "/effective-communication-workplace.png",
      duration: "3 hours",
      lessons: 10,
      level: "Intermediate",
      rating: 4.7,
      students: 1800
    }
  ]

  const benefits = [
    "Free access to all training materials",
    "Certificate upon completion",
    "Learn at your own pace",
    "Mobile-friendly platform",
    "Expert instructors",
    "Lifetime access to content"
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#117c82] via-[#0d9ea6] to-[#117c82] py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDB913]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container relative px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-bold">Training Center</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                  Master Skills for Success Abroad
                </h1>
                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  Free comprehensive training programs designed to prepare you for international domestic work opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-bold">
                    <Link href="/signup">Start Learning</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white/10">
                    <Link href="/videos">Browse Videos</Link>
                  </Button>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="/professional-housekeeping.jpg"
                    alt="Training"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#FDB913] to-[#f5a623] flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-[#117c82]">5,000+</div>
                      <div className="text-sm text-gray-600 font-semibold">Certified Workers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                Training Categories
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive courses covering all aspects of domestic work
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {categories.map((category, index) => (
                <div key={index} className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-transparent p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10`} />
                  <div className="absolute inset-[2px] bg-white rounded-2xl -z-10" />

                  <div className="relative text-center space-y-4">
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{category.courses} Courses</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{category.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                Featured Courses
              </h2>
              <p className="text-lg text-gray-600">
                Most popular training programs chosen by workers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {featuredCourses.map((course, index) => (
                <div key={index} className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-[#117c82] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative aspect-video">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-[#117c82] fill-current ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-[#FDB913] text-black px-3 py-1 rounded-full text-xs font-bold">
                      {course.level}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{course.title}</h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#FDB913] text-[#FDB913]" />
                        <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">{course.students.toLocaleString()} students</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
                  Why Choose Our Training?
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our comprehensive training programs are designed by industry experts to give you the skills and confidence needed for success.
                </p>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#117c82]/5 to-transparent rounded-xl hover:from-[#117c82]/10 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-[#117c82] flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button size="lg" asChild className="bg-gradient-to-r from-[#117c82] to-[#0d9ea6] hover:from-[#0d9ea6] hover:to-[#117c82] text-white font-bold shadow-xl">
                  <Link href="/signup">Start Training Now</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#117c82] to-[#0d9ea6] rounded-2xl p-8 text-white text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-4xl font-extrabold mb-2">98%</div>
                  <div className="text-sm font-semibold">Completion Rate</div>
                </div>
                <div className="bg-gradient-to-br from-[#FDB913] to-[#f5a623] rounded-2xl p-8 text-white text-center">
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-4xl font-extrabold mb-2">5K+</div>
                  <div className="text-sm font-semibold">Certificates Issued</div>
                </div>
                <div className="bg-gradient-to-br from-[#FDB913] to-[#f5a623] rounded-2xl p-8 text-white text-center">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <div className="text-4xl font-extrabold mb-2">10K+</div>
                  <div className="text-sm font-semibold">Active Learners</div>
                </div>
                <div className="bg-gradient-to-br from-[#117c82] to-[#0d9ea6] rounded-2xl p-8 text-white text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 fill-current" />
                  <div className="text-4xl font-extrabold mb-2">4.9</div>
                  <div className="text-sm font-semibold">Average Rating</div>
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
