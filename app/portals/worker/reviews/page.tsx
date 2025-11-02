"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { Home, User, Briefcase, FileText, CreditCard, Shield, Video, MessageSquare, Star, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { WorkerProfile } from "@/lib/mock-data"
import { mockJobReviews } from "@/lib/mock-data"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function WorkerReviews() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [rating, setRating] = useState(0)

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
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const navigationdsd = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Contracts", href: "/worker/contracts", icon: FileText },
    { name: "Payments", href: "/worker/payments", icon: CreditCard },
    { name: "Reviews", href: "/worker/reviews", icon: Star },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]
  
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

  const receivedReviews = mockJobReviews.filter((r) => r.workerId === user.id && r.reviewType === "employer_to_worker")
  const givenReviews = mockJobReviews.filter((r) => r.workerId === user.id && r.reviewType === "worker_to_employer")

  const averageRating =
    receivedReviews.length > 0
      ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
      : "0.0"

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 100 100" className="animate-pulse">
              <polygon points="50,10 90,90 10,90" fill="hsl(var(--accent))" opacity="0.3" />
            </svg>
            <Star className="absolute inset-0 m-auto h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
            <p className="text-muted-foreground">View feedback from employers and leave your own reviews</p>
          </div>
        </div>

        {/* Rating Summary */}
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold">{averageRating}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${Number(averageRating) >= star ? "fill-accent text-accent" : "text-muted"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{receivedReviews.length} reviews</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = receivedReviews.filter((r) => r.rating === stars).length
                  const percentage = receivedReviews.length > 0 ? (count / receivedReviews.length) * 100 : 0
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Received */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews from Employers</CardTitle>
            <CardDescription>Feedback you've received from your employers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receivedReviews.length > 0 ? (
                receivedReviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{review.employerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{review.employerName}</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${review.rating >= star ? "fill-accent text-accent" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.reviewDate}</span>
                    </div>
                    <p className="text-sm">{review.reviewText}</p>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Star className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Given */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reviews</CardTitle>
            <CardDescription>Reviews you've given to employers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {givenReviews.length > 0 ? (
                givenReviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{review.employerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{review.employerName}</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${review.rating >= star ? "fill-accent text-accent" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.reviewDate}</span>
                    </div>
                    <p className="text-sm">{review.reviewText}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  <p>You haven't left any reviews yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Leave a Review */}
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>Share your experience with your current or past employer</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`h-8 w-8 ${rating >= star ? "fill-accent text-accent" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Your Review</Label>
                <Textarea id="review" placeholder="Share your experience working with this employer..." rows={4} />
              </div>

              <Button type="submit" className="bg-accent hover:bg-accent/90">
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
