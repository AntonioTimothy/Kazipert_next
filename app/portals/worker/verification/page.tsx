// app/portals/worker/verification/page.tsx - UPDATED WITH ERROR HANDLING
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
import Step7Completion from '@/components/verification/steps/Step7Completion'
import { getOnboardingProgress, updateOnboardingProgress, createSession, finalizeVerification, uploadVerificationFile } from '@/lib/verification'

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
  const [finalizing, setFinalizing] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState({
    sessionId: null as string | null,
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
    fullName: '',
    gender: '',
    dateOfBirth: '',
    county: '',
    idNumber: '',
    physicalAddress: '',
    ocrData: {} as any,
    paymentCompleted: false,
    mpesaNumber: '',
    transactionCode: '',
  })

  const steps = [
    { number: 1, title: 'Instructions', component: Step1Instructions },
    { number: 2, title: 'ID Front', component: Step2IdFront },
    { number: 3, title: 'ID Back', component: Step3IdBack },
    { number: 4, title: 'Selfie', component: Step4Selfie },
    { number: 5, title: 'KYC Details', component: Step5KycDetails },
    { number: 6, title: 'Payment', component: Step6Payment },
    { number: 7, title: 'Completion', component: Step7Completion },
  ]

  const getCurrentStepComponent = () => {
    const safeStep = Math.max(1, Math.min(currentStep, steps.length))
    const stepIndex = safeStep - 1
    
    if (stepIndex >= 0 && stepIndex < steps.length) {
      return steps[stepIndex].component
    }
    
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
      if (parsedUser.role !== "EMPLOYEE") {
        router.push("/login")
        return
      }

      // Check if user is already verified
      if (parsedUser.verified && parsedUser.onboardingCompleted) {
        router.push('/portals/worker/dashboard')
        return
      }

      setUser(parsedUser)
      
      try {
        // Load verification progress with error handling
        let progressData;
        try {
          progressData = await getOnboardingProgress(parsedUser.id)
          console.log('📊 Loaded progress data:', progressData)
        } catch (error) {
          console.warn('⚠️ Could not load progress, using default:', error)
          progressData = {
            currentStep: 1,
            completed: false,
            data: {},
            completedSteps: [1]
          }
        }
        
        if (progressData) {
          setProgress(progressData)
          const safeStep = Math.max(1, Math.min(progressData.currentStep || 1, steps.length))
          setCurrentStep(safeStep)
          
          // Set completed steps from progress data
          if (progressData.completedSteps && Array.isArray(progressData.completedSteps)) {
            setCompletedSteps(progressData.completedSteps)
          } else {
            // Initialize with step 1 completed by default
            setCompletedSteps([1])
          }
          
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
          // Initialize with step 1 completed for new users
          setCompletedSteps([1])
        }

        // Create session if doesn't exist
        if (!progressData?.data?.sessionId) {
          const newSessionId = await createSession()
          setSessionId(newSessionId)
          setFormData(prev => ({ ...prev, sessionId: newSessionId }))
          
          try {
            await updateOnboardingProgress(parsedUser.id, 1, {
              sessionId: newSessionId,
              currentStep: 1
            }, [1]) // Mark step 1 as completed
          } catch (error) {
            console.warn('⚠️ Could not save initial progress:', error)
            // Continue anyway - we'll try to save again later
          }
        }
      } catch (error) {
        console.error("Failed to initialize verification:", error)
        const newSessionId = await createSession()
        setSessionId(newSessionId)
        setFormData(prev => ({ ...prev, sessionId: newSessionId }))
        setCurrentStep(1)
        setCompletedSteps([1]) // Initialize with step 1 completed
      }
      
      setLoading(false)
    }

    initializeVerification()
  }, [router])

  const updateCompletedSteps = (step: number) => {
    setCompletedSteps(prev => {
      if (!prev.includes(step)) {
        return [...prev, step]
      }
      return prev
    })
  }

  const handleFinalizeVerification = async () => {
    if (!user || !sessionId) return

    setFinalizing(true)
    try {
      console.log('Finalizing verification...')
      
      // Upload files first if they exist
      const uploadPromises = []
      if (formData.idFront) {
        uploadPromises.push(
          uploadVerificationFile(formData.idFront, 'idFront', user.id)
        )
      }
      if (formData.idBack) {
        uploadPromises.push(
          uploadVerificationFile(formData.idBack, 'idBack', user.id)
        )
      }
      if (formData.selfie) {
        uploadPromises.push(
          uploadVerificationFile(formData.selfie, 'selfie', user.id)
        )
      }

      // Wait for all file uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises)
      }

      // Finalize verification in backend
      const result = await finalizeVerification(sessionId, formData, {
        mpesaNumber: formData.mpesaNumber,
        transactionCode: formData.transactionCode
      })

      if (result.success) {
        console.log('Verification finalized successfully!')
        
        // Update user in session storage
        const userData = sessionStorage.getItem("user")
        if (userData) {
          const userObj = JSON.parse(userData)
          userObj.verified = true
          userObj.onboardingCompleted = true
          userObj.fullName = formData.fullName
          userObj.firstName = formData.fullName?.split(' ')[0]
          userObj.lastName = formData.fullName?.split(' ').slice(1).join(' ')
          sessionStorage.setItem("user", JSON.stringify(userObj))
        }

        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          router.push('/portals/worker/dashboard')
        }, 3000)
      } else {
        throw new Error(result.message || 'Failed to finalize verification')
      }
    } catch (error) {
      console.error('Error finalizing verification:', error)
      alert('Failed to complete verification. Please try again.')
    } finally {
      setFinalizing(false)
    }
  }

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

      const safeStep = Math.max(1, Math.min(step, steps.length))
      
      // Update completed steps - mark current step as completed when moving to next step
      const newCompletedSteps = [...completedSteps]
      if (!newCompletedSteps.includes(safeStep)) {
        newCompletedSteps.push(safeStep)
        setCompletedSteps(newCompletedSteps)
      }
      
      // Update progress with error handling
      try {
        await updateOnboardingProgress(user.id, safeStep, updatedData, newCompletedSteps)
        console.log('✅ Progress saved for step:', safeStep)
      } catch (error) {
        console.warn('⚠️ Could not save progress, continuing:', error)
        // Continue even if saving fails - we don't want to block the user
      }
      
      setCurrentStep(safeStep)
      
      // Handle completion - finalize verification
      if (safeStep === steps.length) {
        await handleFinalizeVerification()
      }
    } catch (error) {
      console.error('Error updating step:', error)
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
          <p className="ml-3 text-gray-600">Loading verification...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: KAZIPERT_COLORS.background }}>
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">User not found</div>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: KAZIPERT_COLORS.primary }}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: KAZIPERT_COLORS.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: KAZIPERT_COLORS.text }}>
            Identity Verification
          </h1>
          <p className="text-lg" style={{ color: KAZIPERT_COLORS.textLight }}>
            Complete these steps to verify your identity and start using Kazipert
          </p>
          {(saving || finalizing) && (
            <div className="inline-flex items-center px-4 py-2 rounded-lg mt-4" style={{ backgroundColor: '#e3f2fd', color: KAZIPERT_COLORS.primary }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: KAZIPERT_COLORS.primary }}></div>
              {finalizing ? 'Finalizing verification...' : 'Saving progress...'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stepper Sidebar */}
          <div className="lg:col-span-1">
            <VerificationStepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              sessionId={sessionId}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <CurrentStepComponent
                formData={formData}
                updateStep={updateStep}
                currentStep={currentStep}
                sessionId={sessionId}
                finalizing={finalizing}
              />
            </div>
          </div>
        </div>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <details>
              <summary className="cursor-pointer font-semibold">Debug Info</summary>
              <div className="mt-2 text-sm">
                <p><strong>Current Step:</strong> {currentStep}</p>
                <p><strong>Completed Steps:</strong> [{completedSteps.join(', ')}]</p>
                <p><strong>Session ID:</strong> {sessionId}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}