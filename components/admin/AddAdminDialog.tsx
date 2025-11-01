"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building, Shield, CheckCircle, Mail, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddAdminDialogProps {
  onAdminAdded: () => void
}

const userRoles = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full system access and management",
    icon: Shield,
    color: "bg-red-100 text-red-700"
  },
  {
    value: "HOSPITAL_ADMIN",
    label: "Hospital Admin",
    description: "Manage medical records and certifications",
    icon: Building,
    color: "bg-blue-100 text-blue-700"
  },
  {
    value: "PHOTO_STUDIO_ADMIN",
    label: "Photo Studio Admin",
    description: "Upload and manage professional photos",
    icon: User,
    color: "bg-purple-100 text-purple-700"
  },
  {
    value: "EMBASSY_ADMIN",
    label: "Embassy Admin",
    description: "View analytics and system reports",
    icon: User,
    color: "bg-green-100 text-green-700"
  }
]

export function AddAdminDialog({ onAdminAdded }: AddAdminDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    permissions: [] as string[]
  })

  const EnhancedStepper = () => {
    const steps = [
      { number: 1, title: "Personal Info", description: "Basic information", icon: User },
      { number: 2, title: "Company Details", description: "Partner organization", icon: Building },
      { number: 3, title: "Role Setup", description: "Access levels", icon: Shield },
      { number: 4, title: "Confirmation", description: "Review details", icon: CheckCircle }
    ]

    return (
      <div className="relative mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          {steps.map((stepItem, index) => {
            const StepIcon = stepItem.icon
            const isCompleted = step > stepItem.number
            const isCurrent = step === stepItem.number
            
            return (
              <div key={stepItem.number} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center text-center min-w-[100px]">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 font-semibold transition-all duration-500 relative z-10",
                    isCompleted && "bg-green-500 border-green-500 text-white scale-110 shadow-lg",
                    isCurrent && "bg-[#f5c849] border-[#f5c849] text-amber-900 scale-110 shadow-lg",
                    !isCompleted && !isCurrent && "border-amber-200 bg-amber-50 text-amber-400"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <StepIcon className={cn("h-5 w-5", isCurrent ? "text-amber-900" : "text-amber-400")} />
                    )}
                    <div className={cn(
                      "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                      isCompleted && "bg-green-600 text-white",
                      isCurrent && "bg-amber-600 text-white",
                      !isCompleted && !isCurrent && "bg-amber-200 text-amber-600"
                    )}>
                      {stepItem.number}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={cn(
                      "text-sm font-semibold transition-colors",
                      isCompleted && "text-green-700",
                      isCurrent && "text-amber-900",
                      !isCompleted && !isCurrent && "text-amber-500"
                    )}>
                      {stepItem.title}
                    </div>
                    <div className={cn(
                      "text-xs transition-colors hidden sm:block",
                      isCompleted && "text-green-600",
                      isCurrent && "text-amber-600",
                      !isCompleted && !isCurrent && "text-amber-400"
                    )}>
                      {stepItem.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "hidden sm:block flex-1 h-1 mx-4 transition-all duration-500",
                    isCompleted ? "bg-green-400" : "bg-amber-200"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create admin')
      }

      onAdminAdded()
      setOpen(false)
      setStep(1)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        permissions: []
      })
    } catch (error) {
      console.error('Error creating admin:', error)
      // Handle error (show toast notification)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#f5c849] hover:bg-amber-500 text-amber-900 font-semibold shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-900 flex items-center gap-2 text-xl">
            <User className="h-6 w-6" />
            Add New Administrator
          </DialogTitle>
          <DialogDescription className="text-base">
            Create a new administrator account with specific permissions and access levels.
          </DialogDescription>
        </DialogHeader>

        <EnhancedStepper />

        {/* Step content would go here */}
        {/* Similar to your existing step content but integrated with API */}

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="w-full sm:w-auto border-amber-200 text-amber-700"
          >
            Previous
          </Button>
          <Button
            className="bg-[#f5c849] hover:bg-amber-500 text-amber-900 font-semibold w-full sm:w-auto"
            onClick={step === 4 ? handleSubmit : () => setStep(step + 1)}
            disabled={loading}
          >
            {loading ? (
              "Creating..."
            ) : step === 4 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Admin Account
              </>
            ) : (
              "Next Step"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}