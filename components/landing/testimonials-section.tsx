import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Amina Hassan",
      role: "Domestic Worker",
      location: "Muscat, Oman",
      avatar: "/african-woman-professional.jpg",
      content:
        "Kazipert made my dream of working abroad a reality. The process was smooth, transparent, and I felt supported every step of the way. I'm now working with a wonderful family in Muscat.",
      rating: 5,
    },
    {
      name: "Ahmed Al-Kindi",
      role: "Employer",
      location: "Muscat, Oman",
      avatar: "/middle-eastern-professional.png",
      content:
        "Finding the right domestic worker was always challenging until I discovered Kazipert. The verification process gave me confidence, and the worker we hired has been exceptional.",
      rating: 5,
    },
    {
      name: "Fatima Mohamed",
      role: "Domestic Worker",
      location: "Dubai, UAE",
      avatar: "/african-woman-smiling.jpg",
      content:
        "The training videos and support services helped me prepare for my new role. Kazipert's platform is user-friendly and the team is always available to help. Highly recommended!",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Trusted by Thousands Across Kenya and the Gulf
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Hear from workers and employers who have successfully connected through Kazipert.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="pt-6">
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
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
