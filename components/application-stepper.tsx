// components/application-stepper.tsx
import { CheckCircle, Clock, AlertCircle, FileText, Plane, Stethoscope, UserCheck, Shield, Home, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ApplicationStep {
  key: string
  label: string
  description: string
  icon: any
  employerAction?: string
  employeeAction?: string
}

interface ApplicationStepperProps {
  currentStep: string
  application: any
  role: 'employer' | 'employee'
  onAction?: (step: string, data?: any) => void
}

const APPLICATION_STEPS: ApplicationStep[] = [
  {
    key: 'APPLICATION_SUBMITTED',
    label: 'Application Submitted',
    description: 'Application has been submitted and is under review',
    icon: FileText
  },
  {
    key: 'UNDER_REVIEW',
    label: 'Under Review',
    description: 'Employer is reviewing your application',
    icon: Clock,
    employerAction: 'Review Application'
  },
  {
    key: 'SHORTLISTED',
    label: 'Shortlisted',
    description: 'You have been shortlisted for this position',
    icon: UserCheck,
    employerAction: 'Shortlist Candidate'
  },
  {
    key: 'INTERVIEW_SCHEDULED',
    label: 'Interview Scheduled',
    description: 'Interview has been scheduled with the employer',
    icon: Clock,
    employerAction: 'Schedule Interview'
  },
  {
    key: 'MEDICAL_REQUESTED',
    label: 'Medical Checkup',
    description: 'Medical examination is required',
    icon: Stethoscope,
    employerAction: 'Request Medical',
    employeeAction: 'Upload Medical'
  },
  {
    key: 'MEDICAL_SUBMITTED',
    label: 'Medical Submitted',
    description: 'Medical documents have been submitted',
    icon: Stethoscope
  },
  {
    key: 'MEDICAL_APPROVED',
    label: 'Medical Approved',
    description: 'Medical documents have been approved',
    icon: CheckCircle
  },
  {
    key: 'CONTRACT_SENT',
    label: 'Contract Sent',
    description: 'Employment contract has been sent for signing',
    icon: FileText,
    employerAction: 'Send Contract',
    employeeAction: 'Sign Contract'
  },
  {
    key: 'CONTRACT_SIGNED',
    label: 'Contract Signed',
    description: 'Contract has been signed by both parties',
    icon: UserCheck
  },
  {
    key: 'VISA_APPLIED',
    label: 'Visa Applied',
    description: 'Visa application has been submitted',
    icon: Shield
  },
  {
    key: 'VISA_APPROVED',
    label: 'Visa Approved',
    description: 'Visa has been approved',
    icon: CheckCircle
  },
  {
    key: 'FLIGHT_TICKET_SENT',
    label: 'Flight Ticket',
    description: 'Flight ticket has been arranged',
    icon: Plane,
    employerAction: 'Upload Flight Ticket',
    employeeAction: 'View Flight Ticket'
  },
  {
    key: 'FLIGHT_TICKET_RECEIVED',
    label: 'Ticket Received',
    description: 'Flight ticket has been received',
    icon: Plane
  },
  {
    key: 'DEPLOYMENT_READY',
    label: 'Ready for Deployment',
    description: 'All processes completed, ready to start',
    icon: Home
  }
]

export function ApplicationStepper({ currentStep, application, role, onAction }: ApplicationStepperProps) {
  const currentStepIndex = APPLICATION_STEPS.findIndex(step => step.key === currentStep)

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'current'
    return 'upcoming'
  }

  const getStepIcon = (step: ApplicationStep, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (status === 'current') {
      return <step.icon className="h-5 w-5 text-blue-500" />
    }
    return <step.icon className="h-5 w-5 text-gray-400" />
  }

  const canPerformAction = (step: ApplicationStep, status: string) => {
    if (status !== 'current') return false
    if (role === 'employer' && step.employerAction) return true
    if (role === 'employee' && step.employeeAction) return true
    return false
  }

  const handleAction = (step: ApplicationStep) => {
    if (role === 'employer' && step.employerAction && onAction) {
      onAction(step.key)
    } else if (role === 'employee' && step.employeeAction && onAction) {
      onAction(step.key)
    }
  }

  return (
    <div className="space-y-4">
      {APPLICATION_STEPS.map((step, index) => {
        const status = getStepStatus(index)
        const isCompleted = status === 'completed'
        const isCurrent = status === 'current'

        return (
          <div key={step.key} className="flex items-start space-x-4">
            {/* Step Connector */}
            {index > 0 && (
              <div className={`w-0.5 h-8 ml-5 -my-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
            )}

            <div className="flex items-start space-x-4 flex-1">
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100' :
                  isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                {getStepIcon(step, status)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-medium ${isCompleted ? 'text-green-900' :
                      isCurrent ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                    {step.label}
                  </h4>

                  {isCurrent && (
                    <Badge variant={role === 'employer' ? 'default' : 'secondary'} className="text-xs">
                      {role === 'employer' ? 'Action Required' : 'Pending'}
                    </Badge>
                  )}

                  {isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      Completed
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>

                {/* Show timestamps when available */}
                {application[`${step.key.toLowerCase()}At`] && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(application[`${step.key.toLowerCase()}At`]).toLocaleDateString()}
                  </p>
                )}

                {/* Action Button */}
                {canPerformAction(step, status) && onAction && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAction(step)}
                  >
                    {role === 'employer' ? step.employerAction : step.employeeAction}
                  </Button>
                )}

                {/* Document Status */}
                {step.key === 'MEDICAL_REQUESTED' && application.medicalSubmitted && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 mt-2">
                    Medical Document Submitted
                  </Badge>
                )}

                {step.key === 'FLIGHT_TICKET_SENT' && application.flightTicketSent && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 mt-2">
                    Flight Ticket Uploaded
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}