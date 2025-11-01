"use client"

import React, { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  User,
  Briefcase,
  FileText,
  CreditCard,
  MessageSquare,
  Video,
  Award,
  Shield,
  Star,
  CheckCircle,
  Upload,
  Camera,
  Heart,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  IdCard,
  Globe,
  GraduationCap,
  Languages,
  BookOpen,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { WorkerProfile } from "@/lib/mock-data"

// Mock user data
const MOCK_USER: WorkerProfile = {
  id: "user_123",
  email: "amina.hassan@email.com",
  phone: "+254712345678",
  fullName: "Amina Hassan",
  firstName: "Amina",
  lastName: "Hassan",
  role: "worker",
  gender: "female",
  country: "Kenya",
  verified: false,
  emailVerified: true,
  phoneVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const navigation = [
  { name: "Dashboard", href: "/worker/dashboard", icon: Home },
  { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
  { name: "My Applications", href: "/worker/contracts", icon: FileText },
  { name: "Wallet", href: "/worker/payments", icon: CreditCard },
  { name: "Services", href: "/worker/services", icon: Shield },
  { name: "Training", href: "/worker/training", icon: Video },
  { name: "Reviews", href: "/worker/reviews", icon: Star },
  { name: "Support", href: "/worker/support", icon: MessageSquare },
]

export default function WorkerOnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [faceVerified, setFaceVerified] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  
  const [onboardingData, setOnboardingData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      county: "",
      physicalAddress: "",
      emergencyContactName: "",
      emergencyContactPhone: ""
    },
    kycDetails: {
      idNumber: "",
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      kraPin: "",
      maritalStatus: "",
      workExperience: "",
      skills: [] as string[],
      languages: {
        english: "",
        arabic: ""
      }
    },
    documents: {},
    studioSession: {
      studioName: "",
      studioLocation: "",
      photos: [] as string[]
    },
    medical: {
      hospitalName: "",
      testDate: "",
      fitToWork: false,
      medicalDocument: null as File | null
    }
  })

  const totalSteps = 6

  const steps = [
    { number: 1, title: "Personal Info", icon: User, description: "Basic information & contact" },
    { number: 2, title: "KYC Details", icon: IdCard, description: "Identity verification" },
    { number: 3, title: "Documents", icon: FileText, description: "Upload required documents" },
    { number: 4, title: "Studio Photos", icon: Camera, description: "Professional photos & face recognition" },
    { number: 5, title: "Medical Check", icon: Heart, description: "Health examination" },
    { number: 6, title: "Review", icon: CheckCircle, description: "Final review & submit" },
  ]

  useEffect(() => {
    // Simulate user loading
    const timer = setTimeout(() => {
      // setUser(MOCK_USER)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // actual user 

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
  }, [router])

  const loadProgress = async () => {
    try {
      // Simulate API call to load progress
      const savedStep = localStorage.getItem('onboardingStep')
      if (savedStep) {
        setCurrentStep(parseInt(savedStep))
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  const saveProgress = async (step: number) => {
    try {
      setSaving(true)
      localStorage.setItem('onboardingStep', step.toString())
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Failed to save progress:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateOnboardingData = (section: string, updates: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...updates }
    }))
  }

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!file) return false

    try {
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }))
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      setUploadProgress(prev => ({ ...prev, [documentType]: 100 }))
      return true
    } catch (error) {
      console.error('Upload failed:', error)
      return false
    }
  }

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      const nextStepNum = currentStep + 1
      setCurrentStep(nextStepNum)
      await saveProgress(nextStepNum)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const simulateFaceRecognition = async () => {
    setSaving(true)
    setTimeout(() => {
      setFaceVerified(true)
      setSaving(false)
    }, 3000)
  }

  const progress = (currentStep / totalSteps) * 100

  const Stepper = ({ step }: { step: number }) => {
    const totalSteps = steps.length
    
    return (
      <div className="relative mb-6">
        <div className="flex justify-between items-center">
          {steps.map((s, i) => (
            <Fragment key={i}>
              <div className="flex flex-col items-center z-10">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-xs transition-all duration-300 relative",
                  i < step 
                    ? "bg-[#FFD700] border-[#FFD700] text-gray-900 shadow-md" 
                    : i === step
                    ? "border-[#FFD700] bg-white text-gray-700"
                    : "border-gray-300 bg-white text-gray-400"
                )}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors mt-1",
                  i <= step ? "text-gray-800" : "text-gray-400"
                )}>
                  {s.title}
                </span>
              </div>
              
              {i < totalSteps - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-1 transition-all duration-500",
                  i < step ? "bg-[#FFD700]" : "bg-gray-300"
                )} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    )
  }

  const FileUploadField = ({ 
    id, 
    label, 
    required, 
    accept = "image/*,.pdf",
    onFileSelect 
  }: {
    id: string
    label: string
    required: boolean
    accept?: string
    onFileSelect: (file: File) => Promise<void>
  }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setIsUploading(true)
        await onFileSelect(file)
        setIsUploading(false)
      }
    }

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) {
        setIsUploading(true)
        await onFileSelect(file)
        setIsUploading(false)
      }
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-semibold">
          {label} {required && "*"}
        </Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer",
            isDragging 
              ? "border-[#FFD700] bg-[#FFD700]/10" 
              : "border-gray-300 hover:border-[#FFD700] hover:bg-[#FFD700]/5",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && document.getElementById(id)?.click()}
        >
          <Input
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#FFD700] mb-2" />
              <p className="text-sm font-medium">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
            </>
          )}
        </div>
        {uploadProgress[id] > 0 && uploadProgress[id] < 100 && (
          <Progress value={uploadProgress[id]} className="h-1" />
        )}
      </div>
    )
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Complete Your Profile
              <BookOpen className="h-6 w-6 text-[#FFD700]" />
            </h1>
            <p className="text-muted-foreground">Finish onboarding to start applying for jobs in Oman</p>
          </div>
          <Badge variant="outline" className={cn(
            "px-3 py-1",
            saving ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-green-50 text-green-700 border-green-300"
          )}>
            {saving ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {saving ? "Saving..." : "Auto-saved"}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="font-medium text-[#FFD700]">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Stepper step={currentStep} />

        {/* Main Content */}
        <Card className="border-2 border-amber-200/50 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50 pb-4">
            <div className="flex items-center gap-3">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon
                return (
                  <div className="h-10 w-10 rounded-lg bg-[#FFD700]/20 border-2 border-[#FFD700]/40 flex items-center justify-center">
                    <StepIcon className="h-5 w-5 text-amber-700" />
                  </div>
                )
              })()}
              <div>
                <CardTitle className="text-lg">{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-semibold">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          className="h-9"
                          value={onboardingData.personalInfo.firstName}
                          onChange={(e) => updateOnboardingData('personalInfo', { firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-semibold">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          className="h-9"
                          value={onboardingData.personalInfo.lastName}
                          onChange={(e) => updateOnboardingData('personalInfo', { lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-sm font-semibold">
                          Date of Birth *
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          className="h-9"
                          value={onboardingData.personalInfo.dateOfBirth}
                          onChange={(e) => updateOnboardingData('personalInfo', { dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-semibold">
                          Gender *
                        </Label>
                        <Select
                          value={onboardingData.personalInfo.gender}
                          onValueChange={(value) => updateOnboardingData('personalInfo', { gender: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county" className="text-sm font-semibold">
                        County of Residence *
                      </Label>
                      <Select
                        value={onboardingData.personalInfo.county}
                        onValueChange={(value) => updateOnboardingData('personalInfo', { county: value })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select your county" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi">Nairobi</SelectItem>
                          <SelectItem value="mombasa">Mombasa</SelectItem>
                          <SelectItem value="kisumu">Kisumu</SelectItem>
                          <SelectItem value="nakuru">Nakuru</SelectItem>
                          <SelectItem value="eldoret">Eldoret</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-semibold">
                        Physical Address *
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        rows={2}
                        value={onboardingData.personalInfo.physicalAddress}
                        onChange={(e) => updateOnboardingData('personalInfo', { physicalAddress: e.target.value })}
                      />
                    </div>

                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50/50 p-3">
                      <h3 className="font-semibold mb-2 text-sm text-amber-800">Emergency Contact</h3>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyName" className="text-xs">Contact Name *</Label>
                          <Input
                            id="emergencyName"
                            placeholder="Full name"
                            className="h-9"
                            value={onboardingData.personalInfo.emergencyContactName}
                            onChange={(e) => updateOnboardingData('personalInfo', { emergencyContactName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone" className="text-xs">Contact Phone *</Label>
                          <Input
                            id="emergencyPhone"
                            type="tel"
                            placeholder="+254 700 000 000"
                            className="h-9"
                            value={onboardingData.personalInfo.emergencyContactPhone}
                            onChange={(e) => updateOnboardingData('personalInfo', { emergencyContactPhone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: KYC & Identity */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-blue-800">KYC Verification Required</p>
                          <p className="text-blue-700 text-xs">All information must match your official documents.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="idNumber" className="text-sm font-semibold">
                          National ID Number *
                        </Label>
                        <Input
                          id="idNumber"
                          placeholder="Enter your ID number"
                          className="h-9"
                          value={onboardingData.kycDetails.idNumber}
                          onChange={(e) => updateOnboardingData('kycDetails', { idNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passportNumber" className="text-sm font-semibold">
                          Passport Number *
                        </Label>
                        <Input
                          id="passportNumber"
                          placeholder="Enter passport number"
                          className="h-9"
                          value={onboardingData.kycDetails.passportNumber}
                          onChange={(e) => updateOnboardingData('kycDetails', { passportNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="kraPin" className="text-sm font-semibold">
                          KRA Pin Number *
                        </Label>
                        <Input
                          id="kraPin"
                          placeholder="Enter KRA PIN"
                          className="h-9"
                          value={onboardingData.kycDetails.kraPin}
                          onChange={(e) => updateOnboardingData('kycDetails', { kraPin: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus" className="text-sm font-semibold">
                          Marital Status *
                        </Label>
                        <Select
                          value={onboardingData.kycDetails.maritalStatus}
                          onValueChange={(value) => updateOnboardingData('kycDetails', { maritalStatus: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Work Experience *</Label>
                      <Select
                        value={onboardingData.kycDetails.workExperience}
                        onValueChange={(value) => updateOnboardingData('kycDetails', { workExperience: value })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-7">5-7 years</SelectItem>
                          <SelectItem value="7+">7+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Skills & Expertise *</Label>
                      <div className="grid gap-2 grid-cols-2">
                        {[
                          "House Cleaning", "Cooking", "Childcare", "Elderly Care", 
                          "Laundry & Ironing", "Pet Care", "Gardening", "Driving"
                        ].map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-accent/5 transition-colors"
                          >
                            <Checkbox
                              id={skill.toLowerCase().replace(/\s+/g, "-")}
                              checked={onboardingData.kycDetails.skills.includes(skill)}
                              onCheckedChange={(checked) => {
                                const skills = checked
                                  ? [...onboardingData.kycDetails.skills, skill]
                                  : onboardingData.kycDetails.skills.filter(s => s !== skill)
                                updateOnboardingData('kycDetails', { skills })
                              }}
                            />
                            <label
                              htmlFor={skill.toLowerCase().replace(/\s+/g, "-")}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Languages *</Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="english" className="text-xs">English Level</Label>
                          <Select
                            value={onboardingData.kycDetails.languages.english}
                            onValueChange={(value) => updateOnboardingData('kycDetails', { 
                              languages: { ...onboardingData.kycDetails.languages, english: value }
                            })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="fluent">Fluent</SelectItem>
                              <SelectItem value="native">Native</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="arabic" className="text-xs">Arabic Level</Label>
                          <Select
                            value={onboardingData.kycDetails.languages.arabic}
                            onValueChange={(value) => updateOnboardingData('kycDetails', { 
                              languages: { ...onboardingData.kycDetails.languages, arabic: value }
                            })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="fluent">Fluent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50/50 p-3">
                      <div className="flex items-start gap-2">
                        <Upload className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-amber-800">Document Requirements</p>
                          <p className="text-amber-700 text-xs">Upload clear, high-quality scans of your documents.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FileUploadField
                        id="idDocument"
                        label="National ID Card (Both sides)"
                        required={true}
                        onFileSelect={async (file) => await handleFileUpload(file, 'idDocument')}
                      />

                      <FileUploadField
                        id="passportDocument"
                        label="Passport Bio Page"
                        required={true}
                        onFileSelect={async (file) => await handleFileUpload(file, 'passport')}
                      />

                      <FileUploadField
                        id="kraDocument"
                        label="KRA Pin Certificate"
                        required={true}
                        onFileSelect={async (file) => await handleFileUpload(file, 'kra')}
                      />

                      <FileUploadField
                        id="goodConductDocument"
                        label="Certificate of Good Conduct"
                        required={true}
                        onFileSelect={async (file) => await handleFileUpload(file, 'goodConduct')}
                      />
                    </div>

                    <div className="rounded-lg border-2 border-green-200 bg-green-50/50 p-3">
                      <h3 className="font-semibold mb-2 text-sm text-green-800">Document Checklist</h3>
                      <ul className="space-y-1 text-xs text-green-700">
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          Documents must be clear and readable
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          Passport must be valid for 6+ months
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          File size should not exceed 5MB
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 4: Studio Photos & Face Recognition */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-purple-200 bg-purple-50/50 p-3">
                      <div className="flex items-start gap-2">
                        <Camera className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-purple-800">Professional Photo Session Required</p>
                          <p className="text-purple-700 text-xs">Visit a certified studio for Oman visa-compliant photos.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Certified Studios</Label>
                      <div className="grid gap-3">
                        {[
                          { name: "PhotoPro Studio", location: "Nairobi CBD", rating: "4.8", price: "KSh 1,500" },
                          { name: "Perfect Shots", location: "Westlands", rating: "4.9", price: "KSh 2,000" },
                        ].map((studio) => (
                          <div
                            key={studio.name}
                            className="rounded-lg border p-3 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-sm">{studio.name}</h4>
                                <p className="text-xs text-muted-foreground">{studio.location}</p>
                              </div>
                              <Badge variant="secondary" className="bg-[#FFD700]/20 text-amber-800 text-xs">
                                ⭐ {studio.rating}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-amber-700">{studio.price}</span>
                              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white h-7 text-xs">
                                <Calendar size={12} className="mr-1" />
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-4">
                      <h3 className="font-semibold mb-3 text-sm text-blue-800">Face Recognition Verification</h3>

                      {!faceVerified ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-white">
                            <div className="text-center">
                              {saving ? (
                                <>
                                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                                  <p className="text-sm font-medium text-blue-800">Verifying Face Match...</p>
                                </>
                              ) : (
                                <>
                                  <Camera className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                                  <p className="text-sm font-medium text-blue-800">Waiting for Studio Photos</p>
                                  <Button 
                                    onClick={simulateFaceRecognition}
                                    size="sm"
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    Simulate Upload
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center p-4 border-2 border-green-300 rounded-lg bg-green-50">
                            <div className="text-center">
                              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <p className="text-sm font-semibold text-green-800">Face Verification Successful!</p>
                              <p className="text-xs text-green-700">95% match confidence</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Medical Check */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-green-200 bg-green-50/50 p-3">
                      <div className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-green-800">Medical Fitness Certificate Required</p>
                          <p className="text-green-700 text-xs">Complete medical examination at an approved hospital.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Approved Medical Centers</Label>
                      <div className="grid gap-3">
                        {[
                          { 
                            name: "Nairobi Hospital", 
                            location: "Upper Hill, Nairobi", 
                            price: "KSh 3,500",
                          },
                          { 
                            name: "Aga Khan University Hospital", 
                            location: "3rd Parklands, Nairobi", 
                            price: "KSh 4,000",
                          },
                        ].map((hospital) => (
                          <div
                            key={hospital.name}
                            className="rounded-lg border p-3 hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-sm">{hospital.name}</h4>
                                <p className="text-xs text-muted-foreground">{hospital.location}</p>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Approved
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-green-700">{hospital.price}</span>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs">
                                <Calendar size={12} className="mr-1" />
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50/50 p-4">
                      <h3 className="font-semibold mb-3 text-sm text-blue-800">Upload Medical Certificate</h3>
                      <FileUploadField
                        id="medicalDocument"
                        label="Medical Fitness Certificate"
                        required={true}
                        accept=".pdf,image/*"
                        onFileSelect={async (file) => await handleFileUpload(file, 'medical')}
                      />
                    </div>
                  </div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-green-200 bg-green-50/50 p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-semibold text-green-800">Ready to Submit</p>
                          <p className="text-green-700 text-xs">Your profile will be reviewed within 24-48 hours.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">Personal Information</h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="h-7 text-xs">
                            Edit
                          </Button>
                        </div>
                        <div className="grid gap-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{onboardingData.personalInfo.firstName} {onboardingData.personalInfo.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gender:</span>
                            <span className="font-medium">{onboardingData.personalInfo.gender}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">KYC & Documents</h3>
                          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="h-7 text-xs">
                            Edit
                          </Button>
                        </div>
                        <div className="grid gap-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">ID Verification:</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                              Provided
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Face Recognition:</span>
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              faceVerified 
                                ? "bg-green-100 text-green-800 border-green-300" 
                                : "bg-amber-100 text-amber-800 border-amber-300"
                            )}>
                              {faceVerified ? "Verified" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 rounded-lg border-2 border-amber-200 bg-amber-50/50 p-3">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm cursor-pointer text-amber-800">
                        I confirm all information is accurate and agree to the{" "}
                        <a href="/terms" className="text-amber-700 hover:underline font-medium">
                          Terms
                        </a>
                      </label>
                    </div>

                    <div className="flex items-start space-x-2 rounded-lg border-2 border-blue-200 bg-blue-50/50 p-3">
                      <Checkbox id="noPassport" />
                      <label htmlFor="noPassport" className="text-sm cursor-pointer text-blue-800">
                        I don't have a passport yet, but want to continue
                      </label>
                    </div>

                    <Button 
                      className="w-full bg-[#FFD700] hover:bg-amber-500 text-gray-900 font-semibold"
                      onClick={async () => {
                        await saveProgress(totalSteps)
                        router.push('/worker/dashboard')
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit for Oman Visa Processing
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-9"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="h-9 bg-[#FFD700] hover:bg-amber-500 text-gray-900"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}