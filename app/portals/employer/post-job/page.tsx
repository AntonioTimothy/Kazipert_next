"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import { jobService } from "@/lib/services/jobService"
import {
  Baby,
  Users,
  Home,
  Utensils,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  AlertCircle,
  Sparkles,
  Dog,
  Droplets,
  Sprout,
  User,
  UserCheck,
  HeartHandshake,
  ShoppingCart,
  FileText,
  Send,
  Calculator
} from "lucide-react"
import {
  calculateSalary,
  validateWorkHours,
  AGE_RANGES,
  DISABILITY_LEVELS,
  DUTY_CONFIGS,
  MAXIMUM_SALARY,
  MAXIMUM_WORK_HOURS,
  type FamilyMember,
  type SelectedDuty
} from "@/lib/utils/salaryCalculator"

// Kazipert brand colors
const COLORS = {
  primary: '#117c82',
  secondary: '#009CA6',
  gold: '#FDB913',
  purple: '#463189',
}

interface QuestionnaireState {
  // Basic Info
  jobTitle: string
  category: string

  // Household Questions
  residenceType: string
  bedrooms: number
  bathrooms: number
  hasGarden: boolean
  hasPool: boolean

  // Family Questions
  hasChildren: boolean
  hasInfants: boolean
  hasElderly: boolean
  hasDisabledMembers: boolean
  familyMembers: FamilyMember[]

  // Duty Questions
  needsCooking: boolean
  cookingType: string
  needsLaundry: boolean
  needsPetCare: boolean
  needsGroceryShopping: boolean
  needsIroning: boolean
  selectedDuties: SelectedDuty[]

  // Final Details
  location: string
  city: string
  description: string
  experienceRequired: string
  languageRequirements: string[]
}

