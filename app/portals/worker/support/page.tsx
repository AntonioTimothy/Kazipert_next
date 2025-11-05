"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageSquare, 
  Plus, 
  Send,
  Headphones,
  ShieldCheck
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export default function WorkerSupportPage() {
  const { currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("support-chat")
  const [newMessage, setNewMessage] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Single test message
  const [supportData] = useState({
    tickets: [
      {
        id: "TKT001",
        subject: "Test Support Ticket",
        description: "This is a test message from support",
        status: "open",
        createdAt: new Date().toISOString().split('T')[0],
        lastMessage: "Welcome to Kazipert Support! How can we help you today?",
        responses: [
          {
            id: "RES001",
            message: "Welcome to Kazipert Support! How can we help you today?",
            sender: "Support Agent",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAgent: true,
          }
        ]
      }
    ]
  })

  const [selectedTicket, setSelectedTicket] = useState(supportData.tickets[0])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newResponse = {
      id: `RES${Date.now()}`,
      message: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAgent: false,
    }

    const updatedTicket = {
      ...selectedTicket,
      responses: [...selectedTicket.responses, newResponse],
      lastMessage: newMessage,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    
    setSelectedTicket(updatedTicket)
    setNewMessage("")

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: `RES${Date.now() + 1}`,
        message: "Thank you for your message. We'll respond to your inquiry shortly.",
        sender: "Support Agent",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAgent: true,
      }

      const finalUpdatedTicket = {
        ...updatedTicket,
        responses: [...updatedTicket.responses, agentResponse],
        lastMessage: agentResponse.message,
      }
      
      setSelectedTicket(finalUpdatedTicket)
    }, 1000)
  }

  const handleCreateTicket = () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return

    setIsSubmitting(true)

    setTimeout(() => {
      const newTicket = {
        id: `TKT${Date.now()}`,
        subject: ticketSubject,
        description: ticketDescription,
        status: "open",
        createdAt: new Date().toISOString().split('T')[0],
        lastMessage: "Thank you for creating a new ticket. We'll assist you shortly.",
        responses: [
          {
            id: "RES001",
            message: "Thank you for creating a new ticket. We'll assist you shortly.",
            sender: "Support Agent",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAgent: true,
          }
        ]
      }

      setSelectedTicket(newTicket)
      setTicketSubject("")
      setTicketDescription("")
      setIsSubmitting(false)
      setActiveTab("support-chat")
    }, 1000)
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
          <Button 
            variant="secondary" 
            className="px-3 py-1 text-xs w-fit"
            onClick={() => setActiveTab("new-ticket")}
          >
            <ShieldCheck className="h-3 w-3 mr-1" />
            24/7 Support
          </Button>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "support-chat" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("support-chat")}
                style={{
                  borderBottomColor: activeTab === "support-chat" ? currentTheme.colors.primary : 'transparent'
                }}
              >
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Support Chat
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "new-ticket" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("new-ticket")}
                style={{
                  borderBottomColor: activeTab === "new-ticket" ? currentTheme.colors.primary : 'transparent'
                }}
              >
                <Plus className="h-4 w-4 inline mr-2" />
                New Ticket
              </button>
            </div>

            {/* Support Chat Tab */}
            {activeTab === "support-chat" && (
              <div className="flex flex-col h-[60vh]">
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Messages */}
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
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="border-0 bg-background focus-visible:ring-1"
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

            {/* New Ticket Tab */}
            {activeTab === "new-ticket" && (
              <div className="space-y-6 p-4">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Create Support Ticket</h2>
                  <p className="text-muted-foreground">
                    Describe your issue and we'll help you quickly.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  <div className="p-6 pt-0">
                    <Button
                      className="w-full"
                      onClick={handleCreateTicket}
                      disabled={isSubmitting || !ticketSubject.trim() || !ticketDescription.trim()}
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
                  </div>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}