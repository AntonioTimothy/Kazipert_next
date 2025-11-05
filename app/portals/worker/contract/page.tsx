"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  FileText,
  Download,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Shield,
  CheckCircle,
  AlertTriangle,
  Building,
  Phone,
  Mail,
  Star,
  Zap,
  Crown,
  FileCheck,
  PenTool,
  Signature
} from "lucide-react"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#6c71b5',
  accent: '#e53e3e',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function EmployeeContractPage() {
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileCompletion, setProfileCompletion] = useState(65)
  const [signature, setSignature] = useState("")
  const [isSigning, setIsSigning] = useState(false)

  useEffect(() => {
    // Simulate loading contract data
    const loadContractData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const contractData = {
        id: "CT-2024-001",
        status: "pending_signature",
        title: "Domestic Worker Employment Contract",
        employer: {
          name: "Al Harthy Family",
          address: "Al Khuwair, Muscat, Oman",
          phone: "+968 1234 5678",
          email: "ahmed@alharthy-family.com"
        },
        employee: {
          name: "Sarah Johnson",
          position: "Housekeeper",
          nationality: "Filipino",
          idNumber: "P123456789"
        },
        terms: {
          startDate: "2024-03-01",
          duration: "24 months",
          workingHours: "8 hours/day, 6 days/week",
          salary: "OMR 250 per month",
          accommodation: "Provided",
          transportation: "Provided",
          probationPeriod: "3 months",
          noticePeriod: "1 month"
        },
        responsibilities: [
          "General house cleaning and maintenance",
          "Laundry and ironing",
          "Cooking and meal preparation",
          "Grocery shopping",
          "Pet care (if applicable)"
        ],
        benefits: [
          "Medical insurance",
          "Annual return ticket",
          "30 days paid annual leave",
          "Public holidays as per Omani law",
          "End-of-service benefits"
        ],
        createdDate: "2024-01-15",
        expiryDate: "2026-03-01",
        signed: {
          employer: true,
          employee: false,
          employerSignedAt: "2024-01-18",
          employeeSignedAt: null
        }
      }
      
      setContract(contractData)
      setLoading(false)
    }

    loadContractData()
  }, [])

  const handleSignContract = () => {
    if (!signature.trim()) {
      alert("Please provide your signature")
      return
    }

    setIsSigning(true)
    // Simulate API call
    setTimeout(() => {
      setContract({
        ...contract,
        status: "active",
        signed: {
          ...contract.signed,
          employee: true,
          employeeSignedAt: new Date().toISOString().split('T')[0]
        }
      })
      setIsSigning(false)
      setSignature("")
    }, 2000)
  }

  const handleDownloadContract = () => {
    // Simulate download
    const blob = new Blob([JSON.stringify(contract, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contract-${contract.id}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">Draft</Badge>
      case "pending_signature":
        return <Badge className="bg-amber-500 text-white">Awaiting Signature</Badge>
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case "expired":
        return <Badge variant="outline" className="bg-red-100 text-red-700">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Loading contract details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3 text-gray-900">
              <FileText className="h-6 w-6 md:h-8 md:w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              Employment Contract
            </h1>
            <p className="text-sm md:text-xl text-gray-600">
              Review and sign your employment agreement
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(contract.status)}
            <Button 
              variant="outline" 
              onClick={handleDownloadContract}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Profile Completion Alert */}
        <Card className="border-l-4 border-l-amber-400 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">Profile Completion Required</h3>
                  <Badge variant="outline" className="bg-white text-amber-700 border-amber-300">
                    {profileCompletion}% Complete
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">
                  Complete your profile to unlock full contract features and increase your job opportunities. 
                  Employers are 3x more likely to hire workers with complete profiles.
                </p>
                <div className="space-y-2">
                  <Progress value={profileCompletion} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Profile Strength</span>
                    <span>{profileCompletion}%</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button 
                    size="sm"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    View Requirements
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Contract Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  {contract.title}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Contract ID: {contract.id} • Created: {contract.createdDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      Employer Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{contract.employer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{contract.employer.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{contract.employer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{contract.employer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Employee Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {contract.employee.name}</div>
                      <div><span className="font-medium">Position:</span> {contract.employee.position}</div>
                      <div><span className="font-medium">Nationality:</span> {contract.employee.nationality}</div>
                      <div><span className="font-medium">ID Number:</span> {contract.employee.idNumber}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Employment Terms */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Employment Terms
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Start Date:</span>
                      <span>{contract.terms.startDate}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Duration:</span>
                      <span>{contract.terms.duration}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Working Hours:</span>
                      <span>{contract.terms.workingHours}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Probation Period:</span>
                      <span>{contract.terms.probationPeriod}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Compensation */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Compensation & Benefits
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">Monthly Salary</div>
                        <div className="text-sm text-gray-600">Paid monthly via bank transfer</div>
                      </div>
                      <div className="text-xl font-bold text-green-700">{contract.terms.salary}</div>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Accommodation
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{contract.terms.accommodation}</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="font-medium flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Transportation
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{contract.terms.transportation}</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Additional Benefits:</h5>
                      <div className="space-y-2">
                        {contract.benefits.map((benefit: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Responsibilities */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-amber-600" />
                    Key Responsibilities
                  </h4>
                  <div className="space-y-2">
                    {contract.responsibilities.map((responsibility: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm p-2 hover:bg-gray-50 rounded">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <span>{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signature Section */}
            {contract.status === "pending_signature" && (
              <Card className="border-0 shadow-lg border-l-4 border-l-amber-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <Signature className="h-5 w-5" />
                    Sign Contract
                  </CardTitle>
                  <CardDescription>
                    Please review the contract carefully before signing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Important Notice</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      By signing this contract, you agree to all terms and conditions. 
                      This is a legally binding agreement. Ensure you understand all clauses before proceeding.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Full Name as Signature</label>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Enter your full name to sign"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500">
                      By typing your name, you are providing your electronic signature
                    </p>
                  </div>

                  <Button 
                    onClick={handleSignContract}
                    disabled={isSigning || !signature.trim()}
                    className="w-full"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
                  >
                    {isSigning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing Contract...
                      </>
                    ) : (
                      <>
                        <Signature className="h-4 w-4 mr-2" />
                        Sign Employment Contract
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contract Signed */}
            {contract.status === "active" && (
              <Card className="border-0 shadow-lg border-l-4 border-l-green-400">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Contract Successfully Signed!</h3>
                      <p className="text-gray-600 mt-1">
                        Your employment contract is now active. Welcome to your new position!
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">Employer Signed</div>
                        <div className="text-gray-600">{contract.signed.employerSignedAt}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">You Signed</div>
                        <div className="text-gray-600">{contract.signed.employeeSignedAt}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Contract Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  {getStatusBadge(contract.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expiry Date</span>
                  <span className="text-sm font-medium">{contract.expiryDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notice Period</span>
                  <span className="text-sm font-medium">{contract.terms.noticePeriod}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Required */}
            <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Action Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Sign Contract</div>
                    <div className="text-sm text-gray-600">Pending your signature</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200">
                  <User className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-medium">Complete Profile</div>
                    <div className="text-sm text-gray-600">Required for full access</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Contract
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Legal Advice
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Crown className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Boost Your Profile</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete your profile to access premium features and better job opportunities
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}
                    className="w-full"
                  >
                    Complete Profile Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}