export default function EmployerPostJobPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [state, setState] = useState<QuestionnaireState>({
    jobTitle: "",
    category: "GENERAL_HOUSE_HELP",
    residenceType: "VILLA",
    bedrooms: 3,
    bathrooms: 2,
    hasGarden: false,
    hasPool: false,
    hasChildren: false,
    hasInfants: false,
    hasElderly: false,
    hasDisabledMembers: false,
    familyMembers: [],
    needsCooking: false,
    cookingType: "",
    needsLaundry: false,
    needsPetCare: false,
    needsGroceryShopping: false,
    needsIroning: false,
    selectedDuties: [],
    location: "",
    city: "Muscat",
    description: "",
    experienceRequired: "ONE_TO_TWO_YEARS",
    languageRequirements: ["English"]
  })

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

  // Calculate salary in real-time
  const salaryBreakdown = calculateSalary(state.familyMembers, state.selectedDuties)
  const workHoursValidation = validateWorkHours(state.familyMembers, state.selectedDuties)

  // Dynamic question flow based on answers
  const questions = [
    {
      id: 'job-title',
      title: "What position are you hiring for?",
      subtitle: "Give your job posting a clear title",
      component: (
        <div className="space-y-4">
          <Input
            placeholder="e.g., House Helper, Nanny, Elderly Caregiver"
            value={state.jobTitle}
            onChange={(e) => setState({ ...state, jobTitle: e.target.value })}
            className="text-lg p-6"
          />
          <Select value={state.category} onValueChange={(v) => setState({ ...state, category: v })}>
            <SelectTrigger className="p-6">
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
      ),
      isValid: () => state.jobTitle.trim().length > 3
    },
    {
      id: 'residence',
      title: "Tell us about your home",
      subtitle: "This helps us calculate the right salary",
      component: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Residence Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['APARTMENT', 'VILLA', 'DUPLEX', 'MANSION'].map(type => (
                <button
                  key={type}
                  onClick={() => setState({ ...state, residenceType: type })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    state.residenceType === type
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50"
                  )}
                  style={{ borderColor: state.residenceType === type ? COLORS.primary : undefined }}
                >
                  <Home className="h-6 w-6 mx-auto mb-2" style={{ color: state.residenceType === type ? COLORS.primary : undefined }} />
                  <div className="text-sm font-medium capitalize">{type.toLowerCase()}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Bedrooms</label>
              <Input
                type="number"
                min="1"
                value={state.bedrooms}
                onChange={(e) => setState({ ...state, bedrooms: parseInt(e.target.value) || 1 })}
                className="p-4"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Bathrooms</label>
              <Input
                type="number"
                min="1"
                value={state.bathrooms}
                onChange={(e) => setState({ ...state, bathrooms: parseInt(e.target.value) || 1 })}
                className="p-4"
              />
            </div>
          </div>
        </div>
      ),
      isValid: () => state.bedrooms > 0 && state.bathrooms > 0
    },
    {
      id: 'garden-pool',
      title: "Do you have a garden or swimming pool?",
      subtitle: "Additional outdoor maintenance",
      component: (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setState({ ...state, hasGarden: !state.hasGarden })}
            className={cn(
              "p-6 rounded-xl border-2 transition-all",
              state.hasGarden ? "border-primary bg-primary/10" : "border-gray-200"
            )}
            style={{ borderColor: state.hasGarden ? COLORS.primary : undefined }}
          >
            <Sprout className="h-8 w-8 mx-auto mb-3" style={{ color: state.hasGarden ? COLORS.primary : undefined }} />
            <div className="font-medium">Garden</div>
            <div className="text-sm text-gray-600 mt-1">{state.hasGarden ? 'Yes' : 'No'}</div>
          </button>

          <button
            onClick={() => setState({ ...state, hasPool: !state.hasPool })}
            className={cn(
              "p-6 rounded-xl border-2 transition-all",
              state.hasPool ? "border-primary bg-primary/10" : "border-gray-200"
            )}
            style={{ borderColor: state.hasPool ? COLORS.primary : undefined }}
          >
            <Droplets className="h-8 w-8 mx-auto mb-3" style={{ color: state.hasPool ? COLORS.primary : undefined }} />
            <div className="font-medium">Swimming Pool</div>
            <div className="text-sm text-gray-600 mt-1">{state.hasPool ? 'Yes' : 'No'}</div>
          </button>
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'has-children',
      title: "Do you have children?",
      subtitle: "This determines childcare requirements",
      component: (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setState({ ...state, hasChildren: true })}
            className={cn(
              "p-8 rounded-xl border-2 transition-all",
              state.hasChildren ? "border-primary bg-primary/10" : "border-gray-200"
            )}
            style={{ borderColor: state.hasChildren ? COLORS.primary : undefined }}
          >
            <Baby className="h-12 w-12 mx-auto mb-4" style={{ color: state.hasChildren ? COLORS.primary : undefined }} />
            <div className="text-lg font-semibold">Yes</div>
          </button>

          <button
            onClick={() => setState({ ...state, hasChildren: false, hasInfants: false, familyMembers: state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category !== 'infant' && AGE_RANGES[m.ageRange].category !== 'child') })}
            className={cn(
              "p-8 rounded-xl border-2 transition-all",
              !state.hasChildren ? "border-primary bg-primary/10" : "border-gray-200"
            )}
            style={{ borderColor: !state.hasChildren ? COLORS.primary : undefined }}
          >
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: !state.hasChildren ? COLORS.primary : undefined }} />
            <div className="text-lg font-semibold">No</div>
          </button>
        </div>
      ),
      isValid: () => true
    },
    ...(state.hasChildren ? [{
      id: 'children-details',
      title: "Tell us about your children",
      subtitle: "Add each child with their age and any special needs",
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            {state.familyMembers.filter(m => {
              const cat = AGE_RANGES[m.ageRange].category
              return cat === 'infant' || cat === 'child' || cat === 'teen'
            }).map((member, idx) => (
              <div key={member.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Select
                    value={member.ageRange}
                    onValueChange={(v) => {
                      const updated = [...state.familyMembers]
                      const index = updated.findIndex(m => m.id === member.id)
                      updated[index] = { ...updated[index], ageRange: v as keyof typeof AGE_RANGES }
                      setState({ ...state, familyMembers: updated })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGE_RANGES).filter(([_, range]) =>
                        range.category === 'infant' || range.category === 'child' || range.category === 'teen'
                      ).map(([key, range]) => (
                        <SelectItem key={key} value={key}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={member.disabilityLevel}
                    onValueChange={(v) => {
                      const updated = [...state.familyMembers]
                      const index = updated.findIndex(m => m.id === member.id)
                      updated[index] = { ...updated[index], disabilityLevel: v as keyof typeof DISABILITY_LEVELS }
                      setState({ ...state, familyMembers: updated })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISABILITY_LEVELS).map(([key, level]) => (
                        <SelectItem key={key} value={key}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState({
                    ...state,
                    familyMembers: state.familyMembers.filter(m => m.id !== member.id)
                  })}
                  className="ml-2"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              const newMember: FamilyMember = {
                id: `child-${Date.now()}`,
                ageRange: 'AGE_3_8',
                disabilityLevel: 'NORMAL'
              }
              setState({ ...state, familyMembers: [...state.familyMembers, newMember] })
            }}
            variant="outline"
            className="w-full"
            style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          >
            + Add Child
          </Button>
        </div>
      ),
      isValid: () => state.familyMembers.some(m => {
        const cat = AGE_RANGES[m.ageRange].category
        return cat === 'infant' || cat === 'child' || cat === 'teen'
      })
    }] : []),
    {
      id: 'has-elderly',
      title: "Do you have elderly family members?",
      subtitle: "Age 70 or above requiring care",
      component: (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setState({ ...state, hasElderly: true })}
            className={cn(
              "p-8 rounded-xl border-2 transition-all",
              state.hasElderly ? "border-primary bg-primary/10" : "border-gray-200"
            )}
            style={{ borderColor: state.hasElderly ? COLORS.primary : undefined }}
          >
            <UserCheck className="h-12 w-12 mx-auto mb-4" style={{ color: state.hasElderly ? COLORS.primary : undefined }} />
            <div className="text-lg font-semibold">Yes</div>
          </button>

          <button
            onClick={() => setState({ ...state, hasElderly: false, familyMembers: state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category !== 'elderly') })}
            className={cn(
              "p-8 rounded-xl border-2 transition-all",
              !state.hasElderly ? "border-primary bg-primary/10" : "border-gray-200"
            )}
            style={{ borderColor: !state.hasElderly ? COLORS.primary : undefined }}
          >
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: !state.hasElderly ? COLORS.primary : undefined }} />
            <div className="text-lg font-semibold">No</div>
          </button>
        </div>
      ),
      isValid: () => true
    },
    ...(state.hasElderly ? [{
      id: 'elderly-details',
      title: "Tell us about elderly care needs",
      subtitle: "Add each elderly person with their condition",
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            {state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category === 'elderly').map((member) => (
              <div key={member.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Select
                    value={member.ageRange}
                    onValueChange={(v) => {
                      const updated = [...state.familyMembers]
                      const index = updated.findIndex(m => m.id === member.id)
                      updated[index] = { ...updated[index], ageRange: v as keyof typeof AGE_RANGES }
                      setState({ ...state, familyMembers: updated })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGE_RANGES).filter(([_, range]) => range.category === 'elderly').map(([key, range]) => (
                        <SelectItem key={key} value={key}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={member.disabilityLevel}
                    onValueChange={(v) => {
                      const updated = [...state.familyMembers]
                      const index = updated.findIndex(m => m.id === member.id)
                      updated[index] = { ...updated[index], disabilityLevel: v as keyof typeof DISABILITY_LEVELS }
                      setState({ ...state, familyMembers: updated })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISABILITY_LEVELS).map(([key, level]) => (
                        <SelectItem key={key} value={key}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState({
                    ...state,
                    familyMembers: state.familyMembers.filter(m => m.id !== member.id)
                  })}
                  className="ml-2"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              const newMember: FamilyMember = {
                id: `elderly-${Date.now()}`,
                ageRange: 'AGE_70_80',
                disabilityLevel: 'NORMAL'
              }
              setState({ ...state, familyMembers: [...state.familyMembers, newMember] })
            }}
            variant="outline"
            className="w-full"
            style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          >
            + Add Elderly Person
          </Button>
        </div>
      ),
      isValid: () => state.familyMembers.some(m => AGE_RANGES[m.ageRange].category === 'elderly')
    }] : []),
    {
      id: 'cooking',
      title: "Do you need cooking services?",
      subtitle: "Meal preparation for your family",
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setState({ ...state, needsCooking: true })}
              className={cn(
                "p-8 rounded-xl border-2 transition-all",
                state.needsCooking ? "border-primary bg-primary/10" : "border-gray-200"
              )}
              style={{ borderColor: state.needsCooking ? COLORS.primary : undefined }}
            >
              <Utensils className="h-12 w-12 mx-auto mb-4" style={{ color: state.needsCooking ? COLORS.primary : undefined }} />
              <div className="text-lg font-semibold">Yes</div>
            </button>

            <button
              onClick={() => setState({ ...state, needsCooking: false, cookingType: '', selectedDuties: state.selectedDuties.filter(d => !['SIMPLE_COOKING', 'FULL_ARABIC_COOKING', 'GUEST_COOKING'].includes(d.dutyKey)) })}
              className={cn(
                "p-8 rounded-xl border-2 transition-all",
                !state.needsCooking ? "border-primary bg-primary/10" : "border-gray-200"
              )}
              style={{ borderColor: !state.needsCooking ? COLORS.primary : undefined }}
            >
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: !state.needsCooking ? COLORS.primary : undefined }} />
              <div className="text-lg font-semibold">No</div>
            </button>
          </div>

          {state.needsCooking && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Cooking Type</label>
              <Select
                value={state.cookingType}
                onValueChange={(v) => {
                  setState({ ...state, cookingType: v })
                  // Update selected duties
                  const filtered = state.selectedDuties.filter(d => !['SIMPLE_COOKING', 'FULL_ARABIC_COOKING', 'GUEST_COOKING'].includes(d.dutyKey))
                  if (v === 'simple') filtered.push({ dutyKey: 'SIMPLE_COOKING' })
                  else if (v === 'full') filtered.push({ dutyKey: 'FULL_ARABIC_COOKING' })
                  setState({ ...state, cookingType: v, selectedDuties: filtered })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cooking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple Cooking (1-2 meals/day) - +16 OMR</SelectItem>
                  <SelectItem value="full">Full Arabic Cooking (3 meals/day) - +28 OMR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ),
      isValid: () => !state.needsCooking || state.cookingType !== ''
    },
    {
      id: 'other-duties',
      title: "Select additional duties",
      subtitle: "Choose other tasks you need help with",
      component: (
        <div className="space-y-3">
          {[
            { key: 'NORMAL_LAUNDRY', label: 'Laundry', icon: FileText, cost: 10 },
            { key: 'IRONING', label: 'Ironing', icon: FileText, cost: 8 },
            { key: 'GROCERY_SHOPPING', label: 'Grocery Shopping', icon: ShoppingCart, cost: 5 },
            { key: 'PET_CARE', label: 'Pet Care', icon: Dog, cost: 4 },
          ].map(duty => {
            const isSelected = state.selectedDuties.some(d => d.dutyKey === duty.key)
            return (
              <button
                key={duty.key}
                onClick={() => {
                  if (isSelected) {
                    setState({ ...state, selectedDuties: state.selectedDuties.filter(d => d.dutyKey !== duty.key) })
                  } else {
                    setState({ ...state, selectedDuties: [...state.selectedDuties, { dutyKey: duty.key as any }] })
                  }
                }}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between",
                  isSelected ? "border-primary bg-primary/10" : "border-gray-200"
                )}
                style={{ borderColor: isSelected ? COLORS.primary : undefined }}
              >
                <div className="flex items-center gap-3">
                  <duty.icon className="h-6 w-6" style={{ color: isSelected ? COLORS.primary : undefined }} />
                  <span className="font-medium">{duty.label}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: COLORS.gold }}>+{duty.cost} OMR</span>
              </button>
            )
          })}
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'location',
      title: "Where is the job located?",
      subtitle: "City and specific location",
      component: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">City</label>
            <Select value={state.city} onValueChange={(v) => setState({ ...state, city: v })}>
              <SelectTrigger className="p-4">
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

          <div>
            <label className="text-sm font-medium mb-2 block">Specific Location/Area</label>
            <Input
              placeholder="e.g., Al Khuwair, Qurum"
              value={state.location}
              onChange={(e) => setState({ ...state, location: e.target.value })}
              className="p-4"
            />
          </div>
        </div>
      ),
      isValid: () => state.city !== '' && state.location.trim() !== ''
    },
    {
      id: 'description',
      title: "Add a job description",
      subtitle: "Tell candidates about the role and your expectations",
      component: (
        <Textarea
          placeholder="Describe the role, working environment, and what you're looking for in a candidate..."
          value={state.description}
          onChange={(e) => setState({ ...state, description: e.target.value })}
          rows={6}
          className="p-4"
        />
      ),
      isValid: () => state.description.trim().length > 20
    },
    {
      id: 'review',
      title: "Review and submit",
      subtitle: "Check everything before posting",
      component: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="font-medium">{state.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{state.location}, {state.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Residence:</span>
                <span className="font-medium capitalize">{state.residenceType.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Family Members:</span>
                <span className="font-medium">{state.familyMembers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duties:</span>
                <span className="font-medium">{state.selectedDuties.length + 1} tasks</span>
              </div>
            </CardContent>
          </Card>

          {!workHoursValidation.valid && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">{workHoursValidation.message}</div>
            </div>
          )}
        </div>
      ),
      isValid: () => workHoursValidation.valid
    }
  ]

  const totalQuestions = questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleNext = () => {
    if (currentQuestion < questions.length - 1 && questions[currentQuestion].isValid()) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!workHoursValidation.valid) return

    setIsSubmitting(true)
    try {
      // Prepare job data
      const jobData = {
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
        // familyComposition: state.familyMembers,
        duties: state.selectedDuties.map(d => DUTY_CONFIGS[d.dutyKey].label),
        experienceRequired: state.experienceRequired,
        languageRequirements: state.languageRequirements,
        workingHours: `${workHoursValidation.totalHours.toFixed(1)} hours/day`,
        // employmentType: 'FULL_TIME',
        // status: 'OPEN'
      }

      await jobService.createJob(jobData as any)

      // Show success and redirect
      alert('Job posted successfully!')
      router.push('/portals/employer/jobs')
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Failed to post job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: COLORS.primary }}>Post a Job</h1>
              <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {totalQuestions}</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
          <Progress value={progress} className="mt-3 h-2" style={{ backgroundColor: '#e5e7eb' }}>
            <div className="h-full transition-all" style={{ width: `${progress}%`, backgroundColor: COLORS.primary }} />
          </Progress>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{currentQ.title}</CardTitle>
                <CardDescription className="text-base">{currentQ.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {currentQ.component}
              </CardContent>
              <div className="px-6 pb-6 flex gap-3">
                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!currentQ.isValid()}
                    className="flex-1"
                    style={{ backgroundColor: COLORS.primary, color: 'white' }}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!currentQ.isValid() || isSubmitting}
                    className="flex-1"
                    style={{ backgroundColor: COLORS.gold, color: 'white' }}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Job'}
                    <Send className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Salary Calculator Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-lg" style={{ borderTop: `4px solid ${COLORS.primary}` }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Salary Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Base Salary */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Base Salary</span>
                    <span className="font-semibold">{salaryBreakdown.baseSalary} OMR</span>
                  </div>

                  {/* Family Care Costs */}
                  {salaryBreakdown.familyCareCosts.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase">Family Care</div>
                      {salaryBreakdown.familyCareCosts.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{AGE_RANGES[item.member.ageRange].label}</span>
                          <span className="font-medium">+{item.cost} OMR</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Duty Costs */}
                  {salaryBreakdown.dutyCosts.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase">Additional Duties</div>
                      {salaryBreakdown.dutyCosts.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{DUTY_CONFIGS[item.duty.dutyKey].label}</span>
                          <span className="font-medium">+{item.cost} OMR</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Work Hours */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Daily Work Hours</span>
                      <span className={cn(
                        "text-sm font-semibold",
                        workHoursValidation.valid ? "text-green-600" : "text-red-600"
                      )}>
                        {salaryBreakdown.totalHoursPerDay.toFixed(1)} / {MAXIMUM_WORK_HOURS} hrs
                      </span>
                    </div>
                    <Progress
                      value={(salaryBreakdown.totalHoursPerDay / MAXIMUM_WORK_HOURS) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Total */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Monthly Salary</span>
                      <div className="text-right">
                        {salaryBreakdown.totalMonthlyCost > MAXIMUM_SALARY && (
                          <div className="text-xs text-gray-500 line-through">{salaryBreakdown.totalMonthlyCost} OMR</div>
                        )}
                        <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                          {salaryBreakdown.cappedSalary} OMR
                        </div>
                      </div>
                    </div>
                    {salaryBreakdown.totalMonthlyCost > MAXIMUM_SALARY && (
                      <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-800 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Capped at maximum {MAXIMUM_SALARY} OMR as per regulations</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}