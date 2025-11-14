"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  MessageSquare,
  Ticket,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Shield,
  Heart,
  Building,
  TrendingUp,
  LogOut,
  Settings,
  ChevronDown,
  Plus,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Types
interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'SERVICE' | 'OTHER'
  escalatedTo: 'NONE' | 'LEGAL' | 'INSURANCE' | 'EMBASSY' | 'MANAGEMENT'
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

interface TicketMessage {
  id: string
  content: string
  sender: {
    id: string
    firstName: string
    lastName: string
    role: string
  }
  createdAt: string
  isInternal: boolean
}

interface LiveChat {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  status: 'ACTIVE' | 'WAITING' | 'ENDED'
  lastMessage: string
  lastActivity: string
  assignedAgent?: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

interface SupportStats {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  escalatedTickets: number
  activeChats: number
  averageResponseTime: number
}

// Color constants
const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82',
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    OPEN: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
    RESOLVED: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    ESCALATED: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Shield },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN
  const IconComponent = config.icon

  return (
    <Badge className={cn("flex items-center gap-1", config.color)}>
      <IconComponent className="h-3 w-3" />
      {status.replace('_', ' ')}
    </Badge>
  )
}

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = {
    LOW: { color: "bg-gray-100 text-gray-800 border-gray-200" },
    MEDIUM: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    HIGH: { color: "bg-orange-100 text-orange-800 border-orange-200" },
    URGENT: { color: "bg-red-100 text-red-800 border-red-200" },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.LOW

  return (
    <Badge className={cn("text-xs", config.color)}>
      {priority}
    </Badge>
  )
}

// Escalation Badge Component
const EscalationBadge = ({ escalatedTo }: { escalatedTo: string }) => {
  if (escalatedTo === 'NONE') return null

  const escalationConfig = {
    LEGAL: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: FileText },
    INSURANCE: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Heart },
    EMBASSY: { color: "bg-green-100 text-green-800 border-green-200", icon: Building },
    MANAGEMENT: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Users },
  }

  const config = escalationConfig[escalatedTo as keyof typeof escalationConfig] || escalationConfig.LEGAL
  const IconComponent = config.icon

  return (
    <Badge className={cn("flex items-center gap-1", config.color)}>
      <IconComponent className="h-3 w-3" />
      {escalatedTo}
    </Badge>
  )
}

