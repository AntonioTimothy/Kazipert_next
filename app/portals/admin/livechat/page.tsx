"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  MessageSquare,
  ArrowLeft,
  Send,
  User,
  Clock,
  CheckCircle,
  MoreVertical,
  Paperclip,
  Smile
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  content: string
  sender: 'USER' | 'AGENT'
  timestamp: string
  read: boolean
  type: 'TEXT' | 'FILE' | 'SYSTEM'
}

interface LiveChat {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  status: 'ACTIVE' | 'WAITING' | 'ENDED'
  assignedAgent?: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  messages: ChatMessage[]
}

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82',
  accent: '#6c71b5',
}

export default function LiveChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.id as string
  
  const [chat, setChat] = useState<LiveChat | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock chat data - in real app, fetch by ID
  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    
    // Find chat by ID from mock data
    const foundChat = mockChats.find(c => c.id === chatId)
    if (foundChat) {
      setChat({
        ...foundChat,
        messages: mockChatMessages[chatId] || []
      })
    }
    
    setLoading(false)
  }, [chatId, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chat) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'AGENT',
      timestamp: new Date().toISOString(),
      read: true,
      type: 'TEXT'
    }

    setChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message]
    } : null)

    setNewMessage('')
  }

  const handleEndChat = () => {
    if (chat) {
      setChat({
        ...chat,
        status: 'ENDED'
      })
      alert('Chat ended successfully')
    }
  }

  const handleTransferChat = () => {
    alert('Transfer chat functionality would go here')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chat Not Found</h3>
            <p className="text-muted-foreground mb-4">The requested chat session could not be found.</p>
            <Button onClick={() => router.push('/support')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support Center
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/support')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" style={{ color: KAZIPERT_COLORS.primary }} />
                </div>
                <div>
                  <div className="font-semibold">
                    {chat.user.firstName} {chat.user.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {chat.user.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={chat.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {chat.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Started {new Date(chat.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {chat.status === 'ACTIVE' && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleTransferChat}>
                      Transfer
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleEndChat}>
                      End Chat
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View User Profile</DropdownMenuItem>
                    <DropdownMenuItem>Create Support Ticket</DropdownMenuItem>
                    <DropdownMenuItem>Chat History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
              {chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.sender === 'AGENT' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0",
                    message.sender === 'AGENT' 
                      ? "bg-blue-500" 
                      : "bg-gray-400"
                  )}>
                    {message.sender === 'AGENT' ? 'A' : 'U'}
                  </div>
                  <div className={cn(
                    "rounded-lg p-3",
                    message.sender === 'AGENT'
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={cn(
                      "text-xs mt-1 flex items-center gap-1",
                      message.sender === 'AGENT' ? "text-blue-100" : "text-gray-500"
                    )}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.sender === 'AGENT' && message.read && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* System message for new chat */}
            {chat.messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Chat Started
                </h3>
                <p className="text-muted-foreground">
                  You are now connected with {chat.user.firstName}. Start the conversation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Input */}
        {chat.status === 'ACTIVE' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{ backgroundColor: KAZIPERT_COLORS.primary }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {chat.status === 'ENDED' && (
          <Card className="bg-gray-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-semibold text-muted-foreground">Chat Ended</h3>
              <p className="text-sm text-muted-foreground">
                This chat session has been ended. No new messages can be sent.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Mock data
const mockChats: LiveChat[] = [
  {
    id: "CHAT001",
    user: {
      id: "U006",
      firstName: "Maria",
      lastName: "Kibe",
      email: "maria.s@example.com",
      phone: "+96812345678"
    },
    status: "ACTIVE",
    assignedAgent: {
      id: "A001",
      firstName: "John",
      lastName: "Kibe"
    },
    createdAt: "2025-01-16T14:15:00Z",
    messages: []
  }
]

const mockChatMessages: Record<string, ChatMessage[]> = {
  "CHAT001": [
    {
      id: "1",
      content: "Hello, I need help with my job application. It says it's pending review for 5 days now.",
      sender: "USER",
      timestamp: "2025-01-16T14:15:30Z",
      read: true,
      type: "TEXT"
    },
    {
      id: "2",
      content: "Hello Maria! I'm John from support. I'll help you with your job application issue.",
      sender: "AGENT",
      timestamp: "2025-01-16T14:16:15Z",
      read: true,
      type: "TEXT"
    },
    {
      id: "3",
      content: "Can you tell me the job ID or the employer's name?",
      sender: "AGENT",
      timestamp: "2025-01-16T14:16:45Z",
      read: true,
      type: "TEXT"
    }
  ]
}