"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import {
  Briefcase,
  Plus,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  ArrowRight,
  Home,
  User,
  Baby,
  Utensils,
  Car,
  Wifi,
  Shield,
  FileText,
  CheckCircle,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  Star,
  Download,
  Share2,
  MoreHorizontal,
  Building,
  Bed,
  Bath,
  Ruler,
  Users as UsersIcon,
  Heart,
  Bookmark,
  Send,
  Zap,
  Crown,
  Target,
  AlertCircle,
  Info,
  Calculator,
  Sparkles,
  TrendingUp,
  Award,
  Clock3,
  HeartHandshake,
  Coins,
  Scale,
  Building2,
  Sprout,
  Dumbbell,
  Music,
  Palette,
  Languages,
  Dog,
  Cat,
  Baby as BabyIcon,
  UserCheck,
  FileCheck,
  BookOpen,
  GraduationCap,
  Car as CarIcon,
  Wifi as WifiIcon,
  Tv,
  Smartphone,
  Laptop,
  Camera,
  Headphones,
  Gamepad,
  Coffee,
  Wine,
  ChefHat,
  Shirt,
  ShoppingCart,
  Flower,
  TreePine,
  Droplets,
  Sun,
  Cloud,
  Wind,
  Thermometer,
  Plane
} from "lucide-react"

