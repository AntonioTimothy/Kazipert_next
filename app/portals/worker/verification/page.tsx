// app/portals/worker/verification/page.tsx - UPDATED WITH SESSION MANAGEMENT
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
import { getOnboardingProgress, updateOnboardingProgress, createSession } from '@/lib/verification'

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
  })

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

      setUser(parsedUser)
      
      try {
        // Load verification progress
        const progressData = await getOnboardingProgress(parsedUser.id)
        
        if (progressData) {
          setProgress(progressData)
          setCurrentStep(progressData.currentStep || 1)
          if (progressData.data) {
            const savedData = progressData.data
            setFormData(prev => ({ 
              ...prev, 
              ...savedData,
              // Convert file data back if needed
              sessionId: savedData.sessionId || null
            }))
            setSessionId(savedData.sessionId || null)
          }
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
          })
        }
      } catch (error) {
        console.error("Failed to initialize verification:", error)
        // Start fresh if error
        const newSessionId = await createSession()
        setSessionId(newSessionId)
        setFormData(prev => ({ ...prev, sessionId: newSessionId }))
        setCurrentStep(1)
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
        sessionId: sessionId // Ensure sessionId is always included
      }
      setFormData(updatedData)

      // Save to database with session ID
      await updateOnboardingProgress(user.id, step, updatedData)
      setCurrentStep(step)
      
      if (step === 6) {
        // Redirect to dashboard after completion
        setTimeout(() => {
          router.push('/portals/worker/dashboard')
        }, 3000)
      }
    } catch (error) {
      console.error('Error updating step:', error)
      // Still update the UI even if saving fails
      setCurrentStep(step)
      if (data) {
        setFormData(prev => ({ ...prev, ...data }))
      }
    } finally {
      setSaving(false)
    }
  }

  const steps = [
    { number: 1, title: 'Instructions', component: Step1Instructions },
    { number: 2, title: 'ID Front', component: Step2IdFront },
    { number: 3, title: 'ID Back', component: Step3IdBack },
    { number: 4, title: 'Selfie', component: Step4Selfie },
    { number: 5, title: 'KYC Details', component: Step5KycDetails },
    { number: 6, title: 'Payment', component: Step6Payment },
  ]

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

  const CurrentStepComponent = steps[currentStep - 1].component

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
          {saving && (
            <div className="inline-flex items-center px-4 py-2 rounded-lg mt-4" style={{ backgroundColor: '#e3f2fd', color: KAZIPERT_COLORS.primary }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: KAZIPERT_COLORS.primary }}></div>
              Saving progress...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stepper Sidebar */}
          <div className="lg:col-span-1">
            <VerificationStepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={progress?.completedSteps || []}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}