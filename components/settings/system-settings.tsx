"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Palette, 
  Bell, 
  Building, 
  Cpu, 
  Database, 
  Zap, 
  Smartphone, 
  Monitor, 
  Sun, 
  Moon, 
  Languages, 
  DollarSign,
  Mail,
  MessageSquare,
  Shield,
  Calendar,
  MapPin
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function SystemSettings() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock system settings data
  const [systemSettings, setSystemSettings] = useState({
    theme: "light",
    language: "en",
    currency: "USD",
    timezone: "Africa/Dar_es_Salaam",
    workingHours: {
      start: "09:00",
      end: "17:00"
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      systemUpdates: true,
      securityAlerts: true
    },
    business: {
      companyName: "Kazipert",
      defaultWorkingHours: "9:00 AM - 5:00 PM",
      timezone: "East Africa Time (EAT)"
    }
  })

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: "System settings updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (theme: string) => {
    setSystemSettings(prev => ({ ...prev, theme }))
    // In a real app, you would apply the theme here
    toast({
      title: "Theme Updated",
      description: `Changed to ${theme} theme`
    })
  }

  const handleNotificationToggle = (key: string, value: boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Appearance Settings */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-amber-900 font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "light", label: "Light", icon: Sun, description: "Light theme" },
                { value: "dark", label: "Dark", icon: Moon, description: "Dark theme" },
                { value: "auto", label: "Auto", icon: Monitor, description: "System preference" }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.value}
                    className={cn(
                      "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 text-center",
                      systemSettings.theme === item.value
                        ? "border-[#f5c849] bg-amber-50/50"
                        : "border-amber-200 hover:border-amber-300"
                    )}
                    onClick={() => handleThemeChange(item.value)}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <div className="font-medium text-amber-900">{item.label}</div>
                    <div className="text-xs text-amber-600">{item.description}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-amber-900 font-medium">Language & Region</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Language
                </Label>
                <Select 
                  value={systemSettings.language} 
                  onValueChange={(value) => setSystemSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="bg-amber-50/50 border-amber-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Currency
                </Label>
                <Select 
                  value={systemSettings.currency} 
                  onValueChange={(value) => setSystemSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="bg-amber-50/50 border-amber-200">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="TZS">TZS (TSh)</SelectItem>
                    <SelectItem value="OMR">OMR (﷼)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Timezone
                </Label>
                <Select 
                  value={systemSettings.timezone} 
                  onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger className="bg-amber-50/50 border-amber-200">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Dar_es_Salaam">East Africa Time (EAT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {[
            { 
              key: "email", 
              title: "Email Notifications", 
              description: "Receive notifications via email", 
              icon: Mail 
            },
            { 
              key: "push", 
              title: "Push Notifications", 
              description: "Receive push notifications on your device", 
              icon: Smartphone 
            },
            { 
              key: "sms", 
              title: "SMS Alerts", 
              description: "Get important updates via SMS", 
              icon: MessageSquare 
            },
            { 
              key: "systemUpdates", 
              title: "System Updates", 
              description: "Notifications about system maintenance", 
              icon: Zap 
            },
            { 
              key: "securityAlerts", 
              title: "Security Alerts", 
              description: "Alerts about security activities", 
              icon: Shield 
            }
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.key} className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-amber-900">{item.title}</div>
                    <div className="text-sm text-amber-600">{item.description}</div>
                  </div>
                </div>
                <Switch
                  checked={systemSettings.notifications[item.key as keyof typeof systemSettings.notifications]}
                  onCheckedChange={(value) => handleNotificationToggle(item.key, value)}
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Building className="h-6 w-6" />
            Business Settings
          </CardTitle>
          <CardDescription>
            Configure business-related preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-amber-900 font-medium">Default Settings</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="workingHours">Default Working Hours</Label>
                <div className="flex gap-2">
                  <Input 
                    id="workingHoursStart"
                    type="time"
                    value={systemSettings.workingHours.start}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, start: e.target.value }
                    }))}
                    className="bg-amber-50/50 border-amber-200"
                  />
                  <Input 
                    id="workingHoursEnd"
                    type="time"
                    value={systemSettings.workingHours.end}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, end: e.target.value }
                    }))}
                    className="bg-amber-50/50 border-amber-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName"
                  value={systemSettings.business.companyName}
                  onChange={(e) => setSystemSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, companyName: e.target.value }
                  }))}
                  className="bg-amber-50/50 border-amber-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessTimezone">Business Timezone</Label>
                <Select 
                  value={systemSettings.business.timezone} 
                  onValueChange={(value) => setSystemSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, timezone: value }
                  }))}
                >
                  <SelectTrigger className="bg-amber-50/50 border-amber-200">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="East Africa Time (EAT)">East Africa Time (EAT)</SelectItem>
                    <SelectItem value="Gulf Standard Time (GST)">Gulf Standard Time (GST)</SelectItem>
                    <SelectItem value="Greenwich Mean Time (GMT)">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            System Information
          </CardTitle>
          <CardDescription>
            System status and technical details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-amber-600">Version</div>
              <div className="font-medium text-amber-900">v2.1.0</div>
            </div>
            <div>
              <div className="text-amber-600">Last Updated</div>
              <div className="font-medium text-amber-900">2024-01-15</div>
            </div>
            <div>
              <div className="text-amber-600">Database</div>
              <div className="font-medium text-amber-900">PostgreSQL 14</div>
            </div>
            <div>
              <div className="text-amber-600">Uptime</div>
              <div className="font-medium text-amber-900">99.8%</div>
            </div>
            <div>
              <div className="text-amber-600">Environment</div>
              <div className="font-medium text-amber-900">Production</div>
            </div>
            <div>
              <div className="text-amber-600">Server Location</div>
              <div className="font-medium text-amber-900">Frankfurt, DE</div>
            </div>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button variant="outline" className="w-full border-amber-200">
              <Database className="h-4 w-4 mr-2" />
              System Diagnostics
            </Button>
            <Button variant="outline" className="w-full border-amber-200">
              <Calendar className="h-4 w-4 mr-2" />
              View Audit Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="lg:col-span-2 flex justify-end">
        <Button 
          className="bg-[#f5c849] hover:bg-amber-500 text-amber-900 font-semibold px-8"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  )
}