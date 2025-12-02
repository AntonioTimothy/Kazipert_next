"use client"

import { useState, useEffect } from "react"
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
  Clock,
  Briefcase,
  FileText
} from "lucide-react"
import { notificationService } from "@/lib/services/apiServices"

const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#6c71b5',
  accent: '#e53e3e',
}

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getNotifications()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'JOB_ALERT': return Briefcase
      case 'APPLICATION_UPDATE': return FileText
      case 'CONTRACT_UPDATE': return FileText
      case 'PAYMENT_RECEIVED': return DollarSign
      case 'PAYMENT_SENT': return DollarSign
      case 'SUPPORT_TICKET': return MessageSquare
      case 'TRAINING_COMPLETE': return Award
      case 'SUCCESS': return CheckCircle
      default: return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
      case "TRAINING_COMPLETE":
        return "text-green-600 bg-green-100"
      case "WARNING":
        return "text-amber-600 bg-amber-100"
      case "INFO":
      case "JOB_ALERT":
      case "APPLICATION_UPDATE":
        return "text-blue-600 bg-blue-100"
      case "ERROR":
        return "text-red-600 bg-red-100"
      case "PAYMENT_RECEIVED":
      case "PAYMENT_SENT":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
      case "TRAINING_COMPLETE":
        return "border-l-green-400"
      case "WARNING":
        return "border-l-amber-400"
      case "INFO":
      case "JOB_ALERT":
      case "APPLICATION_UPDATE":
        return "border-l-blue-400"
      case "ERROR":
        return "border-l-red-400"
      case "PAYMENT_RECEIVED":
      case "PAYMENT_SENT":
        return "border-l-purple-400"
      default:
        return "border-l-gray-400"
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAsRead(undefined, true)
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading notifications...</p>
            </div>
          ) : notifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type)
            const timeAgo = new Date(notification.createdAt).toLocaleString()
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
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {timeAgo}
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