// Mock data for the Kazipert platform

export interface User {
  id: string
  email: string
  name: string
  role: "worker" | "employer" | "admin"
  phone: string
  avatar?: string
  kycStatus: "pending" | "verified" | "rejected"
  createdAt: string
}

export interface WorkerProfile extends User {
  role: "worker"
  age: number
  nationality: string
  experience: string
  skills: string[]
  languages: string[]
  education: string
  availability: string
  preferredLocation: string
  salaryExpectation: string
  documents: {
    passport: boolean
    certificate: boolean
    medicalReport: boolean
  }
  subscriptions: {
    insurance: boolean
    legal: boolean
    medical: boolean
  }
}

export interface EmployerProfile extends User {
  role: "employer"
  company: string
  location: string
  country: string
  familySize: number
  houseType: string
  requirements: string[]
  subscriptions: {
    insurance: boolean
    legal: boolean
  }
}

export interface Job {
  id: string
  employerId: string
  employerName: string
  title: string
  location: string
  country: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  status: "open" | "filled" | "closed"
  postedDate: string
}

export interface Contract {
  id: string
  workerId: string
  workerName: string
  employerId: string
  employerName: string
  jobId: string
  jobTitle: string
  salary: string
  duration: string
  startDate: string
  status: "pending" | "signed" | "active" | "completed"
  signedDate?: string
}

// Mock Users
export const mockWorkers: WorkerProfile[] = [
  {
    id: "w1",
    email: "amina.hassan@email.com",
    name: "Amina Hassan",
    role: "worker",
    phone: "+254 712 345 678",
    avatar: "/african-woman-professional.jpg",
    kycStatus: "verified",
    createdAt: "2024-01-15",
    age: 28,
    nationality: "Kenyan",
    experience: "5 years in domestic work",
    skills: ["Cooking", "Cleaning", "Childcare", "Elderly Care"],
    languages: ["English", "Swahili", "Basic Arabic"],
    education: "Certificate in Hospitality Management",
    availability: "Immediate",
    preferredLocation: "Muscat, Oman",
    salaryExpectation: "$400-500/month",
    documents: {
      passport: true,
      certificate: true,
      medicalReport: true,
    },
    subscriptions: {
      insurance: true,
      legal: true,
      medical: true,
    },
  }
]

export const mockEmployers: EmployerProfile[] = [
  {
    id: "e1",
    email: "ahmed.alkindi@email.com",
    name: "Ahmed Al-Kindi",
    role: "employer",
    phone: "+968 9123 4567",
    avatar: "/middle-eastern-professional.png",
    kycStatus: "verified",
    createdAt: "2024-01-10",
    company: "Al-Kindi Family",
    location: "Muscat",
    country: "Oman",
    familySize: 5,
    houseType: "Villa",
    requirements: ["Cooking", "Cleaning", "Childcare"],
    subscriptions: {
      insurance: true,
      legal: true,
    },
  }
]

export const mockAdmins: User[] = [
  {
    id: "a1",
    email: "admin@kazipert.com",
    name: "System Administrator",
    role: "admin",
    phone: "+254 700 000 000",
    kycStatus: "verified",
    createdAt: "2023-01-01",
  },
]

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: "j1",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    title: "Domestic Worker - Full Time",
    location: "Muscat",
    country: "Oman",
    salary: "$450/month",
    description:
      "Looking for an experienced domestic worker to help with household chores, cooking, and childcare for a family of 5.",
    requirements: ["5+ years experience", "Cooking skills", "Childcare experience", "English speaking"],
    benefits: ["Accommodation provided", "Health insurance", "Annual leave", "Return ticket"],
    status: "open",
    postedDate: "2024-03-01",
  },
  {
    id: "j2",
    employerId: "e2",
    employerName: "Mohammed Al-Busaidi",
    title: "Housekeeper & Elderly Care",
    location: "Salalah",
    country: "Oman",
    salary: "$500/month",
    description: "Seeking a compassionate and experienced worker for housekeeping and elderly care in a family of 4.",
    requirements: ["Elderly care experience", "Housekeeping skills", "Patient and caring", "Basic Arabic helpful"],
    benefits: ["Private room", "Health insurance", "Monthly bonus", "Paid holidays"],
    status: "open",
    postedDate: "2024-03-05",
  },
  {
    id: "j3",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    title: "Nanny & Tutor",
    location: "Muscat",
    country: "Oman",
    salary: "$400/month",
    description: "Looking for a dedicated nanny to care for two children (ages 5 and 8) and assist with homework.",
    requirements: ["Childcare certification", "Tutoring experience", "English fluent", "Patient with children"],
    benefits: ["Accommodation", "Health coverage", "Training provided", "Career growth"],
    status: "open",
    postedDate: "2024-03-10",
  },
]

