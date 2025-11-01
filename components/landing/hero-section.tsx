import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Shield, Globe, CheckCircle, LogIn, Lock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Motion Graphics */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        />

        <svg
          className="absolute bottom-0 left-0 w-full h-40 opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path
            d="M 0,100 Q 300,50 600,100 T 1200,100"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse-slow"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="container relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              {/* Header with Badge and Login */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-accent/40 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm">
                  <span className="relative flex h-3 w-5 bg-accent rounded-sm">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-sm bg-accent opacity-75" />
                    <span className="relative inline-flex h-3 w-5 rounded-sm bg-accent" />
                  </span>
                  First in the WORLD
                </div>
                
              
              </div>

              {/* Main Heading */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                Finally, your{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  safest domestic job abroad
                </span>{" "}
                is now here!
              </h1>

              {/* Pricing */}
              <p className="mb-6 text-xl text-muted-foreground font-medium">
                Create your account now for <span className="font-bold text-accent">ONLY Ksh. 200</span>
              </p>

              {/* Benefits List with Triangle Pointers */}
              <div className="mb-8 space-y-3">
                {[
                  "Life & Medical Insurance cover beyond the insurer's limits",
                  "24/7 contact with your loving family back home",
                  "Dedicated legal representation in case of disputes",
                  "Automated job contract and registration with Kenya Embassy",
                  "Verified employers with guaranteed fair salary",
                  "All this while saving over 80% on Agency fees"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm md:text-base">
                    <div className="relative mt-1 flex-shrink-0">
                      <div className="w-4 h-4 bg-yellow-500/20 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-sm animate-pulse" />
                      </div>
                      <div className="absolute top-1/2 left-4 w-2 h-2 bg-yellow-500/30 transform rotate-45 -translate-y-1/2" />
                    </div>
                    <span className="text-muted-foreground text-left leading-relaxed flex-1">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <Button size="lg" asChild className="group relative overflow-hidden bg-primary hover:bg-primary/90 shadow-lg flex-1">
                  <Link href="/signup">
                    <span className="relative z-10 flex items-center">
                      Register Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
               
              </div>

              {/* Trust & Data Protection */}
              <div className="mb-6 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-foreground">100% Secure & Trusted Platform</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">
                  Your data is protected with enterprise-grade security. We comply with international 
                  data protection standards to ensure your privacy and safety.
                </p>
              </div>

              {/* Countries Flags */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-3 text-left">Trusted by employers in:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Oman", flag: "https://flagcdn.com/w40/om.png", alt: "Oman Flag" },
                    { name: "Kenya", flag: "https://flagcdn.com/w40/ke.png", alt: "Kenya Flag" },
                    { name: "UAE", flag: "https://flagcdn.com/w40/ae.png", alt: "UAE Flag" },
                    { name: "Qatar", flag: "https://flagcdn.com/w40/qa.png", alt: "Qatar Flag" },
                    { name: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png", alt: "Saudi Arabia Flag" }
                  ].map((country, index) => (
                    <div key={index} className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                      <img 
                        src={country.flag} 
                        alt={country.alt}
                        className="w-6 h-4 rounded-sm object-cover"
                      />
                      <span className="text-xs font-medium text-foreground">{country.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employer Callout */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
                <p className="text-sm text-foreground text-left font-medium">
                  <span className="text-primary">Employers in Oman:</span> Sign up today to find verified, 
                  skilled domestic workers with complete background checks and legal documentation.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border">
                  <div className="h-12 w-12 rounded-lg bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Verified Employers</div>
                    <div className="text-xs text-muted-foreground">Guaranteed Fair Salary</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Legal Protection</div>
                    <div className="text-xs text-muted-foreground">Dispute Resolution</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                <div className="absolute inset-0 rounded-2xl border-4 border-accent/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 backdrop-blur-sm shadow-xl">
                  <div className="relative h-full w-full rounded-xl overflow-hidden border border-border">
                    <img
                      src="/employee3.jpg"
                      alt="Domestic worker abroad"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-l-4 border-accent rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-accent rounded-br-xl" />
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-card border-2 border-accent/40 rounded-xl p-4 shadow-lg animate-float backdrop-blur-sm">
                  <div className="text-2xl font-bold text-primary">80%+</div>
                  <div className="text-xs text-muted-foreground">Fee Savings</div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-card border-2 border-accent/40 rounded-xl p-4 shadow-lg animate-float backdrop-blur-sm"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="text-2xl font-bold text-secondary">Ksh. 200</div>
                  <div className="text-xs text-muted-foreground">Registration</div>
                </div>

                <div
                  className="absolute top-1/2 -right-6 bg-card border-2 border-primary/40 rounded-xl p-3 shadow-lg animate-float backdrop-blur-sm"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-bold text-primary">Insurance</div>
                      <div className="text-xs text-muted-foreground">Cover</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}