// components/verification/VerificationStepper.tsx
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface VerificationStepperProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (stepIndex: number) => void;
  completedSteps?: number[];
}

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82',
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
};

export default function VerificationStepper({ currentStep, steps, onStepClick, completedSteps }: VerificationStepperProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps
                ? completedSteps.includes(stepNumber)
                : stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              const isClickable = isCompleted || isCurrent || (completedSteps && completedSteps.includes(stepNumber - 1));

              return (
                <div key={index} className={cn("flex items-center", index !== steps.length - 1 ? "flex-1" : "")}>
                  <div
                    className={cn(
                      "relative flex items-center justify-center",
                      isClickable ? "cursor-pointer" : "cursor-default"
                    )}
                    onClick={() => isClickable && onStepClick?.(stepNumber)}
                  >
                    {/* Step Circle */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-sm z-10",
                        isCompleted
                          ? "bg-primary border-primary text-white"
                          : isCurrent
                            ? "bg-white border-primary text-primary ring-4 ring-primary/10"
                            : "bg-white border-gray-200 text-gray-400"
                      )}
                      style={{
                        backgroundColor: isCompleted ? KAZIPERT_COLORS.primary : 'white',
                        borderColor: isCompleted || isCurrent ? KAZIPERT_COLORS.primary : '#e2e8f0',
                        color: isCompleted ? 'white' : (isCurrent ? KAZIPERT_COLORS.primary : '#cbd5e0')
                      }}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold">{stepNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index !== steps.length - 1 && (
                    <div className="flex-1 mx-2 h-[2px] bg-gray-100 relative">
                      <div
                        className="absolute inset-0 transition-all duration-500 ease-out"
                        style={{
                          width: isCompleted ? '100%' : '0%',
                          backgroundColor: KAZIPERT_COLORS.primary
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}