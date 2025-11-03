"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { 
  MessageSquare, Search, Plus, Phone, Mail, Clock, 
  AlertTriangle, CheckCircle2, XCircle, MoreHorizontal,
  Send, ChevronLeft, Paperclip, X, File, Trash2,
  Headphones, ShieldCheck, Zap
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

// Simplified mock data
const supportData = {
  tickets: [
    {
      id: "TKT001",
      subject: "Payment Delay for January Salary",
      description: "My salary for January work has not been processed yet.",
      category: "payment",
      priority: "urgent",
      status: "escalated",
      statusDetail: "Escalated to Embassy",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-21",
      lastMessage: "We've escalated this to our finance team.",
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
          message: "Hi, I haven't received my January salary yet.",
          sender: "You",
          timestamp: "2024-01-20 14:20",
          isAgent: false,
        },
        {
          id: "RES002",
          message: "We've escalated this to our finance team.",
          sender: "Support Agent",
          timestamp: "2024-01-20 14:30",
          isAgent: true,
        }
      ]
    },
    {
      id: "TKT002",
      subject: "Contract Document Clarification",
      description: "Need clarification on clause 4.2.",
      category: "contract",
      priority: "normal",
      status: "reviewed",
      statusDetail: "Reviewed by Law Firm",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-19",
      lastMessage: "Our legal team is reviewing your contract.",
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
          message: "Our legal team is reviewing your contract.",
          sender: "Legal Support",
          timestamp: "2024-01-18 11:15",
          isAgent: true,
        }
      ]
    },
    {
      id: "TKT003",
      subject: "Training Certificate",
      description: "Completed course but no certificate.",
      category: "training",
      priority: "normal",
      status: "resolved",
      statusDetail: "Resolved",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-16",
      lastMessage: "Certificate sent to your email.",
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
          message: "Certificate sent to your email.",
          sender: "Training Support",
          timestamp: "2024-01-16 09:45",
          isAgent: true,
        }
      ]
    },
    {
      id: "TKT004",
      subject: "Visa Processing Update",
      description: "Need update on visa application status",
      category: "legal",
      priority: "high",
      status: "requires_info",
      statusDetail: "Requires Additional Info",
      createdAt: "2024-01-22",
      updatedAt: "2024-01-22",
      lastMessage: "Please provide passport copy.",
      unread: 1,
      agent: {
        name: "David Kim",
        role: "Immigration Specialist",
        avatar: "DK",
        online: true
      },
      responses: [
        {
          id: "RES004",
          message: "Please provide passport copy for processing.",
          sender: "Immigration Support",
          timestamp: "2024-01-22 10:30",
          isAgent: true,
        }
      ]
    }
  ],
  quickActions: [
    {
      id: "QA001",
      title: "Payment Issue",
      description: "Salary or payment problems",
      category: "payment",
    },
    {
      id: "QA002",
      title: "Contract Help",
      description: "Contract terms clarification",
      category: "contract",
    },
    {
      id: "QA003",
      title: "Training Support",
      description: "Course completion issues",
      category: "training",
    },
    {
      id: "QA004",
      title: "Legal Assistance",
      description: "Visa and legal matters",
      category: "legal",
    }
  ]
}

