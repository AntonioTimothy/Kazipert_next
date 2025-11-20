// components/verification/VerificationStepper.tsx - IMPROVED VERSION
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

  // Debug log to check what steps are completed
  console.log('Stepper Debug:', {
    currentStep,
    completedSteps,
    stepsCount: steps.length
  })

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
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const isUpcoming = step.number > currentStep && !isCompleted;

          console.log(`Step ${step.number}:`, {
            isCompleted,
            isCurrent,
            isUpcoming,
            inCompletedArray: completedSteps.includes(step.number)
          })

          return (
            <div key={step.number} className="flex items-start space-x-3">
              {/* Step Indicator */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                  >
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                  >
                    <span className="text-sm font-medium text-white">{step.number}</span>
                  </div>
                ) : (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                    style={{ 
                      backgroundColor: isUpcoming ? 'transparent' : '#f3f4f6',
                      borderColor: isUpcoming ? '#d1d5db' : 'transparent'
                    }}
                  >
                    <span 
                      className="text-sm font-medium"
                      style={{ 
                        color: isUpcoming ? '#9ca3af' : KAZIPERT_COLORS.textLight
                      }}
                    >
                      {step.number}
                    </span>
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
                <p className={`text-base font-semibold transition-colors duration-300 ${
                  isCompleted ? 'text-gray-900' : 
                  isCurrent ? 'text-gray-900' : 
                  'text-gray-400'
                }`}>
                  {step.title}
                </p>
                
                {/* Status Indicator */}
                <div className="mt-1">
                  {isCompleted && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                      In Progress
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-xs text-gray-500">Upcoming</span>
                  )}
                </div>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`ml-4 mt-3 w-0.5 h-6 transition-all duration-500 ${
                      completedSteps.includes(step.number + 1) ? 'bg-green-500' :
                      currentStep > step.number ? 'bg-green-300' :
                      'bg-gray-200'
                    }`} 
                  />
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
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(completedSteps.length / steps.length) * 100}%`,
              backgroundColor: KAZIPERT_COLORS.primary
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          {completedSteps.length === steps.length 
            ? 'Verification Complete! 🎉' 
            : `${Math.round((completedSteps.length / steps.length) * 100)}% completed`
          }
        </p>
      </div>
    </div>
  );
}