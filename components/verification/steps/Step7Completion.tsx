// components/verification/steps/Step7Completion.tsx - UPDATED
import { useEffect, useState } from 'react'
import { CheckCircle, Briefcase, LayoutDashboard, PartyPopper } from 'lucide-react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'

interface Step7CompletionProps {
  formData: any
  updateStep: (step: number, data?: any) => void
  currentStep: number
  sessionId: string | null
  role?: string
  finalizing?: boolean
  user?: any
}

export default function Step7Completion({ formData, updateStep, currentStep, sessionId, role, finalizing, user }: Step7CompletionProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    // Dispatch event to update layout
    window.dispatchEvent(new Event('kazipert-verification-updated'));

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-8">
      <div className="mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
          <div className="w-32 h-32 bg-green-400 rounded-full"></div>
        </div>
        <div className="relative z-10 bg-white rounded-full p-4 inline-block shadow-xl">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </div>
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
        Verification Successful!
      </h2>

      <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
        Congratulations! Your identity has been verified. You are now a trusted member of the Kazipert community.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto mb-8 shadow-sm">
        <h3 className="font-bold text-green-800 mb-4 flex items-center justify-center gap-2">
          <PartyPopper className="w-5 h-5" />
          You're All Set!
        </h3>
        <ul className="text-green-700 text-left space-y-3">
          <li className="flex items-center gap-2">
            <span className="bg-green-200 text-green-700 rounded-full p-1"><CheckCircle className="w-3 h-3" /></span>
            <span>Your profile is now verified</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="bg-green-200 text-green-700 rounded-full p-1"><CheckCircle className="w-3 h-3" /></span>
            <span>You can start applying for jobs immediately</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="bg-green-200 text-green-700 rounded-full p-1"><CheckCircle className="w-3 h-3" /></span>
            <span>Employers can now trust your identity</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
        <button
          onClick={() => router.push(role === 'EMPLOYER' ? '/portals/employer/dashboard' : '/portals/worker/dashboard')}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <LayoutDashboard className="w-5 h-5" />
          Go to Dashboard
        </button>

        <button
          onClick={() => router.push(role === 'EMPLOYER' ? '/portals/employer/jobs/create' : '/portals/worker/jobs')}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Briefcase className="w-5 h-5" />
          {role === 'EMPLOYER' ? 'Post a Job' : 'Browse Jobs'}
        </button>
      </div>

      {finalizing && (
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Finalizing your account setup...</p>
        </div>
      )}
    </div>
  )
}