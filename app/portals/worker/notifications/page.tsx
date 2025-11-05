"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  CheckCircle, 
  Zap,
  Calendar,
  User,
  Award,
  MessageSquare,
  DollarSign,
  Clock
} from "lucide-react"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#6c71b5', 
  accent: '#e53e3e',
}

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Job Application Successful!",
      description: "Your application for 'Housekeeper Position' has been submitted to Al Harthy Family.",
      time: "1 hour ago",
      icon: CheckCircle,
      read: true,
      category: "application"
    },
    {
      id: 2,
      type: "alert",
      title: "New Job Match - High Compatibility!",
      description: "Housekeeping position in Al Khuwair matches 95% of your preferences.",
      time: "3 hours ago",
      icon: Zap,
      read: false,
      category: "job_match"
    },
    {
      id: 3,
      type: "info",
      title: "Interview Invitation 🎉",
      description: "Al Harthy Family invited you for an interview tomorrow at 2:00 PM.",
      time: "5 hours ago",
      icon: Calendar,
      read: false,
      category: "interview"
    },
    {
      id: 4,
      type: "warning",
      title: "Profile Completion Reminder",
      description: "Complete your skills section to increase chances by 70%.",
      time: "1 day ago",
      icon: User,
      read: false,
      category: "profile"
    },
    {
      id: 5,
      type: "success",
      title: "You've Earned a New Badge!",
      description: "Congratulations! You've earned the 'Reliable Worker' badge.",
      time: "2 days ago",
      icon: Award,
      read: true,
      category: "achievement"
    },
    {
      id: 6,
      type: "info",
      title: "New Message from Employer",
      description: "Mrs. Al Harthy: 'Hello! We were impressed by your profile.'",
      time: "2 days ago",
      icon: MessageSquare,
      read: true,
      category: "message"
    },
    {
      id: 7,
      type: "alert",
      title: "Urgent: High-Paying Opportunity",
      description: "Immediate opening for nanny in Shatti Al Qurum. OMR 350/month.",
      time: "3 days ago",
      icon: DollarSign,
      read: true,
      category: "urgent_job"
    }
  ])

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-amber-600 bg-amber-100"
      case "info":
        return "text-blue-600 bg-blue-100"
      case "alert":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-400"
      case "warning":
        return "border-l-amber-400"
      case "info":
        return "border-l-blue-400"
      case "alert":
        return "border-l-purple-400"
      default:
        return "border-l-gray-400"
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

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6" style={{ color: KAZIPERT_COLORS.primary }} />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">{unreadCount} unread messages</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <div 
                key={notification.id} 
                className={`
                  bg-white rounded-lg border-l-4 ${getBorderColor(notification.type)} 
                  ${!notification.read ? 'ring-1 ring-blue-200 bg-blue-50' : ''}
                  p-4 transition-all duration-200 hover:shadow-md
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getNotificationColor(notification.type)}`}>
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
                        </div>
                        <p className="text-gray-600 text-sm leading-tight">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-sm">You're all caught up! New notifications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}