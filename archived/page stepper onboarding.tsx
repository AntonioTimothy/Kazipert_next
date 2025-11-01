import { SignupForm } from "@/components/auth/signup-form"
import WorkerOnboardingPage from "../onboarding/worker/page"

export default function SignupPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left side - Graphics (hidden on mobile) */}
      <div className="relative hidden bg-gradient-to-br from-secondary via-secondary/90 to-accent/80 lg:block">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative flex h-full flex-col justify-center p-12">
          <div className="space-y-6 text-secondary-foreground">
            <h1 className="text-4xl font-bold leading-tight text-balance">Start Your Journey Today</h1>
            <p className="text-lg leading-relaxed">
              Create your account and join a trusted community of workers and employers across Kenya and the Gulf
              region.
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-foreground/20 text-sm font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold">Create Your Profile</div>
                  <div className="text-sm opacity-80">Complete KYC verification for security</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-foreground/20 text-sm font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold">Find Your Match</div>
                  <div className="text-sm opacity-80">Browse opportunities or get matched automatically</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-foreground/20 text-sm font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold">Start Working</div>
                  <div className="text-sm opacity-80">Complete visa process and begin your journey</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        {/* <SignupForm /> */}
        <WorkerOnboardingPage/>
      </div>
    </div>
  )
}
