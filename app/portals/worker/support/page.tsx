"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Plus,
  Send,
  Headphones,
  ShieldCheck
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { supportService } from "@/lib/services/apiServices"

export default function WorkerSupportPage() {
  const { currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("support-chat")
  const [newMessage, setNewMessage] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [ticketCategory, setTicketCategory] = useState("GENERAL")
  const [ticketPriority, setTicketPriority] = useState("MEDIUM")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const data = await supportService.getTickets()
      setTickets(data.tickets || [])
      if (data.tickets && data.tickets.length > 0) {
        setSelectedTicket(data.tickets[0])
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return

    try {
      await supportService.addMessage({
        ticketId: selectedTicket.id,
        message: newMessage
      })

      setNewMessage("")
      await fetchTickets()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return

    setIsSubmitting(true)

    try {
      const newTicket = await supportService.createTicket({
        subject: ticketSubject,
        description: ticketDescription,
        category: ticketCategory,
        priority: ticketPriority
      })

      setTicketSubject("")
      setTicketDescription("")
      setTicketCategory("GENERAL")
      setTicketPriority("MEDIUM")
      setIsSubmitting(false)
      setActiveTab("support-chat")

      await fetchTickets()
      setSelectedTicket(newTicket)
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket. Please try again.')
      setIsSubmitting(false)
    }
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
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "support-chat"
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
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "new-ticket"
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
                {selectedTicket ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(selectedTicket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                      ) : selectedTicket?.messages?.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender.role === 'ADMIN' || msg.sender.role === 'SUPER_ADMIN' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${msg.sender.role === 'ADMIN' || msg.sender.role === 'SUPER_ADMIN'
                              ? 'bg-muted rounded-tl-none'
                              : 'rounded-tr-none text-white'
                              }`}
                            style={{
                              backgroundColor: (msg.sender.role === 'ADMIN' || msg.sender.role === 'SUPER_ADMIN')
                                ? currentTheme.colors.backgroundLight
                                : currentTheme.colors.primary,
                              color: (msg.sender.role === 'ADMIN' || msg.sender.role === 'SUPER_ADMIN') ? currentTheme.colors.text : currentTheme.colors.text
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {msg.sender.firstName} {msg.sender.lastName}
                              </span>
                              <span className="text-xs opacity-70">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
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
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                    {loading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    ) : (
                      <>
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No tickets found</p>
                        <p className="text-sm">Create a new ticket to get started.</p>
                      </>
                    )}
                  </div>
                )}
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
                      <label className="text-sm font-medium">Category</label>
                      <Select value={ticketCategory} onValueChange={setTicketCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="PAYMENT">Payment</SelectItem>
                          <SelectItem value="CONTRACT">Contract</SelectItem>
                          <SelectItem value="TECHNICAL">Technical</SelectItem>
                          <SelectItem value="ABUSE">Abuse</SelectItem>
                          <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={ticketPriority} onValueChange={setTicketPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
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