// Mock Contracts
export const mockContracts: Contract[] = [
  {
    id: "c1",
    workerId: "w1",
    workerName: "Amina Hassan",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    jobId: "j1",
    jobTitle: "Domestic Worker - Full Time",
    salary: "$450/month",
    duration: "2 years",
    startDate: "2024-04-01",
    status: "signed",
    signedDate: "2024-03-15",
  },
  {
    id: "c2",
    workerId: "w2",
    workerName: "Fatima Mohamed",
    employerId: "e2",
    employerName: "Mohammed Al-Busaidi",
    jobId: "j2",
    jobTitle: "Housekeeper & Elderly Care",
    salary: "$500/month",
    duration: "2 years",
    startDate: "2024-04-15",
    status: "pending",
  },
]

// Helper function to get user by email and role
export function getUserByEmailAndRole(email: string, role: string): User | null {
  if (role === "worker") {
    return mockWorkers.find((w) => w.email === email) || null
  } else if (role === "employer") {
    return mockEmployers.find((e) => e.email === email) || null
  } else if (role === "admin") {
    return mockAdmins.find((a) => a.email === email) || null
  }
  return null
}

export function decorateUserTemp(role: string): User | null {
  if (role === "worker") {
    return mockWorkers.find((w) => w.role === role) || null
  } else if (role === "employer") {
    return mockEmployers.find((e) => e.role === role) || null
  } else if (role === "admin") {
    return mockAdmins.find((a) => a.role === role) || null
  }
  return null
}


// Training videos data
export const trainingVideos = {
  kenya: [
    { id: "tk1", title: "Introduction to Kenya", duration: "15:30", category: "Culture" },
    { id: "tk2", title: "Kenyan Laws and Rights", duration: "20:45", category: "Legal" },
    { id: "tk3", title: "Working Abroad: What to Expect", duration: "18:20", category: "Preparation" },
  ],
  oman: [
    { id: "to1", title: "Welcome to Oman", duration: "12:15", category: "Culture" },
    { id: "to2", title: "Omani Culture and Customs", duration: "22:30", category: "Culture" },
    { id: "to3", title: "Labor Laws in Oman", duration: "25:10", category: "Legal" },
    { id: "to4", title: "Living and Working in Oman", duration: "19:45", category: "Lifestyle" },
  ],
  general: [
    { id: "tg1", title: "Your Rights as a Worker", duration: "16:40", category: "Legal" },
    { id: "tg2", title: "Health and Safety", duration: "14:20", category: "Safety" },
    { id: "tg3", title: "Communication Skills", duration: "17:55", category: "Skills" },
  ],
}

// Services data
export const integratedServices = [
  {
    id: "s1",
    name: "Legal Consultation",
    description: "Expert legal advice for contracts, disputes, and compliance",
    icon: "scale",
    price: "$50/consultation",
  },
  {
    id: "s2",
    name: "Insurance Coverage",
    description: "Comprehensive health and travel insurance for workers",
    icon: "shield",
    price: "$30/month",
  },
  {
    id: "s3",
    name: "Healthcare Services",
    description: "Medical examinations and health certifications",
    icon: "heart",
    price: "$100/exam",
  },
  {
    id: "s4",
    name: "Mental Wellness",
    description: "Counseling and mental health support services",
    icon: "brain",
    price: "$40/session",
  },
  {
    id: "s5",
    name: "Airport Taxi Service",
    description: "Reliable airport pickup and drop-off services",
    icon: "car",
    price: "$25/trip",
  },
  {
    id: "s6",
    name: "Money Transfer (M-Pesa)",
    description: "Send money home quickly and securely",
    icon: "banknote",
    price: "2% fee",
  },
]

