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
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import { jobService, type JobFormData } from "@/lib/services/jobService"
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
  Shield,
  FileText,
  CheckCircle,
  Calendar,
  MessageCircle,
  Star,
  Calculator,
  Sparkles,
  Award,
  HeartHandshake,
  Building2,
  Baby as BabyIcon,
  UserCheck,
  BookOpen,
  Dog,
  Cat,
  Plane,
  GraduationCap,
  ArrowLeft,
  Send,
  PartyPopper,
  Scale,
  ShieldCheck,
  Group,
  ShoppingCart,
  Sprout,
  Droplets,
  Car
} from "lucide-react"
import { ApplicationStepper } from "@/components/application-stepper"

// Define color scheme
const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82', 
  accent: '#6c71b5',
  brown: '#8B7355',
  background: '#f8fafc',
  backgroundLight: '#ffffff',
  text: '#1a202c',
  textLight: '#718096',
  border: '#e2e8f0'
}

// Job categories for Oman domestic workers
const JOB_CATEGORIES = [
  { value: "GENERAL_HOUSE_HELP", label: "General House Help", description: "Cleaning, laundry, basic cooking" },
  { value: "ELDERLY_CARE", label: "Elderly Person Care", description: "Companionship, medication, mobility assistance" },
  { value: "CHILD_CARE", label: "Child Care / Nanny", description: "Childcare, homework help, activities" },
  { value: "COOKING_SPECIALIST", label: "Cooking Specialist", description: "Meal preparation, dietary planning" },
  { value: "HOUSE_MANAGER", label: "House Manager", description: "Supervision, coordination, management" }
]

// Available from options
const AVAILABLE_FROM_OPTIONS = [
  { value: "IMMEDIATELY", label: "Immediately" },
  { value: "ONE_MONTH", label: "1 month from now" },
  { value: "TWO_MONTHS", label: "2 months from now" },
  { value: "SPECIFIC_DATE", label: "Specific date" }
]