export default function WorkerSupportPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("support-chat")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)

  const messagesEndRef = useRef(null)

  // New ticket form state
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [selectedPriority, setSelectedPriority] = useState("normal")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      
      if (supportData.tickets.length > 0 && !selectedTicket) {
        setSelectedTicket(supportData.tickets[0])
      }
    }

    loadData()
  }, [router, selectedTicket])

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "payment", label: "Payment Issue" },
    { value: "contract", label: "Contract Related" },
    { value: "training", label: "Training & Certificates" },
    { value: "legal", label: "Legal Assistance" },
    { value: "other", label: "Other" }
  ]

  const priorities = [
    { value: "low", label: "Low Priority", responseTime: "Within 24 hours" },
    { value: "normal", label: "Normal", responseTime: "Within 12 hours" },
    { value: "high", label: "High Priority", responseTime: "Within 6 hours" },
    { value: "urgent", label: "Urgent", responseTime: "Within 2 hours" }
  ]

  const filteredTickets = supportData.tickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketDescription) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const newTicket = {
        id: `TKT${Date.now()}`,
        subject: ticketSubject,
        description: ticketDescription,
        category: selectedCategory,
        priority: selectedPriority,
        status: "open",
        statusDetail: "Open",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        lastMessage: "Thank you for your ticket. We'll respond shortly.",
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

      toast.success("Ticket Created Successfully!")

      setTicketSubject("")
      setTicketDescription("")
      setSelectedPriority("normal")
      setSelectedCategory("general")
      setIsSubmitting(false)
      setActiveTab("support-chat")
      if (isMobile) {
        setShowChatModal(true)
      }
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newResponse = {
      id: `RES${Date.now()}`,
      message: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgent: false,
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
      
      const ticketIndex = supportData.tickets.findIndex(t => t.id === selectedTicket.id)
      if (ticketIndex !== -1) {
        supportData.tickets[ticketIndex] = updatedTicket
      }
    }

    setNewMessage("")

    setTimeout(() => {
      const agentResponse = {
        id: `RES${Date.now() + 1}`,
        message: "Thank you for your message. We'll respond shortly.",
        sender: selectedTicket?.agent?.name || "Support Agent",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAgent: true,
      }

      if (selectedTicket) {
        const updatedTicket = {
          ...selectedTicket,
          responses: [...selectedTicket.responses, agentResponse],
          lastMessage: agentResponse.message,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        
        setSelectedTicket(updatedTicket)
        
        const ticketIndex = supportData.tickets.findIndex(t => t.id === selectedTicket.id)
        if (ticketIndex !== -1) {
          supportData.tickets[ticketIndex] = updatedTicket
        }
      }
    }, 2000)
  }

  const handleQuickAction = (action) => {
    setSelectedCategory(action.category)
    setActiveTab("new-ticket")
    toast.info(`Starting ${action.title.toLowerCase()}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open": return <Clock className="h-3 w-3 text-blue-500" />
      case "escalated": return <AlertTriangle className="h-3 w-3 text-orange-500" />
      case "reviewed": return <CheckCircle2 className="h-3 w-3 text-purple-500" />
      case "resolved": return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case "requires_info": return <AlertTriangle className="h-3 w-3 text-amber-500" />
      default: return <MoreHorizontal className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "text-blue-600 bg-blue-500/10"
      case "escalated": return "text-orange-600 bg-orange-500/10"
      case "reviewed": return "text-purple-600 bg-purple-500/10"
      case "resolved": return "text-green-600 bg-green-500/10"
      case "requires_info": return "text-amber-600 bg-amber-500/10"
      default: return "text-gray-600 bg-gray-500/10"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "text-green-600 bg-green-500/10"
      case "normal": return "text-blue-600 bg-blue-500/10"
      case "high": return "text-orange-600 bg-orange-500/10"
      case "urgent": return "text-red-600 bg-red-500/10"
      default: return "text-gray-600 bg-gray-500/10"
    }
  }

  const handleOpenChat = (ticket) => {
    setSelectedTicket(ticket)
    if (isMobile) {
      setShowChatModal(true)
    }
  }

  const handleCloseChat = () => {
    setShowChatModal(false)
  }

  // Skeleton loading component
  const TicketSkeleton = () => (
    <div className="flex items-center justify-between p-4 border-b border-border/30 animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-10 w-10 bg-gray-200 rounded"></div>
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-32"></div>
          <div className="h-2 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center animate-pulse">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          {/* Tickets Skeleton */}
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <TicketSkeleton key={i} />
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
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Headphones className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
              Support Center
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Get help with your questions and issues
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-xs w-fit">
            <ShieldCheck className="h-3 w-3 mr-1" />
            24/7 Available
          </Badge>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {supportData.quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  onClick={() => handleQuickAction(action)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium text-sm text-center">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 p-1 rounded-lg bg-muted/50">
                <TabsTrigger 
                  value="support-chat" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'support-chat' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'support-chat' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Tickets
                </TabsTrigger>
                <TabsTrigger 
                  value="new-ticket" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'new-ticket' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'new-ticket' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Ticket
                </TabsTrigger>
                <TabsTrigger 
                  value="contact" 
                  className="rounded-md text-sm"
                  style={{ 
                    backgroundColor: activeTab === 'contact' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'contact' ? currentTheme.colors.text : 'inherit'
                  }}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* Tickets Tab */}
              <TabsContent value="support-chat" className="p-0">
                <div className="flex flex-col md:flex-row h-[60vh] md:h-[500px] border-t">
                  {/* Tickets List */}
                  <div className={cn(
                    "border-r w-full md:w-1/3",
                    isMobile && showChatModal ? "hidden" : "block"
                  )}>
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Your Tickets</h2>
                        <Button 
                          size="sm" 
                          onClick={() => setActiveTab("new-ticket")}
                          className="h-8 w-8"
                          style={{ 
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search tickets..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 border-0 bg-background focus-visible:ring-1 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(60vh-80px)] md:h-[400px]">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`flex items-center p-4 border-b cursor-pointer transition-colors ${
                            selectedTicket?.id === ticket.id 
                              ? "bg-primary/10" 
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleOpenChat(ticket)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-sm truncate">{ticket.subject}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {new Date(ticket.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">
                              {ticket.lastMessage}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusColor(ticket.status)}`}
                              >
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1">{ticket.statusDetail}</span>
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(ticket.priority)}`}
                              >
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredTickets.length === 0 && (
                        <div className="text-center py-12">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                          <p className="text-muted-foreground text-sm mb-4 px-4">
                            {searchQuery ? "Try adjusting your search" : "You haven't created any tickets yet"}
                          </p>
                          <Button 
                            onClick={() => setActiveTab("new-ticket")}
                            style={{ 
                              backgroundColor: currentTheme.colors.primary,
                              color: currentTheme.colors.text
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Ticket
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Area (Desktop) */}
                  {!isMobile && (
                    <div className="w-2/3 flex flex-col">
                      {selectedTicket ? (
                        <>
                          <div className="p-4 border-b flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-sm ${getStatusColor(selectedTicket.status)}`}
                                >
                                  {getStatusIcon(selectedTicket.status)}
                                  <span className="ml-1">{selectedTicket.statusDetail}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedTicket.responses.map((response) => (
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
                                    <span className="text-xs font-medium">
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

                          <div className="p-4 border-t">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 relative">
                                <Input
                                  placeholder="Type your message..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                  className="pr-12 border-0 bg-background focus-visible:ring-1"
                                />
                              </div>
                              <Button 
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
                            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="text-xl font-semibold mb-2">Support Chat</h3>
                            <p className="text-muted-foreground mb-6">
                              Select a ticket to start chatting with support.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* New Ticket Tab */}
              <TabsContent value="new-ticket" className="space-y-6 p-4">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold">Create Support Ticket</h2>
                  <p className="text-muted-foreground">
                    Describe your issue and we'll help you quickly.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ticket Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", {
                                    "bg-green-500": priority.value === "low",
                                    "bg-blue-500": priority.value === "normal",
                                    "bg-orange-500": priority.value === "high",
                                    "bg-red-500": priority.value === "urgent"
                                  })} />
                                  {priority.label} ({priority.responseTime})
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          placeholder="Brief description of your issue"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Please provide detailed information about your issue..."
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={handleSubmitTicket}
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Support Ticket
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-6 p-4">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold">Contact Support</h2>
                  <p className="text-muted-foreground">
                    Multiple ways to reach our support team.
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: currentTheme.colors.primary }} />
                      <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                      <p className="text-muted-foreground mb-4">Instant messaging with support agents</p>
                      <Badge variant="secondary" className="mb-4">24/7 Available</Badge>
                      <Button 
                        className="w-full"
                        onClick={() => setActiveTab("support-chat")}
                        style={{ 
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Mail className="h-12 w-12 mx-auto mb-4" style={{ color: currentTheme.colors.primary }} />
                      <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                      <p className="text-muted-foreground mb-4">Detailed assistance via email</p>
                      <Badge variant="secondary" className="mb-4">Response within 6 hours</Badge>
                      <Button variant="outline" className="w-full">
                        support@kazipert.com
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Chat Modal */}
      {isMobile && showChatModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCloseChat}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h3 className="font-semibold text-sm">{selectedTicket.subject}</h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(selectedTicket.status)}`}
                >
                  {getStatusIcon(selectedTicket.status)}
                  <span className="ml-1">{selectedTicket.statusDetail}</span>
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCloseChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedTicket.responses.map((response) => (
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
                    <span className="text-xs font-medium">
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

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-12 border-0 bg-muted focus-visible:ring-1"
                />
              </div>
              <Button 
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
    </div>
  )
}