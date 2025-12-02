"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  User,
  Users,
  FileText,
  Settings,
  Mail,
  MessageSquare,
  Clock
} from "lucide-react"
// import { useRouter } from "next/router"
import { useRouter } from "next/navigation"


const KAZIPERT_COLORS = {
  primary: '#117c82',
  secondary: '#117c82', 
  accent: '#6c71b5',
  background: '#f8fafc',
  text: '#1a202c',
  textLight: '#718096',
}

export default function EmployerNotificationsPage() {

  const router = useRouter()
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Job Posted Successfully",
      description: "Your 'General House Help' position has been published and is now visible to candidates.",
      time: "2 hours ago",
      icon: CheckCircle,
      read: true,
      action: null
    },
    {
      id: 2,
      type: "warning",
      title: "Pending Job Applications - Kindly Review",
      description: "You have 3 new applications waiting for your review on the 'Elderly Care Specialist' position.",
      time: "5 hours ago",
      icon: Users,
      read: false,
      action: {
        label: "Review Applications",
        onClick: () => console.log("Review applications")
      }
    },
    {
      id: 3,
      type: "info",
      title: "Contract Sent for Signature",
      description: "Employment contract has been sent to Sarah Johnson. Waiting for signature.",
      time: "1 day ago",
      icon: FileText,
      read: true,
      action: {
        label: "View Contract",
        onClick: () => console.log("View contract")
      }
    },
    {
      id: 4,
      type: "alert",
      title: "Complete Your Profile",
      description: "Finish setting up your employer profile to access all features and increase candidate trust.",
      time: "2 days ago",
      icon: User,
      read: false,
      action: {
        label: "Complete Profile",
        onClick: () => router.push('/portals/employer/verification')  
      }
    }
  ]

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

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3 text-gray-900">
              <Bell className="h-6 w-6 md:h-8 md:w-8" style={{ color: KAZIPERT_COLORS.primary }} />
              Notifications
            </h1>
            <p className="text-sm md:text-xl text-gray-600">
              Stay updated with your account activity
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary">
            {unreadCount} unread
          </Badge>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <Card 
                key={notification.id} 
                className={`border-0 shadow-lg border-l-4 ${getBorderColor(notification.type)} ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {notification.description}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge variant="default" className="bg-blue-500 text-white text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {notification.time}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {notification.action && (
                            <Button 
                              size="sm"
                              style={{
                                backgroundColor: KAZIPERT_COLORS.primary,
                                color: 'white'
                              }}
                              onClick={notification.action.onClick}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Notification Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Application Alerts */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">New Application Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when candidates apply</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Contract Updates */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contract Updates</h4>
                    <p className="text-sm text-gray-600">Updates on contract status</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Message Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Message Alerts</h4>
                    <p className="text-sm text-gray-600">Notifications for new messages</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                style={{
                  backgroundColor: KAZIPERT_COLORS.primary,
                  color: 'white'
                }}
              >
                Save Settings
              </Button>
              <Button variant="outline">
                Mark All as Read
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Notification Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep notifications enabled to stay updated on applications</li>
                  <li>• Review pending applications within 24 hours for best candidate experience</li>
                  <li>• Complete your profile to access all notification features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}