// New interfaces for additional features
export interface SalaryPayment {
  id: string
  workerId: string
  workerName: string
  employerId: string
  employerName: string
  amount: number
  currency: string
  month: string
  status: "pending" | "paid" | "failed"
  paidDate?: string
  method: "bank_transfer" | "mpesa" | "cash"
}

export interface Payslip {
  id: string
  workerId: string
  month: string
  year: number
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  currency: string
  generatedDate: string
  pdfUrl?: string
}

export interface PaymentCard {
  id: string
  userId: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: "visa" | "mastercard" | "amex"
  isDefault: boolean
}

export interface Subscription {
  id: string
  userId: string
  serviceType: "insurance" | "legal" | "medical" | "platform"
  plan: "monthly" | "quarterly" | "annual"
  amount: number
  currency: string
  status: "active" | "cancelled" | "expired"
  startDate: string
  endDate: string
  autoRenew: boolean
}

export interface IssueReport {
  id: string
  reporterId: string
  reporterName: string
  reporterRole: "worker" | "employer"
  category: "payment" | "contract" | "harassment" | "safety" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  subject: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  createdDate: string
  resolvedDate?: string
  attachments?: string[]
}

export interface JobReview {
  id: string
  jobId: string
  workerId: string
  workerName: string
  employerId: string
  employerName: string
  rating: number
  reviewText: string
  reviewDate: string
  reviewType: "worker_to_employer" | "employer_to_worker"
}

export interface MpesaTransaction {
  id: string
  workerId: string
  amount: number
  recipient: string
  recipientPhone: string
  status: "pending" | "completed" | "failed"
  transactionDate: string
  fee: number
}

export interface TaxiBooking {
  id: string
  employerId: string
  workerId: string
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  driverName?: string
  vehicleNumber?: string
  fare: number
}

export interface StudioPhotographer {
  id: string
  name: string
  location: string
  county: string
  rating: number
  distance: string
  price: number
  verified: boolean
  phone: string
}

// Mock Salary Payments
export const mockSalaryPayments: SalaryPayment[] = [
  {
    id: "sp1",
    workerId: "w1",
    workerName: "Amina Hassan",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    amount: 450,
    currency: "USD",
    month: "March 2025",
    status: "paid",
    paidDate: "2025-03-31",
    method: "bank_transfer",
  },
  {
    id: "sp2",
    workerId: "w1",
    workerName: "Amina Hassan",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    amount: 450,
    currency: "USD",
    month: "April 2025",
    status: "pending",
    method: "bank_transfer",
  },
]

// Mock Payslips
export const mockPayslips: Payslip[] = [
  {
    id: "ps1",
    workerId: "w1",
    month: "March",
    year: 2025,
    basicSalary: 450,
    allowances: 50,
    deductions: 20,
    netSalary: 480,
    currency: "USD",
    generatedDate: "2025-03-31",
  },
  {
    id: "ps2",
    workerId: "w1",
    month: "February",
    year: 2025,
    basicSalary: 450,
    allowances: 30,
    deductions: 15,
    netSalary: 465,
    currency: "USD",
    generatedDate: "2025-02-28",
  },
  {
    id: "ps3",
    workerId: "w1",
    month: "January",
    year: 2025,
    basicSalary: 450,
    allowances: 40,
    deductions: 18,
    netSalary: 472,
    currency: "USD",
    generatedDate: "2025-01-31",
  },
]

// Mock Payment Cards
export const mockPaymentCards: PaymentCard[] = [
  {
    id: "pc1",
    userId: "w1",
    cardNumber: "**** **** **** 4532",
    cardHolder: "Amina Hassan",
    expiryDate: "12/26",
    cardType: "visa",
    isDefault: true,
  },
  {
    id: "pc2",
    userId: "e1",
    cardNumber: "**** **** **** 8765",
    cardHolder: "Ahmed Al-Kindi",
    expiryDate: "08/27",
    cardType: "mastercard",
    isDefault: true,
  },
]

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: "sub1",
    userId: "w1",
    serviceType: "insurance",
    plan: "monthly",
    amount: 30,
    currency: "USD",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    autoRenew: true,
  },
  {
    id: "sub2",
    userId: "w1",
    serviceType: "legal",
    plan: "monthly",
    amount: 25,
    currency: "USD",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    autoRenew: true,
  },
  {
    id: "sub3",
    userId: "w1",
    serviceType: "medical",
    plan: "monthly",
    amount: 20,
    currency: "USD",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    autoRenew: true,
  },
  {
    id: "sub4",
    userId: "e1",
    serviceType: "insurance",
    plan: "annual",
    amount: 300,
    currency: "USD",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    autoRenew: true,
  },
]

