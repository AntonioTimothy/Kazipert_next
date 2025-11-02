"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Home,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  Star,
  BookOpen,
  Award,
  PlayCircle,
  CheckCircle,
  Lock,
  Clock,
  Download,
  Share2,
  Zap,
  Users,
  TrendingUp,
  Sparkles,
  Target,
  Crown,
  Bookmark,
  ArrowRight,
  BarChart3,
  Medal,
  GraduationCap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { WorkerProfile } from "@/lib/mock-data"

interface Course {
  id: string
  title: string
  description: string
  duration: string
  lessons: number
  progress: number
  status: "locked" | "in-progress" | "completed"
  category: string
  instructor: string
  rating: number
  students: number
  level: "beginner" | "intermediate" | "advanced"
  thumbnail: string
  featured: boolean
}

const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Gulf Culture & Customs",
    description: "Learn about cultural norms, traditions, and etiquette in Gulf countries to ensure smooth integration and professional success.",
    duration: "2 hours",
    lessons: 8,
    progress: 100,
    status: "completed",
    category: "Culture",
    instructor: "Dr. Fatima Al-Rashid",
    rating: 4.8,
    students: 1250,
    level: "beginner",
    thumbnail: "/course-culture.jpg",
    featured: false
  },
  {
    id: "2",
    title: "Arabic Language Basics for Workers",
    description: "Essential Arabic phrases and communication skills for daily work interactions and building relationships with employers.",
    duration: "4 hours",
    lessons: 12,
    progress: 65,
    status: "in-progress",
    category: "Language",
    instructor: "Ahmed Hassan",
    rating: 4.9,
    students: 980,
    level: "beginner",
    thumbnail: "/course-arabic.jpg",
    featured: true
  },
  {
    id: "3",
    title: "Professional Housekeeping Standards",
    description: "Master modern housekeeping techniques, international standards, and efficient home management practices.",
    duration: "3 hours",
    lessons: 10,
    progress: 30,
    status: "in-progress",
    category: "Skills",
    instructor: "Mary Johnson",
    rating: 4.7,
    students: 1100,
    level: "intermediate",
    thumbnail: "/course-housekeeping.jpg",
    featured: false
  },
  {
    id: "4",
    title: "Advanced Child Care & Safety",
    description: "Professional childcare practices, safety protocols, emergency response, and developmental activities.",
    duration: "3.5 hours",
    lessons: 11,
    progress: 0,
    status: "locked",
    category: "Skills",
    instructor: "Sarah Williams",
    rating: 4.9,
    students: 850,
    level: "intermediate",
    thumbnail: "/course-childcare.jpg",
    featured: false
  },
  {
    id: "5",
    title: "International Cuisine Mastery",
    description: "Learn to prepare Middle Eastern, Asian, and Western dishes with professional cooking techniques.",
    duration: "5 hours",
    lessons: 15,
    progress: 0,
    status: "locked",
    category: "Skills",
    instructor: "Chef Omar Abdullah",
    rating: 4.8,
    students: 720,
    level: "advanced",
    thumbnail: "/course-cooking.jpg",
    featured: false
  },
  {
    id: "6",
    title: "Your Rights & Legal Protection",
    description: "Understanding your employment rights, contracts, legal protections, and dispute resolution mechanisms.",
    duration: "2.5 hours",
    lessons: 9,
    progress: 100,
    status: "completed",
    category: "Legal",
    instructor: "Advocate Jane Mwangi",
    rating: 5.0,
    students: 1500,
    level: "beginner",
    thumbnail: "/course-legal.jpg",
    featured: false
  },
]

