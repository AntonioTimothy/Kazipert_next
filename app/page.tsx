import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/landing/hero-section"
import { VideoDescriptionSection } from "@/components/landing/video-description-section"
import { RegistrationSection } from "@/components/landing/registration-section"
import { EmployeeShowcaseSection } from "@/components/landing/employee-showcase-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import FeaturesSection from "@/components/landing/features-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <VideoDescriptionSection />
        <RegistrationSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />

        <EmployeeShowcaseSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
