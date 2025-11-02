"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { 
  Home, Briefcase, FileText, CreditCard, Shield, Video, MessageSquare, Star, 
  Headphones, Phone, Mail, Clock, AlertTriangle, CheckCircle2, XCircle, 
  MoreHorizontal, Plus, Search, Filter, Download, User, Calendar, MessageCircle, 
  PhoneCall, MapPin, ShieldCheck, Heart, Ambulance, FireExtinguisher, Zap,
  Send, ChevronLeft, Paperclip, Smile, File, Image, Mic, ThumbsUp,
  Video as VideoIcon, UserCheck, Building, Globe, MapPin as MapPinIcon,
  Smartphone, Laptop, Wifi, FileQuestion, Wallet, BookOpen, Scale,
  HeartPulse, Users, Eye, EyeOff, Trash2, Edit3, Share2, Copy, X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import type { WorkerProfile } from "@/lib/mock-data"

// Enhanced mock data
const supportData = {
  tickets: [
    {
      id: "TKT001",
      subject: "Payment Delay for January Salary",
      description: "My salary for January work has not been processed yet. It's been 5 days past the expected payment date.",
      category: "payment",
      priority: "urgent",
      status: "open",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-21",
      lastMessage: "We've escalated this to our finance team. They're investigating the delay.",
      unread: 2,
      agent: {
        name: "Sarah Johnson",
        role: "Payment Specialist",
        avatar: "SJ",
        online: true
      },
      responses: [
        {
          id: "RES001",
          message: "Hi, I haven't received my January salary yet. It's already 5 days late.",
          sender: "You",
          timestamp: "2024-01-20 14:20",
          isAgent: false,
          type: "text"
        },
        {
          id: "RES002",
          message: "We've escalated this to our finance team. They're investigating the delay.",
          sender: "Support Agent",
          timestamp: "2024-01-20 14:30",
          isAgent: true,
          type: "text"
        },
        {
          id: "RES003",
          message: "Any update on this? I really need this payment processed.",
          sender: "You",
          timestamp: "2024-01-21 09:15",
          isAgent: false,
          type: "text"
        }
      ]
    },
    {
      id: "TKT002",
      subject: "Contract Document Clarification",
      description: "Need clarification on clause 4.2 regarding working hours and overtime compensation.",
      category: "contract",
      priority: "normal",
      status: "in-progress",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-19",
      lastMessage: "Our legal team is reviewing your contract and will provide clarification within 24 hours.",
      unread: 0,
      agent: {
        name: "Michael Chen",
        role: "Legal Advisor",
        avatar: "MC",
        online: false
      },
      responses: [
        {
          id: "RES002",
          message: "Our legal team is reviewing your contract and will provide clarification within 24 hours.",
          sender: "Legal Support",
          timestamp: "2024-01-18 11:15",
          isAgent: true,
          type: "text"
        }
      ]
    },
    {
      id: "TKT003",
      subject: "Training Certificate Not Received",
      description: "Completed the Arabic Language course 3 days ago but haven't received my certificate.",
      category: "training",
      priority: "normal",
      status: "resolved",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-16",
      lastMessage: "Certificate has been issued and sent to your email. Please check your spam folder as well.",
      unread: 0,
      agent: {
        name: "Aisha Mohamed",
        role: "Training Coordinator",
        avatar: "AM",
        online: true
      },
      responses: [
        {
          id: "RES003",
          message: "Certificate has been issued and sent to your email. Please check your spam folder as well.",
          sender: "Training Support",
          timestamp: "2024-01-16 09:45",
          isAgent: true,
          type: "text"
        }
      ]
    }
  ],
  emergencyContacts: [
    { 
      id: "EMG001", 
      name: "Police Emergency", 
      number: "9999", 
      description: "For immediate police assistance and security emergencies", 
      icon: ShieldCheck, 
      type: "security",
      color: "bg-blue-500"
    },
    { 
      id: "EMG002", 
      name: "Ambulance & Medical", 
      number: "9999", 
      description: "Medical emergencies and ambulance services", 
      icon: Ambulance, 
      type: "medical",
      color: "bg-red-500"
    },
    { 
      id: "EMG003", 
      name: "Fire Department", 
      number: "9999", 
      description: "Fire emergencies and rescue services", 
      icon: FireExtinguisher, 
      type: "fire",
      color: "bg-orange-500"
    },
    { 
      id: "EMG004", 
      name: "Kazipert 24/7 Emergency", 
      number: "+254 711 000000", 
      description: "24/7 emergency support for workers abroad", 
      icon: ShieldCheck, 
      type: "support",
      color: "bg-green-500"
    },
    { 
      id: "EMG005", 
      name: "Legal Emergency Hotline", 
      number: "+254 722 000000", 
      description: "Immediate legal assistance and advice", 
      icon: Scale, 
      type: "legal",
      color: "bg-purple-500"
    },
    { 
      id: "EMG006", 
      name: "Mental Health Support", 
      number: "+254 733 000000", 
      description: "Confidential mental health and counseling services", 
      icon: HeartPulse, 
      type: "health",
      color: "bg-pink-500"
    }
  ],
  quickActions: [
    {
      id: "QA001",
      title: "Report Payment Issue",
      description: "Salary or payment related problems",
      icon: Wallet,
      category: "payment",
      color: "text-green-600 bg-green-100"
    },
    {
      id: "QA002",
      title: "Contract Help",
      description: "Contract terms and clarification",
      icon: FileText,
      category: "contract",
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: "QA003",
      title: "Training Support",
      description: "Course completion and certificates",
      icon: BookOpen,
      category: "training",
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: "QA004",
      title: "Technical Issue",
      description: "App or platform problems",
      icon: Smartphone,
      category: "technical",
      color: "text-orange-600 bg-orange-100"
    }
  ],
  faqs: [
    {
      id: "FAQ001",
      question: "How long does it take to receive my salary?",
      answer: "Salaries are typically processed within 3-5 business days after the pay period ends.",
      category: "payment"
    },
    {
      id: "FAQ002",
      question: "What should I do if I haven't received my training certificate?",
      answer: "Certificates are issued within 48 hours of course completion. Check your email spam folder or contact training support.",
      category: "training"
    },
    {
      id: "FAQ003",
      question: "How can I update my contract details?",
      answer: "Contract updates require approval from both parties. Contact your assigned agent for modifications.",
      category: "contract"
    },
    {
      id: "FAQ004",
      question: "What emergency services are available?",
      answer: "We provide 24/7 emergency support including medical, legal, and security assistance.",
      category: "emergency"
    }
  ]
}

