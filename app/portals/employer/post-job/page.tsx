"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import * as jobService from "@/lib/services/jobService"
import {
  Baby, Users, Home, Utensils, Shield, CheckCircle, ArrowRight, ArrowLeft,
  DollarSign, Clock, AlertCircle, Sparkles, Dog, Droplets, Sprout, User,
  UserCheck, HeartHandshake, ShoppingCart, FileText, Send, Calculator,
  PartyPopper, Check, Briefcase, MapPin, Building, ChevronRight, Star
} from "lucide-react"
import {
  calculateSalary,
  validateWorkHours,
  AGE_RANGES,
  DISABILITY_LEVELS,
  DUTY_CONFIGS,
  type FamilyMember,
  type SelectedDuty
} from "@/lib/utils/salaryCalculator"

// Kazipert brand colors from ThemeContext are used via CSS variables, 
// but we keep these for inline styles where needed
const COLORS = {
  primary: '#198D95',
  secondary: '#8684BF',
  accent: '#F6EC40',
  muted: '#B9BBBD'
}

interface JobPostState {
  // Step 1: Job Basics
  jobTitle: string
  category: string
  description: string
  experienceRequired: string
  languageRequirements: string[]
  location: string
  city: string

  // Step 2: Household
  residenceType: string
  bedrooms: number
  bathrooms: number
  hasGarden: boolean
  hasPool: boolean

  // Step 3: Family
  hasChildren: boolean
  hasElderly: boolean
  familyMembers: FamilyMember[]

  // Step 4: Duties
  needsCooking: boolean
  cookingType: string
  selectedDuties: SelectedDuty[]
  additionalDutiesDescription: string
}

const INITIAL_STATE: JobPostState = {
  jobTitle: "",
  category: "GENERAL_HOUSE_HELP",
  description: "",
  experienceRequired: "ONE_TO_TWO_YEARS",
  languageRequirements: ["English"],
  location: "",
  city: "Muscat",
  residenceType: "VILLA",
  bedrooms: 3,
  bathrooms: 2,
  hasGarden: false,
  hasPool: false,
  hasChildren: false,
  hasElderly: false,
  familyMembers: [],
  needsCooking: false,
  cookingType: "",
  selectedDuties: [],
  additionalDutiesDescription: ""
}

const STEPS = [
  { id: 1, title: "Job Basics", icon: Briefcase },
  { id: 2, title: "Household", icon: Home },
  { id: 3, title: "Family", icon: Users },
  { id: 4, title: "Duties", icon: Sparkles },
  { id: 5, title: "Review", icon: FileText }
]