// Initial job form state
const initialJobForm = {
  // Step 1: Job Category & Attestation
  title: "",
  category: "GENERAL_HOUSE_HELP", // Default value that matches enum
  description: "",
  agreeToTruth: false,
  agreeToTerms: false,
  
  // Step 2: Household Details
  residenceType: "VILLA",
  bedrooms: 3,
  bathrooms: 2,
  totalFloors: 1,
  hasGarden: false,
  hasPool: false,
  squareMeters: 200,
  
  // Step 3: Family Details
  familyMembers: 4,
  childrenCount: 2,
  childrenAges: [] as string[],
  elderlyCare: false,
  specialNeeds: false,
  pets: [] as string[],
  
  // Step 4: Job Requirements
  duties: [] as string[],
  experienceRequired: "ONE_TO_TWO_YEARS",
  languageRequirements: ["English"] as string[],
  workingHours: "8 hours",
  vacationDays: 30,
  
  // Step 5: Benefits
  benefits: ["health-insurance", "annual-flight"] as string[],
  
  // Step 6: Final Details
  salary: 320,
  salaryCurrency: "OMR",
  location: "",
  city: "Muscat",
  availableFrom: "",
  availableFromType: "IMMEDIATELY",
  
  // Auto-calculated fields
  autoSalaryCalculation: true
}

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
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  // Real data states
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [drafts, setDrafts] = useState<any[]>([])
  const [closedJobs, setClosedJobs] = useState<any[]>([])

  // Job posting form state
  const [jobForm, setJobForm] = useState(initialJobForm)

  // Applicants modal states
  const [jobApplications, setJobApplications] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [loadingApplications, setLoadingApplications] = useState(false)

  // Calculate available from date based on selection
  const getAvailableFromDate = () => {
    const today = new Date()
    switch (jobForm.availableFromType) {
      case "immediately":
        return today.toISOString().split('T')[0]
      case "1_month":
        return new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0]
      case "2_months":
        return new Date(today.setMonth(today.getMonth() + 2)).toISOString().split('T')[0]
      case "specific_date":
        return jobForm.availableFrom
      default:
        return today.toISOString().split('T')[0]
    }
  }

  // Base salary calculation with reasonable maximum
  const calculateTotalSalary = () => {
    let baseSalary = 90 // Base OMR for up to 3 bedrooms, 2 children
    
    // Bedroom multiplier (beyond 3 bedrooms)
    if (jobForm.bedrooms > 3) {
      baseSalary += (jobForm.bedrooms - 3) * 10 // Reduced from 15
    }
    
    // Children multiplier (beyond 2 children)
    if (jobForm.childrenCount > 2) {
      baseSalary += (jobForm.childrenCount - 2) * 15 // Reduced from 20
    }
    
    // Special care additions
    if (jobForm.elderlyCare) baseSalary += 25 // Reduced from 30
    if (jobForm.specialNeeds) baseSalary += 30 // Reduced from 40
    
    // Residence type multiplier
    const residenceMultipliers = {
      "APARTMENT": 1.0,
      "VILLA": 1.15, // Reduced from 1.2
      "DUPLEX": 1.08, // Reduced from 1.1
      "MANSION": 1.25 // Reduced from 1.4
    }
    baseSalary *= residenceMultipliers[jobForm.residenceType as keyof typeof residenceMultipliers] || 1.0
    
    // Total floors multiplier
    if (jobForm.totalFloors > 1) {
      baseSalary += (jobForm.totalFloors - 1) * 5
    }
    
    // Garden and Pool additions
    if (jobForm.hasGarden) baseSalary += 8 // Reduced from 12
    if (jobForm.hasPool) baseSalary += 12 // Reduced from 18
    
    // Duties complexity
    jobForm.duties.forEach(duty => {
      const dutyValues: { [key: string]: number } = {
        "Childcare": 20, // Reduced
        "Elderly care": 25, // Reduced
        "Special needs care": 30, // Reduced
        "Cooking": 12, // Reduced
        "Cleaning": 8, // Reduced
        "Laundry": 6, // Reduced
        "Ironing": 6, // Reduced
        "Grocery shopping": 10, // Reduced
        "Pet care": 12, // Reduced
        "Gardening": 8, // Reduced
        "Pool maintenance": 10, // Reduced
        "House management": 20 // Reduced
      }
      baseSalary += dutyValues[duty] || 0
    })
    
    // Round to nearest 5 OMR and cap at reasonable maximum
    const finalSalary = Math.ceil(baseSalary / 5) * 5
    return Math.min(finalSalary, 180) // Cap at 180 OMR
  }

  // Enhanced duty options
  const dutyOptions = [
    { value: "Childcare", label: "Childcare", category: "care", icon: BabyIcon },
    { value: "Elderly care", label: "Elderly Care", category: "care", icon: UserCheck },
    { value: "Special needs care", label: "Special Needs Care", category: "care", icon: HeartHandshake },
    { value: "Cooking", label: "Cooking", category: "household", icon: Utensils },
    { value: "Cleaning", label: "Cleaning", category: "household", icon: Home },
    { value: "Laundry", label: "Laundry", category: "household", icon: FileText },
    { value: "Ironing", label: "Ironing", category: "household", icon: FileText },
    { value: "Grocery shopping", label: "Grocery Shopping", category: "shopping", icon: ShoppingCart },
    { value: "Pet care", label: "Pet Care", category: "care", icon: Dog },
    { value: "Gardening", label: "Gardening", category: "outdoor", icon: Sprout },
    { value: "Pool maintenance", label: "Pool Maintenance", category: "outdoor", icon: Droplets },
    { value: "House management", label: "House Management", category: "management", icon: Building2 }
  ]

  const benefitOptions = [
    { value: "health-insurance", label: "Health Insurance", icon: Shield, description: "Medical coverage", required: true },
    { value: "annual-flight", label: "Annual Flight Home", icon: Plane, description: "Yearly round-trip ticket", required: true },
    { value: "phone-allowance", label: "Phone Allowance", icon: GraduationCap, description: "Monthly phone credit", required: false },
    { value: "transportation", label: "Transportation Allowance", icon: Car, description: "Monthly transport stipend", required: false },
    { value: "education", label: "Education Support", icon: GraduationCap, description: "Training and courses", required: false },
    { value: "bonus", label: "Performance Bonus", icon: Award, description: "Yearly performance bonus", required: false }
  ]

  const petOptions = [
    { value: "dogs", label: "Dogs", icon: Dog },
    { value: "cats", label: "Cats", icon: Cat },
    { value: "other", label: "Other Pets", icon: Group }
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
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
      
      try {
        const jobsData = await jobService.getJobs({ 
          role: 'employer',
          status: activeTab === 'posted' ? 'ACTIVE' : 
                 activeTab === 'drafts' ? 'DRAFT' : 'CLOSED'
        })
        
        if (activeTab === 'posted') {
          setJobs(jobsData.jobs || [])
        } else if (activeTab === 'drafts') {
          setDrafts(jobsData.jobs || [])
        } else {
          setClosedJobs(jobsData.jobs || [])
        }

        const applicationsData = await jobService.getApplications({ role: 'employer' })
        setApplications(applicationsData || [])

      } catch (error) {
        console.error('Error loading data:', error)
        setJobs([])
        setApplications([])
        setDrafts([])
        setClosedJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, activeTab])

  // Smart salary calculation
  useEffect(() => {
    if (jobForm.autoSalaryCalculation) {
      setIsCalculatingSalary(true)
      const timer = setTimeout(() => {
        const newSalary = calculateTotalSalary()
        setCalculatedSalary(newSalary)
        setIsCalculatingSalary(false)
      }, 600)
      
      return () => clearTimeout(timer)
    }
  }, [
    jobForm.bedrooms,
    jobForm.childrenCount,
    jobForm.elderlyCare,
    jobForm.specialNeeds,
    jobForm.residenceType,
    jobForm.totalFloors,
    jobForm.hasGarden,
    jobForm.hasPool,
    jobForm.duties,
    jobForm.autoSalaryCalculation
  ])

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
    // Don't allow unchecking required benefits
    const benefitInfo = benefitOptions.find(b => b.value === benefit)
    if (benefitInfo?.required) return
    
    setJobForm(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
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

  const submitJob = async () => {
    try {
      const availableFromDate = getAvailableFromDate()
      
      const jobData = {
        ...jobForm,
        status: 'ACTIVE',
        salary: calculatedSalary,
        availableFrom: jobForm.availableFromType === "SPECIFIC_DATE" 
        ? jobForm.availableFrom 
        : jobForm.availableFromType,
        type: "FULL_TIME", // All jobs are live-in in Oman
        accommodation: "PROVIDED", // Compulsory in Oman
        meals: "INCLUDED", // Compulsory in Oman
        interviewRequired: true,
        childrenAges: jobForm.childrenAges || [],
        skills: [], // Add empty skills array as required by schema
        certifications: [], // Add empty certifications array as required by schema
        overtimeRequired: false // Add default value as required by schema
      }

      await jobService.createJob(jobData)
      
      const jobsData = await jobService.getJobs({ role: 'employer', status: 'ACTIVE' })
      setJobs(jobsData.jobs || [])
      
      setShowJobStepper(false)
      setShowSuccessAnimation(true)
      
      // Reset form after success
      setTimeout(() => {
        setCurrentStep(1)
        setJobForm(initialJobForm)
        setShowSuccessAnimation(false)
      }, 3000)
      
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job. Please try again.')
    }
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      await jobService.deleteJob(jobId)
      setJobs(prev => prev.filter(job => job.id !== jobId))
      setDrafts(prev => prev.filter(job => job.id !== jobId))
      setClosedJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job. Please try again.')
    }
  }

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      await jobService.updateJob(jobId, { status })
      
      const jobsData = await jobService.getJobs({ 
        role: 'employer', 
        status: status === 'ACTIVE' ? 'ACTIVE' : 'CLOSED' 
      })
      
      if (status === 'ACTIVE') {
        setJobs(jobsData.jobs || [])
        setClosedJobs(prev => prev.filter(job => job.id !== jobId))
      } else {
        setClosedJobs(jobsData.jobs || [])
        setJobs(prev => prev.filter(job => job.id !== jobId))
      }
    } catch (error) {
      console.error('Error updating job status:', error)
      alert('Failed to update job status. Please try again.')
    }
  }

  // Add this function to handle viewing applicants
  const handleViewApplicants = async (job: any) => {
    console.log('👥 Handling view applicants for job:', job.id)
    setSelectedJob(job)
    setApplicantsView(job.id)
    setLoadingApplications(true)
    
    try {
      console.log('📡 Fetching applications for job:', job.id)
      const applications = await jobService.getJobApplications(job.id)
      console.log('✅ Applications fetched:', applications.length)
      setJobApplications(applications)
    } catch (error) {
      console.error('❌ Error fetching applications:', error)
      alert('Failed to load applicants. Please try again.')
    } finally {
      setLoadingApplications(false)
    }
  }

  // Add this function to handle application actions
  const handleApplicationAction = async (applicationId: string, action: string, data?: any) => {
    console.log('🔄 Handling application action:', action, 'for application:', applicationId)
    
    try {
      switch (action) {
        case 'SHORTLISTED':
          await jobService.updateApplicationStep(applicationId, 'SHORTLISTED')
          break
        case 'INTERVIEW_SCHEDULED':
          // For demo, using current date + 3 days
          const interviewDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          await jobService.updateApplicationStep(applicationId, 'INTERVIEW_SCHEDULED', {
            interviewDate,
            interviewNotes: 'Please be prepared for the interview'
          })
          break
        case 'MEDICAL_REQUESTED':
          await jobService.updateApplicationStep(applicationId, 'MEDICAL_REQUESTED')
          break
        case 'CONTRACT_SENT':
          await jobService.updateApplicationStep(applicationId, 'CONTRACT_SENT', {
            contractUrl: '/sample-contract.pdf' // Replace with actual contract URL
          })
          break
        case 'FLIGHT_TICKET_SENT':
          // Handle flight ticket upload
          break
        default:
          await jobService.updateApplicationStep(applicationId, action, data)
      }
      
      // Refresh applications
      const applications = await jobService.getJobApplications(selectedJob.id)
      setJobApplications(applications)
      
      console.log('✅ Application action completed successfully')
    } catch (error) {
      console.error('❌ Error updating application:', error)
      alert('Failed to update application. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'DRAFT': return 'bg-gray-500/10 text-gray-600 border-gray-200'
      case 'CLOSED': return 'bg-red-500/10 text-red-600 border-red-200'
      default: return 'bg-blue-500/10 text-blue-600 border-blue-200'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'Active'
      case 'DRAFT': return 'Draft'
      case 'CLOSED': return 'Closed'
      default: return status
    }
  }

  const formatExperience = (experience: string) => {
    switch(experience) {
      case 'NO_EXPERIENCE': return 'No experience'
      case 'ONE_TO_TWO_YEARS': return '1-2 years'
      case 'THREE_TO_FIVE_YEARS': return '3-5 years'
      case 'FIVE_PLUS_YEARS': return '5+ years'
      default: return experience
    }
  }

  const steps = [
    { number: 1, title: "Job Category", description: "Select position type" },
    { number: 2, title: "Household Info", description: "Describe your home" },
    { number: 3, title: "Family Details", description: "About your family" },
    { number: 4, title: "Duties", description: "Required tasks" },
    { number: 5, title: "Benefits", description: "Additional benefits" },
    { number: 6, title: "Final Details", description: "Location & salary" }
  ]

  // Success Animation Component
  const SuccessAnimation = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully! 🎉</h3>
        <p className="text-gray-600 mb-6">
          Your job has been posted and is now visible to qualified candidates. 
          You'll be notified when applicants start applying.
        </p>
        <div className="animate-pulse">
          <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Your job is now live!</span>
          </div>
        </div>
        <Button 
          onClick={() => setShowSuccessAnimation(false)}
          className="w-full"
          style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
        >
          View Job Posting
        </Button>
      </div>
    </div>
  )

  // Terms & Conditions Modal
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Terms & Conditions</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowTermsModal(false)}>✕</Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Employer Responsibilities</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Provide suitable accommodation as per Omani labor laws</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Provide three meals daily or equivalent meal allowance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Pay monthly salary on time as agreed</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Provide 30 days annual leave with return ticket</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal Compliance</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Comply with Oman Labor Law provisions for domestic workers</span>
              </li>
              <li className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Maintain valid employment contract registered with authorities</span>
              </li>
              <li className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Provide medical insurance as required by law</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agree-terms"
              checked={jobForm.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
            />
            <label htmlFor="agree-terms" className="text-sm font-medium">
              I agree to all terms and conditions above
            </label>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowTermsModal(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              disabled={!jobForm.agreeToTerms}
              onClick={() => {
                setShowTermsModal(false)
                submitJob()
              }}
              style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
            >
              Agree & Post Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Applicants Modal Component
  const ApplicantsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Applicants for {selectedJob?.title}</h3>
            <p className="text-gray-600">
              {selectedJob?.city} • {selectedJob?.salary} {selectedJob?.salaryCurrency} • 
              {jobApplications.length} applicant{jobApplications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setApplicantsView(null)
              setSelectedJob(null)
              setJobApplications([])
            }}
          >
            ✕
          </Button>
        </div>
        
        {loadingApplications ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : jobApplications.length > 0 ? (
          <div className="space-y-6">
            {jobApplications.map((application) => (
              <Card key={application.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {application.employee?.firstName?.[0]}{application.employee?.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {application.employee?.firstName} {application.employee?.lastName}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>
                              Age: {application.employee?.kycDetails?.dateOfBirth ? 
                                Math.floor((new Date().getTime() - new Date(application.employee.kycDetails.dateOfBirth).getTime()) / 3.15576e+10) : 'N/A'
                              }
                            </span>
                            <span>
                              Experience: {application.employee?.kycDetails?.workExperience || 'N/A'}
                            </span>
                            <span>
                              Applied: {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* KYC Status */}
                      <div className="flex gap-2 mb-3">
                        <Badge variant={application.employee?.kycDetails?.profileVerified ? 'default' : 'outline'}>
                          Profile {application.employee?.kycDetails?.profileVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge variant={application.employee?.kycDetails?.idVerified ? 'default' : 'outline'}>
                          ID {application.employee?.kycDetails?.idVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge variant={application.employee?.kycDetails?.medicalVerified ? 'default' : 'outline'}>
                          Medical {application.employee?.kycDetails?.medicalVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>

                      {/* Application Status */}
                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={
                          application.status === 'SHORTLISTED' ? 'bg-green-500 text-white' :
                          application.status === 'REJECTED' ? 'bg-red-500 text-white' :
                          application.status === 'UNDER_REVIEW' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }>
                          {application.status?.replace('_', ' ') || 'PENDING'}
                        </Badge>
                        <span className="text-gray-600">
                          Current Step: {application.currentStep?.replace('_', ' ') || 'Application Submitted'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApplicationAction(application.id, 'SHORTLISTED')}
                        disabled={application.status === 'SHORTLISTED'}
                      >
                        {application.status === 'SHORTLISTED' ? 'Shortlisted' : 'Shortlist'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Application Progress Stepper */}
                  <div className="mt-6 pt-4 border-t">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">Application Progress</h5>
                    <ApplicationStepper 
                      currentStep={application.currentStep || 'APPLICATION_SUBMITTED'}
                      application={application}
                      role="employer"
                      onAction={(step) => handleApplicationAction(application.id, step)}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleApplicationAction(application.id, 'INTERVIEW_SCHEDULED')}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Applicants Yet</h4>
            <p className="text-gray-600">No one has applied for this job yet.</p>
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoadingSpinner />
  }

  const currentJobs = activeTab === 'posted' ? jobs : 
                    activeTab === 'drafts' ? drafts : 
                    closedJobs

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3 text-gray-900">
              <Briefcase className="h-6 w-6 md:h-8 md:w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              My Job Postings
            </h1>
            <p className="text-sm md:text-xl text-gray-600">
              Manage your job postings and find the perfect household help
            </p>
          </div>
          {!showJobStepper && (
            <Button 
              onClick={() => setShowJobStepper(true)}
              style={{
                backgroundColor: KAZIPERT_COLORS.primary,
                color: 'white'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          )}
        </div>

        {/* Job Posting Stepper */}
        {showJobStepper ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowJobStepper(false)
                      setCurrentStep(1)
                      setJobForm(initialJobForm)
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Jobs
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
                    <p className="text-gray-600">Find the perfect domestic help for your household</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Step {currentStep} of {steps.length}</div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between mb-8 px-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= step.number 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className="text-xs mt-2 font-medium text-center max-w-20">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Stepper Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Step 1: Job Category & Attestation */}
                  {currentStep === 1 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <User className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                          Select Job Category
                        </CardTitle>
                        <CardDescription>
                          Choose the type of domestic help you need
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4">
                          {JOB_CATEGORIES.map((category) => (
                            <div
                              key={category.value}
                              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                jobForm.category === category.value 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => {
                                handleInputChange('category', category.value)
                                handleInputChange('title', category.label)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">{category.label}</div>
                                  <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                                </div>
                                {jobForm.category === category.value && (
                                  <CheckCircle className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-medium text-gray-700">Job Description</label>
                          <Textarea 
                            placeholder="Describe the specific responsibilities and what you're looking for in a candidate..."
                            rows={4}
                            value={jobForm.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                          />
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Scale className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <div className="font-semibold text-yellow-800">Important Notice</div>
                            <div className="text-sm text-yellow-700 mt-1">
                              By proceeding, you confirm that all information provided is accurate and 
                              you agree to provide accommodation and meals as required by Omani law.
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="truth-attestation"
                            checked={jobForm.agreeToTruth}
                            onCheckedChange={(checked) => handleInputChange('agreeToTruth', checked)}
                          />
                          <label htmlFor="truth-attestation" className="text-sm font-medium text-gray-700">
                            I confirm all information provided is accurate and truthful
                          </label>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Household Details */}
                  {currentStep === 2 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <Home className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                          Household Information
                        </CardTitle>
                        <CardDescription>
                          Tell us about your home and facilities
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Residence Type</label>
                            <Select value={jobForm.residenceType} onValueChange={(value) => handleInputChange('residenceType', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APARTMENT">Apartment</SelectItem>
                                <SelectItem value="VILLA">Villa</SelectItem>
                                <SelectItem value="DUPLEX">Duplex</SelectItem>
                                <SelectItem value="MANSION">Mansion</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Number of Bedrooms</label>
                            <Input 
                              type="number" 
                              min="1"
                              value={jobForm.bedrooms}
                              onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Number of Bathrooms</label>
                            <Input 
                              type="number" 
                              min="1"
                              value={jobForm.bathrooms}
                              onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Total Floors</label>
                            <Input 
                              type="number" 
                              min="1"
                              value={jobForm.totalFloors}
                              onChange={(e) => handleInputChange('totalFloors', parseInt(e.target.value))}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Additional Facilities</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="garden"
                                checked={jobForm.hasGarden}
                                onCheckedChange={(checked) => handleInputChange('hasGarden', checked)}
                              />
                              <label htmlFor="garden" className="text-sm text-gray-700">Garden</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="pool"
                                checked={jobForm.hasPool}
                                onCheckedChange={(checked) => handleInputChange('hasPool', checked)}
                              />
                              <label htmlFor="pool" className="text-sm text-gray-700">Swimming Pool</label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Family Details */}
                  {currentStep === 3 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <Users className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                          Family Details
                        </CardTitle>
                        <CardDescription>
                          Information about your family members
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Total Family Members</label>
                            <Input 
                              type="number" 
                              min="1"
                              value={jobForm.familyMembers}
                              onChange={(e) => handleInputChange('familyMembers', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Number of Children</label>
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
                            <label className="text-sm font-medium text-gray-700">Children's Ages</label>
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
                          <label className="text-sm font-medium text-gray-700">Special Care Requirements</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="elderly"
                                checked={jobForm.elderlyCare}
                                onCheckedChange={(checked) => handleInputChange('elderlyCare', checked)}
                              />
                              <label htmlFor="elderly" className="text-sm text-gray-700">Elderly Care Needed</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="special-needs"
                                checked={jobForm.specialNeeds}
                                onCheckedChange={(checked) => handleInputChange('specialNeeds', checked)}
                              />
                              <label htmlFor="special-needs" className="text-sm text-gray-700">Special Needs Care</label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Pets in Household</label>
                          <div className="grid grid-cols-2 gap-3">
                            {petOptions.map((pet) => (
                              <div key={pet.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={pet.value}
                                  checked={jobForm.pets.includes(pet.value)}
                                  onCheckedChange={() => handlePetToggle(pet.value)}
                                />
                                <label htmlFor={pet.value} className="text-sm text-gray-700 flex items-center gap-2">
                                  <pet.icon className="h-4 w-4" />
                                  {pet.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 4: Duties */}
                  {currentStep === 4 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <CheckCircle className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                          Required Duties
                        </CardTitle>
                        <CardDescription>
                          Select the tasks and responsibilities for this position
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dutyOptions.map((duty) => (
                            <div key={duty.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-gray-400 transition-colors">
                              <Checkbox 
                                id={duty.value}
                                checked={jobForm.duties.includes(duty.value)}
                                onCheckedChange={() => handleDutyToggle(duty.value)}
                              />
                              <label htmlFor={duty.value} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <duty.icon className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">{duty.label}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 5: Benefits */}
                  {currentStep === 5 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <Award className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                          Additional Benefits
                        </CardTitle>
                        <CardDescription>
                          Select benefits you will provide (recommended for better candidates)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {benefitOptions.map((benefit) => (
                            <div key={benefit.value} className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                              benefit.required ? 'bg-blue-50 border-blue-200' : 'hover:border-gray-400'
                            }`}>
                              <Checkbox 
                                id={benefit.value}
                                checked={jobForm.benefits.includes(benefit.value)}
                                onCheckedChange={() => handleBenefitToggle(benefit.value)}
                                disabled={benefit.required}
                              />
                              <label htmlFor={benefit.value} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  <benefit.icon className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-700">{benefit.label}</span>
                                  {benefit.required && (
                                    <Badge className="bg-blue-500 text-white text-xs">Required</Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">{benefit.description}</div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 6: Final Details */}
                  {currentStep === 6 && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <MapPin className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
                          Final Details
                        </CardTitle>
                        <CardDescription>
                          Location and availability information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City *</label>
                            <Input 
                              placeholder="e.g., Muscat, Salalah"
                              value={jobForm.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Available From *</label>
                            <Select 
                              value={jobForm.availableFromType} 
                              onValueChange={(value) => handleInputChange('availableFromType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AVAILABLE_FROM_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {jobForm.availableFromType === "specific_date" && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Specific Date</label>
                            <Input 
                              type="date"
                              value={jobForm.availableFrom}
                              onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Neighborhood / Area</label>
                          <Input 
                            placeholder="e.g., Al Khuwair, Shatti Al Qurm"
                            value={jobForm.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                          />
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-semibold text-blue-800">Live-in Position</div>
                              <div className="text-sm text-blue-700">
                                Accommodation and meals will be provided as required by Omani law
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>
                    
                    {currentStep === steps.length ? (
                      <Button 
                        onClick={() => setShowTermsModal(true)}
                        disabled={!jobForm.agreeToTruth}
                        style={{
                          backgroundColor: KAZIPERT_COLORS.primary,
                          color: 'white'
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Review & Post Job
                      </Button>
                    ) : (
                      <Button 
                        onClick={nextStep}
                        disabled={currentStep === 1 && !jobForm.agreeToTruth}
                        style={{
                          backgroundColor: KAZIPERT_COLORS.primary,
                          color: 'white'
                        }}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right Side - Salary Calculator */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg sticky top-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Calculator className="h-5 w-5" style={{ color: KAZIPERT_COLORS.accent }} />
                        Salary Calculator
                      </CardTitle>
                      <CardDescription>
                        Live calculation based on your requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        {isCalculatingSalary ? (
                          <div className="flex items-center justify-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                            <span className="font-medium">Calculating...</span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{calculatedSalary} OMR</div>
                            <div className="text-sm text-gray-600 mt-1">Monthly Salary</div>
                            <Badge className="bg-green-500 text-white border-0 mt-2">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Omani Law Compliant
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base (3 bed, 2 children)</span>
                          <span className="font-medium">90 OMR</span>
                        </div>
                        
                        {jobForm.bedrooms > 3 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Extra bedrooms</span>
                            <span className="font-medium text-green-600">+{(jobForm.bedrooms - 3) * 10} OMR</span>
                          </div>
                        )}
                        
                        {jobForm.childrenCount > 2 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Extra children</span>
                            <span className="font-medium text-green-600">+{(jobForm.childrenCount - 2) * 15} OMR</span>
                          </div>
                        )}
                        
                        {jobForm.elderlyCare && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Elderly care</span>
                            <span className="font-medium text-green-600">+25 OMR</span>
                          </div>
                        )}
                        
                        {jobForm.specialNeeds && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Special needs</span>
                            <span className="font-medium text-green-600">+30 OMR</span>
                          </div>
                        )}

                        {jobForm.hasGarden && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Garden maintenance</span>
                            <span className="font-medium text-green-600">+8 OMR</span>
                          </div>
                        )}

                        {jobForm.hasPool && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pool maintenance</span>
                            <span className="font-medium text-green-600">+12 OMR</span>
                          </div>
                        )}

                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm font-semibold">
                            <span>Total Monthly</span>
                            <span>{calculatedSalary} OMR</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-700">
                            <div className="font-semibold">Smart Calculation</div>
                            <div>Salary adjusts automatically as you add requirements</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Summary */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-900">Job Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Position:</span>
                        <span className="font-medium text-gray-900">{jobForm.title || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Family Size:</span>
                        <span className="font-medium text-gray-900">{jobForm.familyMembers} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Children:</span>
                        <span className="font-medium text-gray-900">{jobForm.childrenCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bedrooms:</span>
                        <span className="font-medium text-gray-900">{jobForm.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duties:</span>
                        <span className="font-medium text-gray-900">{jobForm.duties.length} selected</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Original Tabs Content */
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-2 bg-gray-100/50 rounded-lg">
                  <TabsTrigger 
                    value="posted" 
                    className="rounded-md text-sm font-medium data-[state=active]:shadow-lg transition-all"
                    style={{ 
                      backgroundColor: activeTab === 'posted' ? KAZIPERT_COLORS.primary : 'transparent',
                      color: activeTab === 'posted' ? 'white' : KAZIPERT_COLORS.textLight
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Posted Jobs
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                      {jobs.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="drafts" 
                    className="rounded-md text-sm font-medium data-[state=active]:shadow-lg transition-all"
                    style={{ 
                      backgroundColor: activeTab === 'drafts' ? KAZIPERT_COLORS.primary : 'transparent',
                      color: activeTab === 'drafts' ? 'white' : KAZIPERT_COLORS.textLight
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Drafts
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                      {drafts.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="closed" 
                    className="rounded-md text-sm font-medium data-[state=active]:shadow-lg transition-all"
                    style={{ 
                      backgroundColor: activeTab === 'closed' ? KAZIPERT_COLORS.primary : 'transparent',
                      color: activeTab === 'closed' ? 'white' : KAZIPERT_COLORS.textLight
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Closed
                    <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                      {closedJobs.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                {/* Tab contents */}
                <TabsContent value="posted" className="space-y-4 p-6">
                  {jobs.length > 0 ? (
                    <div className="grid gap-4">
                      {jobs.map((job) => (
                        <div 
                          key={job.id}
                          className="rounded-2xl p-4 border border-gray-200 transition-all duration-300 hover:scale-105 bg-white"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 text-gray-900">{job.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.city}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary} {job.salaryCurrency}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {job._count?.applications || 0} applicants
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {job._count?.views || 0} views
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {job.duties.slice(0, 3).map((duty: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {duty}
                                  </Badge>
                                ))}
                                {job.duties.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{job.duties.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusText(job.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Posted on {new Date(job.postedAt || job.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewApplicants(job)}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                View Applicants ({job._count?.applications || 0})
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateJobStatus(job.id, 'CLOSED')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Close Job
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">No Posted Jobs</h3>
                      <p className="text-gray-600 mb-6">Get started by posting your first job</p>
                      <Button 
                        onClick={() => setShowJobStepper(true)}
                        style={{
                          backgroundColor: KAZIPERT_COLORS.primary,
                          color: 'white'
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="drafts" className="space-y-4 p-6">
                  {drafts.length > 0 ? (
                    <div className="grid gap-4">
                      {drafts.map((draft) => (
                        <div 
                          key={draft.id}
                          className="rounded-2xl p-4 border border-gray-200 transition-all duration-300 hover:scale-105 bg-white"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1 text-gray-900">{draft.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {draft.city}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {draft.salary} {draft.salaryCurrency}
                                </div>
                              </div>
                            </div>
                            <Badge className={getStatusColor(draft.status)}>
                              {getStatusText(draft.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Last edited {new Date(draft.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setJobForm(draft)
                                  setShowJobStepper(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Continue Editing
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteJob(draft.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">No Drafts</h3>
                      <p className="text-gray-600">Save jobs as drafts to finish later</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="closed" className="space-y-4 p-6">
                  {closedJobs.length > 0 ? (
                    <div className="grid gap-4">
                      {closedJobs.map((job) => (
                        <div 
                          key={job.id}
                          className="rounded-2xl p-4 border border-gray-200 transition-all duration-300 hover:scale-105 bg-white"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 text-gray-900">{job.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {job.city}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary} {job.salaryCurrency}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {job._count?.applications || 0} applicants
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                            </div>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusText(job.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Closed on {new Date(job.closedAt || job.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateJobStatus(job.id, 'ACTIVE')}
                              >
                                <Briefcase className="h-4 w-4 mr-2" />
                                Reopen
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">No Closed Jobs</h3>
                      <p className="text-gray-600">Closed jobs will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Success Animation */}
        {showSuccessAnimation && <SuccessAnimation />}

        {/* Terms Modal */}
        {showTermsModal && <TermsModal />}

        {/* Applicants Modal */}
        {applicantsView && selectedJob && <ApplicantsModal />}
      </div>
    </div>
  )
}