export default function WorkerSupportPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("support-chat")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("normal")
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showFAQ, setShowFAQ] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New ticket form state
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedTicket?.responses])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    setLoading(false)
    
    // Auto-select first ticket if available
    if (supportData.tickets.length > 0 && !selectedTicket) {
      setSelectedTicket(supportData.tickets[0])
    }
  }, [router, selectedTicket])

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

  const categories = [
    { value: "general", label: "General Inquiry", icon: FileQuestion },
    { value: "payment", label: "Payment Issue", icon: Wallet },
    { value: "contract", label: "Contract Related", icon: FileText },
    { value: "technical", label: "Technical Support", icon: Smartphone },
    { value: "training", label: "Training & Certificates", icon: BookOpen },
    { value: "legal", label: "Legal Assistance", icon: Scale },
    { value: "emergency", label: "Emergency Situation", icon: AlertTriangle },
    { value: "other", label: "Other", icon: MoreHorizontal }
  ]

  const priorities = [
    { value: "low", label: "Low Priority", description: "General questions and non-urgent matters", color: "text-green-600 bg-green-500/10", responseTime: "Within 24 hours" },
    { value: "normal", label: "Normal", description: "Standard support requests", color: "text-blue-600 bg-blue-500/10", responseTime: "Within 12 hours" },
    { value: "high", label: "High Priority", description: "Important issues needing attention", color: "text-orange-600 bg-orange-500/10", responseTime: "Within 6 hours" },
    { value: "urgent", label: "Super Urgent", description: "Critical issues requiring immediate action", color: "text-red-600 bg-red-500/10", responseTime: "Within 2 hours" }
  ]

  const filteredTickets = supportData.tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketDescription) {
      toast.error("Please fill in all fields", {
        description: "Subject and description are required to create a support ticket."
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newTicket = {
        id: `TKT${Date.now()}`,
        subject: ticketSubject,
        description: ticketDescription,
        category: selectedCategory,
        priority: selectedPriority,
        status: "open",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        lastMessage: "Thank you for your ticket. Our team will respond shortly.",
        unread: 0,
        agent: {
          name: "Support Agent",
          role: "Customer Support",
          avatar: "SA",
          online: true
        },
        responses: []
      }

      supportData.tickets.unshift(newTicket)
      setSelectedTicket(newTicket)

      toast.success("Ticket Created Successfully!", {
        description: `Your ${selectedPriority} priority ticket has been submitted. We'll respond within 2 hours.`,
        duration: 5000,
      })

      // Reset form
      setTicketSubject("")
      setTicketDescription("")
      setSelectedPriority("normal")
      setSelectedCategory("general")
      setIsSubmitting(false)
      setActiveTab("support-chat")
      if (isMobile) {
        setShowChatModal(true)
      }
    }, 2000)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Simulate sending message
    const newResponse = {
      id: `RES${Date.now()}`,
      message: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgent: false,
      type: "text"
    }

    if (selectedTicket) {
      const updatedTicket = {
        ...selectedTicket,
        responses: [...selectedTicket.responses, newResponse],
        lastMessage: newMessage,
        updatedAt: new Date().toISOString().split('T')[0],
        unread: 0
      }
      
      setSelectedTicket(updatedTicket)
      
      // Update in mock data
      const ticketIndex = supportData.tickets.findIndex(t => t.id === selectedTicket.id)
      if (ticketIndex !== -1) {
        supportData.tickets[ticketIndex] = updatedTicket
      }
    }

    setNewMessage("")

    // Simulate agent response after delay
    setTimeout(() => {
      const agentResponse = {
        id: `RES${Date.now() + 1}`,
        message: "Thank you for your message. Our support team will respond shortly.",
        sender: selectedTicket?.agent?.name || "Support Agent",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAgent: true,
        type: "text"
      }

      if (selectedTicket) {
        const updatedTicket = {
          ...selectedTicket,
          responses: [...selectedTicket.responses, agentResponse],
          lastMessage: agentResponse.message,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        
        setSelectedTicket(updatedTicket)
        
        // Update in mock data
        const ticketIndex = supportData.tickets.findIndex(t => t.id === selectedTicket.id)
        if (ticketIndex !== -1) {
          supportData.tickets[ticketIndex] = updatedTicket
        }
      }
    }, 2000)
  }

  const handleQuickAction = (action: any) => {
    setSelectedCategory(action.category)
    setActiveTab("new-ticket")
    toast.info("Quick Action", {
      description: `Starting ${action.title.toLowerCase()}. Fill in the details below.`
    })
  }

  const handleEmergencyCall = (contact: any) => {
    toast.warning("Emergency Contact", {
      description: `Calling ${contact.name} at ${contact.number}. Please use only for genuine emergencies.`,
      duration: 6000,
    })
    
    // Simulate call
    setTimeout(() => {
      toast.info("Call Connected", {
        description: `You are now connected to ${contact.name}.`,
        duration: 3000,
      })
    }, 1000)
  }

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number)
    toast.success("Number Copied", {
      description: "Emergency number copied to clipboard"
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments = Array.from(files)
      setAttachments(prev => [...prev, ...newAttachments])
      toast.success("Files Added", {
        description: `${newAttachments.length} file(s) added to attachments`
      })
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "in-progress": return <Clock className="h-4 w-4 text-amber-500" />
      case "resolved": return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "closed": return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <MoreHorizontal className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "in-progress": return "text-amber-600 bg-amber-500/10 border-amber-500/20"
      case "resolved": return "text-green-600 bg-green-500/10 border-green-500/20"
      case "closed": return "text-gray-600 bg-gray-500/10 border-gray-500/20"
      default: return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "text-green-600 bg-green-500/10 border-green-500/20"
      case "normal": return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "high": return "text-orange-600 bg-orange-500/10 border-orange-500/20"
      case "urgent": return "text-red-600 bg-red-500/10 border-red-500/20"
      default: return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const handleTicketAction = (ticketId: string, action: string) => {
    const ticket = supportData.tickets.find(t => t.id === ticketId)
    if (ticket) {
      switch (action) {
        case "close":
          ticket.status = "closed"
          toast.success("Ticket Closed", {
            description: "The support ticket has been closed."
          })
          break
        case "reopen":
          ticket.status = "open"
          toast.success("Ticket Reopened", {
            description: "The support ticket has been reopened."
          })
          break
      }
      setSelectedTicket({...ticket})
    }
  }

  const handleOpenChat = (ticket: any) => {
    setSelectedTicket(ticket)
    if (isMobile) {
      setShowChatModal(true)
    }
  }

  const handleCloseChat = () => {
    setShowChatModal(false)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-4 md:space-y-6">
        {/* Header Section - Mobile Optimized */}
        <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2 md:gap-3">
              <Headphones className="h-5 w-5 md:h-8 md:w-8 text-primary" />
              Support Center
            </h1>
            <p className="text-sm md:text-xl text-muted-foreground">
              We're here to help you 24/7. Choose the right support option.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-1 text-xs" style={{ backgroundColor: currentTheme.colors.primary + '15' }}>
              <ShieldCheck className="h-3 w-3 mr-1" />
              24/7 Available
            </Badge>
          </div>
        </div>

        {/* Quick Actions - Mobile Grid */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Get help faster with common support options</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
              {supportData.quickActions.map((action) => {
                const IconComponent = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                    onClick={() => handleQuickAction(action)}
                  >
                    <div className={cn("p-2 rounded-lg", action.color)}>
                      <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <span className="font-medium text-xs md:text-sm text-center leading-tight">{action.title}</span>
                    <span className="text-xs text-muted-foreground text-center hidden md:block">{action.description}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Banner - Mobile Optimized */}
        <Card className="border-2 border-red-200 bg-red-50/50 backdrop-blur-sm">
          <CardContent className="flex flex-col md:flex-row items-center gap-3 p-4 md:p-6">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-semibold text-red-800 text-sm md:text-base">Emergency Assistance</h3>
              <p className="text-xs md:text-sm text-red-700 mt-1">
                For immediate help in critical situations, use emergency contacts.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100 w-full md:w-auto text-xs md:text-sm"
              onClick={() => setActiveTab("emergency")}
            >
              <PhoneCall className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Emergency
            </Button>
          </CardContent>
        </Card>

        {/* Support Options Tabs - Mobile Optimized */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 md:grid-cols-4 p-1 rounded-lg md:rounded-xl"
                style={{ backgroundColor: currentTheme.colors.backgroundLight }}
              >
                <TabsTrigger 
                  value="support-chat" 
                  className="rounded-md data-[state=active]:shadow-sm transition-all duration-300 text-xs"
                  style={{ 
                    backgroundColor: activeTab === 'support-chat' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'support-chat' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="new-ticket" 
                  className="rounded-md data-[state=active]:shadow-sm transition-all duration-300 text-xs"
                  style={{ 
                    backgroundColor: activeTab === 'new-ticket' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'new-ticket' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency" 
                  className="rounded-md data-[state=active]:shadow-sm transition-all duration-300 text-xs"
                  style={{ 
                    backgroundColor: activeTab === 'emergency' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'emergency' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <PhoneCall className="h-3 w-3 mr-1" />
                  Emergency
                </TabsTrigger>
                <TabsTrigger 
                  value="contact" 
                  className="rounded-md data-[state=active]:shadow-sm transition-all duration-300 text-xs"
                  style={{ 
                    backgroundColor: activeTab === 'contact' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'contact' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* Support Chat Tab - Mobile Optimized */}
              <TabsContent value="support-chat" className="p-0">
                <div className="flex flex-col md:flex-row h-[60vh] md:h-[500px] border-t">
                  {/* Left Sidebar - Conversations */}
                  <div className={cn(
                    "border-r w-full md:w-1/3",
                    isMobile && showChatModal ? "hidden" : "block"
                  )} style={{ backgroundColor: currentTheme.colors.backgroundLight }}>
                    <div className="p-3 md:p-4 border-b" style={{ backgroundColor: currentTheme.colors.backgroundLight }}>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base md:text-lg font-semibold">Support Conversations</h2>
                        <Button 
                          size="sm" 
                          onClick={() => setActiveTab("new-ticket")}
                          className="h-8 w-8 md:h-9 md:w-9"
                          style={{ 
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search conversations..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 md:pl-10 border-0 bg-background focus-visible:ring-1 text-sm h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(60vh-80px)] md:h-[400px]">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`flex items-center p-3 border-b cursor-pointer transition-colors ${
                            selectedTicket?.id === ticket.id 
                              ? "bg-primary/10" 
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleOpenChat(ticket)}
                        >
                          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/10 mr-2 md:mr-3">
                            <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-sm truncate">{ticket.subject}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {new Date(ticket.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground truncate max-w-[100px] md:max-w-[180px]">
                                {ticket.lastMessage}
                              </p>
                              {ticket.unread > 0 && (
                                <Badge 
                                  className="h-4 w-4 md:h-5 md:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                  style={{ backgroundColor: currentTheme.colors.primary }}
                                >
                                  {ticket.unread}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(ticket.status)}`}
                              >
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1 capitalize hidden md:inline">{ticket.status}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredTickets.length === 0 && (
                        <div className="text-center py-8 md:py-12">
                          <MessageCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-muted-foreground/50" />
                          <h3 className="text-base md:text-lg font-semibold mb-2">No conversations found</h3>
                          <p className="text-muted-foreground text-sm mb-4 px-4">
                            {searchQuery ? "Try adjusting your search criteria" : "You haven't started any support conversations yet"}
                          </p>
                          <Button 
                            onClick={() => setActiveTab("new-ticket")}
                            className="text-sm"
                            style={{ 
                              backgroundColor: currentTheme.colors.primary,
                              color: currentTheme.colors.text
                            }}
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            Start New Conversation
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Chat Area (Desktop) */}
                  {!isMobile && (
                    <div className="w-2/3 flex flex-col" style={{ backgroundColor: currentTheme.colors.background }}>
                      {selectedTicket ? (
                        <>
                          {/* Chat Header */}
                          <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: currentTheme.colors.backgroundLight }}>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                                  <MessageCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base">{selectedTicket.subject}</h3>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getStatusColor(selectedTicket.status)}`}
                                    >
                                      {getStatusIcon(selectedTicket.status)}
                                      <span className="ml-1 capitalize">{selectedTicket.status}</span>
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getPriorityColor(selectedTicket.priority)}`}
                                    >
                                      {selectedTicket.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Chat Messages */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
                            {selectedTicket.responses.map((response: any) => (
                              <div
                                key={response.id}
                                className={`flex ${response.isAgent ? 'justify-start' : 'justify-end'}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg p-3 ${
                                    response.isAgent
                                      ? 'bg-muted rounded-tl-none'
                                      : 'rounded-tr-none text-white'
                                  }`}
                                  style={{
                                    backgroundColor: response.isAgent 
                                      ? currentTheme.colors.backgroundLight 
                                      : currentTheme.colors.primary,
                                    color: response.isAgent ? currentTheme.colors.text : currentTheme.colors.text
                                  }}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-medium ${response.isAgent ? 'text-primary' : 'text-current'}`}>
                                      {response.sender}
                                    </span>
                                    <span className="text-xs opacity-70">
                                      {response.timestamp}
                                    </span>
                                  </div>
                                  <p className="text-sm">{response.message}</p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>

                          {/* Message Input */}
                          <div className="p-4 border-t" style={{ backgroundColor: currentTheme.colors.backgroundLight }}>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <Paperclip className="h-4 w-4" />
                              </Button>
                              <div className="flex-1 relative">
                                <Input
                                  placeholder="Type your message..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                  className="pr-12 border-0 bg-background focus-visible:ring-1"
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                >
                                  <Smile className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                style={{ 
                                  backgroundColor: currentTheme.colors.primary,
                                  color: currentTheme.colors.text
                                }}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center max-w-md p-4">
                            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-xl font-semibold mb-2">Welcome to Support Chat</h3>
                            <p className="text-muted-foreground mb-6">
                              Select a conversation from the sidebar or start a new support ticket.
                            </p>
                            <Button 
                              onClick={() => setActiveTab("new-ticket")}
                              style={{ 
                                backgroundColor: currentTheme.colors.primary,
                                color: currentTheme.colors.text
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Start New Conversation
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* New Ticket Tab - Mobile Optimized */}
              <TabsContent value="new-ticket" className="space-y-4 md:space-y-6 p-4">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold">Create Support Ticket</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Describe your issue in detail for faster support.
                  </p>
                </div>

                {/* FAQ Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base md:text-lg">
                      <span>Frequently Asked Questions</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFAQ(!showFAQ)}
                      >
                        {showFAQ ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showFAQ && (
                    <CardContent className="space-y-3 pt-0">
                      {supportData.faqs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-3">
                          <h4 className="font-semibold text-sm md:text-base mb-2">{faq.question}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>

                <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                  {/* Ticket Form */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Ticket Details
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">Provide detailed information about your issue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-2 border-border/50 focus:border-primary/50 text-sm h-10">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => {
                              const IconComponent = category.icon
                              return (
                                <SelectItem key={category.value} value={category.value} className="text-sm">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority Level</label>
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                          <SelectTrigger className="border-2 border-border/50 focus:border-primary/50 text-sm h-10">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value} className="text-sm">
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", {
                                    "bg-green-500": priority.value === "low",
                                    "bg-blue-500": priority.value === "normal",
                                    "bg-orange-500": priority.value === "high",
                                    "bg-red-500": priority.value === "urgent"
                                  })} />
                                  {priority.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedPriority && (
                          <p className="text-xs text-muted-foreground">
                            {priorities.find(p => p.value === selectedPriority)?.description}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          placeholder="Brief description of your issue"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          className="border-2 border-border/50 focus:border-primary/50 text-sm h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Please provide detailed information about your issue..."
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          rows={4}
                          className="border-2 border-border/50 focus:border-primary/50 resize-none text-sm"
                        />
                      </div>
                      
                      {/* File Attachments */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Attachments</label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-3">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            ref={fileInputRef}
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-center">
                              <Paperclip className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs md:text-sm text-muted-foreground">
                                Click to upload files
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Max 10MB
                              </p>
                            </div>
                          </label>
                        </div>
                        
                        {/* Attachments List */}
                        {attachments.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded text-xs">
                                <div className="flex items-center gap-2 truncate">
                                  <File className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveAttachment(index)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full transition-all duration-300 hover:scale-105 text-sm"
                        onClick={handleSubmitTicket}
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-current mr-2" />
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            Create Support Ticket
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Priority Information */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Response Times
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">Expected response times based on priority</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      {priorities.map((priority) => (
                        <div
                          key={priority.value}
                          className={cn(
                            "p-3 md:p-4 rounded-lg border-2 transition-all duration-300",
                            selectedPriority === priority.value && "scale-105 shadow-md",
                            priority.value === "low" && "border-green-200 bg-green-50/50",
                            priority.value === "normal" && "border-blue-200 bg-blue-50/50",
                            priority.value === "high" && "border-orange-200 bg-orange-50/50",
                            priority.value === "urgent" && "border-red-200 bg-red-50/50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{priority.label}</span>
                            <Badge className={cn("text-xs", priority.color)}>
                              {priority.responseTime}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{priority.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Emergency Contacts Tab - Mobile Optimized */}
              <TabsContent value="emergency" className="space-y-4 md:space-y-6 p-4">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold">Emergency Contacts</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Immediate assistance for critical situations.
                  </p>
                </div>
                <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {supportData.emergencyContacts.map((contact) => {
                    const IconComponent = contact.icon
                    return (
                      <Card
                        key={contact.id}
                        className="border-2 border-red-100 bg-red-50/30 hover:border-red-200 transition-all duration-300 hover:scale-105"
                      >
                        <CardContent className="p-3 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full ${contact.color} bg-opacity-10`}>
                              <IconComponent className={`h-5 w-5 md:h-6 md:w-6 ${contact.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-base md:text-lg">{contact.name}</h3>
                              <p className="text-muted-foreground text-xs md:text-sm">{contact.description}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="text-lg md:text-xl font-bold text-red-600 flex items-center justify-between">
                              {contact.number}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 md:h-8 md:w-8 p-0"
                                onClick={() => handleCopyNumber(contact.number)}
                              >
                                <Copy className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm"
                                onClick={() => handleEmergencyCall(contact)}
                              >
                                <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                Call Now
                              </Button>
                              <Button variant="outline" className="border-red-300 text-red-700 h-9 md:h-10 w-9 md:w-10 p-0">
                                <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Emergency Instructions */}
                <Card className="border-2 border-amber-200 bg-amber-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 text-base md:text-lg">
                      <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
                      Emergency Instructions
                    </CardTitle>
                    <CardDescription className="text-amber-700 text-xs md:text-sm">
                      Important guidelines for emergency situations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-amber-800">
                    <ul className="space-y-2 text-xs md:text-sm">
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        Stay calm and provide clear information about your location and situation
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        Follow instructions from emergency services personnel
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        Contact Kazipert support immediately after ensuring your safety
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        Keep your identification and important documents accessible
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Tab - Mobile Optimized */}
              <TabsContent value="contact" className="space-y-4 md:space-y-6 p-4">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold">Other Contact Methods</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Multiple ways to reach our support team.
                  </p>
                </div>
                <div className="grid gap-3 md:gap-6 md:grid-cols-2">
                  {[
                    {
                      icon: MessageCircle,
                      title: "Live Chat",
                      description: "Instant messaging with our support agents",
                      availability: "24/7",
                      action: "Start Chat",
                      details: "Average response time: 2 minutes"
                    },
                    {
                      icon: Mail,
                      title: "Email Support",
                      description: "Detailed assistance via email",
                      availability: "Response within 6 hours",
                      action: "Send Email",
                      details: "support@kazipert.com"
                    },
                    {
                      icon: Phone,
                      title: "Phone Support",
                      description: "Speak directly with our team",
                      availability: "8:00 AM - 8:00 PM",
                      action: "Call Now",
                      details: "+254 700 123456"
                    },
                    {
                      icon: MapPin,
                      title: "Office Visit",
                      description: "Visit our support center",
                      availability: "By appointment",
                      action: "Get Directions",
                      details: "Nairobi, Kenya"
                    }
                  ].map((method, index) => {
                    const IconComponent = method.icon
                    return (
                      <Card
                        key={index}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                        }}
                      >
                        <CardContent className="p-3 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
                              <IconComponent className="h-5 w-5 md:h-6 md:w-6" style={{ color: currentTheme.colors.primary }} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-base md:text-lg">{method.title}</h3>
                              <p className="text-muted-foreground text-xs md:text-sm">{method.description}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{ backgroundColor: currentTheme.colors.primary + '15' }}
                              >
                                {method.availability}
                              </Badge>
                              <span className="text-xs text-muted-foreground hidden md:inline">{method.details}</span>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full border-primary/30 hover:bg-primary/10 text-xs md:text-sm"
                              onClick={() => toast.info(`Initiating ${method.title}`)}
                            >
                              {method.action}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Chat Modal */}
      {isMobile && showChatModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between bg-background">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCloseChat}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(selectedTicket.status)}`}
                    >
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1 capitalize">{selectedTicket.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCloseChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
            {selectedTicket.responses.map((response: any) => (
              <div
                key={response.id}
                className={`flex ${response.isAgent ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    response.isAgent
                      ? 'bg-muted rounded-tl-none'
                      : 'rounded-tr-none text-white'
                  }`}
                  style={{
                    backgroundColor: response.isAgent 
                      ? currentTheme.colors.backgroundLight 
                      : currentTheme.colors.primary,
                    color: response.isAgent ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${response.isAgent ? 'text-primary' : 'text-current'}`}>
                      {response.sender}
                    </span>
                    <span className="text-xs opacity-70">
                      {response.timestamp}
                    </span>
                  </div>
                  <p className="text-sm">{response.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-12 border-0 bg-muted focus-visible:ring-1 text-sm"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                style={{ 
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.text
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  )
}