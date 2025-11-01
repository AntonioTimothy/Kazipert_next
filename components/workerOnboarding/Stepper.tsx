"use client"

import { Fragment } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
  icon: any
  description: string
}

interface StepperProps {
  step: number
  completedSteps: number[]
  steps: Step[]
  onStepClick: (step: number) => void
}

export default function Stepper({ step, completedSteps, steps, onStepClick }: StepperProps) {
  return (
    <div className="relative mb-6">
      <div className="flex justify-between items-center">
        {steps.map((s, i) => {
          const stepNumber = i + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = step === stepNumber
          const isIncomplete = stepNumber > step && !isCompleted

          return (
            <Fragment key={i}>
              <div className="flex flex-col items-center z-10">
                <button
                  onClick={() => onStepClick(stepNumber)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-xs transition-all duration-300 relative",
                    isCompleted
                      ? "bg-theme-success border-theme-success text-white shadow-md"
                      : isCurrent
                        ? "border-theme-primary bg-theme-background text-theme-text"
                        : isIncomplete
                          ? "border-theme-error/30 bg-theme-error/10 text-theme-error"
                          : "border-theme-border bg-theme-background text-theme-text-muted"
                  )}
                >
                  {isCompleted ? <CheckCircle size={14} /> : stepNumber}
                </button>
                <span className={cn(
                  "text-xs font-medium transition-colors mt-1 text-center",
                  isCompleted ? "text-theme-success" :
                    isCurrent ? "text-theme-text" :
                      isIncomplete ? "text-theme-error" :
                        "text-theme-text-muted"
                )}>
                  {s.title}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-1 transition-all duration-500",
                  isCompleted ? "bg-theme-success" :
                    stepNumber < step ? "bg-theme-primary" :
                      "bg-theme-border"
                )} />
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}