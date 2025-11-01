import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 md:py-32">
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

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl text-balance">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-10 text-lg text-primary-foreground/90 text-pretty leading-relaxed">
            Join thousands of workers and employers who trust Kazipert for safe, transparent, and successful employment
            connections.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="group">
              <Link href="/login">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Additional info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/80">
            <div>No hidden fees</div>
            <div className="h-1 w-1 rounded-full bg-primary-foreground/50" />
            <div>Secure platform</div>
            <div className="h-1 w-1 rounded-full bg-primary-foreground/50" />
            <div>24/7 support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
