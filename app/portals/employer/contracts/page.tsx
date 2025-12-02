"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  Send,
  User,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react"
import { useRouter } from "next/navigation"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82', 
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function EmployerContractsPage() {
    const router = useRouter()
  
  const [profileComplete, setProfileComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Mock data - replace with real data later
  const contracts = [
    {
      id: "1",
      employeeName: "Sarah Johnson",
      jobTitle: "General House Help",
      status: "SIGNED",
      signedDate: "2024-01-15",
      startDate: "2024-02-01",
      salary: "320 OMR",
      location: "Muscat",
      duration: "24 months"
    },
    {
      id: "2",
      employeeName: "Maria Santos",
      jobTitle: "Elderly Care Specialist",
      status: "PENDING",
      sentDate: "2024-01-10",
      salary: "350 OMR",
      location: "Salalah",
      duration: "24 months"
    },
    {
      id: "3",
      employeeName: "Aisha Mohammed",
      jobTitle: "Child Care / Nanny",
      status: "DRAFT",
      createdDate: "2024-01-08",
      salary: "300 OMR",
      location: "Muscat",
      duration: "24 months"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SIGNED":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "DRAFT":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SIGNED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "DRAFT":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredContracts = contracts.filter(contract => {
    if (activeTab === "all") return true
    return contract.status === activeTab.toUpperCase()
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3 text-gray-900">
              <FileText className="h-6 w-6 md:h-8 md:w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              Employment Contracts
            </h1>
            <p className="text-sm md:text-xl text-gray-600">
              Manage and track all your employment contracts
            </p>
          </div>
          <Button 
            style={{
              backgroundColor: KAZIPERT_COLORS.primary,
              color: 'white'
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>

        {/* Profile Completion Alert */}
        {!profileComplete && (
          <Card className="border-2 border-amber-200 bg-amber-50/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <User className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-800 mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-amber-700 text-sm">
                    To create employment contracts, please complete your employer profile with company details and verification.
                  </p>
                </div>
                <Button 
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => router.push('/portals/employer/verification')}
                  >
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contracts Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Signed Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Signature</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Contract Management</CardTitle>
                <CardDescription>
                  View and manage all your employment contracts
                </CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 sm:mt-0">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="signed" className="text-xs">Signed</TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {filteredContracts.length > 0 ? (
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {contract.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{contract.employeeName}</h3>
                            <p className="text-sm text-gray-600">{contract.jobTitle}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(contract.status)}
                            {contract.status.charAt(0) + contract.status.slice(1).toLowerCase()}
                          </span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{contract.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{contract.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{contract.duration}</span>
                        </div>
                        {contract.status === "SIGNED" && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <UserCheck className="h-4 w-4" />
                            <span>Signed {contract.signedDate}</span>
                          </div>
                        )}
                        {contract.status === "PENDING" && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Sent {contract.sentDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-4">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      {contract.status === "DRAFT" && (
                        <Button size="sm" className="flex items-center gap-2" style={{ backgroundColor: KAZIPERT_COLORS.primary, color: 'white' }}>
                          <Send className="h-4 w-4" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contracts Found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "all" 
                    ? "You haven't created any employment contracts yet."
                    : `No ${activeTab} contracts found.`
                  }
                </p>
                <Button 
                  style={{
                    backgroundColor: KAZIPERT_COLORS.primary,
                    color: 'white'
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Create Your First Contract
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Contract Templates</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Use pre-built templates for different job categories
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Templates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Legal Compliance</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Ensure your contracts meet Omani labor law requirements
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}