"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import { useTheme } from '@/contexts/ThemeContext'

interface ErrorModalProps {
  errors: string[]
  onClose: () => void
}

export default function ErrorModal({ errors, onClose }: ErrorModalProps) {
  const { currentTheme } = useTheme()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-theme-background rounded-2xl shadow-2xl max-w-md w-full animate-theme-transition">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-theme-error" />
            <div>
              <h2 className="text-xl font-bold text-theme-text">Validation Errors</h2>
              <p className="text-theme-text-muted text-sm mt-1">Please fix the following errors to continue:</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-theme-error/10 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {errors.map((error, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-theme-error/20 bg-theme-error/5">
                <div className="h-2 w-2 rounded-full bg-theme-error mt-2 flex-shrink-0" />
                <p className="text-sm text-theme-error flex-1">{error}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-theme-border">
          <Button
            onClick={onClose}
            className="w-full"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  )
}