// Mock Issue Reports
export const mockIssueReports: IssueReport[] = [
  {
    id: "ir1",
    reporterId: "w1",
    reporterName: "Amina Hassan",
    reporterRole: "worker",
    category: "payment",
    priority: "high",
    subject: "Delayed Salary Payment",
    description: "My March salary has not been received yet. Expected date was March 31st.",
    status: "in_progress",
    createdDate: "2025-04-02",
  },
  {
    id: "ir2",
    reporterId: "w2",
    reporterName: "Fatima Mohamed",
    reporterRole: "worker",
    category: "contract",
    priority: "medium",
    subject: "Contract Terms Clarification",
    description: "Need clarification on working hours mentioned in the contract.",
    status: "resolved",
    createdDate: "2025-03-28",
    resolvedDate: "2025-03-30",
  },
]

// Mock Job Reviews
export const mockJobReviews: JobReview[] = [
  {
    id: "jr1",
    jobId: "j1",
    workerId: "w1",
    workerName: "Amina Hassan",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    rating: 5,
    reviewText: "Excellent employer, very respectful and fair. The family is wonderful to work with.",
    reviewDate: "2025-03-20",
    reviewType: "worker_to_employer",
  },
  {
    id: "jr2",
    jobId: "j1",
    workerId: "w1",
    workerName: "Amina Hassan",
    employerId: "e1",
    employerName: "Ahmed Al-Kindi",
    rating: 5,
    reviewText: "Amina is an exceptional worker. Very professional and great with children.",
    reviewDate: "2025-03-21",
    reviewType: "employer_to_worker",
  },
]

// Mock M-Pesa Transactions
export const mockMpesaTransactions: MpesaTransaction[] = [
  {
    id: "mt1",
    workerId: "w1",
    amount: 300,
    recipient: "Mary Hassan",
    recipientPhone: "+254 722 123 456",
    status: "completed",
    transactionDate: "2025-04-01",
    fee: 6,
  },
  {
    id: "mt2",
    workerId: "w1",
    amount: 150,
    recipient: "John Hassan",
    recipientPhone: "+254 733 234 567",
    status: "completed",
    transactionDate: "2025-04-05",
    fee: 3,
  },
]

// Mock Taxi Bookings
export const mockTaxiBookings: TaxiBooking[] = [
  {
    id: "tb1",
    employerId: "e1",
    workerId: "w1",
    pickupLocation: "Muscat International Airport",
    dropoffLocation: "Al-Kindi Residence, Muscat",
    pickupDate: "2025-04-15",
    pickupTime: "14:30",
    status: "confirmed",
    driverName: "Mohammed Ali",
    vehicleNumber: "OM-1234",
    fare: 25,
  },
]

// Mock Studio Photographers
export const mockStudioPhotographers: StudioPhotographer[] = [
  {
    id: "ph1",
    name: "PhotoPro Studio",
    location: "Nairobi CBD",
    county: "Nairobi",
    rating: 4.8,
    distance: "2.5 km",
    price: 1500,
    verified: true,
    phone: "+254 712 345 678",
  },
  {
    id: "ph2",
    name: "Perfect Shots",
    location: "Westlands",
    county: "Nairobi",
    rating: 4.9,
    distance: "5.1 km",
    price: 2000,
    verified: true,
    phone: "+254 723 456 789",
  },
  {
    id: "ph3",
    name: "Studio Excellence",
    location: "Kilimani",
    county: "Nairobi",
    rating: 4.7,
    distance: "3.8 km",
    price: 1800,
    verified: true,
    phone: "+254 734 567 890",
  },
]
