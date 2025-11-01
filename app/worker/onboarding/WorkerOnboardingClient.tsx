"use client"

import { PortalLayout } from "@/components/portal-layout"
import { useOnboarding } from "@/components/workerOnboarding/hooks/useOnboarding"
import Stepper from "@/components/workerOnboarding/Stepper"
import Step1Instructions from "@/components/workerOnboarding/Step1Instructions"
import Step2PersonalInfo from "@/components/workerOnboarding/Step2PersonalInfo"
import Step3KycDetails from "@/components/workerOnboarding/Step3KycDetails"
import Step4Documents from "@/components/workerOnboarding/Step4Documents"
import Step5FaceVerification from "@/components/workerOnboarding/Step5FaceVerification"
import Step6PhotoStudio from "@/components/workerOnboarding/Step6PhotoStudio"
import Step7Payment from "@/components/workerOnboarding/Step7Payment"
import Step8Summary from "@/components/workerOnboarding/Step8Summary"
import ErrorModal from "@/components/workerOnboarding/ErrorModal"
import CountyModal from "@/components/workerOnboarding/CountyModal"
import CountriesModal from "@/components/workerOnboarding/CountriesModal"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  Home,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  Star,
  MessageSquare,
  User,
  Camera
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"



interface WorkerOnboardingClientProps {
  initialUser: any
  initialProgress: any
  
}

