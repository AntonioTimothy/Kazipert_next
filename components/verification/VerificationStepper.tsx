// components/verification/VerificationStepper.tsx - UPDATED
interface Step {
  number: number;
  title: string;
}

interface VerificationStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  sessionId?: string | null;
}

export default function VerificationStepper({
  steps,
  currentStep,
  completedSteps,
  sessionId,
}: VerificationStepperProps) {
  const KAZIPERT_COLORS = {
    primary: '#117c82',
    secondary: '#117c82', 
    accent: '#6c71b5',
    background: '#f8fafc',
    text: '#1a202c',
    textLight: '#718096',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
      <h3 className="text-lg font-semibold mb-6" style={{ color: KAZIPERT_COLORS.text }}>
        Verification Steps
      </h3>
      
      {/* Session Info */}
      {sessionId && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Session ID:</p>
          <p className="text-xs font-mono text-gray-800 truncate">{sessionId}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-start space-x-3">
              {/* Step Indicator */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                  >
                    <span className="text-sm font-medium text-white">{step.number}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{step.number}</span>
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-green-600' :
                  isCurrent ? 'text-green-700' :
                  'text-gray-500'
                }`}>
                  Step {step.number}
                </p>
                <p className={`text-base font-semibold ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                
                {/* Connecting Line */}
                {step.number < steps.length && (
                  <div className={`ml-4 mt-2 w-0.5 h-8 ${
                    completedSteps.includes(step.number + 1) || currentStep > step.number
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: KAZIPERT_COLORS.background }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: KAZIPERT_COLORS.primary }}>Progress</span>
          <span className="text-sm font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
            {completedSteps.length}/{steps.length}
          </span>
        </div>
        <div className="w-full bg-green-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(completedSteps.length / steps.length) * 100}%`,
              backgroundColor: KAZIPERT_COLORS.primary
            }}
          />
        </div>
      </div>
    </div>
  );
}