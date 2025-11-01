"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Lock, Key, Eye, EyeOff, Shield, Smartphone, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const { toast } = useToast()

  // Mock security settings data
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30, // minutes
    passwordExpiry: 90, // days
    failedLoginAttempts: 5
  })

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: "Password updated successfully"
      })
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSecuritySettings(prev => ({
        ...prev,
        twoFactorAuth: enabled
      }))
      
      toast({
        title: "Success",
        description: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication",
        variant: "destructive"
      })
    }
  }

  const handleSettingToggle = async (setting: string, value: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: value
      }))
      
      toast({
        title: "Success",
        description: `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Key className="h-6 w-6" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-amber-900">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="bg-amber-50/50 border-amber-200 pr-10"
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-amber-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-amber-900">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-amber-50/50 border-amber-200 pr-10"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-amber-500" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-amber-600">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-amber-900">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-amber-50/50 border-amber-200 pr-10"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-amber-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              className="bg-[#f5c849] hover:bg-amber-500 text-amber-900"
              onClick={handlePasswordChange}
              disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="font-medium text-amber-900">Two-Factor Authentication</div>
                <div className="text-sm text-amber-600">
                  Protect your account with an extra layer of security. When enabled, you'll be required to enter both your password and an authentication code from your mobile device.
                </div>
              </div>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          {securitySettings.twoFactorAuth && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Two-Factor Setup Required</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Please check your email for instructions to complete two-factor authentication setup.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Lock className="h-6 w-6" />
            Security Preferences
          </CardTitle>
          <CardDescription>
            Configure additional security settings for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Login Alerts</div>
                <div className="text-sm text-amber-600">Get notified of new sign-ins</div>
              </div>
              <Switch
                checked={securitySettings.loginAlerts}
                onCheckedChange={(value) => handleSettingToggle('loginAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Session Timeout</div>
                <div className="text-sm text-amber-600">{securitySettings.sessionTimeout} minutes</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200"
                  onClick={() => setSecuritySettings(prev => ({ 
                    ...prev, 
                    sessionTimeout: Math.max(5, prev.sessionTimeout - 5) 
                  }))}
                >
                  -
                </Button>
                <span className="text-sm w-8 text-center">{securitySettings.sessionTimeout}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200"
                  onClick={() => setSecuritySettings(prev => ({ 
                    ...prev, 
                    sessionTimeout: prev.sessionTimeout + 5 
                  }))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Password Expiry</div>
                <div className="text-sm text-amber-600">Change every {securitySettings.passwordExpiry} days</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200"
                  onClick={() => setSecuritySettings(prev => ({ 
                    ...prev, 
                    passwordExpiry: Math.max(30, prev.passwordExpiry - 30) 
                  }))}
                >
                  -
                </Button>
                <span className="text-sm w-12 text-center">{securitySettings.passwordExpiry}d</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200"
                  onClick={() => setSecuritySettings(prev => ({ 
                    ...prev, 
                    passwordExpiry: prev.passwordExpiry + 30 
                  }))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Failed Login Attempts</div>
                <div className="text-sm text-amber-600">Lock after {securitySettings.failedLoginAttempts} attempts</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200"
                  onClick={() => setSecuritySettings(prev => ({ 
                    ...prev, 
                    failedLoginAttempts: Math.max(3, prev.failedLoginAttempts - 1) 
                  }))}
                >
                  -
                </Button>
                <span className="text-sm w-8 text-center">{securitySettings.failedLoginAttempts}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-200"
                  onClick={() => setSecuritySettings(prev => ({ 
                    ...prev, 
                    failedLoginAttempts: prev.failedLoginAttempts + 1 
                  }))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-[#f5c849] hover:bg-amber-500 text-amber-900">
              Save Security Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-amber-200/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200/40 rounded-t-lg">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage your active login sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Current Session</div>
                <div className="text-sm text-amber-600">
                  Chrome on Windows • Dar es Salaam, Tanzania
                </div>
                <div className="text-xs text-amber-500 mt-1">
                  Active now • This device
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-amber-200" disabled>
                Current
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Safari on iPhone</div>
                <div className="text-sm text-amber-600">
                  Safari on iOS • Dar es Salaam, Tanzania
                </div>
                <div className="text-xs text-amber-500 mt-1">
                  Last active 2 hours ago
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                Revoke
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg">
              <div>
                <div className="font-medium text-amber-900">Firefox on Mac</div>
                <div className="text-sm text-amber-600">
                  Firefox on macOS • Dubai, UAE
                </div>
                <div className="text-xs text-amber-500 mt-1">
                  Last active 1 day ago
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                Revoke
              </Button>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" className="border-amber-200">
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}