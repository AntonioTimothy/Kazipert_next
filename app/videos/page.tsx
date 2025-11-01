import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Users } from "lucide-react"

export default function VideosPage() {
  const kenyaVideos = [
    {
      title: "Understanding Oman Culture",
      description: "Learn about Omani customs, traditions, and cultural expectations",
      duration: "15:30",
      views: "12.5K",
      thumbnail: "/oman-culture-traditional.jpg",
      category: "Culture",
    },
    {
      title: "Your Rights as a Domestic Worker",
      description: "Know your legal rights and protections under Oman labor law",
      duration: "12:45",
      views: "18.2K",
      thumbnail: "/legal-rights-document.jpg",
      category: "Legal",
    },
    {
      title: "Arabic Language Basics",
      description: "Essential Arabic phrases for daily communication",
      duration: "20:15",
      views: "25.8K",
      thumbnail: "/arabic-language-learning.jpg",
      category: "Language",
    },
    {
      title: "Safety and Emergency Procedures",
      description: "What to do in emergencies and how to stay safe",
      duration: "10:20",
      views: "15.3K",
      thumbnail: "/emergency-safety-procedures.jpg",
      category: "Safety",
    },
    {
      title: "Professional Housekeeping Standards",
      description: "Best practices for cleaning, cooking, and household management",
      duration: "18:40",
      views: "22.1K",
      thumbnail: "/professional-housekeeping.jpg",
      category: "Skills",
    },
    {
      title: "Managing Homesickness",
      description: "Mental wellness tips for living abroad",
      duration: "14:25",
      views: "9.7K",
      thumbnail: "/mental-wellness-support.jpg",
      category: "Wellness",
    },
    {
      title: "Financial Management & M-Pesa",
      description: "How to send money home and manage your salary",
      duration: "11:30",
      views: "20.4K",
      thumbnail: "/mobile-money-transfer.jpg",
      category: "Finance",
    },
    {
      title: "Contract Understanding",
      description: "What to look for in your employment contract",
      duration: "13:15",
      views: "16.8K",
      thumbnail: "/employment-contract-signing.jpg",
      category: "Legal",
    },
  ]

  const omanVideos = [
    {
      title: "Understanding Kenyan Culture",
      description: "Learn about Kenyan customs, communication styles, and cultural values",
      duration: "16:20",
      views: "8.3K",
      thumbnail: "/kenya-culture-traditional.jpg",
      category: "Culture",
    },
    {
      title: "Employer Responsibilities in Oman",
      description: "Your legal obligations as an employer under Oman labor law",
      duration: "14:50",
      views: "11.2K",
      thumbnail: "/employer-responsibilities-legal.jpg",
      category: "Legal",
    },
    {
      title: "Effective Communication with Domestic Workers",
      description: "Best practices for clear, respectful communication",
      duration: "12:35",
      views: "9.8K",
      thumbnail: "/effective-communication-workplace.png",
      category: "Communication",
    },
    {
      title: "Creating a Safe Work Environment",
      description: "How to ensure safety and comfort for your domestic worker",
      duration: "10:45",
      views: "7.5K",
      thumbnail: "/safe-work-environment-home.jpg",
      category: "Safety",
    },
    {
      title: "Fair Compensation Guidelines",
      description: "Understanding fair wages and benefits for domestic workers",
      duration: "11:20",
      views: "10.1K",
      thumbnail: "/fair-wages-compensation.jpg",
      category: "Finance",
    },
    {
      title: "Conflict Resolution Strategies",
      description: "How to address and resolve workplace issues professionally",
      duration: "13:40",
      views: "6.9K",
      thumbnail: "/conflict-resolution-mediation.jpg",
      category: "Management",
    },
    {
      title: "Visa and Documentation Process",
      description: "Step-by-step guide to visa applications and legal requirements",
      duration: "15:30",
      views: "12.4K",
      thumbnail: "/visa-documentation-process.jpg",
      category: "Legal",
    },
    {
      title: "Building Trust and Respect",
      description: "Creating a positive employer-worker relationship",
      duration: "9:50",
      views: "8.7K",
      thumbnail: "/trust-respect-workplace.jpg",
      category: "Relationship",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Training Videos</h1>
            <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Comprehensive video training for both job seekers and employers. Learn about culture, rights,
              responsibilities, and best practices.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="kenya" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="kenya">For Job Seekers (Kenya)</TabsTrigger>
                <TabsTrigger value="oman">For Employers (Oman)</TabsTrigger>
              </TabsList>

              <TabsContent value="kenya" className="mt-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Training for Kenyan Job Seekers</h2>
                  <p className="mt-2 text-muted-foreground">
                    Essential training videos to prepare you for working in Oman. Learn about culture, your rights, and
                    professional skills.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {kenyaVideos.map((video, index) => (
                    <Card key={index} className="group cursor-pointer transition-all hover:shadow-lg">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                            <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                          {video.duration}
                        </div>
                      </div>
                      <CardHeader>
                        <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {video.category}
                        </div>
                        <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{video.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="oman" className="mt-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Training for Omani Employers</h2>
                  <p className="mt-2 text-muted-foreground">
                    Learn about Kenyan culture, your responsibilities as an employer, and how to create a positive work
                    environment.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {omanVideos.map((video, index) => (
                    <Card key={index} className="group cursor-pointer transition-all hover:shadow-lg">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                            <Play className="h-8 w-8 text-secondary-foreground" fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                          {video.duration}
                        </div>
                      </div>
                      <CardHeader>
                        <div className="mb-2 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                          {video.category}
                        </div>
                        <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{video.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
