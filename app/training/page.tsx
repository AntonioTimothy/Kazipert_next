import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, BookOpen } from "lucide-react"
import { trainingVideos } from "@/lib/mock-data"

export default function TrainingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-secondary/5 to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-balance">Training Resources</h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Comprehensive training videos to prepare you for working abroad. Learn about Kenyan and Omani culture,
                laws, and best practices for successful employment.
              </p>
            </div>
          </div>
        </section>

        {/* Training Categories */}
        <section className="py-20">
          <div className="container space-y-12">
            {/* About Kenya */}
            <div>
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold">About Kenya</h2>
                <p className="text-muted-foreground">Essential information for employers about Kenyan workers</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainingVideos.kenya.map((video) => (
                  <Card key={video.id} className="transition-all hover:border-primary/50 hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </span>
                          <Badge variant="secondary">{video.category}</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* About Oman */}
            <div>
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold">About Oman</h2>
                <p className="text-muted-foreground">
                  Essential information for workers about living and working in Oman
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainingVideos.oman.map((video) => (
                  <Card key={video.id} className="transition-all hover:border-primary/50 hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-secondary" />
                      </div>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </span>
                          <Badge variant="secondary">{video.category}</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* General Training */}
            <div>
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold">General Training</h2>
                <p className="text-muted-foreground">Important skills and knowledge for all users</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainingVideos.general.map((video) => (
                  <Card key={video.id} className="transition-all hover:border-primary/50 hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-4 aspect-video rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-accent" />
                      </div>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </span>
                          <Badge variant="secondary">{video.category}</Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-3xl font-bold">Additional Resources</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <BookOpen className="mb-4 h-8 w-8 text-primary" />
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Guides and manuals for workers and employers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Docs
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <BookOpen className="mb-4 h-8 w-8 text-secondary" />
                    <CardTitle>FAQs</CardTitle>
                    <CardDescription>Frequently asked questions and answers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      Read FAQs
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <BookOpen className="mb-4 h-8 w-8 text-accent" />
                    <CardTitle>Support</CardTitle>
                    <CardDescription>Get help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