export default function EmployerJobsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posted")
  const [showJobStepper, setShowJobStepper] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [applicantsView, setApplicantsView] = useState<string | null>(null)
  const [isCalculatingSalary, setIsCalculatingSalary] = useState(false)
  const [calculatedSalary, setCalculatedSalary] = useState(320)

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    // Step 1: Basic Information
    jobTitle: "",
    jobType: "full-time",
    description: "",
    
    // Step 2: Household Details
    residenceType: "villa",
    bedrooms: 3,
    bathrooms: 2,
    totalFloors: 1,
    hasGarden: false,
    hasPool: false,
    squareMeters: 200,
    
    // Step 3: Family Details
    familyMembers: 4,
    childrenCount: 2,
    childrenAges: ["5", "8"],
    elderlyCare: false,
    specialNeeds: false,
    pets: [] as string[],
    
    // Step 4: Job Requirements
    duties: ["Cleaning", "Cooking", "Laundry", "Ironing", "Childcare"] as string[],
    experienceRequired: "3-5 years",
    languageRequirements: ["English", "Arabic"] as string[],
    workingHours: "8 hours",
    overtimeRequired: false,
    accommodation: "private",
    meals: "included",
    vacationDays: 30,
    
    // Step 5: Additional Benefits & Requirements
    benefits: ["health-insurance", "annual-flight", "phone-allowance"] as string[],
    certifications: [] as string[],
    skills: [] as string[],
    
    // Step 6: Compensation & Location
    salary: 320,
    salaryCurrency: "OMR",
    location: "",
    city: "Muscat",
    availableFrom: "",
    interviewRequired: true,
    
    // Step 7: Review & Post
    agreeToTerms: false,
    emergencySupport: true,
    autoSalaryCalculation: true
  })

  // Oman Labor Law 2025 Minimums
  const OMAN_LAW_MINIMUMS = {
    baseSalary: 320, // OMR per month
    overtimeRate: 1.25, // 25% extra for overtime
    annualLeave: 30, // days per year
    accommodation: {
      provided: 50, // OMR value if provided
      notProvided: 0,
      shared: 25,
      private: 50
    },
    meals: {
      included: 40, // OMR value if included
      notIncluded: 0,
      partial: 20
    }
  }

  // Salary calculation factors
  const SALARY_FACTORS = {
    // Job Type
    jobType: {
      "full-time": 1.0,
      "part-time": 0.6,
      "live-out": 0.8,
      "flexible": 0.7
    },
    
    // Experience
    experience: {
      "no experience": 0.9,
      "1-2 years": 1.0,
      "3-5 years": 1.2,
      "5+ years": 1.4
    },
    
    // Residence Type
    residence: {
      "apartment": 1.0,
      "villa": 1.15,
      "duplex": 1.1,
      "mansion": 1.3
    },
    
    // Family Factors
    children: {
      base: 20, // OMR per child
      toddler: 10, // Extra for children under 3
      schoolAge: 5, // Extra for school-age children
      teenager: 8 // Extra for teenagers
    },
    
    // Special Requirements
    specialCare: {
      elderly: 30,
      specialNeeds: 40,
      medicalCare: 50
    },
    
    // Duties Complexity
    duties: {
      "Childcare": 25,
      "Elderly care": 30,
      "Special needs care": 40,
      "Cooking": 15,
      "Cleaning": 10,
      "Laundry": 8,
      "Ironing": 8,
      "Grocery shopping": 12,
      "Driving": 20,
      "Pet care": 15,
      "Gardening": 12,
      "Pool maintenance": 18,
      "House management": 25,
      "Teaching": 20,
      "Nursing": 35
    },
    
    // Languages (bonus for each additional language)
    languages: {
      "English": 10,
      "Arabic": 15,
      "Hindi": 8,
      "Urdu": 8,
      "Tagalog": 8,
      "French": 12,
      "Swahili": 8
    },
    
    // Working Hours
    hours: {
      "8 hours": 1.0,
      "10 hours": 1.15,
      "12 hours": 1.3,
      "flexible": 1.05
    },
    
    // Benefits (value to employee)
    benefits: {
      "health-insurance": 25,
      "annual-flight": 30,
      "phone-allowance": 10,
      "transportation": 15,
      "education": 20,
      "bonus": 20
    },
    
    // Certifications (premium for qualifications)
    certifications: {
      "first-aid": 15,
      "childcare": 20,
      "nursing": 25,
      "teaching": 18,
      "driving": 12,
      "cooking": 15
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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

  // Smart salary calculation with delay animation
  useEffect(() => {
    if (jobForm.autoSalaryCalculation) {
      setIsCalculatingSalary(true)
      const timer = setTimeout(() => {
        const newSalary = calculateTotalSalary()
        setCalculatedSalary(newSalary)
        setIsCalculatingSalary(false)
      }, 800) // 800ms delay for calculation effect
      
      return () => clearTimeout(timer)
    }
  }, [
    jobForm.jobType,
    jobForm.experienceRequired,
    jobForm.residenceType,
    jobForm.childrenCount,
    jobForm.childrenAges,
    jobForm.elderlyCare,
    jobForm.specialNeeds,
    jobForm.duties,
    jobForm.languageRequirements,
    jobForm.workingHours,
    jobForm.accommodation,
    jobForm.meals,
    jobForm.benefits,
    jobForm.autoSalaryCalculation
  ])

  const calculateTotalSalary = () => {
    let baseSalary = OMAN_LAW_MINIMUMS.baseSalary
    
    // Job Type Multiplier
    baseSalary *= SALARY_FACTORS.jobType[jobForm.jobType as keyof typeof SALARY_FACTORS.jobType]
    
    // Experience Multiplier
    baseSalary *= SALARY_FACTORS.experience[jobForm.experienceRequired as keyof typeof SALARY_FACTORS.experience]
    
    // Residence Type Multiplier
    baseSalary *= SALARY_FACTORS.residence[jobForm.residenceType as keyof typeof SALARY_FACTORS.residence]
    
    // Working Hours Multiplier
    baseSalary *= SALARY_FACTORS.hours[jobForm.workingHours as keyof typeof SALARY_FACTORS.hours]
    
    // Add fixed amounts for various factors
    let additions = 0
    
    // Children
    additions += jobForm.childrenCount * SALARY_FACTORS.children.base
    jobForm.childrenAges.forEach(age => {
      const ageNum = parseInt(age)
      if (ageNum < 3) additions += SALARY_FACTORS.children.toddler
      else if (ageNum >= 3 && ageNum <= 12) additions += SALARY_FACTORS.children.schoolAge
      else if (ageNum > 12) additions += SALARY_FACTORS.children.teenager
    })
    
    // Special Care
    if (jobForm.elderlyCare) additions += SALARY_FACTORS.specialCare.elderly
    if (jobForm.specialNeeds) additions += SALARY_FACTORS.specialCare.specialNeeds
    
    // Duties
    jobForm.duties.forEach(duty => {
      additions += SALARY_FACTORS.duties[duty as keyof typeof SALARY_FACTORS.duties] || 0
    })
    
    // Languages
    jobForm.languageRequirements.forEach(lang => {
      additions += SALARY_FACTORS.languages[lang as keyof typeof SALARY_FACTORS.languages] || 0
    })
    
    // Accommodation (subtract if provided, as it's a benefit)
    const accommodationValue = OMAN_LAW_MINIMUMS.accommodation[
      jobForm.accommodation as keyof typeof OMAN_LAW_MINIMUMS.accommodation
    ]
    
    // Meals (subtract if included)
    const mealsValue = OMAN_LAW_MINIMUMS.meals[
      jobForm.meals as keyof typeof OMAN_LAW_MINIMUMS.meals
    ]
    
    // Benefits (employer cost)
    jobForm.benefits.forEach(benefit => {
      additions += SALARY_FACTORS.benefits[benefit as keyof typeof SALARY_FACTORS.benefits] || 0
    })
    
    // Calculate final salary
    let finalSalary = baseSalary + additions
    
    // Adjust for provided benefits (accommodation and meals are benefits that reduce cash salary expectation)
    if (jobForm.accommodation !== "not-provided") {
      finalSalary -= accommodationValue * 0.3 // Partial adjustment for provided accommodation
    }
    
    if (jobForm.meals !== "not-included") {
      finalSalary -= mealsValue * 0.3 // Partial adjustment for provided meals
    }
    
    // Ensure minimum wage compliance
    finalSalary = Math.max(OMAN_LAW_MINIMUMS.baseSalary, finalSalary)
    
    // Round to nearest 5 OMR for clean numbers
    return Math.ceil(finalSalary / 5) * 5
  }

  // Enhanced duty options with categories
  const dutyOptions = [
    { value: "Childcare", label: "Childcare", category: "care", icon: BabyIcon, default: true },
    { value: "Elderly care", label: "Elderly Care", category: "care", icon: UserCheck, default: false },
    { value: "Special needs care", label: "Special Needs Care", category: "care", icon: HeartHandshake, default: false },
    { value: "Cooking", label: "Cooking", category: "household", icon: ChefHat, default: true },
    { value: "Cleaning", label: "Cleaning", category: "household", icon: Shirt, default: true },
    { value: "Laundry", label: "Laundry", category: "household", icon: Droplets, default: true },
    { value: "Ironing", label: "Ironing", category: "household", icon: Shirt, default: true },
    { value: "Grocery shopping", label: "Grocery Shopping", category: "shopping", icon: ShoppingCart, default: true },
    { value: "Driving", label: "Driving", category: "transport", icon: CarIcon, default: false },
    { value: "Pet care", label: "Pet Care", category: "care", icon: Dog, default: false },
    { value: "Gardening", label: "Gardening", category: "outdoor", icon: Sprout, default: false },
    { value: "Pool maintenance", label: "Pool Maintenance", category: "outdoor", icon: Droplets, default: false },
    { value: "House management", label: "House Management", category: "management", icon: Building2, default: false },
    { value: "Teaching", label: "Teaching/Homework Help", category: "education", icon: BookOpen, default: false },
    { value: "Nursing", label: "Nursing/Medical Care", category: "medical", icon: Heart, default: false }
  ]

  const benefitOptions = [
    { value: "health-insurance", label: "Health Insurance", icon: Shield, default: true },
    { value: "annual-flight", label: "Annual Flight Home", icon: Plane, default: true },
    { value: "phone-allowance", label: "Phone Allowance", icon: Smartphone, default: true },
    { value: "transportation", label: "Transportation Allowance", icon: Car, default: false },
    { value: "education", label: "Education Support", icon: GraduationCap, default: false },
    { value: "bonus", label: "Performance Bonus", icon: Award, default: false }
  ]

  const certificationOptions = [
    { value: "first-aid", label: "First Aid Certified", icon: Heart, default: true },
    { value: "childcare", label: "Childcare Certification", icon: Baby, default: true },
    { value: "nursing", label: "Nursing Qualification", icon: UserCheck, default: false },
    { value: "teaching", label: "Teaching Certificate", icon: BookOpen, default: false },
    { value: "driving", label: "Driving License", icon: Car, default: false },
    { value: "cooking", label: "Cooking Certification", icon: ChefHat, default: false }
  ]

  const petOptions = [
    { value: "dogs", label: "Dogs", icon: Dog },
    { value: "cats", label: "Cats", icon: Cat },
    { value: "birds", label: "Birds", icon: Sprout },
    { value: "other", label: "Other Pets", icon: Heart }
  ]

  const handleInputChange = (field: string, value: any) => {
    setJobForm(prev => ({ ...prev, [field]: value }))
  }

  const handleDutyToggle = (duty: string) => {
    setJobForm(prev => ({
      ...prev,
      duties: prev.duties.includes(duty)
        ? prev.duties.filter(d => d !== duty)
        : [...prev.duties, duty]
    }))
  }

  const handleBenefitToggle = (benefit: string) => {
    setJobForm(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }))
  }

  const handleCertificationToggle = (certification: string) => {
    setJobForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }))
  }

  const handlePetToggle = (pet: string) => {
    setJobForm(prev => ({
      ...prev,
      pets: prev.pets.includes(pet)
        ? prev.pets.filter(p => p !== pet)
        : [...prev.pets, pet]
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setJobForm(prev => ({
      ...prev,
      languageRequirements: prev.languageRequirements.includes(language)
        ? prev.languageRequirements.filter(l => l !== language)
        : [...prev.languageRequirements, language]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitJob = (asDraft: boolean = false) => {
    // In real app, would submit to backend
    console.log("Submitting job:", jobForm, asDraft ? "as draft" : "as active")
    setShowJobStepper(false)
    setCurrentStep(1)
    // Reset form or keep for next job?
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'draft': return 'bg-gray-500/10 text-gray-600 border-gray-200'
      case 'closed': return 'bg-red-500/10 text-red-600 border-red-200'
      default: return 'bg-blue-500/10 text-blue-600 border-blue-200'
    }
  }

  const steps = [
    { number: 1, title: "Job Details", description: "Basic information about the position" },
    { number: 2, title: "Household Info", description: "Describe your home and facilities" },
    { number: 3, title: "Family Details", description: "Information about your family" },
    { number: 4, title: "Requirements", description: "Skills and duties required" },
    { number: 5, title: "Benefits", description: "Additional benefits and requirements" },
    { number: 6, title: "Compensation", description: "Salary and location details" },
    { number: 7, title: "Review & Post", description: "Finalize and publish your job" }
  ]

  // Mock data (same as before)
  const jobsData = {
    posted: [
      {
        id: "1",
        title: "Live-in Nanny for 2 Children",
        type: "full-time",
        status: "active",
        applications: 12,
        salary: "350 OMR",
        location: "Muscat, Oman",
        postedDate: "2024-01-15",
        views: 45,
        description: "Looking for experienced nanny for two children aged 3 and 6. Must have childcare certification.",
        requirements: ["Childcare experience", "First aid certified", "English speaking"],
        duties: ["Childcare", "Educational activities", "Light housework"],
        household: {
          type: "Villa",
          bedrooms: 4,
          children: 2,
          floors: 2
        }
      }
    ],
    drafts: [],
    applicants: {}
  }

  // Skeleton loading components (same as before)
  const JobCardSkeleton = () => (
    <div className="rounded-2xl p-4 border border-border animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="border-0 rounded-lg p-6 animate-pulse">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Jobs Grid Skeleton */}
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <Briefcase className="h-6 w-6 md:h-8 md:w-8" style={{ color: currentTheme.colors.primary }} />
              My Job Postings
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              Manage your job postings and find the perfect household help
            </p>
          </div>
          <Button 
            onClick={() => setShowJobStepper(true)}
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Job Posting Stepper Modal */}
        {showJobStepper && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div 
              className="bg-background rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              style={{ border: `1px solid ${currentTheme.colors.border}` }}
            >
              {/* Stepper Header */}
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Post a New Job</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowJobStepper(false)}
                  >
                    ✕
                  </Button>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: currentStep >= step.number ? currentTheme.colors.primary : currentTheme.colors.backgroundLight,
                          color: currentStep >= step.number ? currentTheme.colors.text : currentTheme.colors.textLight,
                          border: `2px solid ${currentStep >= step.number ? currentTheme.colors.primary : currentTheme.colors.border}`
                        }}
                      >
                        {step.number}
                      </div>
                      {index < steps.length - 1 && (
                        <div 
                          className="flex-1 h-1 mx-2"
                          style={{
                            backgroundColor: currentStep > step.number ? currentTheme.colors.primary : currentTheme.colors.border
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <Progress value={(currentStep / steps.length) * 100} className="h-2" />
              </div>

              {/* Stepper Content */}
              <div className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Job Basic Information</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title *</label>
                        <Input 
                          placeholder="e.g., Live-in Nanny, House Manager, Cook"
                          value={jobForm.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Job Type *</label>
                        <Select value={jobForm.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time Live-in</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="live-out">Live-out</SelectItem>
                            <SelectItem value="flexible">Flexible Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Job Description *</label>
                        <Textarea 
                          placeholder="Describe the role, responsibilities, and what you're looking for..."
                          rows={4}
                          value={jobForm.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Household Information</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Residence Type *</label>
                        <Select value={jobForm.residenceType} onValueChange={(value) => handleInputChange('residenceType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                            <SelectItem value="mansion">Mansion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Bedrooms *</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={jobForm.bedrooms}
                          onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Bathrooms *</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={jobForm.bathrooms}
                          onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Total Floors *</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={jobForm.totalFloors}
                          onChange={(e) => handleInputChange('totalFloors', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Square Meters</label>
                        <Input 
                          type="number" 
                          min="50"
                          value={jobForm.squareMeters}
                          onChange={(e) => handleInputChange('squareMeters', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Additional Facilities</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="garden"
                            checked={jobForm.hasGarden}
                            onCheckedChange={(checked) => handleInputChange('hasGarden', checked)}
                          />
                          <label htmlFor="garden" className="text-sm">Garden</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="pool"
                            checked={jobForm.hasPool}
                            onCheckedChange={(checked) => handleInputChange('hasPool', checked)}
                          />
                          <label htmlFor="pool" className="text-sm">Swimming Pool</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Family Details</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Total Family Members *</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={jobForm.familyMembers}
                          onChange={(e) => handleInputChange('familyMembers', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Number of Children</label>
                        <Input 
                          type="number" 
                          min="0"
                          value={jobForm.childrenCount}
                          onChange={(e) => handleInputChange('childrenCount', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    {jobForm.childrenCount > 0 && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Children's Ages</label>
                        <div className="grid grid-cols-2 gap-3">
                          {Array.from({ length: jobForm.childrenCount }, (_, i) => (
                            <Input 
                              key={i}
                              placeholder={`Child ${i + 1} age`}
                              value={jobForm.childrenAges[i] || ""}
                              onChange={(e) => {
                                const newAges = [...jobForm.childrenAges]
                                newAges[i] = e.target.value
                                handleInputChange('childrenAges', newAges)
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Special Care Requirements</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="elderly"
                            checked={jobForm.elderlyCare}
                            onCheckedChange={(checked) => handleInputChange('elderlyCare', checked)}
                          />
                          <label htmlFor="elderly" className="text-sm">Elderly Care</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="special-needs"
                            checked={jobForm.specialNeeds}
                            onCheckedChange={(checked) => handleInputChange('specialNeeds', checked)}
                          />
                          <label htmlFor="special-needs" className="text-sm">Special Needs</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Pets in Household</label>
                      <div className="grid grid-cols-2 gap-3">
                        {petOptions.map((pet) => (
                          <div key={pet.value} className="flex items-center space-x-2">
                            <Checkbox 
                              id={pet.value}
                              checked={jobForm.pets.includes(pet.value)}
                              onCheckedChange={() => handlePetToggle(pet.value)}
                            />
                            <label htmlFor={pet.value} className="text-sm flex items-center gap-2">
                              <pet.icon className="h-4 w-4" />
                              {pet.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Job Requirements & Duties</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-3 block">Select Duties *</label>
                        <div className="grid grid-cols-2 gap-3">
                          {dutyOptions.map((duty) => (
                            <div key={duty.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={duty.value}
                                checked={jobForm.duties.includes(duty.value)}
                                onCheckedChange={() => handleDutyToggle(duty.value)}
                              />
                              <label htmlFor={duty.value} className="text-sm flex items-center gap-2">
                                <duty.icon className="h-4 w-4" />
                                {duty.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Experience Required *</label>
                        <Select value={jobForm.experienceRequired} onValueChange={(value) => handleInputChange('experienceRequired', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no experience">No Experience</SelectItem>
                            <SelectItem value="1-2 years">1-2 Years</SelectItem>
                            <SelectItem value="3-5 years">3-5 Years</SelectItem>
                            <SelectItem value="5+ years">5+ Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Working Hours *</label>
                        <Select value={jobForm.workingHours} onValueChange={(value) => handleInputChange('workingHours', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8 hours">8 Hours/Day</SelectItem>
                            <SelectItem value="10 hours">10 Hours/Day</SelectItem>
                            <SelectItem value="12 hours">12 Hours/Day</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Accommodation *</label>
                          <Select value={jobForm.accommodation} onValueChange={(value) => handleInputChange('accommodation', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="provided">Provided</SelectItem>
                              <SelectItem value="not-provided">Not Provided</SelectItem>
                              <SelectItem value="shared">Shared Room</SelectItem>
                              <SelectItem value="private">Private Room</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Meals *</label>
                          <Select value={jobForm.meals} onValueChange={(value) => handleInputChange('meals', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="included">Included</SelectItem>
                              <SelectItem value="not-included">Not Included</SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Benefits & Certifications</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-3 block">Offered Benefits</label>
                        <div className="grid grid-cols-2 gap-3">
                          {benefitOptions.map((benefit) => (
                            <div key={benefit.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={benefit.value}
                                checked={jobForm.benefits.includes(benefit.value)}
                                onCheckedChange={() => handleBenefitToggle(benefit.value)}
                              />
                              <label htmlFor={benefit.value} className="text-sm flex items-center gap-2">
                                <benefit.icon className="h-4 w-4" />
                                {benefit.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block">Required Certifications</label>
                        <div className="grid grid-cols-2 gap-3">
                          {certificationOptions.map((cert) => (
                            <div key={cert.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={cert.value}
                                checked={jobForm.certifications.includes(cert.value)}
                                onCheckedChange={() => handleCertificationToggle(cert.value)}
                              />
                              <label htmlFor={cert.value} className="text-sm flex items-center gap-2">
                                <cert.icon className="h-4 w-4" />
                                {cert.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Compensation & Location</h3>
                    
                    {/* Smart Salary Calculator */}
                    <Card className="border-2 border-blue-200 bg-blue-50/50">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Calculator className="h-5 w-5 text-blue-600" />
                          Smart Salary Calculator
                        </CardTitle>
                        <CardDescription>
                          Based on Oman Labor Law 2025 and your requirements
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-blue-800">Recommended Monthly Salary</div>
                            <div className="text-sm text-blue-700">
                              Calculated based on job complexity and market rates
                            </div>
                          </div>
                          <div className="text-right">
                            {isCalculatingSalary ? (
                              <div className="flex items-center gap-2 text-blue-600">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                                <span className="font-medium">Calculating...</span>
                              </div>
                            ) : (
                              <div>
                                <div className="text-3xl font-bold text-blue-900">{calculatedSalary} OMR</div>
                                <Badge className="bg-green-500 text-white border-0 mt-1">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Omani Law Compliant
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={jobForm.autoSalaryCalculation}
                            onCheckedChange={(checked) => handleInputChange('autoSalaryCalculation', checked)}
                          />
                          <label className="text-sm font-medium">Auto-calculate salary based on requirements</label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Monthly Salary (OMR) *</label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            min="320"
                            value={jobForm.autoSalaryCalculation ? calculatedSalary : jobForm.salary}
                            onChange={(e) => handleInputChange('salary', parseInt(e.target.value))}
                            disabled={jobForm.autoSalaryCalculation}
                          />
                          <span className="text-sm font-medium">OMR</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Minimum required: 320 OMR according to Omani Law
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Available From *</label>
                        <Input 
                          type="date"
                          value={jobForm.availableFrom}
                          onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City *</label>
                        <Input 
                          placeholder="e.g., Muscat, Salalah"
                          value={jobForm.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Address</label>
                        <Input 
                          placeholder="Street address"
                          value={jobForm.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="interview"
                        checked={jobForm.interviewRequired}
                        onCheckedChange={(checked) => handleInputChange('interviewRequired', checked)}
                      />
                      <label htmlFor="interview" className="text-sm">
                        Interview required before hiring
                      </label>
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Review & Post Job</h3>
                    
                    {/* Salary Summary */}
                    <Card className="border-2 border-green-200 bg-green-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-green-800">Final Monthly Salary</div>
                            <div className="text-2xl font-bold text-green-900">{calculatedSalary} OMR</div>
                            <div className="text-sm text-green-700 mt-1">
                              Based on your requirements and Omani labor laws
                            </div>
                          </div>
                          <Badge className="bg-green-500 text-white border-0">
                            <Scale className="h-3 w-3 mr-1" />
                            Law Compliant
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Job Summary */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Job Summary</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Position</div>
                          <div className="font-medium">{jobForm.jobTitle}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Job Type</div>
                          <div className="font-medium">{jobForm.jobType}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Location</div>
                          <div className="font-medium">{jobForm.city}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Family Size</div>
                          <div className="font-medium">{jobForm.familyMembers} members</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Children</div>
                          <div className="font-medium">{jobForm.childrenCount} children</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Experience Required</div>
                          <div className="font-medium">{jobForm.experienceRequired}</div>
                        </div>
                      </div>
                    </div>

                    {/* Benefits Summary */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Included Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobForm.benefits.map(benefit => {
                          const benefitInfo = benefitOptions.find(b => b.value === benefit)
                          return benefitInfo ? (
                            <Badge key={benefit} variant="outline" className="flex items-center gap-1">
                              <benefitInfo.icon className="h-3 w-3" />
                              {benefitInfo.label}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms"
                          checked={jobForm.agreeToTerms}
                          onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                        />
                        <label htmlFor="terms" className="text-sm">
                          I agree to the Kazipert Employer Agreement and Omani Labor Laws
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="support"
                          checked={jobForm.emergencySupport}
                          onCheckedChange={(checked) => handleInputChange('emergencySupport', checked)}
                        />
                        <label htmlFor="support" className="text-sm">
                          Enable 24/7 emergency support for this position
                        </label>
                      </div>
                    </div>
                    
                    {/* Legal Compliance Section */}
                    <Card className="border-2 border-blue-200 bg-blue-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Scale className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <div className="font-semibold text-blue-800">Legal Compliance Check</div>
                            <div className="text-sm text-blue-700 mt-1">
                              ✓ Meets Omani minimum wage requirements<br/>
                              ✓ Includes mandatory benefits<br/>
                              ✓ Complies with working hour regulations<br/>
                              ✓ Provides required accommodation standards
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Stepper Footer */}
              <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    {currentStep === steps.length ? (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => submitJob(true)}
                        >
                          Save as Draft
                        </Button>
                        <Button 
                          onClick={() => submitJob(false)}
                          disabled={!jobForm.agreeToTerms}
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post Job
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={nextStep}
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applicants View Modal */}
        {applicantsView && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div 
              className="bg-background rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              style={{ border: `1px solid ${currentTheme.colors.border}` }}
            >
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Applicants for {jobsData.posted.find(j => j.id === applicantsView)?.title}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setApplicantsView(null)}>✕</Button>
                </div>
                <p className="text-muted-foreground">
                  Review and select candidates for your position
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                {jobsData.applicants[applicantsView as keyof typeof jobsData.applicants]?.map((applicant) => (
                  <div 
                    key={applicant.id}
                    className="rounded-xl p-4 border transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: currentTheme.colors.backgroundLight,
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                          style={{ backgroundColor: currentTheme.colors.primary }}
                        >
                          {applicant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{applicant.name}</h3>
                          <p className="text-muted-foreground">{applicant.experience} experience</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="font-medium">{applicant.rating}</span>
                            <Badge 
                              className="ml-2"
                              style={{
                                backgroundColor: currentTheme.colors.primary + '20',
                                color: currentTheme.colors.primary
                              }}
                            >
                              {applicant.match} match
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(applicant.status)}>
                        {applicant.status === 'new' ? 'New' : 'Reviewed'}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>
                            {applicant.salary}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Available {applicant.available}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        size="sm"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-3 p-1 rounded-lg bg-muted/50"
              >
                <TabsTrigger 
                  value="posted" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'posted' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'posted' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Briefcase className="h-3 w-3 mr-1" />
                  Posted Jobs
                </TabsTrigger>
                <TabsTrigger 
                  value="drafts" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'drafts' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'drafts' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Drafts
                </TabsTrigger>
                <TabsTrigger 
                  value="closed" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'closed' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'closed' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Closed
                </TabsTrigger>
              </TabsList>

              {/* Posted Jobs Tab */}
              <TabsContent value="posted" className="space-y-4 p-6">
                {jobsData.posted.length > 0 ? (
                  <div className="grid gap-4">
                    {jobsData.posted.map((job) => (
                      <div 
                        key={job.id}
                        className="rounded-2xl p-4 border transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: currentTheme.colors.backgroundLight,
                          borderColor: currentTheme.colors.border
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {job.applications} applicants
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {job.views} views
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Posted on {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setApplicantsView(job.id)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              View Applicants ({job.applications})
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No Posted Jobs</h3>
                    <p className="text-muted-foreground mb-6">Get started by posting your first job</p>
                    <Button 
                      onClick={() => setShowJobStepper(true)}
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: currentTheme.colors.text
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Drafts Tab */}
              <TabsContent value="drafts" className="space-y-4 p-6">
                {jobsData.drafts.length > 0 ? (
                  <div className="grid gap-4">
                    {jobsData.drafts.map((draft) => (
                      <div 
                        key={draft.id}
                        className="rounded-2xl p-4 border transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: currentTheme.colors.backgroundLight,
                          borderColor: currentTheme.colors.border
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{draft.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {draft.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {draft.salary}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(draft.status)}>
                            {draft.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Last edited {new Date(draft.lastEdited).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowJobStepper(true)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Continue Editing
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No Drafts</h3>
                    <p className="text-muted-foreground">Save jobs as drafts to finish later</p>
                  </div>
                )}
              </TabsContent>

              {/* Closed Tab */}
              <TabsContent value="closed" className="space-y-4 p-6">
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No Closed Jobs</h3>
                  <p className="text-muted-foreground">Closed jobs will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}