export default function SupportCenterPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tickets' | 'chats'>('tickets')
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [chats, setChats] = useState<LiveChat[]>([])
  const [stats, setStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    escalatedTickets: 0,
    activeChats: 0,
    averageResponseTime: 0
  })
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  })
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL' as const,
    priority: 'MEDIUM' as const
  })
  const [refreshing, setRefreshing] = useState(false)

  // Check authentication
  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(parsedUser.role)) {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
    fetchSupportData()
  }, [router])

  const fetchSupportData = async () => {
    try {
      setRefreshing(true)
      // In a real app, these would be API calls
      setTickets(mockTickets)
      setChats(mockChats)
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching support data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      alert("Please fill in all required fields")
      return
    }

    const ticket: SupportTicket = {
      id: `TICKET${mockTickets.length + 1}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'OPEN',
      priority: newTicket.priority,
      category: newTicket.category,
      escalatedTo: 'NONE',
      createdBy: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    }

    setTickets(prev => [ticket, ...prev])
    setNewTicket({ title: '', description: '', category: 'TECHNICAL', priority: 'MEDIUM' })
    setIsNewTicketDialogOpen(false)
    alert("Ticket created successfully!")
  }

  const handleEscalateTicket = async (ticketId: string, escalateTo: 'LEGAL' | 'INSURANCE' | 'EMBASSY') => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, escalatedTo: escalateTo, status: 'ESCALATED', updatedAt: new Date().toISOString() }
        : ticket
    ))
    alert(`Ticket escalated to ${escalateTo}`)
  }

  const handleUpdateStatus = async (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status, updatedAt: new Date().toISOString() }
        : ticket
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg" style={{ backgroundColor: `${KAZIPERT_COLORS.primary}15` }}>
                <MessageSquare className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                  Support Center
                </h1>
                <p className="text-muted-foreground">Manage support tickets and live chats</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsNewTicketDialogOpen(true)}
              style={{ backgroundColor: KAZIPERT_COLORS.primary }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                {stats.totalTickets}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.openTickets} open • {stats.resolvedTickets} resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.accent }}>
                {stats.activeChats}
              </div>
              <p className="text-xs text-muted-foreground">
                Live conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Escalated Cases</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.escalatedTickets}
              </div>
              <p className="text-xs text-muted-foreground">
                Legal, Insurance, Embassy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.averageResponseTime}m
              </div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'tickets' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('tickets')}
                  style={activeTab === 'tickets' ? { backgroundColor: KAZIPERT_COLORS.primary } : {}}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  Support Tickets
                  <Badge variant="secondary" className="ml-2">
                    {tickets.length}
                  </Badge>
                </Button>
                <Button
                  variant={activeTab === 'chats' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('chats')}
                  style={activeTab === 'chats' ? { backgroundColor: KAZIPERT_COLORS.primary } : {}}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chats
                  <Badge variant="secondary" className="ml-2">
                    {chats.filter(chat => chat.status === 'ACTIVE').length}
                  </Badge>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={fetchSupportData} disabled={refreshing}>
                  <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'tickets' ? (
              <TicketsView 
                tickets={tickets}
                filters={filters}
                onFiltersChange={setFilters}
                onTicketSelect={(ticket) => {
                  setSelectedTicket(ticket)
                  setIsTicketDialogOpen(true)
                }}
                onEscalate={handleEscalateTicket}
                onStatusUpdate={handleUpdateStatus}
              />
            ) : (
              <ChatsView 
                chats={chats}
                onChatSelect={(chat) => {
                  // Navigate to chat interface
                  router.push(`/support/chats/${chat.id}`)
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" style={{ color: KAZIPERT_COLORS.primary }} />
              Ticket Details
            </DialogTitle>
            <DialogDescription>
              View and manage support ticket
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <TicketDetailView 
              ticket={selectedTicket}
              onEscalate={handleEscalateTicket}
              onStatusUpdate={handleUpdateStatus}
              onClose={() => setIsTicketDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new support ticket.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}
                >
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
            </div>

            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the issue..."
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTicketDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTicket}
              style={{ backgroundColor: KAZIPERT_COLORS.primary }}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Tickets View Component
function TicketsView({ 
  tickets, 
  filters, 
  onFiltersChange, 
  onTicketSelect, 
  onEscalate, 
  onStatusUpdate 
}: {
  tickets: SupportTicket[]
  filters: any
  onFiltersChange: (filters: any) => void
  onTicketSelect: (ticket: SupportTicket) => void
  onEscalate: (ticketId: string, escalateTo: 'LEGAL' | 'INSURANCE' | 'EMBASSY') => void
  onStatusUpdate: (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => void
}) {
  const filteredTickets = tickets.filter(ticket => {
    if (filters.status !== 'all' && ticket.status !== filters.status) return false
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false
    if (filters.category !== 'all' && ticket.category !== filters.category) return false
    if (filters.search && !ticket.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !ticket.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>
        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="ESCALATED">Escalated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Category</SelectItem>
            <SelectItem value="TECHNICAL">Technical</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
            <SelectItem value="ACCOUNT">Account</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Details</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Escalated To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm cursor-pointer hover:text-blue-600" 
                         onClick={() => onTicketSelect(ticket)}>
                      {ticket.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.category.replace('_', ' ')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.createdBy.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.createdBy.role}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>
                  <EscalationBadge escalatedTo={ticket.escalatedTo} />
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTicketSelect(ticket)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onStatusUpdate(ticket.id, 'IN_PROGRESS')}>
                          <Clock className="h-4 w-4 mr-2" />
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusUpdate(ticket.id, 'RESOLVED')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Escalate To
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onEscalate(ticket.id, 'LEGAL')}>
                              Legal Department
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEscalate(ticket.id, 'INSURANCE')}>
                              Insurance Team
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEscalate(ticket.id, 'EMBASSY')}>
                              Embassy Liaison
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTickets.length === 0 && (
          <div className="text-center py-8">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No tickets found</h3>
            <p className="text-muted-foreground mt-2">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'No support tickets have been created yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Chats View Component
function ChatsView({ chats, onChatSelect }: { chats: LiveChat[], onChatSelect: (chat: LiveChat) => void }) {
  const activeChats = chats.filter(chat => chat.status === 'ACTIVE')
  const waitingChats = chats.filter(chat => chat.status === 'WAITING')

  return (
    <div className="space-y-6">
      {/* Active Chats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Conversations</h3>
        <div className="grid gap-4">
          {activeChats.map((chat) => (
            <Card key={chat.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {chat.user.firstName} {chat.user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {chat.lastMessage}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date(chat.lastActivity).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chat.assignedAgent ? `Assigned to ${chat.assignedAgent.firstName}` : 'Unassigned'}
                      </div>
                    </div>
                    <Button onClick={() => onChatSelect(chat)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeChats.length === 0 && (
          <div className="text-center py-8 border rounded-lg">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No active chats</h3>
            <p className="text-muted-foreground mt-2">Waiting for users to start conversations</p>
          </div>
        )}
      </div>

      {/* Waiting Chats */}
      {waitingChats.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Waiting in Queue ({waitingChats.length})</h3>
          <div className="grid gap-4">
            {waitingChats.map((chat) => (
              <Card key={chat.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {chat.user.firstName} {chat.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Waiting for agent...
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => onChatSelect(chat)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Accept Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Ticket Detail View Component
function TicketDetailView({ 
  ticket, 
  onEscalate, 
  onStatusUpdate, 
  onClose 
}: { 
  ticket: SupportTicket
  onEscalate: (ticketId: string, escalateTo: 'LEGAL' | 'INSURANCE' | 'EMBASSY') => void
  onStatusUpdate: (ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => void
  onClose: () => void
}) {
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // In a real app, this would send the message to the backend
    alert(`Message sent: ${newMessage} (${isInternal ? 'Internal' : 'Public'})`)
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: KAZIPERT_COLORS.primary }}
        >
          <Ticket className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{ticket.title}</h3>
          <p className="text-muted-foreground">Created by {ticket.createdBy.firstName} {ticket.createdBy.lastName}</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <EscalationBadge escalatedTo={ticket.escalatedTo} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ticket.status !== 'RESOLVED' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStatusUpdate(ticket.id, 'IN_PROGRESS')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark In Progress
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStatusUpdate(ticket.id, 'RESOLVED')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              </>
            )}
            {ticket.status !== 'ESCALATED' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Escalate To
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEscalate(ticket.id, 'LEGAL')}>
                    Legal Department
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEscalate(ticket.id, 'INSURANCE')}>
                    Insurance Team
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEscalate(ticket.id, 'EMBASSY')}>
                    Embassy Liaison
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Category</div>
              <div className="font-medium">{ticket.category.replace('_', ' ')}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Created</div>
              <div className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="font-medium">{new Date(ticket.updatedAt).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Requester Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Name</div>
              <div className="font-medium">{ticket.createdBy.firstName} {ticket.createdBy.lastName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-medium">{ticket.createdBy.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Role</div>
              <div className="font-medium">{ticket.createdBy.role}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Issue Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticket.messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Start the conversation.
              </div>
            ) : (
              ticket.messages.map((message) => (
                <div key={message.id} className={`p-3 rounded-lg ${
                  message.isInternal ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {message.sender.firstName} {message.sender.lastName}
                      {message.isInternal && (
                        <Badge variant="outline" className="ml-2 text-xs">Internal</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              ))
            )}
          </div>

          {/* New Message */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="internal-note"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="internal-note" className="text-sm font-medium">
                Internal Note (Visible only to support team)
              </label>
            </div>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isInternal ? "Add an internal note..." : "Type your response..."}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewMessage('')}>
                Clear
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                style={{ backgroundColor: KAZIPERT_COLORS.primary }}
              >
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock Data
const mockTickets: SupportTicket[] = [
  {
    id: "TICKET001",
    title: "Payment not processed for completed job",
    description: "I completed a house manager job two weeks ago but haven't received payment. The employer is not responding to my messages.",
    status: "OPEN",
    priority: "HIGH",
    category: "BILLING",
    escalatedTo: "NONE",
    createdBy: {
      id: "U001",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@example.com",
      role: "WORKER"
    },
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    messages: []
  },
  {
    id: "TICKET002",
    title: "Account verification issue",
    description: "I've uploaded my documents three times but my account is still not verified. It's been over a week.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    category: "ACCOUNT",
    escalatedTo: "NONE",
    createdBy: {
      id: "U002",
      firstName: "Mohammed",
      lastName: "Al-Habsi",
      email: "m.alhabsi@example.com",
      role: "EMPLOYER"
    },
    assignedTo: {
      id: "A001",
      firstName: "John",
      lastName: "Smith"
    },
    createdAt: "2025-01-14T14:20:00Z",
    updatedAt: "2025-01-16T09:15:00Z",
    messages: [
      {
        id: "M001",
        content: "Thank you for contacting support. I'm looking into your verification issue.",
        sender: {
          id: "A001",
          firstName: "John",
          lastName: "Smith",
          role: "SUPPORT_AGENT"
        },
        createdAt: "2025-01-16T09:15:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "TICKET003",
    title: "Work visa sponsorship inquiry",
    description: "I need information about work visa sponsorship for domestic workers from Philippines.",
    status: "ESCALATED",
    priority: "URGENT",
    category: "SERVICE",
    escalatedTo: "EMBASSY",
    createdBy: {
      id: "U003",
      firstName: "Fatima",
      lastName: "Al-Rashid",
      email: "fatima.r@example.com",
      role: "EMPLOYER"
    },
    createdAt: "2025-01-12T16:45:00Z",
    updatedAt: "2025-01-16T11:20:00Z",
    messages: [
      {
        id: "M002",
        content: "This requires embassy liaison. Escalating to our embassy coordination team.",
        sender: {
          id: "A002",
          firstName: "Lisa",
          lastName: "Chen",
          role: "SUPPORT_AGENT"
        },
        createdAt: "2025-01-16T11:20:00Z",
        isInternal: true
      }
    ]
  },
  {
    id: "TICKET004",
    title: "Insurance claim for work injury",
    description: "My domestic worker had an accident while working at my residence. Need to file insurance claim.",
    status: "ESCALATED",
    priority: "HIGH",
    category: "OTHER",
    escalatedTo: "INSURANCE",
    createdBy: {
      id: "U004",
      firstName: "Ahmed",
      lastName: "Al-Balushi",
      email: "ahmed.b@example.com",
      role: "EMPLOYER"
    },
    createdAt: "2025-01-16T08:15:00Z",
    updatedAt: "2025-01-16T10:30:00Z",
    messages: []
  },
  {
    id: "TICKET005",
    title: "App not loading on iOS device",
    description: "The Kazipert app crashes immediately when I try to open it on my iPhone 13. iOS version 16.5.",
    status: "RESOLVED",
    priority: "MEDIUM",
    category: "TECHNICAL",
    escalatedTo: "NONE",
    createdBy: {
      id: "U005",
      firstName: "James",
      lastName: "Wilson",
      email: "j.wilson@example.com",
      role: "WORKER"
    },
    assignedTo: {
      id: "A003",
      firstName: "David",
      lastName: "Brown"
    },
    createdAt: "2025-01-10T11:20:00Z",
    updatedAt: "2025-01-15T14:10:00Z",
    messages: [
      {
        id: "M003",
        content: "This was fixed in the latest app update. Please update to version 2.1.3.",
        sender: {
          id: "A003",
          firstName: "David",
          lastName: "Brown",
          role: "SUPPORT_AGENT"
        },
        createdAt: "2025-01-15T14:10:00Z",
        isInternal: false
      }
    ]
  }
]

const mockChats: LiveChat[] = [
  {
    id: "CHAT001",
    user: {
      id: "U006",
      firstName: "Maria",
      lastName: "Santos",
      email: "maria.s@example.com"
    },
    status: "ACTIVE",
    lastMessage: "I need help with my job application",
    lastActivity: "2025-01-16T14:25:00Z",
    assignedAgent: {
      id: "A001",
      firstName: "John",
      lastName: "Smith"
    },
    createdAt: "2025-01-16T14:15:00Z"
  },
  {
    id: "CHAT002",
    user: {
      id: "U007",
      firstName: "Khalid",
      lastName: "Al-Hinai",
      email: "k.hinai@example.com"
    },
    status: "ACTIVE",
    lastMessage: "How do I post a job for multiple positions?",
    lastActivity: "2025-01-16T14:28:00Z",
    createdAt: "2025-01-16T14:20:00Z"
  },
  {
    id: "CHAT003",
    user: {
      id: "U008",
      firstName: "Aisha",
      lastName: "Al-Lawati",
      email: "aisha.l@example.com"
    },
    status: "WAITING",
    lastMessage: "I have a question about worker contracts",
    lastActivity: "2025-01-16T14:30:00Z",
    createdAt: "2025-01-16T14:30:00Z"
  }
]

const mockStats: SupportStats = {
  totalTickets: 47,
  openTickets: 12,
  resolvedTickets: 28,
  escalatedTickets: 7,
  activeChats: 2,
  averageResponseTime: 15
}