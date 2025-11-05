"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText, 
  Video, 
  Search,
  ChevronDown,
  ChevronUp,
  Play,
  Download,
  Clock,
  User
} from "lucide-react"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82', 
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function EmployerHelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: "How do I post a job on KaziPert?",
      answer: "To post a job, navigate to the Jobs page and click 'Post New Job'. Follow the step-by-step process to provide job details, requirements, and benefits. Your job will be reviewed and published within 24 hours.",
      category: "Jobs"
    },
    {
      id: 2,
      question: "What are the requirements for hiring domestic workers in Oman?",
      answer: "Employers must provide accommodation, meals, medical insurance, and a return ticket annually. The minimum salary is 180 OMR per month, and workers are entitled to 30 days of paid leave per year.",
      category: "Legal"
    },
    {
      id: 3,
      question: "How do I review job applications?",
      answer: "Go to your Jobs page, click 'View Applicants' on any active job posting. You can review candidate profiles, KYC status, and application details before shortlisting or scheduling interviews.",
      category: "Applications"
    },
    {
      id: 4,
      question: "What payment methods are accepted?",
      answer: "We accept major credit cards, bank transfers, and mobile payments. All transactions are secure and encrypted.",
      category: "Billing"
    },
    {
      id: 5,
      question: "How do I create employment contracts?",
      answer: "Contracts can be generated automatically after selecting a candidate. We provide standardized templates compliant with Omani labor laws that you can customize as needed.",
      category: "Contracts"
    }
  ]

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with KaziPert",
      description: "Learn how to set up your employer account and post your first job",
      duration: "5:30",
      thumbnail: "/about.mp4", // This will be your uploaded video
      category: "Basics"
    },
    {
      id: 2,
      title: "Job Posting Best Practices",
      description: "Tips for creating attractive job posts that get quality applications",
      duration: "8:15",
      thumbnail: "/about.mp4",
      category: "Jobs"
    },
    {
      id: 3,
      title: "Candidate Selection Process",
      description: "How to effectively review applications and select the right candidate",
      duration: "12:45",
      thumbnail: "/about.mp4",
      category: "Applications"
    },
    {
      id: 4,
      title: "Contract Management",
      description: "Creating, sending, and managing employment contracts",
      duration: "7:20",
      thumbnail: "/about.mp4",
      category: "Contracts"
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold flex items-center justify-center gap-3 text-gray-900">
            <HelpCircle className="h-8 w-8 md:h-10 md:w-10" style={{ color: KAZIPERT_COLORS.primary }} />
            Help Center
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get help with using KaziPert, managing your hires, and understanding Omani labor regulations
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help articles, FAQs, or tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary"
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive guides and manuals
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white mx-auto mb-4">
                <Video className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm">
                Step-by-step video guides
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600 text-sm">
                24/7 customer support
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faqs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100/50 rounded-2xl">
            <TabsTrigger 
              value="faqs" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger 
              value="tutorials" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us
            </TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions about using KaziPert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {faq.category}
                        </Badge>
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-6 pt-0 border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step guides to master KaziPert features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial) => (
                    <Card key={tutorial.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                          <video 
                            className="w-full h-full object-cover"
                            poster="/about.mp4"
                          >
                            <source src={tutorial.thumbnail} type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Button 
                              size="icon" 
                              className="rounded-full w-16 h-16 bg-white/90 hover:bg-white"
                              onClick={() => window.open(tutorial.thumbnail, '_blank')}
                            >
                              <Play className="h-6 w-6 text-gray-900 ml-1" />
                            </Button>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-black/70 text-white border-0">
                            {tutorial.duration}
                          </Badge>
                        </div>
                        
                        <div className="p-4">
                          <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 border-blue-200">
                            {tutorial.category}
                          </Badge>
                          <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                          <div className="flex items-center justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(tutorial.thumbnail, '_blank')}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Watch Now
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Us Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Methods */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Choose your preferred method to contact our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phone Support */}
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Phone Support</h4>
                      <p className="text-gray-600 text-sm">+968 1234 5678</p>
                      <p className="text-xs text-gray-500">Available 24/7</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Call Now
                    </Button>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Email Support</h4>
                      <p className="text-gray-600 text-sm">support@kazipert.com</p>
                      <p className="text-xs text-gray-500">Response within 2 hours</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Send Email
                    </Button>
                  </div>

                  {/* Live Chat */}
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Live Chat</h4>
                      <p className="text-gray-600 text-sm">Instant messaging support</p>
                      <p className="text-xs text-gray-500">Available 6AM - 10PM</p>
                    </div>
                    <Button 
                      style={{
                        backgroundColor: KAZIPERT_COLORS.primary,
                        color: 'white'
                      }}
                      size="sm"
                    >
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support Resources */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Support Resources</CardTitle>
                  <CardDescription>
                    Additional resources to help you get the most out of KaziPert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Documentation</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Download Omani labor law guides and compliance checklists
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resources
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <h4 className="font-semibold text-gray-900 mb-2">Employer Handbook</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Comprehensive guide for employers in Oman
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Handbook
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                    <h4 className="font-semibold text-gray-900 mb-2">Community Forum</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Connect with other employers and share experiences
                    </p>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Join Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Hours */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Phone Support:</strong> 24/7 • <strong>Live Chat:</strong> 6AM - 10PM (GMT+4) • <strong>Email:</strong> 24/7
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Average response time: 15 minutes for phone, 2 hours for email
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}