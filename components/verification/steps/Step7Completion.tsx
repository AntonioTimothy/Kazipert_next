// components/verification/steps/Step7Completion.tsx
import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface Step7CompletionProps {
  formData: any
  updateStep: (step: number, data?: any) => void
  currentStep: number
  sessionId: string | null
}

export default function Step7Completion({ formData, updateStep, currentStep, sessionId }: Step7CompletionProps) {
  useEffect(() => {
    // Auto-redirect after showing completion message
    const timer = setTimeout(() => {
      // You can redirect here or let the parent component handle it
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="text-center py-8">
      <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Verification Complete!
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Thank you for completing the verification process. Your account is now being verified.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
        <ul className="text-green-700 text-left space-y-2">
          <li>• Your documents are being reviewed</li>
          <li>• You'll receive a confirmation email</li>
          <li>• You can start applying for jobs immediately</li>
        </ul>
      </div>
      <div className="mt-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}