export default function WorkerOnboardingClient({ initialUser, initialProgress }: WorkerOnboardingClientProps) {
  const router = useRouter()
  const { setUser, syncWithSessionStorage } = useAuth()
  
  // Sync the initial user data with client-side auth state
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
    }
    syncWithSessionStorage()
  }, [initialUser, setUser, syncWithSessionStorage])

  // Optional: Set up periodic token refresh
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        // Call API route to refresh tokens
        await fetch('/api/auth/refresh', { method: 'POST' })
      } catch (error) {
        console.error('Failed to refresh token:', error)
      }
    }, 14 * 60 * 1000) // Refresh every 14 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  const {
    user,
    loading,
    currentStep,
    onboardingData,
    validationErrors,
    saving,
    showErrorModal,
    showCountyModal,
    showCountriesModal,
    updateOnboardingData,
    nextStep,
    prevStep,
    goToStep,
    setShowErrorModal,
    setShowCountyModal,
    setShowCountriesModal,
    handleFileUpload,
    uploadProgress
  } = useOnboarding(initialUser, initialProgress)

  // Mock functions for payment and face verification (replace with actual implementations)
  const processPayment = async (paymentData: any) => {
    try {
      // Simulate payment processing
      console.log('Processing payment:', paymentData)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { success: true, transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) }
    } catch (error) {
      console.error('Payment processing failed:', error)
      return { success: false, error: 'Payment failed' }
    }
  }

  const simulateFaceVerification = async (faceData: any) => {
    try {
      // Simulate face verification
      console.log('Processing face verification:', faceData)
      await new Promise(resolve => setTimeout(resolve, 3000))
      return { success: true, confidence: 0.95 }
    } catch (error) {
      console.error('Face verification failed:', error)
      return { success: false, error: 'Face verification failed' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-theme-primary mx-auto" />
          <p className="text-theme-text-muted">Loading your onboarding progress...</p>
        </div>
      </div>
    )
  }

  const totalSteps = 8
  const progress = (currentStep / totalSteps) * 100
  const completedSteps = Array.from({ length: currentStep - 1 }, (_, i) => i + 1)

  if (onboardingData?.verification?.paymentVerified && !completedSteps.includes(7)) {
    completedSteps.push(7)
  }

  const steps = [
    { number: 1, title: "Instructions", icon: BookOpen, description: "Read and accept terms" },
    { number: 2, title: "Documents", icon: FileText, description: "Upload required documents" },
    { number: 3, title: "Face Verification", icon: Camera, description: "Photo matching" },

    { number: 4, title: "Personal Info", icon: User, description: "Complete your profile" },
    { number: 5, title: "KYC Details", icon: User, description: "Identity information" },
    { number: 6, title: "Photo Studio", icon: Camera, description: "Professional photos" },
    { number: 7, title: "Payment", icon: CreditCard, description: "Registration fee" },
    { number: 8, title: "Summary", icon: CheckCircle, description: "Review and submit" },
  ]

  const renderStepContent = () => {
    const StepIcon = steps[currentStep - 1].icon
    
    return (
      <Card className="border border-theme-border shadow-sm bg-theme-background">
        <CardHeader className="border-b bg-gradient-theme-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border-2 flex items-center justify-center bg-theme-primary/20 border-theme-primary/40">
              <StepIcon className="h-5 w-5 text-theme-primary" />
            </div>
            <div>
              <CardTitle className="text-lg text-theme-text">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription className="text-theme-text-muted">{steps[currentStep - 1].description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {currentStep === 1 && <Step1Instructions data={onboardingData} updateData={updateOnboardingData} />}
              {currentStep === 2 && (
                <Step2PersonalInfo 
                  data={onboardingData} 
                  updateData={updateOnboardingData} 
                  user={initialUser}
                  onCountyModalOpen={() => setShowCountyModal(true)}
                />
              )}
              {currentStep === 3 && (
                <Step3KycDetails 
                  data={onboardingData} 
                  updateData={updateOnboardingData}
                  onCountriesModalOpen={() => setShowCountriesModal(true)}
                />
              )}
              {currentStep === 4 && (
                <Step4Documents 
                  data={onboardingData} 
                  updateData={updateOnboardingData} 
                  user={user}
                  onFileUpload={handleFileUpload}
                  uploadProgress={uploadProgress}
                />
              )}
              {currentStep === 5 && (
                <Step5FaceVerification 
                  data={onboardingData} 
                  updateData={updateOnboardingData}
                  onFaceVerification={simulateFaceVerification}
                  saving={saving}
                />
              )}
              {currentStep === 6 && <Step6PhotoStudio data={onboardingData} />}
              {currentStep === 7 && (
                <Step7Payment 
                  data={onboardingData} 
                  updateData={updateOnboardingData}
                  onProcessPayment={processPayment}
                  saving={saving}
                />
              )}
              {currentStep === 8 && <Step8Summary data={onboardingData} user={user} router={router} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 8 && (
            <div className="flex justify-between pt-6 border-t border-theme-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-10 border-theme-border hover:bg-theme-primary/10 text-theme-text"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={saving}
                className="h-10 text-white text-base px-6 bg-theme-primary hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <PortalLayout  user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-theme-text">
              Complete Your Profile
              <BookOpen className="h-6 w-6 text-theme-primary" />
            </h1>
            <p className="text-theme-text-muted">Finish onboarding to start applying for jobs in Oman</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn(
              "px-3 py-1",
              saving ? "bg-theme-warning/10 text-theme-warning border-theme-warning/30" : "bg-theme-success/10 text-theme-success border-theme-success/30"
            )}>
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {saving ? "Saving..." : "Auto-saved"}
            </Badge>
            
            {/* User Info Badge */}
            <Badge variant="secondary" className="px-3 py-1 bg-theme-primary/10 text-theme-primary border-theme-primary/20">
              <User className="h-3 w-3 mr-1" />
              {user?.name || user?.email}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-theme-text">Step {currentStep} of {totalSteps}</span>
            <span className="font-medium text-theme-primary">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-theme-border">
            <div 
              className="h-full bg-theme-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>

        <Stepper 
          step={currentStep} 
          completedSteps={completedSteps} 
          steps={steps}
          onStepClick={goToStep}
        />

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="border-theme-error/20 bg-theme-error/10">
            <AlertCircle className="h-4 w-4 text-theme-error" />
            <AlertDescription className="text-theme-error">
              Please complete the following required fields:
              <ul className="mt-1 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Session Status Alert */}
        <Alert className="border-theme-primary/20 bg-theme-primary/5">
          <AlertCircle className="h-4 w-4 text-theme-primary" />
          <AlertDescription className="text-theme-text">
            Your progress is automatically saved. You can return anytime to complete your onboarding.
          </AlertDescription>
        </Alert>

        {renderStepContent()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showErrorModal && (
          <ErrorModal 
            errors={validationErrors} 
            onClose={() => setShowErrorModal(false)} 
          />
        )}
        {showCountyModal && (
          <CountyModal 
            onSelect={(county) => updateOnboardingData('personalInfo', { county })}
            onClose={() => setShowCountyModal(false)}
          />
        )}
        {showCountriesModal && (
          <CountriesModal 
            selectedCountries={onboardingData.kycDetails.countriesWorked}
            onUpdate={(countries) => updateOnboardingData('kycDetails', { countriesWorked: countries })}
            onClose={() => setShowCountriesModal(false)}
          />
        )}
      </AnimatePresence>
    </PortalLayout>
  )
}