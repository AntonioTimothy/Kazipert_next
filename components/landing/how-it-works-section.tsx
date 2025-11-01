import { UserPlus, Search, FileSignature, Plane } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up and complete your profile with KYC verification for security and trust.",
      color: "primary",
    },
    {
      icon: Search,
      title: "Find Your Match",
      description: "Browse opportunities or let our AI match you with the perfect employer or worker.",
      color: "secondary",
    },
    {
      icon: FileSignature,
      title: "Sign Contract",
      description: "Review and digitally sign your employment contract with legal protection.",
      color: "accent",
    },
    {
      icon: Plane,
      title: "Start Your Journey",
      description: "Complete visa processing, medical exams, and travel arrangements with our support.",
      color: "primary",
    },
  ]

  return (
    <section className="bg-muted/30 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-balance">How Kazipert Works</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Four simple steps to connect workers and employers in a safe, transparent process.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 relative z-10">
                  <step.icon className="h-10 w-10 text-primary" />
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
