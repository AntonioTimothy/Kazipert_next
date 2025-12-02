// app/portals/worker/verification/page.tsx - UPDATED WITH SAFETY CHECKS
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VerificationStepper from '@/components/verification/VerificationStepper'
import Step1Instructions from '@/components/verification/steps/Step1Instructions'
import Step2IdFront from '@/components/verification/steps/Step2IdFront'
import Step3IdBack from '@/components/verification/steps/Step3IdBack'
import Step4Selfie from '@/components/verification/steps/Step4Selfie'
import Step5KycDetails from '@/components/verification/steps/Step5KycDetails'
import Step6Payment from '@/components/verification/steps/Step6Payment'
import Step7Completion from '@/components/verification/steps/Step7Completion' // Add completion step
import {
  getOnboardingProgress,
  updateOnboardingProgress,
  createSession,
  finalizeVerification,
  uploadVerificationFile
} from '@/lib/verification'

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82',
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function WorkerVerificationPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    sessionId: null as string | null,
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
    idFrontPath: null as string | null,
    idBackPath: null as string | null,
    selfiePath: null as string | null,
    fullName: '',
    gender: '',
    dateOfBirth: '',
    county: '',
    idNumber: '',
    physicalAddress: '',
    ocrData: {} as any,
    paymentCompleted: false,
    pesapalOrderId: '',
    pesapalTrackingId: '',
  })

  const steps = [
    {
      number: 1,
      title: "Instructions",
      description: "Overview & Fees",
      component: Step1Instructions
    },
    {
      number: 2,
      title: "ID Front",
      description: "Capture Front Side",
      component: Step2IdFront
    },
    {
      number: 3,
      title: "ID Back",
      description: "Capture Back Side",
      component: Step3IdBack
    },
    {
      number: 4,
      title: "Selfie",
      description: "Face Verification",
      component: Step4Selfie
    },
    {
      number: 5,
      title: "Details",
      description: "Personal Info",
      component: Step5KycDetails
    },
    {
      number: 6,
      title: "Payment",
      description: "Processing Fee",
      component: Step6Payment
    },
    {
      number: 7,
      title: "Complete",
      description: "Final Review",
      component: Step7Completion
    },
  ]

  // ✅ SAFE COMPONENT RESOLUTION
  const getCurrentStepComponent = () => {
    // Ensure currentStep is within bounds
    const safeStep = Math.max(1, Math.min(currentStep, steps.length))
    const stepIndex = safeStep - 1

    if (stepIndex >= 0 && stepIndex < steps.length) {
      return steps[stepIndex].component
    }

    // Fallback to first step if invalid
    console.warn(`Invalid step ${currentStep}, falling back to step 1`)
    return steps[0].component
  }

  const CurrentStepComponent = getCurrentStepComponent()

  useEffect(() => {
    const initializeVerification = async () => {
      const userData = sessionStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "EMPLOYER") {
        router.push("/login")
        return
      }

      setUser(parsedUser)

      try {
        // Load verification progress
        const progressData = await getOnboardingProgress(parsedUser.id)

        if (progressData) {
          setProgress(progressData)
          // ✅ SAFE STEP SETTING - ensure step is within bounds
          const safeStep = Math.max(1, Math.min(progressData.currentStep || 1, steps.length))
          setCurrentStep(safeStep)

          // Set completed steps
          if (progressData.completedSteps && Array.isArray(progressData.completedSteps)) {
            setCompletedSteps(progressData.completedSteps)
          } else {
            setCompletedSteps([1])
          }

          // Restore saved data from progress
          if (progressData.data) {
            const savedData = progressData.data
            setFormData(prev => ({
              ...prev,
              ...savedData,
              sessionId: savedData.sessionId || null
            }))
            setSessionId(savedData.sessionId || null)
          }
        } else {
          setCompletedSteps([1])
        }

        // Create session if doesn't exist
        if (!progressData?.data?.sessionId) {
          const newSessionId = await createSession()
          setSessionId(newSessionId)
          setFormData(prev => ({ ...prev, sessionId: newSessionId }))

          // Save initial session to database
          await updateOnboardingProgress(parsedUser.id, 1, {
            sessionId: newSessionId,
            currentStep: 1
          }, [1])
        }
      } catch (error) {
        console.error("Failed to initialize verification:", error)
        // Start fresh if error
        const newSessionId = await createSession()
        setSessionId(newSessionId)
        setFormData(prev => ({ ...prev, sessionId: newSessionId }))
        setCurrentStep(1)
        setCompletedSteps([1])
      }

      setLoading(false)
    }

    initializeVerification()
  }, [router])

  const updateStep = async (step: number, data?: any) => {
    if (!user) return

    setSaving(true)
    try {
      const updatedData = {
        ...formData,
        ...data,
        sessionId: sessionId
      }
      setFormData(updatedData)

      // ✅ SAFE STEP SAVING - ensure step is within bounds
      const safeStep = Math.max(1, Math.min(step, steps.length))

      // Update completed steps - mark current step as completed
      const newCompletedSteps = [...completedSteps]
      if (!newCompletedSteps.includes(currentStep)) {
        newCompletedSteps.push(currentStep)
        setCompletedSteps(newCompletedSteps)
      }

      await updateOnboardingProgress(user.id, safeStep, updatedData, newCompletedSteps)
      setCurrentStep(safeStep)
      window.scrollTo(0, 0)

      // ✅ Handle completion (step 7)
      if (safeStep === steps.length) {
        console.log('Finalizing employer verification...')
        try {
          const result = await finalizeVerification(sessionId!, updatedData, {
            pesapalOrderId: updatedData.pesapalOrderId,
            pesapalTrackingId: updatedData.pesapalTrackingId
          })

          if (result.success) {
            console.log('✅ Employer verification finalized successfully!')
            
            // Update user in session storage
            const userData = sessionStorage.getItem("user")
            if (userData) {
              const userObj = JSON.parse(userData)
              userObj.verified = true
              userObj.onboardingCompleted = true
              userObj.fullName = updatedData.fullName
              userObj.firstName = updatedData.fullName?.split(' ')[0]
              userObj.lastName = updatedData.fullName?.split(' ').slice(1).join(' ')
              sessionStorage.setItem("user", JSON.stringify(userObj))
            }

            // Dispatch event to update layout
            window.dispatchEvent(new Event('kazipert-verification-updated'))
          } else {
            console.error('❌ Finalization failed:', result.message)
          }
        } catch (error) {
          console.error('❌ Error finalizing verification:', error)
        }
      }
    } catch (error) {
      console.error('Error updating step:', error)
      // Still update the UI even if saving fails
      const safeStep = Math.max(1, Math.min(step, steps.length))
      setCurrentStep(safeStep)
      if (data) {
        setFormData(prev => ({ ...prev, ...data }))
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: KAZIPERT_COLORS.background }}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: KAZIPERT_COLORS.primary }}></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: KAZIPERT_COLORS.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-3xl font-bold mb-2" style={{ color: KAZIPERT_COLORS.text }}>
            Identity Verification
          </h1>
          <p className="text-lg" style={{ color: KAZIPERT_COLORS.textLight }}>
            Complete these steps to verify your identity and start using Kazipert
          </p>
          {saving && (
            <div className="inline-flex items-center px-4 py-2 rounded-lg mt-4" style={{ backgroundColor: '#e3f2fd', color: KAZIPERT_COLORS.primary }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: KAZIPERT_COLORS.primary }}></div>
              Saving progress...
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Stepper at Top */}
          <VerificationStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (completedSteps.includes(step) || step === currentStep || completedSteps.includes(step - 1)) {
                setCurrentStep(step)
              }
            }}
            completedSteps={completedSteps}
          />

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <CurrentStepComponent
              formData={formData}
              updateStep={updateStep}
              currentStep={currentStep}
              sessionId={sessionId}
              role="EMPLOYER"
            />
          </div>
        </div>
      </div>
    </div>
  )
}