export default function WorkerTrainingPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Applications", href: "/worker/contracts", icon: FileText },
    { name: "Wallet", href: "/worker/payments", icon: CreditCard },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Reviews", href: "/worker/reviews", icon: Star },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const completedCourses = courses.filter((c) => c.status === "completed").length
  const inProgressCourses = courses.filter((c) => c.status === "in-progress").length
  const totalProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
  const featuredCourse = courses.find(course => course.featured)

  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen, count: courses.length },
    { id: "Culture", name: "Culture", icon: Users, count: courses.filter(c => c.category === 'Culture').length },
    { id: "Language", name: "Language", icon: MessageSquare, count: courses.filter(c => c.category === 'Language').length },
    { id: "Skills", name: "Skills", icon: Award, count: courses.filter(c => c.category === 'Skills').length },
    { id: "Legal", name: "Legal", icon: Shield, count: courses.filter(c => c.category === 'Legal').length }
  ]

  const filteredCourses = selectedCategory === "all" ? courses : courses.filter((c) => c.category === selectedCategory)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "intermediate":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "advanced":
        return "text-purple-600 bg-purple-500/10 border-purple-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              Skill Development Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Enhance your expertise and unlock better career opportunities
            </p>
          </div>
          <Button 
            asChild 
            className="shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            <Link href="/worker/certificates">
              <Medal className="mr-2 h-4 w-4" />
              My Certificates
            </Link>
          </Button>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card 
            className="border-0 shadow-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}08 0%, ${currentTheme.colors.backgroundLight} 100%)`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6 opacity-10"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <CheckCircle className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                {completedCourses}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Certificates earned and skills mastered</p>
            </CardContent>
          </Card>

          <Card 
            className="border-0 shadow-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.accent}08 0%, ${currentTheme.colors.backgroundLight} 100%)`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6 opacity-10"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-5 w-5" style={{ color: currentTheme.colors.accent }} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                {inProgressCourses}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Currently expanding your skillset</p>
            </CardContent>
          </Card>

          <Card 
            className="border-0 shadow-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.secondary}08 0%, ${currentTheme.colors.backgroundLight} 100%)`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6 opacity-10"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <TrendingUp className="h-5 w-5" style={{ color: currentTheme.colors.secondary }} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                {totalProgress}%
              </div>
              <Progress 
                value={totalProgress} 
                className="mt-2"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Featured Course Banner */}
        {featuredCourse && (
          <Card 
            className="border-0 shadow-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.accent}10 50%, ${currentTheme.colors.backgroundLight} 100%)`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-10"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <div 
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-10"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
            
            <CardContent className="pt-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className="bg-gradient-to-r from-primary to-accent text-white border-0"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Featured Course
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={getLevelColor(featuredCourse.level)}
                    >
                      {featuredCourse.level}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                    {featuredCourse.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {featuredCourse.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{featuredCourse.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({featuredCourse.students} students)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{featuredCourse.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{featuredCourse.lessons} lessons</span>
                    </div>
                  </div>

                  {/* Progress for featured course */}
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your progress</span>
                      <span className="font-semibold">{featuredCourse.progress}% complete</span>
                    </div>
                    <Progress 
                      value={featuredCourse.progress} 
                      className="h-2"
                      style={{
                        backgroundColor: currentTheme.colors.backgroundLight
                      }}
                    />
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.text
                  }}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {featuredCourse.progress > 0 ? "Continue Learning" : "Start Learning"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList 
                className="grid w-full grid-cols-5 p-1 rounded-xl"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight
                }}
              >
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id}
                      className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300 flex items-center gap-2"
                      style={{
                        backgroundColor: selectedCategory === category.id ? currentTheme.colors.primary : 'transparent',
                        color: selectedCategory === category.id ? currentTheme.colors.text : currentTheme.colors.text
                      }}
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                      <Badge 
                        variant="secondary" 
                        className="ml-1 text-xs"
                        style={{
                          backgroundColor: selectedCategory === category.id 
                            ? 'rgba(255,255,255,0.2)' 
                            : currentTheme.colors.primary + '15'
                        }}
                      >
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id}
              className={cn(
                "group relative overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl",
                course.status === "locked" ? "opacity-70" : "hover:border-primary/30",
                course.featured ? "border-accent/30" : "border-border/50"
              )}
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
              }}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {course.status === "completed" && (
                  <Badge className="bg-green-500 text-white border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {course.status === "in-progress" && (
                  <Badge 
                    style={{
                      backgroundColor: currentTheme.colors.accent,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                )}
                {course.status === "locked" && (
                  <Badge variant="secondary">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="outline"
                    className={getLevelColor(course.level)}
                  >
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </CardTitle>
                
                <CardDescription className="mt-2 line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/30">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                  >
                    <span className="text-sm font-bold" style={{ color: currentTheme.colors.primary }}>
                      {course.instructor.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {course.status !== "locked" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress 
                      value={course.progress} 
                      style={{
                        backgroundColor: currentTheme.colors.backgroundLight
                      }}
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2 pt-4">
                {course.status === "locked" ? (
                  <Button className="flex-1" variant="outline" disabled>
                    <Lock className="mr-2 h-4 w-4" />
                    Complete Prerequisites
                  </Button>
                ) : course.status === "completed" ? (
                  <>
                    <Button 
                      className="flex-1 border-primary/30 hover:bg-primary/10 bg-transparent"
                      variant="outline"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                    <Button variant="outline" size="icon" className="border-primary/30 hover:bg-primary/10">
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="flex-1 transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.text
                      }}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {course.progress > 0 ? "Continue" : "Start Now"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardFooter>

              {/* Hover Effect Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
              />
            </Card>
          ))}
        </div>

        {/* Learning Journey */}
        <Card 
          className="border-0 shadow-xl text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}08 0%, ${currentTheme.colors.accent}05 50%, ${currentTheme.colors.backgroundLight} 100%)`
          }}
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
          <div 
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 opacity-10"
            style={{ backgroundColor: currentTheme.colors.accent }}
          />
          
          <CardContent className="pt-12 pb-8 relative z-10">
            <div className="max-w-2xl mx-auto">
              <Medal className="h-16 w-16 mx-auto mb-6" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                Your Professional Development Journey
              </h3>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Complete all courses to earn your Professional Worker Certificate and increase your chances of getting hired by top employers
              </p>
              
              <div className="flex items-center justify-center gap-8 mb-8">
                {[
                  { value: completedCourses, label: "Completed", color: "text-green-600" },
                  { value: inProgressCourses, label: "In Progress", color: "text-blue-600" },
                  { value: courses.length - completedCourses - inProgressCourses, label: "Remaining", color: "text-orange-600" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.text
                }}
              >
                <Target className="mr-2 h-5 w-5" />
                View Learning Path
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}