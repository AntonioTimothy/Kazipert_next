"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Shield,
  Settings,
  MessageSquare,
  BarChart3,
  CreditCard,
  UserCheck,
  UserX,
  FileText,
  Zap,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Archive,
  Volume2,
  VolumeX
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#6c71b5', 
  accent: '#e53e3e',
  background: '#f8fafc'
}

interface Notification {
  id: number
  type: "system" | "user" | "security" | "billing" | "success" | "warning"
  title: string
  description: string
  time: string
  icon: any
  read: boolean
  category: string
  priority: "low" | "medium" | "high" | "critical"
  actionRequired?: boolean
  target?: string
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "security",
      title: "Suspicious Login Attempt",
      description: "Multiple failed login attempts detected from IP 192.168.1.100 for user admin@kazpert.com",
      time: "5 minutes ago",
      icon: Shield,
      read: false,
      category: "security",
      priority: "critical",
      actionRequired: true,
      target: "User Security"
    },
    {
      id: 2,
      type: "system",
      title: "System Maintenance Scheduled",
      description: "Planned maintenance scheduled for Saturday, 2:00 AM - 4:00 AM. Expected downtime: 30 minutes.",
      time: "1 hour ago",
      icon: Settings,
      read: false,
      category: "system",
      priority: "medium",
      target: "System Operations"
    },
    {
      id: 3,
      type: "user",
      title: "New Employer Verification Required",
      description: "Al Harthy Corporation submitted verification documents. Requires admin approval.",
      time: "2 hours ago",
      icon: UserCheck,
      read: false,
      category: "verification",
      priority: "high",
      actionRequired: true,
      target: "User Management"
    },
    {
      id: 4,
      type: "billing",
      title: "Payment Dispute Filed",
      description: "Payment dispute filed by Maria Santos for transaction #TX-7842. Amount: OMR 350",
      time: "3 hours ago",
      icon: CreditCard,
      read: true,
      category: "billing",
      priority: "high",
      actionRequired: true,
      target: "Finance"
    },
    {
      id: 5,
      type: "warning",
      title: "High Server Load",
      description: "API server experiencing 85% CPU utilization. Consider scaling resources.",
      time: "5 hours ago",
      icon: AlertTriangle,
      read: true,
      category: "system",
      priority: "high",
      target: "Infrastructure"
    },
    {
      id: 6,
      type: "user",
      title: "Worker Account Suspension Appeal",
      description: "Sarah Johnson has appealed her account suspension. Review required within 24 hours.",
      time: "1 day ago",
      icon: UserX,
      read: true,
      category: "moderation",
      priority: "medium",
      actionRequired: true,
      target: "User Management"
    },
    {
      id: 7,
      type: "system",
      title: "Database Backup Completed",
      description: "Nightly database backup completed successfully. Size: 2.4GB, Duration: 12 minutes",
      time: "1 day ago",
      icon: CheckCircle,
      read: true,
      category: "system",
      priority: "low",
      target: "System Operations"
    },
    {
      id: 8,
      type: "success",
      title: "Monthly Growth Target Achieved",
      description: "Congratulations! Platform achieved 150% of monthly user growth target.",
      time: "2 days ago",
      icon: BarChart3,
      read: true,
      category: "analytics",
      priority: "low",
      target: "Business"
    },
    {
      id: 9,
      type: "billing",
      title: "Subscription Payment Failed",
      description: "Recurring payment failed for Al Habsi Family. Subscription will expire in 3 days.",
      time: "2 days ago",
      icon: DollarSign,
      read: true,
      category: "billing",
      priority: "medium",
      actionRequired: true,
      target: "Finance"
    },
    {
      id: 10,
      type: "security",
      title: "New Admin User Created",
      description: "New admin user 'support_agent_02' created by super_admin. Permissions: Support Agent",
      time: "3 days ago",
      icon: Users,
      read: true,
      category: "security",
      priority: "medium",
      target: "User Management"
    }
  ])

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100 border-green-200"
      case "warning":
        return "text-amber-600 bg-amber-100 border-amber-200"
      case "security":
        return "text-red-600 bg-red-100 border-red-200"
      case "system":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "user":
        return "text-purple-600 bg-purple-100 border-purple-200"
      case "billing":
        return "text-indigo-600 bg-indigo-100 border-indigo-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Zap className="h-3 w-3" />
      case "high":
        return <AlertTriangle className="h-3 w-3" />
      case "medium":
        return <Clock className="h-3 w-3" />
      case "low":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Bell className="h-3 w-3" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const archiveNotification = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true, category: 'archived' } : notif
    ))
  }

  const clearAllRead = () => {
    setNotifications(notifications.filter(notif => !notif.read))
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.target?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !notification.read
    if (activeTab === "action") return matchesSearch && notification.actionRequired
    return matchesSearch && notification.category === activeTab
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    actionRequired: actionRequiredCount,
    critical: notifications.filter(n => n.priority === 'critical' && !n.read).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg" style={{ backgroundColor: `${KAZIPERT_COLORS.primary}15` }}>
                <Bell className="h-8 w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                  Admin Notifications
                </h1>
                <p className="text-muted-foreground">Monitor system alerts and administrative tasks</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Requires Action</div>
              <div className="text-2xl font-bold text-red-600">{stats.actionRequired}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: KAZIPERT_COLORS.primary }}>
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.unread} unread notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Requiring Action</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.actionRequired}
              </div>
              <p className="text-xs text-muted-foreground">
                Immediate attention needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.critical}
              </div>
              <p className="text-xs text-muted-foreground">
                High priority issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                98%
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <Label htmlFor="sound" className="text-sm">Sound Alerts</Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label htmlFor="email" className="text-sm">Email Notifications</Label>
                  </div>
                  <Switch
                    id="email"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={clearAllRead}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Read Notifications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>System Notifications</CardTitle>
                    <CardDescription>
                      {filteredNotifications.length} notifications found • {unreadCount} unread
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notifications..."
                        className="pl-9 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      All
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {stats.total}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex items-center gap-2">
                      Unread
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                        {stats.unread}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="action" className="flex items-center gap-2">
                      Action
                      <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                        {stats.actionRequired}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="space-y-4">
                    {filteredNotifications.map((notification) => {
                      const IconComponent = notification.icon
                      return (
                        <div 
                          key={notification.id} 
                          className={`
                            bg-white rounded-lg border-l-4 p-4 transition-all duration-200 hover:shadow-md
                            ${!notification.read ? 'ring-2 ring-blue-200 bg-blue-50' : ''}
                            ${getNotificationColor(notification.type).split(' ')[2]} // border color
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getNotificationColor(notification.type).split(' ').slice(0, 2).join(' ')}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-gray-900 text-sm leading-tight">
                                      {notification.title}
                                    </h3>
                                    {!notification.read && (
                                      <Badge variant="default" className="bg-blue-500 text-white text-xs px-1 py-0">
                                        New
                                      </Badge>
                                    )}
                                    {notification.actionRequired && (
                                      <Badge variant="destructive" className="text-xs px-1 py-0">
                                        Action Required
                                      </Badge>
                                    )}
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs px-1 py-0 ${getPriorityColor(notification.priority)}`}
                                    >
                                      <span className="flex items-center gap-1">
                                        {getPriorityIcon(notification.priority)}
                                        {notification.priority}
                                      </span>
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 text-sm leading-tight mb-2">
                                    {notification.description}
                                  </p>
                                  {notification.target && (
                                    <Badge variant="outline" className="text-xs">
                                      {notification.target}
                                    </Badge>
                                  )}
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read && (
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                      <Archive className="h-4 w-4 mr-2" />
                                      Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {notification.time}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {notification.actionRequired && (
                                    <Button size="sm" className="h-7 text-xs">
                                      Take Action
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Empty State */}
                    {filteredNotifications.length === 0 && (
                      <div className="text-center py-12">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                        <p className="text-gray-500 text-sm">
                          {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up! New notifications will appear here.'}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}