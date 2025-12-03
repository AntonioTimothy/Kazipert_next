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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Calculator,
  PartyPopper,
  Check
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
  additionalDutiesDescription: string // New field

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
  const [showSuccess, setShowSuccess] = useState(false)

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
    additionalDutiesDescription: "",
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
  const salaryBreakdown = calculateSalary(state.familyMembers, state.selectedDuties, state.bedrooms)
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
            className="text-lg p-6 border-2 focus:border-primary/50"
          />
          <Select value={state.category} onValueChange={(v) => setState({ ...state, category: v })}>
            <SelectTrigger className="p-6 border-2">
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
            <label className="text-sm font-medium mb-2 block text-gray-700">Residence Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['APARTMENT', 'VILLA', 'DUPLEX', 'MANSION'].map(type => (
                <button
                  key={type}
                  onClick={() => setState({ ...state, residenceType: type })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all hover:shadow-md",
                    state.residenceType === type
                      ? "border-primary bg-primary/5 shadow-inner"
                      : "border-gray-100 bg-white hover:border-primary/30"
                  )}
                  style={{ borderColor: state.residenceType === type ? COLORS.primary : undefined }}
                >
                  <Home className="h-6 w-6 mx-auto mb-2" style={{ color: state.residenceType === type ? COLORS.primary : '#9ca3af' }} />
                  <div className="text-sm font-medium capitalize text-gray-700">{type.toLowerCase()}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Bedrooms</label>
              <Input
                type="number"
                min="1"
                value={state.bedrooms}
                onChange={(e) => setState({ ...state, bedrooms: parseInt(e.target.value) || 1 })}
                className="p-4 border-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Bathrooms</label>
              <Input
                type="number"
                min="1"
                value={state.bathrooms}
                onChange={(e) => setState({ ...state, bathrooms: parseInt(e.target.value) || 1 })}
                className="p-4 border-2"
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
              "p-6 rounded-xl border-2 transition-all hover:shadow-md",
              state.hasGarden ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
            )}
            style={{ borderColor: state.hasGarden ? COLORS.primary : undefined }}
          >
            <Sprout className="h-8 w-8 mx-auto mb-3" style={{ color: state.hasGarden ? COLORS.primary : '#9ca3af' }} />
            <div className="font-medium text-gray-800">Garden</div>
            <div className="text-sm text-gray-500 mt-1">{state.hasGarden ? 'Yes' : 'No'}</div>
          </button>

          <button
            onClick={() => setState({ ...state, hasPool: !state.hasPool })}
            className={cn(
              "p-6 rounded-xl border-2 transition-all hover:shadow-md",
              state.hasPool ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
            )}
            style={{ borderColor: state.hasPool ? COLORS.primary : undefined }}
          >
            <Droplets className="h-8 w-8 mx-auto mb-3" style={{ color: state.hasPool ? COLORS.primary : '#9ca3af' }} />
            <div className="font-medium text-gray-800">Swimming Pool</div>
            <div className="text-sm text-gray-500 mt-1">{state.hasPool ? 'Yes' : 'No'}</div>
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
              "p-8 rounded-xl border-2 transition-all hover:shadow-md",
              state.hasChildren ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
            )}
            style={{ borderColor: state.hasChildren ? COLORS.primary : undefined }}
          >
            <Baby className="h-12 w-12 mx-auto mb-4" style={{ color: state.hasChildren ? COLORS.primary : '#9ca3af' }} />
            <div className="text-lg font-semibold text-gray-800">Yes</div>
          </button>

          <button
            onClick={() => setState({ ...state, hasChildren: false, hasInfants: false, familyMembers: state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category !== 'infant' && AGE_RANGES[m.ageRange].category !== 'child' && AGE_RANGES[m.ageRange].category !== 'teen') })}
            className={cn(
              "p-8 rounded-xl border-2 transition-all hover:shadow-md",
              !state.hasChildren ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
            )}
            style={{ borderColor: !state.hasChildren ? COLORS.primary : undefined }}
          >
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: !state.hasChildren ? COLORS.primary : '#9ca3af' }} />
            <div className="text-lg font-semibold text-gray-800">No</div>
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
              <div key={member.id} className="p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between shadow-sm">
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
                  className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
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
            className="w-full border-dashed border-2 py-6"
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
              "p-8 rounded-xl border-2 transition-all hover:shadow-md",
              state.hasElderly ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
            )}
            style={{ borderColor: state.hasElderly ? COLORS.primary : undefined }}
          >
            <UserCheck className="h-12 w-12 mx-auto mb-4" style={{ color: state.hasElderly ? COLORS.primary : '#9ca3af' }} />
            <div className="text-lg font-semibold text-gray-800">Yes</div>
          </button>

          <button
            onClick={() => setState({ ...state, hasElderly: false, familyMembers: state.familyMembers.filter(m => AGE_RANGES[m.ageRange].category !== 'elderly') })}
            className={cn(
              "p-8 rounded-xl border-2 transition-all hover:shadow-md",
              !state.hasElderly ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
            )}
            style={{ borderColor: !state.hasElderly ? COLORS.primary : undefined }}
          >
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: !state.hasElderly ? COLORS.primary : '#9ca3af' }} />
            <div className="text-lg font-semibold text-gray-800">No</div>
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
              <div key={member.id} className="p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between shadow-sm">
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
                  className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
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
            className="w-full border-dashed border-2 py-6"
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
                "p-8 rounded-xl border-2 transition-all hover:shadow-md",
                state.needsCooking ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
              )}
              style={{ borderColor: state.needsCooking ? COLORS.primary : undefined }}
            >
              <Utensils className="h-12 w-12 mx-auto mb-4" style={{ color: state.needsCooking ? COLORS.primary : '#9ca3af' }} />
              <div className="text-lg font-semibold text-gray-800">Yes</div>
            </button>

            <button
              onClick={() => setState({ ...state, needsCooking: false, cookingType: '', selectedDuties: state.selectedDuties.filter(d => !['SIMPLE_COOKING', 'FULL_ARABIC_COOKING', 'GUEST_COOKING'].includes(d.dutyKey)) })}
              className={cn(
                "p-8 rounded-xl border-2 transition-all hover:shadow-md",
                !state.needsCooking ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
              )}
              style={{ borderColor: !state.needsCooking ? COLORS.primary : undefined }}
            >
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: !state.needsCooking ? COLORS.primary : '#9ca3af' }} />
              <div className="text-lg font-semibold text-gray-800">No</div>
            </button>
          </div>

          {state.needsCooking && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="text-sm font-medium text-gray-700">Cooking Type</label>
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
                <SelectTrigger className="p-4 bg-white">
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
      id: 'cleaning-duties',
      title: "Cleaning & Maintenance Tasks",
      subtitle: "Select additional cleaning tasks needed",
      component: (
        <div className="space-y-3">
          {[
            { key: 'DUSTING', label: 'Dusting Furniture & Surfaces', cost: 2 },
            { key: 'MOPPING_FLOORS', label: 'Mopping Floors', cost: 2.5 },
            { key: 'VACUUMING', label: 'Vacuuming Carpets', cost: 2 },
            { key: 'BATHROOM_CLEANING', label: 'Bathroom Deep Cleaning', cost: 3 },
            { key: 'WINDOW_CLEANING', label: 'Window Cleaning', cost: 3 },
            { key: 'WASHING_DISHES', label: 'Washing Dishes & Kitchenware', cost: 3 },
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
                  "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between hover:shadow-sm",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                )}
                style={{ borderColor: isSelected ? COLORS.primary : undefined }}
              >
                <span className="font-medium text-gray-800">{duty.label}</span>
                <Badge variant={isSelected ? "default" : "secondary"} className={cn(isSelected ? "bg-[#117c82]" : "")}>
                  +{duty.cost} OMR
                </Badge>
              </button>
            )
          })}
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'laundry-duties',
      title: "Laundry & Ironing",
      subtitle: "Select laundry-related tasks",
      component: (
        <div className="space-y-3">
          {[
            { key: 'NORMAL_LAUNDRY', label: 'Normal Laundry (1-4 people)', cost: 10 },
            { key: 'LARGE_FAMILY_LAUNDRY', label: 'Large Family Laundry (5+ people)', cost: 14 },
            { key: 'IRONING', label: 'Ironing Clothes', cost: 8 },
            { key: 'FOLDING_ORGANIZING', label: 'Folding & Organizing Clothes', cost: 3 },
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
                  "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between hover:shadow-sm",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                )}
                style={{ borderColor: isSelected ? COLORS.primary : undefined }}
              >
                <span className="font-medium text-gray-800">{duty.label}</span>
                <Badge variant={isSelected ? "default" : "secondary"} className={cn(isSelected ? "bg-[#117c82]" : "")}>
                  +{duty.cost} OMR
                </Badge>
              </button>
            )
          })}
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'pet-shopping-duties',
      title: "Pet Care, Shopping & Errands",
      subtitle: "Select additional household tasks",
      component: (
        <div className="space-y-3">
          {[
            { key: 'PET_CARE', label: 'Pet Care (Feeding & Walking)', cost: 4, description: 'Daily feeding and walking of pets' },
            { key: 'PET_GROOMING', label: 'Pet Grooming', cost: 4, description: 'Basic grooming and hygiene' },
            { key: 'GROCERY_SHOPPING', label: 'Grocery Shopping', cost: 5 },
            { key: 'MEAL_PLANNING_SHOPPING', label: 'Meal Planning & Shopping', cost: 6 },
            { key: 'ERRANDS', label: 'Running Errands', cost: 3 },
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
                  "w-full p-4 rounded-xl border-2 transition-all hover:shadow-sm",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                )}
                style={{ borderColor: isSelected ? COLORS.primary : undefined }}
              >
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">{duty.label}</div>
                  {duty.description && <div className="text-xs text-gray-500 mt-1">{duty.description}</div>}
                </div>
                <Badge variant={isSelected ? "default" : "secondary"} className={cn(isSelected ? "bg-[#117c82]" : "")}>
                  +{duty.cost} OMR
                </Badge>
              </button>
            )
          })}
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'maintenance-duties',
      title: "Home & Garden Maintenance",
      subtitle: "Select maintenance tasks",
      component: (
        <div className="space-y-3">
          {[
            { key: 'PLANT_WATERING', label: 'Watering Plants', cost: 1 },
            { key: 'GARDEN_MAINTENANCE', label: 'Basic Garden Maintenance', cost: 3 },
            { key: 'POOL_CLEANING', label: 'Pool Cleaning', cost: 8 },
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
                  "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between hover:shadow-sm",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                )}
                style={{ borderColor: isSelected ? COLORS.primary : undefined }}
              >
                <span className="font-medium text-gray-800">{duty.label}</span>
                <Badge variant={isSelected ? "default" : "secondary"} className={cn(isSelected ? "bg-[#117c82]" : "")}>
                  +{duty.cost} OMR
                </Badge>
              </button>
            )
          })}
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'family-duties',
      title: "Family & Guest Care",
      subtitle: "Select family assistance tasks",
      component: (
        <div className="space-y-3">
          {[
            { key: 'HOSTING_GUESTS', label: 'Assisting with Hosting Guests', cost: 2.5 },
            { key: 'TABLE_SETTING', label: 'Setting Table & Serving', cost: 1.5 },
            { key: 'HOMEWORK_HELP', label: 'Homework Assistance', cost: 8 },
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
                  "w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between hover:shadow-sm",
                  isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"
                )}
                style={{ borderColor: isSelected ? COLORS.primary : undefined }}
              >
                <span className="font-medium text-gray-800">{duty.label}</span>
                <Badge variant={isSelected ? "default" : "secondary"} className={cn(isSelected ? "bg-[#117c82]" : "")}>
                  +{duty.cost} OMR
                </Badge>
              </button>
            )
          })}
        </div>
      ),
      isValid: () => true
    },
    {
      id: 'additional-duties',
      title: "Any other duties?",
      subtitle: "Describe any specific requirements or tasks not covered above",
      component: (
        <div className="space-y-4">
          <Textarea
            placeholder="e.g., Watering indoor plants, walking the dog twice a day, specific cleaning instructions..."
            value={state.additionalDutiesDescription}
            onChange={(e) => setState({ ...state, additionalDutiesDescription: e.target.value })}
            rows={6}
            className="p-4 border-2 focus:border-primary/50 text-base"
          />
          <p className="text-sm text-gray-500">
            This helps candidates understand exactly what is expected.
          </p>
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
            <label className="text-sm font-medium mb-2 block text-gray-700">City</label>
            <Select value={state.city} onValueChange={(v) => setState({ ...state, city: v })}>
              <SelectTrigger className="p-4 bg-white">
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
            <label className="text-sm font-medium mb-2 block text-gray-700">Specific Location/Area</label>
            <Input
              placeholder="e.g., Al Khuwair, Qurum"
              value={state.location}
              onChange={(e) => setState({ ...state, location: e.target.value })}
              className="p-4 border-2"
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
          className="p-4 border-2 focus:border-primary/50"
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
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg text-[#117c82]">Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Position</span>
                  <span className="font-semibold text-gray-900 text-base">{state.jobTitle}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Location</span>
                  <span className="font-medium text-gray-900">{state.location}, {state.city}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Residence</span>
                  <span className="font-medium text-gray-900 capitalize">{state.residenceType.toLowerCase()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Family</span>
                  <span className="font-medium text-gray-900">{state.familyMembers.length} members</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-2">Selected Duties</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-gray-50">Basic Cleaning</Badge>
                  {state.selectedDuties.map((d, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-50">
                      {DUTY_CONFIGS[d.dutyKey]?.label || d.dutyKey}
                    </Badge>
                  ))}
                </div>
              </div>

              {state.additionalDutiesDescription && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Additional Duties</span>
                  <p className="text-gray-700 italic">"{state.additionalDutiesDescription}"</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 bg-yellow-50/50 -mx-6 -mb-6 p-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Estimated Monthly Salary</span>
                  <span className="text-2xl font-bold text-[#117c82]">{salaryBreakdown.cappedSalary} OMR</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">Based on selected duties and family composition</p>
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
        additionalDuties: state.additionalDutiesDescription ? { description: state.additionalDutiesDescription } : null,
        experienceRequired: state.experienceRequired,
        languageRequirements: state.languageRequirements,
        workingHours: `${workHoursValidation.totalHours.toFixed(1)} hours/day`,
        // employmentType: 'FULL_TIME',
        // status: 'OPEN'
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

  if (loading) {
    return <LoadingSpinner />
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#117c82]/10 to-[#FDB913]/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-2xl overflow-hidden">
          <div className="bg-[#117c82] h-2 w-full" />
          <CardContent className="pt-10 pb-10 px-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
              <PartyPopper className="h-10 w-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Job Posted!</h2>
              <p className="text-gray-600">
                Your job listing is now live. Qualified candidates will be able to apply immediately.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-left space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Job Title:</span>
                <span className="font-medium">{state.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Active
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => router.push('/portals/employer/jobs')}
                className="w-full bg-[#117c82] hover:bg-[#0e656a] h-12 text-lg"
              >
                View My Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccess(false)
                  setCurrentQuestion(0)
                  setState({
                    ...state,
                    jobTitle: "",
                    description: "",
                    selectedDuties: [],
                    familyMembers: [],
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
                    needsCooking: false,
                    cookingType: "",
                    needsLaundry: false,
                    needsPetCare: false,
                    needsGroceryShopping: false,
                    needsIroning: false,
                    additionalDutiesDescription: "",
                    location: "",
                    city: "Muscat",
                    experienceRequired: "ONE_TO_TWO_YEARS",
                    languageRequirements: ["English"]
                  })
                }}
                className="w-full"
              >
                Post Another Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-[#117c82]">Post a Job</h1>
              <p className="text-sm text-gray-500">Step {currentQuestion + 1} of {totalQuestions}</p>
            </div>
            <Button variant="ghost" onClick={() => router.push('/portals/employer/jobs')} className="text-gray-500 hover:text-gray-900">
              Cancel
            </Button>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-32 lg:pr-[420px]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentQ.title}</h2>
            <p className="text-lg text-gray-600">{currentQ.subtitle}</p>
          </div>

          {currentQ.component}
        </div>
      </div>

      {/* Side Calculator - Desktop Only */}
      <div className="hidden lg:block fixed top-24 right-8 w-80 xl:w-96 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
        <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm bg-white/90">
          <CardHeader className="bg-gradient-to-r from-[#117c82]/10 to-[#FDB913]/10 border-b border-primary/10 pb-4">
            <CardTitle className="flex items-center gap-2 text-[#117c82]">
              <Calculator className="h-5 w-5" />
              Salary Estimator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Base Salary */}
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200">
              <span className="text-gray-600">Base Salary</span>
              <span className="font-semibold">{salaryBreakdown.baseSalary} OMR</span>
            </div>

            {/* Add-ons */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Add-ons</div>

              {/* Family Care */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Family Care
                </span>
                <span className="font-medium text-green-600">+{salaryBreakdown.familyCareCosts} OMR</span>
              </div>

              {/* Duties */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Duties
                </span>
                <span className="font-medium text-green-600">+{salaryBreakdown.dutyCosts} OMR</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t-2 border-gray-100">
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-gray-800">Total Monthly</span>
                <span className="text-3xl font-bold text-[#117c82]">{salaryBreakdown.cappedSalary} <span className="text-sm font-normal text-gray-500">OMR</span></span>
              </div>
              {salaryBreakdown.cappedSalary < salaryBreakdown.totalMonthlyCost && (
                <p className="text-xs text-orange-500 text-right">
                  *Capped at {MAXIMUM_SALARY} OMR max
                </p>
              )}
            </div>

            {/* Validation Messages */}
            {!workHoursValidation.valid && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md flex gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {workHoursValidation.message}
              </div>
            )}

            {workHoursValidation.valid && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-md flex gap-2 text-xs text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                Workload is balanced ({workHoursValidation.totalHours.toFixed(1)} hrs/day)
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mb-20 md:mb-0 z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="h-12 px-6 border-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentQ.isValid()}
              className="h-12 px-8 bg-[#117c82] hover:bg-[#0e656a] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>Posting...</>
              ) : (
                <>Post Job <Check className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentQ.isValid()}
              className="h-12 px-8 bg-[#117c82] hover:bg-[#0e656a] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Next <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}