export default function EmployerPostJobPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [state, setState] = useState<JobPostState>(INITIAL_STATE)

  useEffect(() => {
    const loadData = async () => {
      const userData = sessionStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "EMPLOYER") {
        router.push("/login")
        return
      }
      setUser(parsedUser)
      setLoading(false)
    }
    loadData()
  }, [router])

  // Real-time calculations
  const salaryBreakdown = calculateSalary(state.familyMembers, state.selectedDuties, state.bedrooms)
  const workHoursValidation = validateWorkHours(state.familyMembers, state.selectedDuties)

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    if (!workHoursValidation.valid) return

    setIsSubmitting(true)
    try {
      const jobData = {
        employerId: user.id,
        title: state.jobTitle,
        category: state.category,
        description: state.description,
        location: state.location,
        city: state.city,
        salary: salaryBreakdown.cappedSalary,
        salaryCurrency: 'OMR',
        salaryBreakdown: {
          base: salaryBreakdown.baseSalary,
          familyCare: salaryBreakdown.familyCareCosts,
          duties: salaryBreakdown.dutyCosts,
          total: salaryBreakdown.totalMonthlyCost,
          capped: salaryBreakdown.cappedSalary,
          breakdown: salaryBreakdown.breakdown
        },
        residenceType: state.residenceType,
        bedrooms: state.bedrooms,
        bathrooms: state.bathrooms,
        hasGarden: state.hasGarden,
        hasPool: state.hasPool,
        familyMembers: state.familyMembers.length,
        familyDetails: state.familyMembers,
        duties: state.selectedDuties.map(d => DUTY_CONFIGS[d.dutyKey].label),
        additionalDuties: state.additionalDutiesDescription ? { description: state.additionalDutiesDescription } : null,
        experienceRequired: state.experienceRequired,
        languageRequirements: state.languageRequirements,
        workingHours: `${workHoursValidation.totalHours.toFixed(1)} hours/day`,
        employmentType: 'FULL_TIME',
        status: 'ACTIVE'
      }

      await jobService.createJob(jobData as any)
      setShowSuccess(true)
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Failed to post job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDuty = (key: string) => {
    const exists = state.selectedDuties.some(d => d.dutyKey === key)
    if (exists) {
      setState(prev => ({ ...prev, selectedDuties: prev.selectedDuties.filter(d => d.dutyKey !== key) }))
    } else {
      setState(prev => ({ ...prev, selectedDuties: [...prev.selectedDuties, { dutyKey: key as any }] }))
    }
  }

  if (loading) return <LoadingSpinner />

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-purple-50 p-4">
        <Card className="max-w-md w-full text-center border-0 shadow-2xl overflow-hidden">
          <div className="bg-primary/10 p-8 flex justify-center">
            <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <PartyPopper className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardContent className="pt-8 pb-8 space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Job Posted!</h2>
            <p className="text-gray-600">
              Your job posting is now live. Qualified candidates will start applying soon.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Job Title:</span>
                <span className="font-medium">{state.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Salary:</span>
                <span className="font-bold text-primary">{salaryBreakdown.cappedSalary} OMR</span>
              </div>
            </div>
            <Button
              onClick={() => router.push('/portals/employer/jobs')}
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6 mt-4"
            >
              View My Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg">Post a New Job</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Step {currentStep} of 5</span>
            <Progress value={(currentStep / 5) * 100} className="w-32 h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Job Basics */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Let's start with the basics</h2>
                <p className="text-gray-500">Define the role you are hiring for.</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      placeholder="e.g. Experienced Housekeeper & Nanny"
                      value={state.jobTitle}
                      onChange={(e) => setState(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="text-lg py-6"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={state.category} onValueChange={(v) => setState(prev => ({ ...prev, category: v }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL_HOUSE_HELP">General House Help</SelectItem>
                          <SelectItem value="CHILD_CARE">Child Care / Nanny</SelectItem>
                          <SelectItem value="ELDERLY_CARE">Elderly Care</SelectItem>
                          <SelectItem value="COOKING_SPECIALIST">Cooking Specialist</SelectItem>
                          <SelectItem value="HOUSE_MANAGER">House Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Location (City)</Label>
                      <Select value={state.city} onValueChange={(v) => setState(prev => ({ ...prev, city: v }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Muscat">Muscat</SelectItem>
                          <SelectItem value="Salalah">Salalah</SelectItem>
                          <SelectItem value="Sohar">Sohar</SelectItem>
                          <SelectItem value="Nizwa">Nizwa</SelectItem>
                          <SelectItem value="Sur">Sur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Textarea
                      placeholder="Describe the main responsibilities and what you are looking for in a candidate..."
                      value={state.description}
                      onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[150px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience Required</Label>
                      <Select value={state.experienceRequired} onValueChange={(v) => setState(prev => ({ ...prev, experienceRequired: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ENTRY_LEVEL">Entry Level (0-1 years)</SelectItem>
                          <SelectItem value="ONE_TO_TWO_YEARS">1-2 Years</SelectItem>
                          <SelectItem value="THREE_TO_FIVE_YEARS">3-5 Years</SelectItem>
                          <SelectItem value="FIVE_PLUS_YEARS">5+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={state.languageRequirements[0]} onValueChange={(v) => setState(prev => ({ ...prev, languageRequirements: [v] }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                          <SelectItem value="Swahili">Swahili</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Household */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Household Details</h2>
                <p className="text-gray-500">Tell us about your home to help estimate the workload.</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-base">Type of Residence</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['APARTMENT', 'VILLA', 'DUPLEX', 'MANSION'].map(type => (
                        <button
                          key={type}
                          onClick={() => setState(prev => ({ ...prev, residenceType: type }))}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all hover:shadow-md flex flex-col items-center gap-2",
                            state.residenceType === type
                              ? "border-primary bg-primary/5 shadow-inner"
                              : "border-gray-100 bg-white hover:border-primary/30"
                          )}
                        >
                          <Home className={cn("h-6 w-6", state.residenceType === type ? "text-primary" : "text-gray-400")} />
                          <span className="text-sm font-medium capitalize">{type.toLowerCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-base">Bedrooms</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline" size="icon" className="h-10 w-10 rounded-full"
                          onClick={() => setState(prev => ({ ...prev, bedrooms: Math.max(1, prev.bedrooms - 1) }))}
                        >
                          -
                        </Button>
                        <span className="text-2xl font-semibold w-8 text-center">{state.bedrooms}</span>
                        <Button
                          variant="outline" size="icon" className="h-10 w-10 rounded-full"
                          onClick={() => setState(prev => ({ ...prev, bedrooms: prev.bedrooms + 1 }))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base">Bathrooms</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline" size="icon" className="h-10 w-10 rounded-full"
                          onClick={() => setState(prev => ({ ...prev, bathrooms: Math.max(1, prev.bathrooms - 1) }))}
                        >
                          -
                        </Button>
                        <span className="text-2xl font-semibold w-8 text-center">{state.bathrooms}</span>
                        <Button
                          variant="outline" size="icon" className="h-10 w-10 rounded-full"
                          onClick={() => setState(prev => ({ ...prev, bathrooms: prev.bathrooms + 1 }))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Amenities</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                          state.hasGarden ? "border-primary bg-primary/5" : "border-gray-100"
                        )}
                        onClick={() => setState(prev => ({ ...prev, hasGarden: !prev.hasGarden }))}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", state.hasGarden ? "bg-primary text-white" : "bg-gray-100 text-gray-500")}>
                            <Sprout className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Private Garden</p>
                            <p className="text-xs text-muted-foreground">Requires watering/maintenance</p>
                          </div>
                        </div>
                        <Checkbox checked={state.hasGarden} />
                      </div>

                      <div
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                          state.hasPool ? "border-primary bg-primary/5" : "border-gray-100"
                        )}
                        onClick={() => setState(prev => ({ ...prev, hasPool: !prev.hasPool }))}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", state.hasPool ? "bg-primary text-white" : "bg-gray-100 text-gray-500")}>
                            <Droplets className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Swimming Pool</p>
                            <p className="text-xs text-muted-foreground">Requires cleaning</p>
                          </div>
                        </div>
                        <Checkbox checked={state.hasPool} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Family */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Family Composition</h2>
                <p className="text-gray-500">Who will the employee be caring for?</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-8">
                  {/* Children Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base flex items-center gap-2">
                        <Baby className="h-5 w-5 text-primary" />
                        Children
                      </Label>
                      <Button
                        variant="outline" size="sm"
                        onClick={() => {
                          const newMember: FamilyMember = {
                            id: `child-${Date.now()}`,
                            ageRange: 'AGE_3_8',
                            disabilityLevel: 'NORMAL'
                          }
                          setState(prev => ({ ...prev, hasChildren: true, familyMembers: [...prev.familyMembers, newMember] }))
                        }}
                      >
                        + Add Child
                      </Button>
                    </div>

                    {state.familyMembers.filter(m => ['infant', 'child', 'teen'].includes(AGE_RANGES[m.ageRange].category)).length === 0 ? (
                      <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">No children added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {state.familyMembers.filter(m => ['infant', 'child', 'teen'].includes(AGE_RANGES[m.ageRange].category)).map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <Select
                                value={member.ageRange}
                                onValueChange={(v) => {
                                  const updated = [...state.familyMembers]
                                  const index = updated.findIndex(m => m.id === member.id)
                                  updated[index] = { ...updated[index], ageRange: v as any }
                                  setState(prev => ({ ...prev, familyMembers: updated }))
                                }}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(AGE_RANGES)
                                    .filter(([_, r]) => ['infant', 'child', 'teen'].includes(r.category))
                                    .map(([k, r]) => <SelectItem key={k} value={k}>{r.label}</SelectItem>)}
                                </SelectContent>
                              </Select>

                              <Select
                                value={member.disabilityLevel}
                                onValueChange={(v) => {
                                  const updated = [...state.familyMembers]
                                  const index = updated.findIndex(m => m.id === member.id)
                                  updated[index] = { ...updated[index], disabilityLevel: v as any }
                                  setState(prev => ({ ...prev, familyMembers: updated }))
                                }}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(DISABILITY_LEVELS).map(([k, l]) => (
                                    <SelectItem key={k} value={k}>{l.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="ghost" size="icon" className="text-red-500 hover:bg-red-50"
                              onClick={() => setState(prev => ({
                                ...prev,
                                familyMembers: prev.familyMembers.filter(m => m.id !== member.id)
                              }))}
                            >
                              <span className="text-lg">×</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Elderly Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-primary" />
                        Elderly Care
                      </Label>
                      <Button
                        variant="outline" size="sm"
                        onClick={() => {
                          const newMember: FamilyMember = {
                            id: `elderly-${Date.now()}`,
                            ageRange: 'AGE_70_80',
                            disabilityLevel: 'NORMAL'
                          }
                          setState(prev => ({ ...prev, hasElderly: true, familyMembers: [...prev.familyMembers, newMember] }))
                        }}
                      >
                        + Add Elderly Person
                      </Button>
                    </div>

                    {state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category === 'elderly').length === 0 ? (
                      <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">No elderly members added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category === 'elderly').map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <Select
                                value={member.ageRange}
                                onValueChange={(v) => {
                                  const updated = [...state.familyMembers]
                                  const index = updated.findIndex(m => m.id === member.id)
                                  updated[index] = { ...updated[index], ageRange: v as any }
                                  setState(prev => ({ ...prev, familyMembers: updated }))
                                }}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(AGE_RANGES)
                                    .filter(([_, r]) => r.category === 'elderly')
                                    .map(([k, r]) => <SelectItem key={k} value={k}>{r.label}</SelectItem>)}
                                </SelectContent>
                              </Select>

                              <Select
                                value={member.disabilityLevel}
                                onValueChange={(v) => {
                                  const updated = [...state.familyMembers]
                                  const index = updated.findIndex(m => m.id === member.id)
                                  updated[index] = { ...updated[index], disabilityLevel: v as any }
                                  setState(prev => ({ ...prev, familyMembers: updated }))
                                }}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(DISABILITY_LEVELS).map(([k, l]) => (
                                    <SelectItem key={k} value={k}>{l.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="ghost" size="icon" className="text-red-500 hover:bg-red-50"
                              onClick={() => setState(prev => ({
                                ...prev,
                                familyMembers: prev.familyMembers.filter(m => m.id !== member.id)
                              }))}
                            >
                              <span className="text-lg">×</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Duties */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Duties & Requirements</h2>
                <p className="text-gray-500">Select the tasks required for this role.</p>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-8">
                  {/* Cooking */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" />
                        Cooking Requirements
                      </Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="needs-cooking" className="text-sm text-muted-foreground">Required?</Label>
                        <Checkbox
                          id="needs-cooking"
                          checked={state.needsCooking}
                          onCheckedChange={(c) => setState(prev => ({ ...prev, needsCooking: !!c }))}
                        />
                      </div>
                    </div>

                    {state.needsCooking && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all",
                            state.cookingType === 'simple' ? "border-primary bg-primary/5" : "border-gray-100"
                          )}
                          onClick={() => {
                            setState(prev => ({ ...prev, cookingType: 'simple' }))
                            toggleDuty('SIMPLE_COOKING')
                          }}
                        >
                          <p className="font-medium">Simple Cooking</p>
                          <p className="text-xs text-muted-foreground">Basic meals, 1-2 times a day</p>
                          <Badge variant="secondary" className="mt-2">+16 OMR</Badge>
                        </div>
                        <div
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all",
                            state.cookingType === 'full' ? "border-primary bg-primary/5" : "border-gray-100"
                          )}
                          onClick={() => {
                            setState(prev => ({ ...prev, cookingType: 'full' }))
                            toggleDuty('FULL_ARABIC_COOKING')
                          }}
                        >
                          <p className="font-medium">Full Arabic Cooking</p>
                          <p className="text-xs text-muted-foreground">Complex meals, 3 times a day</p>
                          <Badge variant="secondary" className="mt-2">+28 OMR</Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Other Duties */}
                  <div className="space-y-4">
                    <Label className="text-base">Additional Duties</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: 'DUSTING', label: 'Dusting', cost: 2 },
                        { key: 'MOPPING_FLOORS', label: 'Mopping', cost: 2.5 },
                        { key: 'BATHROOM_CLEANING', label: 'Bathroom Deep Clean', cost: 3 },
                        { key: 'IRONING', label: 'Ironing', cost: 8 },
                        { key: 'LAUNDRY', label: 'Laundry', cost: 10 },
                        { key: 'GROCERY_SHOPPING', label: 'Grocery Shopping', cost: 5 },
                        { key: 'PET_CARE', label: 'Pet Care', cost: 4 },
                        { key: 'CAR_WASHING', label: 'Car Washing', cost: 5 },
                      ].map(duty => {
                        const isSelected = state.selectedDuties.some(d => d.dutyKey === duty.key)
                        return (
                          <div
                            key={duty.key}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                              isSelected ? "border-primary bg-primary/5" : "border-gray-100"
                            )}
                            onClick={() => toggleDuty(duty.key)}
                          >
                            <span className="text-sm font-medium">{duty.label}</span>
                            <Badge variant={isSelected ? "default" : "secondary"} className="text-xs">+{duty.cost} OMR</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Specific Instructions</Label>
                    <Textarea
                      placeholder="Any other specific requirements? e.g. 'Must be good with dogs', 'Prefer someone who can bake'..."
                      value={state.additionalDutiesDescription}
                      onChange={(e) => setState(prev => ({ ...prev, additionalDutiesDescription: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Review & Post</h2>
                <p className="text-gray-500">Review your job details before posting.</p>
              </div>

              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-primary/5 p-6 border-b border-primary/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{state.jobTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" /> {state.city} • {state.category.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <Badge className="text-lg px-4 py-1 bg-primary text-white">
                      {salaryBreakdown.cappedSalary} OMR/mo
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Household</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• {state.residenceType.toLowerCase()}</li>
                        <li>• {state.bedrooms} Bedrooms, {state.bathrooms} Bathrooms</li>
                        {state.hasGarden && <li>• Has Garden</li>}
                        {state.hasPool && <li>• Has Pool</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Family</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• {state.familyMembers.length} Total Members</li>
                        {state.hasChildren && <li>• Includes Children</li>}
                        {state.hasElderly && <li>• Includes Elderly Care</li>}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Selected Duties</h4>
                    <div className="flex flex-wrap gap-2">
                      {state.selectedDuties.map(d => (
                        <Badge key={d.dutyKey} variant="secondary">
                          {DUTY_CONFIGS[d.dutyKey]?.label || d.dutyKey}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{state.description}</p>
                  </div>

                  {!workHoursValidation.valid && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Workload Warning</h4>
                        <p className="text-sm text-red-700">
                          The estimated workload is {workHoursValidation.totalHours.toFixed(1)} hours/day, which exceeds the maximum allowed. Please remove some duties or add another helper.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className="w-32"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting || (currentStep === 5 && !workHoursValidation.valid)}
              className="w-32 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? <LoadingSpinner className="h-4 w-4" /> : currentStep === 5 ? 'Post Job' : 'Next'}
            </Button>
          </div>

        </div>

        {/* Sidebar: Salary Estimate */}
        <div className="hidden lg:block space-y-6">
          <Card className="border-0 shadow-lg sticky top-24 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Salary Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Salary</span>
                  <span className="font-medium">{salaryBreakdown.baseSalary} OMR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Family Care</span>
                  <span className="font-medium">+{salaryBreakdown.familyCareCosts} OMR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duties</span>
                  <span className="font-medium">+{salaryBreakdown.dutyCosts} OMR</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-gray-900">Total Monthly</span>
                  <span className="text-2xl font-bold text-primary">{salaryBreakdown.cappedSalary} OMR</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>This is an estimate based on market rates. You can adjust the final offer later.</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Steps Sidebar */}
          <div className="space-y-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  currentStep === step.id ? "bg-white shadow-sm border border-gray-100" : "text-gray-400"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === step.id ? "bg-primary text-white" :
                    currentStep > step.id ? "bg-green-100 text-green-600" : "bg-gray-100"
                )}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className={cn("font-medium", currentStep === step.id ? "text-gray-900" : "")}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}